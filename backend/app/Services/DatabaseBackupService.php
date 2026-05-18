<?php

namespace App\Services;

use Illuminate\Support\Facades\Process;
use RuntimeException;
use Symfony\Component\Process\ExecutableFinder;

class DatabaseBackupService
{
    /**
     * @return array{0: string, 1: string, 2: string} [tempPath, downloadFilename, mimeType]
     */
    public function create(): array
    {
        $connectionName = config('database.default');
        $config = config("database.connections.{$connectionName}");

        if (! is_array($config) || empty($config['driver'])) {
            throw new RuntimeException('Database connection is not configured.');
        }

        $driver = $config['driver'];
        $stamp = now()->format('Y-m-d-His');

        return match ($driver) {
            'sqlite' => $this->backupSqlite($config, $stamp),
            'mysql', 'mariadb' => $this->backupMysql($config, $driver, $stamp),
            'pgsql' => $this->backupPgsql($config, $stamp),
            default => throw new RuntimeException(
                "Automatic backup for driver \"{$driver}\" is not supported. Use SQLite, MySQL, MariaDB, or PostgreSQL, or export manually from your database tools."
            ),
        };
    }

    /**
     * @param  array<string, mixed>  $config
     * @return array{0: string, 1: string, 2: string}
     */
    private function backupSqlite(array $config, string $stamp): array
    {
        $path = $config['database'] ?? '';

        if ($path === ':memory:' || $path === '') {
            throw new RuntimeException('Cannot back up an in-memory SQLite database.');
        }

        if (! is_string($path)) {
            throw new RuntimeException('Invalid SQLite database path.');
        }

        $resolved = $this->resolveSqlitePath($path);

        if (! is_file($resolved)) {
            throw new RuntimeException("SQLite database file not found: {$resolved}");
        }

        $sqlDump = $this->trySqliteCliDump($resolved);
        if ($sqlDump !== null) {
            $tmpSql = $this->newTempPath('sqlite_dump_', '.sql');
            file_put_contents($tmpSql, $sqlDump);

            return [$tmpSql, "cleanpro-db-sqlite-{$stamp}.sql", 'application/sql'];
        }

        $tmpCopy = $this->newTempPath('sqlite_copy_', '.sqlite');
        if (! @copy($resolved, $tmpCopy)) {
            throw new RuntimeException('Could not copy the SQLite database file for a backup.');
        }

        return [$tmpCopy, "cleanpro-db-sqlite-{$stamp}.sqlite", 'application/octet-stream'];
    }

    private function trySqliteCliDump(string $resolvedPath): ?string
    {
        $binary = (new ExecutableFinder)->find('sqlite3');
        if ($binary === null) {
            return null;
        }

        $result = Process::timeout(600)->run([$binary, $resolvedPath, '.dump']);
        if ($result->successful() && $result->output() !== '') {
            return $result->output();
        }

        return null;
    }

    private function newTempPath(string $prefix, string $suffix): string
    {
        $tmp = tempnam(sys_get_temp_dir(), $prefix);
        if ($tmp === false) {
            throw new RuntimeException('Could not create a temporary file for the backup.');
        }
        $path = $tmp.$suffix;
        rename($tmp, $path);

        return $path;
    }

    private function resolveSqlitePath(string $path): string
    {
        if (str_starts_with($path, DIRECTORY_SEPARATOR) || preg_match('#^[A-Za-z]:\\\\#', $path) === 1) {
            return $path;
        }

        return base_path(trim($path, '/'));
    }

    /**
     * @param  array<string, mixed>  $config
     * @return array{0: string, 1: string, 2: string}
     */
    private function backupMysql(array $config, string $driver, string $stamp): array
    {
        $database = $config['database'] ?? '';
        if ($database === '' || ! is_string($database)) {
            throw new RuntimeException('MySQL database name is not configured.');
        }

        $binary = (new ExecutableFinder)->find('mysqldump');
        if ($binary === null) {
            throw new RuntimeException(
                'mysqldump was not found on the server PATH. Install MySQL client tools on this machine, or run mysqldump manually.'
            );
        }

        $user = (string) ($config['username'] ?? 'root');
        $password = (string) ($config['password'] ?? '');
        $host = (string) ($config['host'] ?? '127.0.0.1');
        $port = (string) ($config['port'] ?? '3306');
        $socket = isset($config['unix_socket']) && is_string($config['unix_socket']) ? $config['unix_socket'] : '';

        $cnf = $this->writeMysqlDefaultsFile($user, $password, $host, $port, $socket);

        try {
            $args = [
                $binary,
                '--defaults-extra-file='.$cnf,
                '--single-transaction',
                '--routines',
                '--default-character-set=utf8mb4',
                $database,
            ];

            $result = Process::timeout(600)->run($args);
        } finally {
            @unlink($cnf);
        }

        if (! $result->successful()) {
            throw new RuntimeException(
                'mysqldump failed: '.trim($result->errorOutput() ?: $result->output() ?: 'unknown error')
            );
        }

        $output = $result->output();
        if ($output === '') {
            throw new RuntimeException('mysqldump produced an empty backup.');
        }

        $sqlFile = $this->newTempPath('mysql_dump_', '.sql');
        file_put_contents($sqlFile, $output);

        $label = $driver === 'mariadb' ? 'mariadb' : 'mysql';

        return [$sqlFile, "cleanpro-db-{$label}-{$stamp}.sql", 'application/sql'];
    }

    /**
     * @param  array<string, mixed>  $config
     * @return array{0: string, 1: string, 2: string}
     */
    private function backupPgsql(array $config, string $stamp): array
    {
        $database = $config['database'] ?? '';
        if ($database === '' || ! is_string($database)) {
            throw new RuntimeException('PostgreSQL database name is not configured.');
        }

        $binary = (new ExecutableFinder)->find('pg_dump');
        if ($binary === null) {
            throw new RuntimeException(
                'pg_dump was not found on the server PATH. Install PostgreSQL client tools, or run pg_dump manually.'
            );
        }

        $user = (string) ($config['username'] ?? 'postgres');
        $password = (string) ($config['password'] ?? '');
        $host = (string) ($config['host'] ?? '127.0.0.1');
        $port = (string) ($config['port'] ?? '5432');

        $env = $this->inheritEnvironment();
        $env['PGPASSWORD'] = $password;

        $result = Process::timeout(600)->env($env)->run([
            $binary,
            '-h', $host,
            '-p', $port,
            '-U', $user,
            '-d', $database,
            '-F', 'p',
            '--no-owner',
            '--no-acl',
        ]);

        if (! $result->successful()) {
            throw new RuntimeException(
                'pg_dump failed: '.trim($result->errorOutput() ?: $result->output() ?: 'unknown error')
            );
        }

        $output = $result->output();
        if ($output === '') {
            throw new RuntimeException('pg_dump produced an empty backup.');
        }

        $sqlFile = $this->newTempPath('pg_dump_', '.sql');
        file_put_contents($sqlFile, $output);

        return [$sqlFile, "cleanpro-db-pgsql-{$stamp}.sql", 'application/sql'];
    }

    private function writeMysqlDefaultsFile(
        string $user,
        string $password,
        string $host,
        string $port,
        string $socket
    ): string {
        $cnf = tempnam(sys_get_temp_dir(), 'my_cnf_');
        if ($cnf === false) {
            throw new RuntimeException('Could not create a temporary MySQL defaults file.');
        }

        $lines = [
            '[client]',
            'user='.preg_replace('/[\r\n]/', '', $user),
            'password='.preg_replace('/[\r\n]/', '', $password),
        ];

        if ($socket !== '') {
            $lines[] = 'socket='.preg_replace('/[\r\n]/', '', $socket);
        } else {
            $lines[] = 'host='.preg_replace('/[\r\n]/', '', $host);
            $lines[] = 'port='.preg_replace('/[\r\n]/', '', $port);
        }

        file_put_contents($cnf, implode("\n", $lines)."\n");
        @chmod($cnf, 0600);

        return $cnf;
    }

    /**
     * @return array<string, string>
     */
    private function inheritEnvironment(): array
    {
        $env = [];
        foreach (array_merge($_ENV, $_SERVER) as $key => $value) {
            if (is_string($key) && is_string($value)) {
                $env[$key] = $value;
            }
        }

        return $env;
    }
}

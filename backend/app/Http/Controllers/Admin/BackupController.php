<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\DatabaseBackupService;

class BackupController extends Controller
{
    public function download(DatabaseBackupService $backup)
    {
        try {
            [$path, $filename, $mime] = $backup->create();
        } catch (\Throwable $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 422);
        }

        return response()->download($path, $filename, [
            'Content-Type' => $mime,
        ])->deleteFileAfterSend(true);
    }
}

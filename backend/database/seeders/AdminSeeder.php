<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    /**
     * Default admin login (change password in production).
     * Email: admin@clean.test  Password: password
     */
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@clean.test'],
            [
                'name' => 'Admin',
                'password' => Hash::make('password'),
                'role' => 'admin',
                'preferred_language' => 'en',
            ]
        );
    }
}

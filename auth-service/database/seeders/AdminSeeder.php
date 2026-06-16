<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        User::firstOrCreate(
            ['email' => env('ADMIN_EMAIL')], 
            [
                'name' => 'Admin',
                'password' => Hash::make(env('ADMIN_PASSWORD')), 
                'role' => User::ROLE_ADMIN 
            ]
        );
    }
}
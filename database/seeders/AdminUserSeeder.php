<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
          // Check if the admin user already exists
          if (!User::where('email', 'admin@example.com')->exists()) {
            // Create the admin user
            User::create([
                'nom' => 'Admin',
                'prenom' => 'User',
                'email' => 'admin@example.com',
                'role' => 'Admin',
                'password' => Hash::make('11111111'),
            ]);
        }
    }
}

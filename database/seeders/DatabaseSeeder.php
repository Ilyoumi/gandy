<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    // dima appel l had cmd pour cree admin account si perdu : php artisan db:seed
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        $this->call(AdminUserSeeder::class);

        // \App\Models\User::factory(10)->create();

        // \App\Models\User::factory()->create([
        //     'nom' => 'admin', // 'name' should be 'nom' according to your migration file
        //     'prenom' => 'admin', // add prenom if it's required
        //     'email' => 'admin@example.com',
        //     'role' => 'admin', // assuming 'admin' is the role for admin user
        //     'password' => bcrypt('11111111') // Hash the password using bcrypt
        // ]);
    }
}

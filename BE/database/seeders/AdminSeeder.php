<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Student;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        if (!Student::where('email', 'admin@example.com')->exists()) {
            Student::create([
                'ime' => 'Admin',
                'prezime' => 'Adminovic',
                'broj_indeksa' => 'admin',
                'email' => 'admin@example.com',
                'password' => Hash::make('admin123'),
                'role' => 'admin',
                'status' => 'zaposlen'
            ]);
        }
    }
}
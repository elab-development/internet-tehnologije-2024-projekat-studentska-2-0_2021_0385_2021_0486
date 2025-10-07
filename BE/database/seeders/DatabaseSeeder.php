<?php

namespace Database\Seeders;

use App\Models\Course;
use App\Models\Student;
use App\Models\ExamEnrollment;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call(AdminSeeder::class);

        $studenti = Student::factory(50)->create();

        $kursevi = Course::factory(20)->create();
        
        ExamEnrollment::factory(100)->create();
    }
}
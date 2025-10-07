<?php

namespace Database\Factories;

use App\Models\Course;
use App\Models\Student;
use Illuminate\Database\Eloquent\Factories\Factory;

class ExamEnrollmentFactory extends Factory
{
    public function definition(): array
    {
        return [
            'student_id' => Student::factory(),
            'course_id' => Course::factory(),
            'datum_prijave' => fake()->dateTimeThisYear(),
            'ocena' => fake()->optional(0.3)->numberBetween(6, 10),
        ];
    }
}
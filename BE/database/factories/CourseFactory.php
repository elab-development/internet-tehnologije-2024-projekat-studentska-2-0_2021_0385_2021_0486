<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class CourseFactory extends Factory
{
    public function definition(): array
    {
        return [
            'naziv' => fake()->unique()->sentence(3), 
            'sifra_predmeta' => fake()->unique()->bothify('??###'),
            'espb' => fake()->numberBetween(4, 8),
            'semestar' => fake()->numberBetween(1, 8),
            'godina' => fake()->numberBetween(1, 4),
        ];
    }
}
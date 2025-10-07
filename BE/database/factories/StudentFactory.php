<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class StudentFactory extends Factory
{
    public function definition(): array
    {
        return [
            'ime' => fake()->firstName(),
            'prezime' => fake()->lastName(),
            'broj_indeksa' => fake()->unique()->numerify('####/####'),
            'email' => fake()->unique()->safeEmail(),
            'password' => 'password',
            'datum_rodjenja' => fake()->date(),
            'status' => fake()->randomElement(['budzet', 'samofinansiranje']),
            'role' => 'student', 
        ];
    }
}
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class Student extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    
    protected $fillable = [
        'ime',
        'prezime',
        'broj_indeksa',
        'email',
        'password',
        'datum_rodjenja',
        'status',
        'role',
    ];


    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }


    public function examEnrollments()
    {
        return $this->hasMany(ExamEnrollment::class);
    }

  
    public function courses()
    {
        return $this->belongsToMany(Course::class, 'exam_enrollments');
    }
}
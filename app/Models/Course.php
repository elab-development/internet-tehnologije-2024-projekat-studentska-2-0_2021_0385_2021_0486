<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    use HasFactory;

    protected $fillable = [
        'naziv',
        'sifra_predmeta',
        'espb',
    ];

    public function examEnrollments()
    {
        return $this->hasMany(ExamEnrollment::class);
    }

    public function students()
    {
        return $this->belongsToMany(
            Student::class,
            'exam_enrollments',
            'course_id',
            'student_id'
        )->withPivot(['datum_prijave', 'ocena'])
         ->withTimestamps();
    }
}

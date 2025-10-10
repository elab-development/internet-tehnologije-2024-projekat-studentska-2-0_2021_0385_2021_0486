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
        'semestar',
        'godina',
    ];

    public function examEnrollments()
    {
        return $this->hasMany(ExamEnrollment::class);
    }

    public function students()
    {
        return $this->belongsToMany(Student::class, 'exam_enrollments');
    }

    /**
     * Get the validation rules for Course model
     */
    public static function validationRules()
    {
        return [
            'naziv' => 'required|string|max:255',
            'sifra_predmeta' => 'required|string|max:10|unique:courses,sifra_predmeta',
            'espb' => 'required|integer|min:1|max:30',
            'semestar' => 'nullable|integer|min:1|max:8',
            'godina' => 'nullable|integer|min:1|max:4',
        ];
    }
}

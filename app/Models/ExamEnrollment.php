<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ExamEnrollment extends Model
{
    use HasFactory;

    protected $table = 'exam_enrollments';

    protected $fillable = [
        'student_id',
        'course_id',
        'datum_prijave',
        'ocena',
    ];

    protected function casts(): array
    {
        return [
            'datum_prijave' => 'date',
            'ocena' => 'integer',
        ];
    }

    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    public function course()
    {
        return $this->belongsTo(Course::class);
    }
}
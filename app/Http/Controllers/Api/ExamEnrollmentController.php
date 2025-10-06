<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ExamEnrollment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon; 

class ExamEnrollmentController extends Controller
{

     private function isStudent() {
        return Auth::user()->role === 'student';
    }

    public function myEnrollments()
    {

        if (!$this->isStudent()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $student = Auth::user();

        $enrollments = ExamEnrollment::where('student_id', $student->id)->with('course')->get();

        return response()->json($enrollments, 200);
    }

    public function enrollToCourse(Request $request)
    {

        if (!$this->isStudent()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        
        $validator = Validator::make($request->all(), [
            'course_id' => 'required|integer|exists:courses,id'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $student = Auth::user();
        $courseId = $request->course_id;

        $existingEnrollment = ExamEnrollment::where('student_id', $student->id)
                                            ->where('course_id', $courseId)
                                            ->first();

        if ($existingEnrollment) {
            return response()->json(['message' => 'Ispit je već prijavljen.'], 409);
        }

        $enrollment = ExamEnrollment::create([
            'student_id' => $student->id,
            'course_id' => $courseId,
            'datum_prijave' => Carbon::now(),
        ]);

        return response()->json([
            'message' => 'Ispit uspešno prijavljen!',
            'enrollment' => $enrollment
        ], 201);
    }
}
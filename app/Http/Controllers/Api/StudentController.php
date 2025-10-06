<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class StudentController extends Controller
{
  
    public function index()
    {
        return response()->json(Student::all(), 200);
    }

    public function store(Request $request)
    {
        return response()->json(['message' => 'Please use the /api/register endpoint to create a student.'], 405); // 405 Method Not Allowed
    }

    public function show(Student $student)
    {
        return response()->json($student, 200);
    }


    public function update(Request $request, Student $student)
    {
   
        $validator = Validator::make($request->all(), [
            'ime' => 'string|max:255',
            'prezime' => 'string|max:255',
            'datum_rodjenja' => 'date',
            'status' => 'string'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $student->update($validator->validated());

        return response()->json($student, 200);
    }

    public function destroy(Student $student)
    {
        $student->delete();
        return response()->json(null, 204);
    }
}
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class CourseController extends Controller
{

    private function isAdmin() {
        return Auth::user()->role === 'admin';
    }


    public function index()
    {
        $courses = Course::all();
        return response()->json($courses, 200);
    }

    public function store(Request $request)
    {


          if (!$this->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validator = Validator::make($request->all(), [
            'naziv' => 'required|string|max:255',
            'sifra_predmeta' => 'required|string|unique:courses|max:10',
            'espb' => 'required|integer|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $course = Course::create($validator->validated());

        return response()->json($course, 201);
    }


    public function show(Course $course)
    {
        return response()->json($course, 200);
    }

  
    public function update(Request $request, Course $course)
    {

        if (!$this->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validator = Validator::make($request->all(), [
            'naziv' => 'sometimes|string|max:255',
            'sifra_predmeta' => 'sometimes|string|unique:courses,sifra_predmeta,'.$course->id.'|max:10',
            'espb' => 'sometimes|integer|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $course->update($validator->validated());

        return response()->json($course, 200);
    }


    public function destroy(Course $course)
    {
        if (!$this->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $course->delete();
        return response()->json(null, 204);
    }
}

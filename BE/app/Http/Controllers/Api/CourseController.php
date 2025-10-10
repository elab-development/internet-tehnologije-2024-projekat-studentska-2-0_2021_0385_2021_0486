<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Http\Resources\CourseResource;
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
        return CourseResource::collection($courses);
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
            'semestar' => 'nullable|integer|min:1|max:8',
            'godina' => 'nullable|integer|min:1|max:4',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $course = Course::create($validator->validated());

        return response()->json([
            'data' => new CourseResource($course),
            'message' => 'Course created successfully'
        ], 201);
    }


    public function show(Course $course)
    {
        return new CourseResource($course);
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
            'semestar' => 'sometimes|nullable|integer|min:1|max:8',
            'godina' => 'sometimes|nullable|integer|min:1|max:4',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $course->update($validator->validated());

        return response()->json([
            'data' => new CourseResource($course),
            'message' => 'Course updated successfully'
        ]);
    }


    public function destroy(Course $course)
    {
        if (!$this->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $course->delete();
        return response()->json(null, 204);
    }

    /**
     * Search courses with pagination and filtering
     */
    public function search(Request $request)
    {
        $query = Course::query();

        // Search by naziv (course name)
        if ($request->has('naziv') && $request->naziv) {
            $query->where('naziv', 'like', '%' . $request->naziv . '%');
        }

        // Search by sifra_predmeta (course code)
        if ($request->has('sifra_predmeta') && $request->sifra_predmeta) {
            $query->where('sifra_predmeta', 'like', '%' . $request->sifra_predmeta . '%');
        }

        // Filter by ESPB
        if ($request->has('espb') && $request->espb) {
            $query->where('espb', $request->espb);
        }

        // Filter by semestar
        if ($request->has('semestar') && $request->semestar) {
            $query->where('semestar', $request->semestar);
        }

        // Filter by godina
        if ($request->has('godina') && $request->godina) {
            $query->where('godina', $request->godina);
        }

        // Filter by ESPB range
        if ($request->has('espb_min') && $request->espb_min) {
            $query->where('espb', '>=', $request->espb_min);
        }
        if ($request->has('espb_max') && $request->espb_max) {
            $query->where('espb', '<=', $request->espb_max);
        }

        // Sorting
        $sortBy = $request->get('sort_by', 'naziv'); // default sort by naziv
        $sortOrder = $request->get('sort_order', 'asc'); // default ascending
        
        $allowedSortFields = ['naziv', 'sifra_predmeta', 'espb', 'semestar', 'godina', 'created_at'];
        if (in_array($sortBy, $allowedSortFields)) {
            $query->orderBy($sortBy, $sortOrder === 'desc' ? 'desc' : 'asc');
        }

        // Pagination
        $perPage = $request->get('per_page', 15); // default 15 items per page
        $perPage = min($perPage, 100); // max 100 items per page

        $courses = $query->paginate($perPage);

        return response()->json([
            'data' => CourseResource::collection($courses),
            'meta' => [
                'current_page' => $courses->currentPage(),
                'last_page' => $courses->lastPage(),
                'per_page' => $courses->perPage(),
                'total' => $courses->total(),
                'from' => $courses->firstItem(),
                'to' => $courses->lastItem(),
            ],
            'links' => [
                'first' => $courses->url(1),
                'last' => $courses->url($courses->lastPage()),
                'prev' => $courses->previousPageUrl(),
                'next' => $courses->nextPageUrl(),
            ],
            'message' => 'Courses retrieved successfully'
        ]);
    }
}

<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\CourseController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ExamEnrollmentController;

// Public auth routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Protected routes using Sanctum
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::apiResource('courses', CourseController::class);
    Route::apiResource('students', \App\Http\Controllers\Api\StudentController::class);
    Route::get('/enroll', [ExamEnrollmentController::class, 'myEnrollments']);
    Route::post('/enroll', [ExamEnrollmentController::class, 'enrollToCourse']);
    Route::get('/student-confirmation-pdf', [\App\Http\Controllers\Api\StudentController::class, 'generateConfirmationPdf']);
});

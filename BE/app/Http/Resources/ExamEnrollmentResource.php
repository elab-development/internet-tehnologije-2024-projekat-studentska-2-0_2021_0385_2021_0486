<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ExamEnrollmentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'datumPrijave' => $this->datum_prijave,
            'ocena' => $this->ocena,
            'kurs' => new CourseResource($this->whenLoaded('course')),
        ];
    }
}
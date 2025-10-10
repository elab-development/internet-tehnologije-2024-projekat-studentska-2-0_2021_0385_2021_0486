<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CourseResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'naziv' => $this->naziv,
            'sifra' => $this->sifra_predmeta,
            'espb' => $this->espb,
            'semestar' => $this->semestar,
            'godina' => $this->godina,
        ];
    }
}
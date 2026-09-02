<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\Teacher */
class TeacherResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'employeeId' => $this->employee_id,
            'firstName' => $this->first_name,
            'lastName' => $this->last_name,
            'name' => trim($this->first_name.' '.$this->last_name),
            'email' => $this->email,
            'phone' => $this->phone,
            'title' => $this->title,
            'status' => $this->status,
            'departmentId' => $this->department_id,
            'department' => $this->whenLoaded('department', fn () => $this->department?->name),
            'joinedAt' => optional($this->joined_at)?->toDateString(),
            'institutionId' => $this->institution_id,
            'userId' => $this->user_id,
        ];
    }
}

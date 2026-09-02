<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\Student */
class StudentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'studentId' => $this->student_number,
            'firstName' => $this->first_name,
            'lastName' => $this->last_name,
            'email' => $this->email,
            'phone' => $this->phone,
            'program' => $this->program?->name,
            'department' => $this->department?->name,
            'programId' => $this->program_id,
            'departmentId' => $this->department_id,
            'semester' => $this->semester,
            'section' => $this->section,
            'status' => $this->status,
            'attendanceRate' => $this->attendance_rate,
            'feeStatus' => $this->fee_status,
            'avatarInitials' => $this->avatar_initials,
            'enrollmentDate' => optional($this->enrollment_date)?->toDateString(),
            'cgpa' => $this->cgpa,
            'dateOfBirth' => optional($this->date_of_birth)?->toDateString(),
            'gender' => $this->gender,
            'cnic' => $this->cnic,
            'address' => $this->address,
            'city' => $this->city,
            'guardianName' => $this->guardian_name,
            'guardianPhone' => $this->guardian_phone,
            'guardianRelation' => $this->guardian_relation,
            'campus' => $this->campus,
            'institutionId' => $this->institution_id,
        ];
    }
}

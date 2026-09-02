<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\User */
class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'role' => $this->role,
            'avatarUrl' => $this->avatar_url,
            'institutionId' => $this->institution_id,
            'department' => $this->department,
            'title' => $this->title,
            'phone' => $this->phone,
            'status' => $this->status,
            'institution' => $this->whenLoaded('institution', fn () => new InstitutionResource($this->institution)),
        ];
    }
}

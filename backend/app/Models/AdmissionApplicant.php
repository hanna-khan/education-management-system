<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class AdmissionApplicant extends Model
{
    public $incrementing = false;

    protected $keyType = 'string';

    protected $guarded = [];

    protected function casts(): array
    {
        return [
            'submitted_at' => 'date',
            'score' => 'integer',
        ];
    }

    public function cycle(): BelongsTo
    {
        return $this->belongsTo(AdmissionCycle::class, 'cycle_id');
    }

    public function interviews(): HasMany
    {
        return $this->hasMany(AdmissionInterview::class, 'applicant_id');
    }

    public function offers(): HasMany
    {
        return $this->hasMany(AdmissionOffer::class, 'applicant_id');
    }
}

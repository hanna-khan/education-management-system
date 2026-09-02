<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AdmissionOffer extends Model
{
    public $incrementing = false;

    protected $keyType = 'string';

    protected $guarded = [];

    protected function casts(): array
    {
        return [
            'offer_date' => 'date',
            'deadline' => 'date',
        ];
    }

    public function applicant(): BelongsTo
    {
        return $this->belongsTo(AdmissionApplicant::class, 'applicant_id');
    }
}

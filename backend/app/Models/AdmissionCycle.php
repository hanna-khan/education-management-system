<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AdmissionCycle extends Model
{
    public $incrementing = false;

    protected $keyType = 'string';

    protected $guarded = [];

    protected function casts(): array
    {
        return [
            'deadline' => 'date',
            'applications_count' => 'integer',
        ];
    }
}

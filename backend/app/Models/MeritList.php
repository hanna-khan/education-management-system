<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MeritList extends Model
{
    public $incrementing = false;

    protected $keyType = 'string';

    protected $guarded = [];

    protected function casts(): array
    {
        return [
            'published_at' => 'date',
            'seats' => 'integer',
            'filled' => 'integer',
        ];
    }
}

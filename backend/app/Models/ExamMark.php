<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ExamMark extends Model
{
    public $incrementing = false;

    protected $keyType = 'string';

    protected $guarded = [];

    protected function casts(): array
    {
        return [
            'assignment' => 'float',
            'midterm' => 'float',
            'final' => 'float',
            'total' => 'float',
            'published' => 'boolean',
        ];
    }
}

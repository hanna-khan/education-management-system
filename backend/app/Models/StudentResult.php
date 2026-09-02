<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class StudentResult extends Model
{
    public $incrementing = false;

    protected $keyType = 'string';

    protected $guarded = [];

    protected function casts(): array
    {
        return [
            'gpa' => 'float',
            'cgpa' => 'float',
            'published' => 'boolean',
        ];
    }

    public function courses(): HasMany
    {
        return $this->hasMany(StudentResultCourse::class, 'result_id');
    }
}

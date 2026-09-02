<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Teacher extends Model
{
    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'institution_id',
        'user_id',
        'department_id',
        'employee_id',
        'first_name',
        'last_name',
        'email',
        'phone',
        'title',
        'status',
        'joined_at',
    ];

    protected function casts(): array
    {
        return [
            'joined_at' => 'date',
        ];
    }

    public function institution(): BelongsTo
    {
        return $this->belongsTo(Institution::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }

    public function sections(): BelongsToMany
    {
        return $this->belongsToMany(Section::class)
            ->withPivot('is_primary')
            ->withTimestamps();
    }

    public function campuses(): BelongsToMany
    {
        return $this->belongsToMany(Campus::class, 'teacher_campus')
            ->withPivot('is_primary')
            ->withTimestamps();
    }
}

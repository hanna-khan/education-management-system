<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Student extends Model
{
    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'institution_id',
        'user_id',
        'department_id',
        'program_id',
        'student_number',
        'first_name',
        'last_name',
        'email',
        'phone',
        'semester',
        'section',
        'status',
        'attendance_rate',
        'fee_status',
        'avatar_initials',
        'enrollment_date',
        'cgpa',
        'date_of_birth',
        'gender',
        'cnic',
        'address',
        'city',
        'guardian_name',
        'guardian_phone',
        'guardian_relation',
        'campus',
    ];

    protected function casts(): array
    {
        return [
            'semester' => 'integer',
            'attendance_rate' => 'float',
            'cgpa' => 'float',
            'enrollment_date' => 'date',
            'date_of_birth' => 'date',
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

    public function program(): BelongsTo
    {
        return $this->belongsTo(Program::class);
    }

    public function parents(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'parent_student', 'student_id', 'parent_user_id')
            ->withPivot(['relation', 'is_primary', 'institution_id'])
            ->withTimestamps();
    }
}

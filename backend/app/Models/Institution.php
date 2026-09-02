<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Institution extends Model
{
    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'name',
        'short_name',
        'slug',
        'type',
        'status',
        'logo_initials',
        'logo_url',
        'primary_color',
        'secondary_color',
        'city',
        'country',
        'contact_email',
        'contact_phone',
        'student_count',
        'staff_count',
        'demo_note',
        'onboarding_step',
        'onboarding_completed_at',
    ];

    protected function casts(): array
    {
        return [
            'student_count' => 'integer',
            'staff_count' => 'integer',
            'onboarding_step' => 'integer',
            'onboarding_completed_at' => 'datetime',
        ];
    }

    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    public function modules(): HasMany
    {
        return $this->hasMany(InstitutionModule::class);
    }

    public function departments(): HasMany
    {
        return $this->hasMany(Department::class);
    }

    public function students(): HasMany
    {
        return $this->hasMany(Student::class);
    }

    public function teachers(): HasMany
    {
        return $this->hasMany(Teacher::class);
    }

    public function campuses(): HasMany
    {
        return $this->hasMany(Campus::class);
    }

    public function subscription(): HasOne
    {
        return $this->hasOne(Subscription::class);
    }
}

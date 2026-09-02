<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Scholarship extends Model
{
    public $incrementing = false;
    protected $keyType = 'string';
    protected $table = 'scholarships';
    protected $guarded = [];
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ApplicationStep extends Model
{
    public $incrementing = false;
    protected $keyType = 'string';
    protected $table = 'application_steps';
    protected $guarded = [];
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WorkflowStep extends Model
{
    public $incrementing = false;
    protected $keyType = 'string';
    protected $table = 'workflow_steps';
    protected $guarded = [];
}

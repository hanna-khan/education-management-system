<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StudentResultCourse extends Model
{
    public $incrementing = false;
    protected $keyType = 'string';
    protected $table = 'student_result_courses';
    protected $guarded = [];
}

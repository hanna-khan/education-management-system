<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FeeInvoice extends Model
{
    public $incrementing = false;

    protected $keyType = 'string';

    protected $guarded = [];

    protected function casts(): array
    {
        return [
            'total' => 'integer',
            'paid' => 'integer',
            'outstanding' => 'integer',
            'due_date' => 'date',
            'breakdown' => 'array',
        ];
    }
}

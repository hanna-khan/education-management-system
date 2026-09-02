<?php

namespace App\Http\Controllers\Concerns;

use Illuminate\Http\Request;

trait ResolvesInstitution
{
    protected function institutionId(Request $request): string
    {
        $id = $request->attributes->get('institution_id') ?: $request->user()?->institution_id;

        if (! $id) {
            abort(422, 'Institution context is required.');
        }

        return $id;
    }
}

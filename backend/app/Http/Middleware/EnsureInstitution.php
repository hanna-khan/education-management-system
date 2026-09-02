<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureInstitution
{
    /**
     * Ensure the authenticated user belongs to an institution
     * (platform admins may pass with X-Institution-Id header).
     *
     * @param  Closure(Request): Response  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (! $user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        if ($user->isPlatformAdmin()) {
            $institutionId = $request->header('X-Institution-Id') ?: $request->query('institution_id');
            if ($institutionId) {
                $request->attributes->set('institution_id', $institutionId);
            }

            return $next($request);
        }

        if (! $user->institution_id) {
            return response()->json(['message' => 'No institution assigned.'], 403);
        }

        $request->attributes->set('institution_id', $user->institution_id);

        return $next($request);
    }
}

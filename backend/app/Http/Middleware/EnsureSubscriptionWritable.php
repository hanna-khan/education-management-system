<?php

namespace App\Http\Middleware;

use App\Models\Institution;
use App\Support\SubscriptionAccess;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Blocks write operations when the institution subscription/trial is expired.
 * Still allows auth, subscription/billing, and read (GET) requests.
 */
class EnsureSubscriptionWritable
{
    public function handle(Request $request, Closure $next): Response
    {
        if (in_array($request->method(), ['GET', 'HEAD', 'OPTIONS'], true)) {
            return $next($request);
        }

        $path = trim($request->path(), '/');
        $allow = [
            'api/v1/auth/logout',
            'api/v1/subscription',
            'api/v1/subscription/change-plan',
        ];
        foreach ($allow as $ok) {
            if (str_starts_with($path, $ok)) {
                return $next($request);
            }
        }

        $institutionId = $request->attributes->get('institution_id') ?: $request->user()?->institution_id;
        if (! $institutionId) {
            return $next($request);
        }

        $institution = Institution::with('subscription.plan')->find($institutionId);
        if (! $institution) {
            return $next($request);
        }

        if (SubscriptionAccess::isLocked($institution)) {
            $access = SubscriptionAccess::accessPayload($institution);

            return response()->json([
                'message' => $access['reason'] ?? 'Subscription inactive.',
                'code' => 'subscription_locked',
                'access' => $access,
            ], 402);
        }

        return $next($request);
    }
}

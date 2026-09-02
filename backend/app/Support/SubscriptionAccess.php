<?php

namespace App\Support;

use App\Models\Institution;
use App\Models\Subscription;
use Carbon\Carbon;

final class SubscriptionAccess
{
    /**
     * Sync expired trial/subscription status on the fly.
     */
    public static function refresh(Institution $institution): Institution
    {
        $institution->loadMissing('subscription.plan');
        $sub = $institution->subscription;
        if (! $sub) {
            return $institution;
        }

        $now = now();
        $trialEnded = $sub->trial_ends_at && Carbon::parse($sub->trial_ends_at)->isPast();
        $periodEnded = $sub->ends_at && Carbon::parse($sub->ends_at)->isPast();

        if (in_array($sub->status, ['trialing', 'active'], true) && ($trialEnded || $periodEnded)) {
            if ($sub->status === 'trialing' && $trialEnded) {
                $sub->status = 'expired';
                $sub->save();
                if ($institution->status === 'trial') {
                    $institution->status = 'expired';
                    $institution->save();
                }
            } elseif ($sub->status === 'active' && $periodEnded) {
                $sub->status = 'expired';
                $sub->save();
                if ($institution->status === 'active') {
                    $institution->status = 'expired';
                    $institution->save();
                }
            }
        }

        return $institution->fresh(['subscription.plan', 'modules']);
    }

    public static function isLocked(Institution $institution): bool
    {
        $institution = self::refresh($institution);
        $sub = $institution->subscription;

        if (! $sub) {
            return false;
        }

        return in_array($sub->status, ['expired', 'cancelled', 'past_due'], true)
            || $institution->status === 'expired'
            || $institution->status === 'suspended';
    }

    public static function daysLeftInTrial(Institution $institution): ?int
    {
        $sub = $institution->subscription;
        if (! $sub || $sub->status !== 'trialing' || ! $sub->trial_ends_at) {
            return null;
        }

        $days = (int) ceil(now()->diffInSeconds($sub->trial_ends_at, false) / 86400);

        return max(0, $days);
    }

    /**
     * Whether the plan allows this module (true = allowed).
     * Plan.modules stores overrides: module_id => false means locked out.
     */
    public static function planAllowsModule(Institution $institution, string $moduleId): bool
    {
        $institution->loadMissing('subscription.plan');
        $plan = $institution->subscription?->plan;
        if (! $plan) {
            return true;
        }

        $overrides = $plan->modules ?? [];
        if (array_key_exists($moduleId, $overrides)) {
            return (bool) $overrides[$moduleId];
        }

        return true;
    }

    /**
     * @return array{locked: bool, reason: string|null, trialDaysLeft: int|null, status: string|null, plan: array|null}
     */
    public static function accessPayload(Institution $institution): array
    {
        $institution = self::refresh($institution);
        $sub = $institution->subscription;
        $locked = self::isLocked($institution);

        return [
            'locked' => $locked,
            'reason' => $locked
                ? ($sub?->status === 'trialing' || $institution->status === 'expired'
                    ? 'Your trial has ended. Choose a plan to continue.'
                    : 'Your subscription is inactive. Update your plan to continue.')
                : null,
            'trialDaysLeft' => self::daysLeftInTrial($institution),
            'status' => $sub?->status,
            'institutionStatus' => $institution->status,
            'plan' => $sub?->plan ? [
                'id' => $sub->plan->id,
                'name' => $sub->plan->name,
                'code' => $sub->plan->code,
                'maxCampuses' => $sub->plan->max_campuses,
                'maxStudents' => $sub->plan->max_students,
                'maxStaff' => $sub->plan->max_staff,
                'modules' => $sub->plan->modules ?? [],
            ] : null,
            'trialEndsAt' => optional($sub?->trial_ends_at)?->toIso8601String(),
            'endsAt' => optional($sub?->ends_at)?->toIso8601String(),
        ];
    }
}

<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\Institution */
class InstitutionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'shortName' => $this->short_name,
            'slug' => $this->slug,
            'type' => $this->type,
            'status' => $this->status,
            'logoInitials' => $this->logo_initials,
            'logoUrl' => $this->logo_url
                ? (str_starts_with($this->logo_url, 'http')
                    ? $this->logo_url
                    : url(\Illuminate\Support\Facades\Storage::url($this->logo_url)))
                : null,
            'primaryColor' => $this->primary_color,
            'secondaryColor' => $this->secondary_color,
            'city' => $this->city,
            'country' => $this->country,
            'studentCount' => $this->student_count,
            'staffCount' => $this->staff_count,
            'demoNote' => $this->demo_note,
            'contactEmail' => $this->contact_email,
            'contactPhone' => $this->contact_phone,
            'onboardingStep' => $this->onboarding_step,
            'onboardingCompleted' => (bool) $this->onboarding_completed_at,
            'modules' => $this->whenLoaded('modules', function () {
                return $this->modules->mapWithKeys(fn ($m) => [$m->module_id => $m->enabled]);
            }),
            'subscription' => $this->whenLoaded('subscription', function () {
                $s = $this->subscription;
                if (! $s) {
                    return null;
                }

                return [
                    'id' => $s->id,
                    'status' => $s->status,
                    'billingCycle' => $s->billing_cycle,
                    'trialEndsAt' => optional($s->trial_ends_at)?->toIso8601String(),
                    'endsAt' => optional($s->ends_at)?->toIso8601String(),
                    'plan' => $s->relationLoaded('plan') && $s->plan ? [
                        'id' => $s->plan->id,
                        'name' => $s->plan->name,
                        'code' => $s->plan->code,
                        'maxCampuses' => $s->plan->max_campuses,
                        'maxStudents' => $s->plan->max_students,
                        'maxStaff' => $s->plan->max_staff,
                        'modules' => $s->plan->modules ?? [],
                    ] : null,
                ];
            }),
            'access' => $this->when(
                $this->relationLoaded('subscription'),
                fn () => \App\Support\SubscriptionAccess::accessPayload($this->resource),
            ),
        ];
    }
}

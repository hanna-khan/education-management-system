<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Concerns\ResolvesInstitution;
use App\Http\Controllers\Controller;
use App\Http\Resources\InstitutionResource;
use App\Models\Campus;
use App\Models\Institution;
use App\Models\InstitutionModule;
use App\Models\Plan;
use App\Models\Subscription;
use App\Support\Roles;
use App\Support\SubscriptionAccess;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class TenantController extends Controller
{
    use ResolvesInstitution;

    public function subscription(Request $request): JsonResponse
    {
        $institution = Institution::with('subscription.plan')->findOrFail($this->institutionId($request));
        $access = SubscriptionAccess::accessPayload($institution);
        $institution = $institution->fresh(['subscription.plan']);
        $sub = $institution->subscription;

        return response()->json([
            'access' => $access,
            'subscription' => $sub ? [
                'id' => $sub->id,
                'status' => $sub->status,
                'billingCycle' => $sub->billing_cycle,
                'startsAt' => optional($sub->starts_at)?->toIso8601String(),
                'endsAt' => optional($sub->ends_at)?->toIso8601String(),
                'trialEndsAt' => optional($sub->trial_ends_at)?->toIso8601String(),
                'plan' => $sub->plan ? [
                    'id' => $sub->plan->id,
                    'name' => $sub->plan->name,
                    'code' => $sub->plan->code,
                    'priceMonthly' => $sub->plan->price_monthly,
                    'priceYearly' => $sub->plan->price_yearly,
                    'currency' => $sub->plan->currency,
                    'maxStudents' => $sub->plan->max_students,
                    'maxCampuses' => $sub->plan->max_campuses,
                    'maxStaff' => $sub->plan->max_staff,
                    'modules' => $sub->plan->modules ?? [],
                    'features' => $sub->plan->features ?? [],
                ] : null,
            ] : null,
        ]);
    }

    public function changePlan(Request $request): JsonResponse
    {
        $this->authorizeAdmin($request);
        $data = $request->validate([
            'planId' => ['required', 'string', 'exists:plans,id'],
            'billingCycle' => ['nullable', Rule::in(['monthly', 'yearly'])],
        ]);

        $institution = Institution::with('subscription')->findOrFail($this->institutionId($request));
        $plan = Plan::where('is_active', true)->findOrFail($data['planId']);

        if ($plan->audience !== 'both' && $plan->audience !== $institution->type) {
            throw ValidationException::withMessages([
                'planId' => ['Plan not available for this institution type.'],
            ]);
        }

        $sub = $institution->subscription;
        if (! $sub) {
            $sub = Subscription::create([
                'id' => 'sub-'.Str::lower(Str::ulid()),
                'institution_id' => $institution->id,
                'plan_id' => $plan->id,
                'status' => 'active',
                'billing_cycle' => $data['billingCycle'] ?? 'monthly',
                'starts_at' => now(),
                'ends_at' => ($data['billingCycle'] ?? 'monthly') === 'yearly' ? now()->addYear() : now()->addMonth(),
            ]);
        } else {
            $sub->update([
                'plan_id' => $plan->id,
                'billing_cycle' => $data['billingCycle'] ?? $sub->billing_cycle,
                'status' => 'active',
                'starts_at' => now(),
                'trial_ends_at' => null,
                'ends_at' => ($data['billingCycle'] ?? $sub->billing_cycle) === 'yearly'
                    ? now()->addYear()
                    : now()->addMonth(),
            ]);
        }

        $institution->update(['status' => 'active']);

        // Align modules with the new plan (locked modules forced off)
        $planModules = $plan->modules ?? [];
        foreach ($planModules as $moduleId => $allowed) {
            if (! $allowed) {
                InstitutionModule::updateOrCreate(
                    ['institution_id' => $institution->id, 'module_id' => $moduleId],
                    ['enabled' => false],
                );
            }
        }

        return $this->subscription($request);
    }

    public function campuses(Request $request): JsonResponse
    {
        $rows = Campus::where('institution_id', $this->institutionId($request))
            ->orderByDesc('is_primary')
            ->orderBy('name')
            ->get()
            ->map(fn (Campus $c) => [
                'id' => $c->id,
                'name' => $c->name,
                'code' => $c->code,
                'address' => $c->address,
                'city' => $c->city,
                'phone' => $c->phone,
                'isPrimary' => $c->is_primary,
                'status' => $c->status,
            ]);

        return response()->json(['data' => $rows]);
    }

    public function storeCampus(Request $request): JsonResponse
    {
        $this->authorizeAdmin($request);
        $institutionId = $this->institutionId($request);
        $institution = Institution::with(['subscription.plan', 'campuses'])->findOrFail($institutionId);

        $max = $institution->subscription?->plan?->max_campuses ?? 1;
        if ($institution->campuses->count() >= $max) {
            throw ValidationException::withMessages([
                'name' => ["Your plan allows a maximum of {$max} campus(es). Upgrade to add more."],
            ]);
        }

        $data = $request->validate([
            'name' => ['required', 'string', 'max:160'],
            'code' => ['nullable', 'string', 'max:32'],
            'address' => ['nullable', 'string', 'max:255'],
            'city' => ['nullable', 'string', 'max:120'],
            'phone' => ['nullable', 'string', 'max:40'],
            'isPrimary' => ['nullable', 'boolean'],
        ]);

        if (! empty($data['isPrimary'])) {
            Campus::where('institution_id', $institutionId)->update(['is_primary' => false]);
        }

        $campus = Campus::create([
            'id' => 'camp-'.Str::lower(Str::ulid()),
            'institution_id' => $institutionId,
            'name' => $data['name'],
            'code' => $data['code'] ?? strtoupper(Str::substr(Str::slug($data['name']), 0, 8)),
            'address' => $data['address'] ?? null,
            'city' => $data['city'] ?? null,
            'phone' => $data['phone'] ?? null,
            'is_primary' => (bool) ($data['isPrimary'] ?? false),
            'status' => 'active',
        ]);

        return response()->json([
            'id' => $campus->id,
            'name' => $campus->name,
            'code' => $campus->code,
            'address' => $campus->address,
            'city' => $campus->city,
            'phone' => $campus->phone,
            'isPrimary' => $campus->is_primary,
            'status' => $campus->status,
        ], 201);
    }

    public function updateInstitution(Request $request): JsonResponse
    {
        $this->authorizeAdmin($request);
        $institution = Institution::findOrFail($this->institutionId($request));

        $data = $request->validate([
            'name' => ['sometimes', 'string', 'max:180'],
            'shortName' => ['sometimes', 'string', 'max:64'],
            'city' => ['nullable', 'string', 'max:120'],
            'contactEmail' => ['nullable', 'email'],
            'contactPhone' => ['nullable', 'string', 'max:40'],
            'primaryColor' => ['nullable', 'string', 'max:16'],
            'secondaryColor' => ['nullable', 'string', 'max:16'],
            'logo' => ['nullable', 'image', 'max:2048'],
        ]);

        $payload = [
            'name' => $data['name'] ?? $institution->name,
            'short_name' => $data['shortName'] ?? $institution->short_name,
            'city' => array_key_exists('city', $data) ? $data['city'] : $institution->city,
            'contact_email' => array_key_exists('contactEmail', $data) ? $data['contactEmail'] : $institution->contact_email,
            'contact_phone' => array_key_exists('contactPhone', $data) ? $data['contactPhone'] : $institution->contact_phone,
            'primary_color' => $data['primaryColor'] ?? $institution->primary_color,
            'secondary_color' => $data['secondaryColor'] ?? $institution->secondary_color,
        ];

        if ($request->hasFile('logo')) {
            $payload['logo_url'] = $request->file('logo')->store("institutions/{$institution->id}", 'public');
        }

        $institution->update($payload);

        return response()->json(new InstitutionResource($institution->fresh()->load(['modules', 'subscription.plan'])));
    }

    public function onboardingStatus(Request $request): JsonResponse
    {
        $institution = Institution::with(['campuses', 'subscription.plan', 'modules'])
            ->findOrFail($this->institutionId($request));

        return response()->json([
            'step' => $institution->onboarding_step,
            'completed' => (bool) $institution->onboarding_completed_at,
            'completedAt' => optional($institution->onboarding_completed_at)?->toIso8601String(),
            'institution' => new InstitutionResource($institution),
            'campuses' => $institution->campuses->map(fn (Campus $c) => [
                'id' => $c->id,
                'name' => $c->name,
                'isPrimary' => $c->is_primary,
            ]),
            'subscription' => $institution->subscription,
        ]);
    }

    public function advanceOnboarding(Request $request): JsonResponse
    {
        $this->authorizeAdmin($request);
        $data = $request->validate([
            'step' => ['required', 'integer', 'min:0', 'max:10'],
            'complete' => ['nullable', 'boolean'],
        ]);

        $institution = Institution::findOrFail($this->institutionId($request));
        $institution->update([
            'onboarding_step' => $data['step'],
            'onboarding_completed_at' => ! empty($data['complete']) ? now() : $institution->onboarding_completed_at,
            'status' => ! empty($data['complete']) && $institution->status === 'trial'
                ? 'trial'
                : $institution->status,
        ]);

        if (! empty($data['complete'])) {
            $institution->update(['onboarding_completed_at' => now()]);
        }

        return $this->onboardingStatus($request);
    }

    private function authorizeAdmin(Request $request): void
    {
        if (! $request->user()?->hasAnyRole([
            Roles::INSTITUTION_ADMIN,
            Roles::SUPER_ADMIN,
            Roles::PRINCIPAL,
            Roles::PLATFORM_ADMIN,
        ])) {
            abort(403, 'Forbidden.');
        }
    }
}

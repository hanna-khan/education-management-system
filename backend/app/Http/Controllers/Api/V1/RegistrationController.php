<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\InstitutionResource;
use App\Http\Resources\UserResource;
use App\Models\Campus;
use App\Models\Institution;
use App\Models\InstitutionModule;
use App\Models\Plan;
use App\Models\Subscription;
use App\Models\User;
use App\Support\ModuleCatalog;
use App\Support\Roles;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class RegistrationController extends Controller
{
    public function plans(Request $request): JsonResponse
    {
        $type = $request->query('type');

        $query = Plan::query()->where('is_active', true)->orderBy('sort_order');

        if ($type) {
            $query->where(function ($q) use ($type) {
                $q->where('audience', 'both')->orWhere('audience', $type);
            });
        }

        $plans = $query->get()->map(fn (Plan $p) => $this->planPayload($p));

        return response()->json(['data' => $plans]);
    }

    public function register(Request $request): JsonResponse
    {
        $data = $request->validate([
            'institutionName' => ['required', 'string', 'max:180'],
            'shortName' => ['required', 'string', 'max:64'],
            'type' => ['required', Rule::in(['university', 'school'])],
            'city' => ['nullable', 'string', 'max:120'],
            'country' => ['nullable', 'string', 'max:120'],
            'contactEmail' => ['required', 'email'],
            'contactPhone' => ['nullable', 'string', 'max:40'],
            'planId' => ['required', 'string', 'exists:plans,id'],
            'billingCycle' => ['nullable', Rule::in(['monthly', 'yearly'])],
            'adminName' => ['required', 'string', 'max:160'],
            'adminEmail' => ['required', 'email'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'campusName' => ['nullable', 'string', 'max:160'],
            'campusAddress' => ['nullable', 'string', 'max:255'],
            'primaryColor' => ['nullable', 'string', 'max:16'],
            'secondaryColor' => ['nullable', 'string', 'max:16'],
            'logo' => ['nullable', 'image', 'max:2048'],
        ]);

        $plan = Plan::where('is_active', true)->findOrFail($data['planId']);

        if ($plan->audience !== 'both' && $plan->audience !== $data['type']) {
            throw ValidationException::withMessages([
                'planId' => ['Selected plan is not available for this institution type.'],
            ]);
        }

        if (User::where('email', $data['adminEmail'])->exists()) {
            throw ValidationException::withMessages([
                'adminEmail' => ['This email is already registered.'],
            ]);
        }

        $logoFile = $request->file('logo');

        $result = DB::transaction(function () use ($data, $plan, $logoFile) {
            $short = $data['shortName'];
            $institutionId = 'inst-'.Str::lower(Str::ulid());

            $logoUrl = null;
            if ($logoFile) {
                $logoUrl = $logoFile->store("institutions/{$institutionId}", 'public');
            }

            $institution = Institution::create([
                'id' => $institutionId,
                'name' => $data['institutionName'],
                'short_name' => $short,
                'slug' => Str::slug($short).'-'.Str::lower(Str::random(4)),
                'type' => $data['type'],
                'status' => 'trial',
                'logo_initials' => strtoupper(substr(preg_replace('/\s+/', '', $short), 0, 2)),
                'logo_url' => $logoUrl,
                'primary_color' => $data['primaryColor'] ?? '#6B58F6',
                'secondary_color' => $data['secondaryColor'] ?? '#8C4AF2',
                'city' => $data['city'] ?? null,
                'country' => $data['country'] ?? 'Pakistan',
                'contact_email' => $data['contactEmail'],
                'contact_phone' => $data['contactPhone'] ?? null,
                'student_count' => 0,
                'staff_count' => 1,
                'onboarding_step' => 1,
                'onboarding_completed_at' => null,
            ]);

            $moduleDefaults = ModuleCatalog::defaultsForType($institution->type);
            $planModules = $plan->modules ?? [];
            foreach ($moduleDefaults as $moduleId => $enabled) {
                if (array_key_exists($moduleId, $planModules)) {
                    $enabled = (bool) $planModules[$moduleId];
                }
                InstitutionModule::create([
                    'institution_id' => $institution->id,
                    'module_id' => $moduleId,
                    'enabled' => $enabled,
                ]);
            }

            $trialDays = $plan->trial_days ?: 14;
            Subscription::create([
                'id' => 'sub-'.Str::lower(Str::ulid()),
                'institution_id' => $institution->id,
                'plan_id' => $plan->id,
                'status' => 'trialing',
                'billing_cycle' => $data['billingCycle'] ?? 'monthly',
                'starts_at' => now(),
                'trial_ends_at' => now()->addDays($trialDays),
                'ends_at' => now()->addDays($trialDays),
            ]);

            $campus = Campus::create([
                'id' => 'camp-'.Str::lower(Str::ulid()),
                'institution_id' => $institution->id,
                'name' => $data['campusName'] ?? 'Main Campus',
                'code' => 'MAIN',
                'address' => $data['campusAddress'] ?? null,
                'city' => $data['city'] ?? null,
                'is_primary' => true,
                'status' => 'active',
            ]);

            $admin = User::create([
                'id' => 'user-'.Str::lower(Str::ulid()),
                'institution_id' => $institution->id,
                'name' => $data['adminName'],
                'email' => $data['adminEmail'],
                'password' => $data['password'],
                'role' => Roles::INSTITUTION_ADMIN,
                'title' => 'Institution Administrator',
                'status' => 'active',
                'email_verified_at' => now(),
            ]);

            $token = $admin->createToken('ems-web')->plainTextToken;

            return compact('institution', 'admin', 'campus', 'token', 'plan');
        });

        $institution = $result['institution']->load(['modules', 'subscription.plan', 'campuses']);

        return response()->json([
            'token' => $result['token'],
            'tokenType' => 'Bearer',
            'user' => new UserResource($result['admin']),
            'institution' => new InstitutionResource($institution),
            'subscription' => $this->subscriptionPayload($institution->subscription),
            'campus' => $this->campusPayload($result['campus']),
            'nextStep' => '/onboarding',
            'message' => 'Institution registered. Complete onboarding to finish setup.',
        ], 201);
    }

    private function planPayload(Plan $p): array
    {
        return [
            'id' => $p->id,
            'name' => $p->name,
            'code' => $p->code,
            'audience' => $p->audience,
            'description' => $p->description,
            'priceMonthly' => $p->price_monthly,
            'priceYearly' => $p->price_yearly,
            'currency' => $p->currency,
            'maxStudents' => $p->max_students,
            'maxStaff' => $p->max_staff,
            'maxCampuses' => $p->max_campuses,
            'trialDays' => $p->trial_days,
            'features' => $p->features ?? [],
            'modules' => $p->modules ?? [],
        ];
    }

    private function subscriptionPayload(?Subscription $s): ?array
    {
        if (! $s) {
            return null;
        }

        return [
            'id' => $s->id,
            'planId' => $s->plan_id,
            'plan' => $s->relationLoaded('plan') && $s->plan ? $this->planPayload($s->plan) : null,
            'status' => $s->status,
            'billingCycle' => $s->billing_cycle,
            'startsAt' => optional($s->starts_at)?->toIso8601String(),
            'endsAt' => optional($s->ends_at)?->toIso8601String(),
            'trialEndsAt' => optional($s->trial_ends_at)?->toIso8601String(),
        ];
    }

    private function campusPayload(Campus $c): array
    {
        return [
            'id' => $c->id,
            'name' => $c->name,
            'code' => $c->code,
            'address' => $c->address,
            'city' => $c->city,
            'phone' => $c->phone,
            'isPrimary' => $c->is_primary,
            'status' => $c->status,
        ];
    }
}

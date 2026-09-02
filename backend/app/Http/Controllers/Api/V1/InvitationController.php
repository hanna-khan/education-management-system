<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Mail\StaffInvitationMail;
use App\Models\Campus;
use App\Models\CampusMembership;
use App\Models\Institution;
use App\Models\Invitation;
use App\Models\Teacher;
use App\Models\User;
use App\Support\Roles;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class InvitationController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $this->authorizeInvite($request);
        $institutionId = $this->institutionId($request);

        $rows = Invitation::query()
            ->where('institution_id', $institutionId)
            ->orderByDesc('created_at')
            ->limit(100)
            ->get()
            ->map(fn (Invitation $inv) => $this->payload($inv));

        return response()->json(['data' => $rows]);
    }

    public function store(Request $request): JsonResponse
    {
        $this->authorizeInvite($request);
        $institutionId = $this->institutionId($request);

        $data = $request->validate([
            'email' => ['required', 'email', 'max:180'],
            'name' => ['nullable', 'string', 'max:120'],
            'role' => ['required', Rule::in(Roles::invitable())],
            'campusIds' => ['nullable', 'array'],
            'campusIds.*' => ['string'],
        ]);

        $email = Str::lower($data['email']);
        $role = $data['role'];
        $campusIds = array_values(array_unique($data['campusIds'] ?? []));

        if (in_array($role, Roles::requiresCampus(), true) && count($campusIds) < 1) {
            throw ValidationException::withMessages([
                'campusIds' => ['Please choose at least one campus for this role.'],
            ]);
        }

        if ($role === Roles::PRINCIPAL || $role === Roles::VICE_PRINCIPAL) {
            if (count($campusIds) !== 1) {
                throw ValidationException::withMessages([
                    'campusIds' => ['Principal and vice principal are invited for one campus at a time.'],
                ]);
            }
        }

        $validCampusCount = Campus::where('institution_id', $institutionId)
            ->whereIn('id', $campusIds)
            ->count();
        if (count($campusIds) > 0 && $validCampusCount !== count($campusIds)) {
            throw ValidationException::withMessages([
                'campusIds' => ['One or more campuses are invalid.'],
            ]);
        }

        if (User::where('institution_id', $institutionId)->where('email', $email)->exists()) {
            throw ValidationException::withMessages([
                'email' => ['Someone with this email already has an account at your institution.'],
            ]);
        }

        Invitation::where('institution_id', $institutionId)
            ->where('email', $email)
            ->where('status', 'pending')
            ->update(['status' => 'revoked']);

        $token = Str::random(48);
        $invitation = Invitation::create([
            'id' => 'inv-'.Str::lower(Str::ulid()),
            'institution_id' => $institutionId,
            'invited_by' => $request->user()->id,
            'email' => $email,
            'name' => $data['name'] ?? null,
            'role' => $role,
            'campus_ids' => $campusIds,
            'token' => $token,
            'status' => 'pending',
            'expires_at' => now()->addDays(7),
        ]);

        $invitation->load('institution');
        $inviteUrl = $this->inviteUrl($token);
        $mail = $this->sendInviteEmail($invitation, $inviteUrl, $request->user()->name);

        return response()->json([
            'invitation' => $this->payload($invitation),
            'inviteUrl' => $inviteUrl,
            'mailSent' => $mail['sent'],
            'mailError' => $mail['error'],
            'mailInboxHint' => config('app.mail_inbox_hint'),
            'message' => $mail['sent']
                ? 'Invitation email sent. You can also copy the link.'
                : 'Invitation created, but the email could not be sent. Copy the link and share it manually.',
        ], 201);
    }

    public function destroy(Request $request, string $invitation): JsonResponse
    {
        $this->authorizeInvite($request);
        $row = Invitation::where('institution_id', $this->institutionId($request))
            ->where('id', $invitation)
            ->firstOrFail();
        $row->update(['status' => 'revoked']);

        return response()->json(['message' => 'Invitation cancelled.']);
    }

    public function resend(Request $request, string $invitation): JsonResponse
    {
        $this->authorizeInvite($request);
        $row = Invitation::where('institution_id', $this->institutionId($request))
            ->where('id', $invitation)
            ->firstOrFail();

        if ($row->status === 'accepted') {
            throw ValidationException::withMessages(['invitation' => ['This invitation was already accepted.']]);
        }

        $row->update([
            'token' => Str::random(48),
            'status' => 'pending',
            'expires_at' => now()->addDays(7),
        ]);

        $row->load('institution');
        $inviteUrl = $this->inviteUrl($row->token);
        $mail = $this->sendInviteEmail($row, $inviteUrl, $request->user()->name);

        return response()->json([
            'invitation' => $this->payload($row->fresh()),
            'inviteUrl' => $inviteUrl,
            'mailSent' => $mail['sent'],
            'mailError' => $mail['error'],
            'mailInboxHint' => config('app.mail_inbox_hint'),
            'message' => $mail['sent']
                ? 'Invitation email resent.'
                : 'Invite refreshed, but email failed. Copy the link instead.',
        ]);
    }

    public function showByToken(string $token): JsonResponse
    {
        $invitation = Invitation::with('institution')->where('token', $token)->firstOrFail();

        if (! $invitation->isPending()) {
            return response()->json([
                'valid' => false,
                'message' => $invitation->status === 'accepted'
                    ? 'This invitation was already used. Please sign in.'
                    : 'This invitation is no longer valid. Ask your admin for a new one.',
            ], 410);
        }

        $campuses = Campus::whereIn('id', $invitation->campus_ids ?? [])
            ->get(['id', 'name', 'city']);

        return response()->json([
            'valid' => true,
            'email' => $invitation->email,
            'name' => $invitation->name,
            'role' => $invitation->role,
            'roleLabel' => $this->roleLabel($invitation->role),
            'institutionName' => $invitation->institution?->name,
            'institutionType' => $invitation->institution?->type,
            'campuses' => $campuses->map(fn (Campus $c) => [
                'id' => $c->id,
                'name' => $c->name,
                'city' => $c->city,
            ]),
            'expiresAt' => $invitation->expires_at->toIso8601String(),
        ]);
    }

    public function accept(Request $request): JsonResponse
    {
        $data = $request->validate([
            'token' => ['required', 'string'],
            'name' => ['required', 'string', 'max:120'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        $invitation = Invitation::with('institution')->where('token', $data['token'])->firstOrFail();
        if (! $invitation->isPending()) {
            throw ValidationException::withMessages([
                'token' => ['This invitation is no longer valid.'],
            ]);
        }

        $result = DB::transaction(function () use ($invitation, $data) {
            $user = User::create([
                'id' => 'usr-'.Str::lower(Str::ulid()),
                'institution_id' => $invitation->institution_id,
                'name' => $data['name'],
                'email' => $invitation->email,
                'password' => $data['password'],
                'role' => $invitation->role,
                'status' => 'active',
                'email_verified_at' => now(),
            ]);

            foreach ($invitation->campus_ids ?? [] as $campusId) {
                CampusMembership::create([
                    'id' => 'cm-'.Str::lower(Str::ulid()),
                    'institution_id' => $invitation->institution_id,
                    'campus_id' => $campusId,
                    'user_id' => $user->id,
                    'role' => $invitation->role === Roles::TEACHER
                        ? Roles::TEACHER
                        : $invitation->role,
                ]);
            }

            if ($invitation->role === Roles::TEACHER) {
                $parts = preg_split('/\s+/', trim($data['name']), 2);
                $teacher = Teacher::create([
                    'id' => 'tch-'.Str::lower(Str::ulid()),
                    'institution_id' => $invitation->institution_id,
                    'user_id' => $user->id,
                    'employee_id' => 'T-'.strtoupper(Str::random(6)),
                    'first_name' => $parts[0] ?? $data['name'],
                    'last_name' => $parts[1] ?? '',
                    'email' => $invitation->email,
                    'status' => 'active',
                    'joined_at' => now()->toDateString(),
                ]);

                $campusIds = $invitation->campus_ids ?? [];
                foreach ($campusIds as $i => $campusId) {
                    $teacher->campuses()->attach($campusId, ['is_primary' => $i === 0]);
                }
            }

            $invitation->update([
                'status' => 'accepted',
                'accepted_at' => now(),
                'accepted_user_id' => $user->id,
            ]);

            $institution = Institution::find($invitation->institution_id);
            if ($institution) {
                $institution->increment('staff_count');
            }

            $token = $user->createToken('ems')->plainTextToken;

            return compact('user', 'token');
        });

        $user = $result['user']->load(['institution.modules', 'institution.subscription.plan']);

        return response()->json([
            'token' => $result['token'],
            'user' => new UserResource($user),
            'institution' => $user->institution
                ? new \App\Http\Resources\InstitutionResource($user->institution)
                : null,
            'message' => 'Welcome! Your account is ready.',
        ]);
    }

    public function staff(Request $request): JsonResponse
    {
        $this->authorizeInvite($request);
        $institutionId = $this->institutionId($request);

        $users = User::query()
            ->where('institution_id', $institutionId)
            ->whereNotIn('role', [Roles::STUDENT, Roles::PARENT, Roles::PLATFORM_ADMIN])
            ->with(['campusMemberships.campus'])
            ->orderBy('name')
            ->get()
            ->map(function (User $u) {
                return [
                    'id' => $u->id,
                    'name' => $u->name,
                    'email' => $u->email,
                    'role' => $u->role,
                    'roleLabel' => $this->roleLabel($u->role),
                    'status' => $u->status,
                    'campuses' => $u->campusMemberships->map(fn (CampusMembership $m) => [
                        'id' => $m->campus_id,
                        'name' => $m->campus?->name,
                        'role' => $m->role,
                    ])->values(),
                ];
            });

        return response()->json(['data' => $users]);
    }

    private function payload(Invitation $inv): array
    {
        return [
            'id' => $inv->id,
            'email' => $inv->email,
            'name' => $inv->name,
            'role' => $inv->role,
            'roleLabel' => $this->roleLabel($inv->role),
            'campusIds' => $inv->campus_ids ?? [],
            'status' => $inv->isPending() ? 'pending' : $inv->status,
            'expiresAt' => optional($inv->expires_at)?->toIso8601String(),
            'createdAt' => optional($inv->created_at)?->toIso8601String(),
            'inviteUrl' => $inv->status === 'pending' ? $this->inviteUrl($inv->token) : null,
        ];
    }

    /** @return array{sent: bool, error: string|null} */
    private function sendInviteEmail(Invitation $invitation, string $inviteUrl, string $inviterName): array
    {
        try {
            Mail::to($invitation->email)->send(new StaffInvitationMail(
                $invitation,
                $inviteUrl,
                $this->roleLabel($invitation->role),
                $inviterName ?: 'Your administrator',
            ));

            return ['sent' => true, 'error' => null];
        } catch (\Throwable $e) {
            report($e);

            return ['sent' => false, 'error' => $e->getMessage()];
        }
    }

    private function inviteUrl(string $token): string
    {
        $base = rtrim(config('app.frontend_url', env('FRONTEND_URL', 'http://localhost:3000')), '/');

        return "{$base}/accept-invite?token={$token}";
    }

    private function roleLabel(string $role): string
    {
        return match ($role) {
            Roles::PRINCIPAL => 'Principal',
            Roles::VICE_PRINCIPAL => 'Vice Principal',
            Roles::TEACHER => 'Teacher',
            Roles::REGISTRAR => 'Registrar',
            Roles::ACCOUNTANT => 'Accountant',
            Roles::HR => 'HR',
            Roles::ADMISSION_OFFICER => 'Admissions Officer',
            Roles::EXAM_OFFICER => 'Exam Officer',
            Roles::INSTITUTION_ADMIN => 'Institution Admin',
            default => str_replace('_', ' ', ucfirst($role)),
        };
    }

    private function institutionId(Request $request): string
    {
        $id = $request->attributes->get('institution_id') ?: $request->user()?->institution_id;
        if (! $id) {
            abort(422, 'Institution context is required.');
        }

        return $id;
    }

    private function authorizeInvite(Request $request): void
    {
        $user = $request->user();
        $allowed = [
            Roles::PLATFORM_ADMIN,
            Roles::SUPER_ADMIN,
            Roles::INSTITUTION_ADMIN,
            Roles::PRINCIPAL,
            Roles::VICE_PRINCIPAL,
            Roles::REGISTRAR,
        ];

        if (! $user || ! $user->hasAnyRole($allowed)) {
            $role = $user?->role ? str_replace('_', ' ', $user->role) : 'guest';
            abort(
                403,
                "Only institution admins and principals can send invitations. You’re currently signed in as {$role}. Sign out and sign in with your admin account.",
            );
        }
    }
}

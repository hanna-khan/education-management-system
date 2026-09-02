<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\InstitutionResource;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(Request $request): JsonResponse
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
            'institution_id' => ['nullable', 'string'],
            'device_name' => ['nullable', 'string', 'max:120'],
        ]);

        $query = User::query()->with('institution')->where('email', $credentials['email']);

        if (! empty($credentials['institution_id'])) {
            $query->where(function ($q) use ($credentials) {
                $q->where('institution_id', $credentials['institution_id'])
                    ->orWhere('role', 'platform_admin');
            });
        }

        /** @var User|null $user */
        $user = $query->first();

        if (! $user || ! Hash::check($credentials['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        if ($user->status !== 'active') {
            throw ValidationException::withMessages([
                'email' => ['This account is not active.'],
            ]);
        }

        $token = $user->createToken($credentials['device_name'] ?? 'ems-web')->plainTextToken;
        $user->load(['institution.modules', 'institution.subscription.plan']);

        return response()->json([
            'token' => $token,
            'tokenType' => 'Bearer',
            'user' => new UserResource($user),
            'institution' => $user->institution
                ? new InstitutionResource($user->institution)
                : null,
        ]);
    }

    public function me(Request $request): JsonResponse
    {
        $user = $request->user()->load(['institution.modules', 'institution.subscription.plan']);

        return response()->json([
            'user' => new UserResource($user),
            'institution' => $user->institution
                ? new InstitutionResource($user->institution)
                : null,
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()?->delete();

        return response()->json(['message' => 'Logged out.']);
    }

    public function forgotPassword(Request $request): JsonResponse
    {
        $request->validate(['email' => ['required', 'email']]);

        Password::sendResetLink($request->only('email'));

        return response()->json([
            'message' => 'If that email exists, a reset link has been sent.',
        ]);
    }

    public function resetPassword(Request $request): JsonResponse
    {
        $request->validate([
            'token' => ['required', 'string'],
            'email' => ['required', 'email'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function (User $user, string $password) {
                $user->forceFill(['password' => $password])->save();
                $user->tokens()->delete();
            }
        );

        if ($status !== Password::PASSWORD_RESET) {
            throw ValidationException::withMessages([
                'email' => [__($status)],
            ]);
        }

        return response()->json(['message' => 'Password has been reset.']);
    }
}

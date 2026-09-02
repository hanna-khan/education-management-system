<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Concerns\ResolvesInstitution;
use App\Http\Controllers\Controller;
use App\Models\Notice;
use App\Support\Roles;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class NoticeController extends Controller
{
    use ResolvesInstitution;

    public function index(Request $request): JsonResponse
    {
        $query = Notice::where('institution_id', $this->institutionId($request));

        if ($status = $request->query('status')) {
            if ($status !== 'all') {
                $query->where('status', $status);
            }
        }

        $rows = $query->orderByDesc('published_at')->get()->map(fn (Notice $n) => [
            'id' => $n->id,
            'title' => $n->title,
            'audience' => $n->audience,
            'body' => $n->body,
            'published' => optional($n->published_at)?->toDateString(),
            'expiry' => optional($n->expires_at)?->toDateString(),
            'status' => $n->status,
        ]);

        return response()->json(['data' => $rows]);
    }

    public function store(Request $request): JsonResponse
    {
        $this->authorizeManage($request);
        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'audience' => ['nullable', 'string', 'max:120'],
            'body' => ['nullable', 'string'],
            'published' => ['nullable', 'date'],
            'expiry' => ['nullable', 'date'],
            'status' => ['nullable', Rule::in(['draft', 'published', 'expired'])],
        ]);

        $notice = Notice::create([
            'id' => 'notice-'.Str::lower(Str::ulid()),
            'institution_id' => $this->institutionId($request),
            'title' => $data['title'],
            'audience' => $data['audience'] ?? 'All',
            'body' => $data['body'] ?? null,
            'published_at' => $data['published'] ?? (($data['status'] ?? 'draft') === 'published' ? now()->toDateString() : null),
            'expires_at' => $data['expiry'] ?? null,
            'status' => $data['status'] ?? 'draft',
            'created_by' => $request->user()->id,
        ]);

        return response()->json([
            'id' => $notice->id,
            'title' => $notice->title,
            'audience' => $notice->audience,
            'body' => $notice->body,
            'published' => optional($notice->published_at)?->toDateString(),
            'expiry' => optional($notice->expires_at)?->toDateString(),
            'status' => $notice->status,
        ], 201);
    }

    public function update(Request $request, string $notice): JsonResponse
    {
        $this->authorizeManage($request);
        $model = Notice::where('institution_id', $this->institutionId($request))
            ->where('id', $notice)
            ->firstOrFail();

        $data = $request->validate([
            'title' => ['sometimes', 'string', 'max:255'],
            'audience' => ['nullable', 'string', 'max:120'],
            'body' => ['nullable', 'string'],
            'status' => ['sometimes', Rule::in(['draft', 'published', 'expired'])],
            'expiry' => ['nullable', 'date'],
        ]);

        $model->update([
            'title' => $data['title'] ?? $model->title,
            'audience' => array_key_exists('audience', $data) ? $data['audience'] : $model->audience,
            'body' => array_key_exists('body', $data) ? $data['body'] : $model->body,
            'status' => $data['status'] ?? $model->status,
            'expires_at' => array_key_exists('expiry', $data) ? $data['expiry'] : $model->expires_at,
            'published_at' => ($data['status'] ?? null) === 'published' && ! $model->published_at
                ? now()->toDateString()
                : $model->published_at,
        ]);

        return response()->json([
            'id' => $model->id,
            'title' => $model->title,
            'audience' => $model->audience,
            'body' => $model->body,
            'published' => optional($model->published_at)?->toDateString(),
            'expiry' => optional($model->expires_at)?->toDateString(),
            'status' => $model->status,
        ]);
    }

    private function authorizeManage(Request $request): void
    {
        if (! $request->user()?->hasAnyRole(Roles::institutionManagers())) {
            abort(403, 'Forbidden.');
        }
    }
}

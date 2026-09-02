<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\TeacherResource;
use App\Models\Teacher;
use App\Support\Roles;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class TeacherController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $institutionId = $this->institutionId($request);

        $query = Teacher::query()
            ->with('department')
            ->where('institution_id', $institutionId);

        if ($search = $request->string('search')->toString()) {
            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                    ->orWhere('last_name', 'like', "%{$search}%")
                    ->orWhere('employee_id', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        if ($status = $request->query('status')) {
            if ($status !== 'all') {
                $query->where('status', $status);
            }
        }

        $pageSize = min(max((int) $request->query('pageSize', 10), 1), 100);
        $paginator = $query->orderBy('last_name')->paginate($pageSize);

        return response()->json([
            'data' => TeacherResource::collection($paginator->items()),
            'total' => $paginator->total(),
            'page' => $paginator->currentPage(),
            'pageSize' => $paginator->perPage(),
            'totalPages' => $paginator->lastPage(),
        ]);
    }

    public function show(Request $request, string $teacher): JsonResponse
    {
        $model = Teacher::query()
            ->with('department')
            ->where('institution_id', $this->institutionId($request))
            ->where('id', $teacher)
            ->firstOrFail();

        return response()->json(new TeacherResource($model));
    }

    public function store(Request $request): JsonResponse
    {
        $this->authorizeManage($request);
        $institutionId = $this->institutionId($request);

        $data = $request->validate([
            'employeeId' => ['required', 'string', 'max:64', Rule::unique('teachers', 'employee_id')->where('institution_id', $institutionId)],
            'firstName' => ['required', 'string', 'max:120'],
            'lastName' => ['required', 'string', 'max:120'],
            'email' => ['required', 'email', Rule::unique('teachers', 'email')->where('institution_id', $institutionId)],
            'phone' => ['nullable', 'string', 'max:40'],
            'title' => ['nullable', 'string', 'max:120'],
            'departmentId' => ['nullable', 'string', 'exists:departments,id'],
            'status' => ['nullable', Rule::in(['active', 'inactive', 'on_leave'])],
            'joinedAt' => ['nullable', 'date'],
        ]);

        $teacher = Teacher::create([
            'id' => 'tch-'.Str::lower(Str::ulid()),
            'institution_id' => $institutionId,
            'employee_id' => $data['employeeId'],
            'first_name' => $data['firstName'],
            'last_name' => $data['lastName'],
            'email' => $data['email'],
            'phone' => $data['phone'] ?? null,
            'title' => $data['title'] ?? null,
            'department_id' => $data['departmentId'] ?? null,
            'status' => $data['status'] ?? 'active',
            'joined_at' => $data['joinedAt'] ?? now()->toDateString(),
        ]);

        $teacher->load('department');

        return response()->json(new TeacherResource($teacher), 201);
    }

    public function update(Request $request, string $teacher): JsonResponse
    {
        $this->authorizeManage($request);
        $institutionId = $this->institutionId($request);

        $model = Teacher::query()
            ->where('institution_id', $institutionId)
            ->where('id', $teacher)
            ->firstOrFail();

        $data = $request->validate([
            'firstName' => ['sometimes', 'string', 'max:120'],
            'lastName' => ['sometimes', 'string', 'max:120'],
            'email' => ['sometimes', 'email', Rule::unique('teachers', 'email')->where('institution_id', $institutionId)->ignore($model->id)],
            'phone' => ['nullable', 'string', 'max:40'],
            'title' => ['nullable', 'string', 'max:120'],
            'departmentId' => ['nullable', 'string', 'exists:departments,id'],
            'status' => ['nullable', Rule::in(['active', 'inactive', 'on_leave'])],
        ]);

        $map = [
            'firstName' => 'first_name',
            'lastName' => 'last_name',
            'email' => 'email',
            'phone' => 'phone',
            'title' => 'title',
            'departmentId' => 'department_id',
            'status' => 'status',
        ];

        $payload = [];
        foreach ($map as $input => $column) {
            if (array_key_exists($input, $data)) {
                $payload[$column] = $data[$input];
            }
        }

        $model->update($payload);
        $model->load('department');

        return response()->json(new TeacherResource($model));
    }

    private function institutionId(Request $request): string
    {
        $id = $request->attributes->get('institution_id') ?: $request->user()?->institution_id;
        if (! $id) {
            abort(422, 'Institution context is required.');
        }

        return $id;
    }

    private function authorizeManage(Request $request): void
    {
        if (! $request->user()?->hasAnyRole(Roles::institutionManagers())) {
            abort(403, 'Forbidden.');
        }
    }
}

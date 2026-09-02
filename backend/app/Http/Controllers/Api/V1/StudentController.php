<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\StudentResource;
use App\Models\Student;
use App\Support\Roles;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class StudentController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $institutionId = $this->institutionId($request);

        $query = Student::query()
            ->with(['department', 'program'])
            ->where('institution_id', $institutionId);

        if ($search = $request->string('search')->toString()) {
            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                    ->orWhere('last_name', 'like', "%{$search}%")
                    ->orWhere('student_number', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        foreach (['status', 'fee_status' => 'feeStatus', 'semester'] as $key => $alias) {
            $column = is_int($key) ? $alias : $key;
            $param = is_int($key) ? $alias : $alias;
            $value = $request->query($param) ?? $request->query($column);
            if ($value && $value !== 'all') {
                $query->where($column, $value);
            }
        }

        if ($department = $request->query('department')) {
            if ($department !== 'all') {
                $query->whereHas('department', fn ($q) => $q->where('name', $department)->orWhere('id', $department));
            }
        }

        if ($program = $request->query('program')) {
            if ($program !== 'all') {
                $query->whereHas('program', fn ($q) => $q->where('name', $program)->orWhere('id', $program));
            }
        }

        $pageSize = min(max((int) $request->query('pageSize', 10), 1), 100);
        $paginator = $query->orderBy('student_number')->paginate($pageSize);

        return response()->json([
            'data' => StudentResource::collection($paginator->items()),
            'total' => $paginator->total(),
            'page' => $paginator->currentPage(),
            'pageSize' => $paginator->perPage(),
            'totalPages' => $paginator->lastPage(),
        ]);
    }

    public function stats(Request $request): JsonResponse
    {
        $institutionId = $this->institutionId($request);
        $base = Student::query()->where('institution_id', $institutionId);

        $total = (clone $base)->count();
        $active = (clone $base)->where('status', 'active')->count();
        $overdue = (clone $base)->where('fee_status', 'overdue')->count();
        $avgAttendance = (clone $base)->avg('attendance_rate') ?? 0;

        return response()->json([
            'total' => $total,
            'active' => $active,
            'overdue' => $overdue,
            'avgAttendance' => number_format((float) $avgAttendance, 1, '.', ''),
        ]);
    }

    public function filterOptions(Request $request): JsonResponse
    {
        $institutionId = $this->institutionId($request);

        $departments = \App\Models\Department::query()
            ->where('institution_id', $institutionId)
            ->orderBy('name')
            ->pluck('name');

        $programs = \App\Models\Program::query()
            ->where('institution_id', $institutionId)
            ->orderBy('name')
            ->pluck('name');

        return response()->json([
            'departments' => $departments,
            'programs' => $programs,
            'semesters' => range(1, 8),
        ]);
    }

    public function show(Request $request, string $student): JsonResponse
    {
        $institutionId = $this->institutionId($request);

        $model = Student::query()
            ->with(['department', 'program'])
            ->where('institution_id', $institutionId)
            ->where(function ($q) use ($student) {
                $q->where('id', $student)->orWhere('student_number', $student);
            })
            ->firstOrFail();

        return response()->json(new StudentResource($model));
    }

    public function store(Request $request): JsonResponse
    {
        $this->authorizeManage($request);
        $institutionId = $this->institutionId($request);

        $data = $request->validate([
            'studentId' => ['required', 'string', 'max:64', Rule::unique('students', 'student_number')->where('institution_id', $institutionId)],
            'firstName' => ['required', 'string', 'max:120'],
            'lastName' => ['required', 'string', 'max:120'],
            'email' => ['required', 'email', Rule::unique('students', 'email')->where('institution_id', $institutionId)],
            'phone' => ['nullable', 'string', 'max:40'],
            'departmentId' => ['nullable', 'string', 'exists:departments,id'],
            'programId' => ['nullable', 'string', 'exists:programs,id'],
            'semester' => ['nullable', 'integer', 'min:1', 'max:16'],
            'section' => ['nullable', 'string', 'max:16'],
            'status' => ['nullable', Rule::in(['active', 'inactive', 'graduated', 'suspended', 'on_leave'])],
            'feeStatus' => ['nullable', Rule::in(['paid', 'partial', 'overdue', 'waived'])],
            'enrollmentDate' => ['nullable', 'date'],
            'cgpa' => ['nullable', 'numeric', 'min:0', 'max:4'],
            'dateOfBirth' => ['nullable', 'date'],
            'gender' => ['nullable', 'string', 'max:32'],
            'cnic' => ['nullable', 'string', 'max:32'],
            'address' => ['nullable', 'string', 'max:255'],
            'city' => ['nullable', 'string', 'max:120'],
            'guardianName' => ['nullable', 'string', 'max:120'],
            'guardianPhone' => ['nullable', 'string', 'max:40'],
            'guardianRelation' => ['nullable', 'string', 'max:64'],
            'campus' => ['nullable', 'string', 'max:120'],
        ]);

        $student = Student::create([
            'id' => 'stu-'.Str::lower(Str::ulid()),
            'institution_id' => $institutionId,
            'student_number' => $data['studentId'],
            'first_name' => $data['firstName'],
            'last_name' => $data['lastName'],
            'email' => $data['email'],
            'phone' => $data['phone'] ?? null,
            'department_id' => $data['departmentId'] ?? null,
            'program_id' => $data['programId'] ?? null,
            'semester' => $data['semester'] ?? 1,
            'section' => $data['section'] ?? null,
            'status' => $data['status'] ?? 'active',
            'fee_status' => $data['feeStatus'] ?? 'partial',
            'avatar_initials' => strtoupper(substr($data['firstName'], 0, 1).substr($data['lastName'], 0, 1)),
            'enrollment_date' => $data['enrollmentDate'] ?? now()->toDateString(),
            'cgpa' => $data['cgpa'] ?? 0,
            'date_of_birth' => $data['dateOfBirth'] ?? null,
            'gender' => $data['gender'] ?? null,
            'cnic' => $data['cnic'] ?? null,
            'address' => $data['address'] ?? null,
            'city' => $data['city'] ?? null,
            'guardian_name' => $data['guardianName'] ?? null,
            'guardian_phone' => $data['guardianPhone'] ?? null,
            'guardian_relation' => $data['guardianRelation'] ?? null,
            'campus' => $data['campus'] ?? null,
        ]);

        $student->load(['department', 'program']);

        return response()->json(new StudentResource($student), 201);
    }

    public function update(Request $request, string $student): JsonResponse
    {
        $this->authorizeManage($request);
        $institutionId = $this->institutionId($request);

        $model = Student::query()
            ->where('institution_id', $institutionId)
            ->where('id', $student)
            ->firstOrFail();

        $data = $request->validate([
            'firstName' => ['sometimes', 'string', 'max:120'],
            'lastName' => ['sometimes', 'string', 'max:120'],
            'email' => ['sometimes', 'email', Rule::unique('students', 'email')->where('institution_id', $institutionId)->ignore($model->id)],
            'phone' => ['nullable', 'string', 'max:40'],
            'departmentId' => ['nullable', 'string', 'exists:departments,id'],
            'programId' => ['nullable', 'string', 'exists:programs,id'],
            'semester' => ['nullable', 'integer', 'min:1', 'max:16'],
            'section' => ['nullable', 'string', 'max:16'],
            'status' => ['nullable', Rule::in(['active', 'inactive', 'graduated', 'suspended', 'on_leave'])],
            'feeStatus' => ['nullable', Rule::in(['paid', 'partial', 'overdue', 'waived'])],
            'cgpa' => ['nullable', 'numeric', 'min:0', 'max:4'],
            'guardianName' => ['nullable', 'string', 'max:120'],
            'guardianPhone' => ['nullable', 'string', 'max:40'],
            'guardianRelation' => ['nullable', 'string', 'max:64'],
            'campus' => ['nullable', 'string', 'max:120'],
            'address' => ['nullable', 'string', 'max:255'],
            'city' => ['nullable', 'string', 'max:120'],
        ]);

        $map = [
            'firstName' => 'first_name',
            'lastName' => 'last_name',
            'email' => 'email',
            'phone' => 'phone',
            'departmentId' => 'department_id',
            'programId' => 'program_id',
            'semester' => 'semester',
            'section' => 'section',
            'status' => 'status',
            'feeStatus' => 'fee_status',
            'cgpa' => 'cgpa',
            'guardianName' => 'guardian_name',
            'guardianPhone' => 'guardian_phone',
            'guardianRelation' => 'guardian_relation',
            'campus' => 'campus',
            'address' => 'address',
            'city' => 'city',
        ];

        $payload = [];
        foreach ($map as $input => $column) {
            if (array_key_exists($input, $data)) {
                $payload[$column] = $data[$input];
            }
        }

        $model->update($payload);
        $model->load(['department', 'program']);

        return response()->json(new StudentResource($model));
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

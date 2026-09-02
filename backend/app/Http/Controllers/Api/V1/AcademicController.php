<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\InstitutionResource;
use App\Models\Course;
use App\Models\Department;
use App\Models\Institution;
use App\Models\InstitutionModule;
use App\Models\Program;
use App\Models\Section;
use App\Models\Student;
use App\Models\Teacher;
use App\Support\ModuleCatalog;
use App\Support\Roles;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class AcademicController extends Controller
{
    public function departments(Request $request): JsonResponse
    {
        $rows = Department::query()
            ->where('institution_id', $this->institutionId($request))
            ->orderBy('name')
            ->get()
            ->map(fn (Department $d) => [
                'id' => $d->id,
                'code' => $d->code,
                'name' => $d->name,
                'headName' => $d->head_name,
                'status' => $d->status,
            ]);

        return response()->json(['data' => $rows]);
    }

    public function programs(Request $request): JsonResponse
    {
        $rows = Program::query()
            ->with('department')
            ->where('institution_id', $this->institutionId($request))
            ->orderBy('name')
            ->get()
            ->map(fn (Program $p) => [
                'id' => $p->id,
                'code' => $p->code,
                'name' => $p->name,
                'degreeLevel' => $p->degree_level,
                'durationSemesters' => $p->duration_semesters,
                'departmentId' => $p->department_id,
                'department' => $p->department?->name,
                'status' => $p->status,
            ]);

        return response()->json(['data' => $rows]);
    }

    public function courses(Request $request): JsonResponse
    {
        $rows = Course::query()
            ->where('institution_id', $this->institutionId($request))
            ->orderBy('code')
            ->get()
            ->map(fn (Course $c) => [
                'id' => $c->id,
                'code' => $c->code,
                'name' => $c->name,
                'creditHours' => $c->credit_hours,
                'departmentId' => $c->department_id,
                'programId' => $c->program_id,
                'status' => $c->status,
            ]);

        return response()->json(['data' => $rows]);
    }

    public function sections(Request $request): JsonResponse
    {
        $rows = Section::query()
            ->with('course')
            ->where('institution_id', $this->institutionId($request))
            ->orderBy('code')
            ->get()
            ->map(fn (Section $s) => [
                'id' => $s->id,
                'code' => $s->code,
                'courseId' => $s->course_id,
                'course' => $s->course?->name,
                'semester' => $s->semester,
                'academicYear' => $s->academic_year,
                'capacity' => $s->capacity,
                'status' => $s->status,
            ]);

        return response()->json(['data' => $rows]);
    }

    public function storeDepartment(Request $request): JsonResponse
    {
        $this->authorizeManage($request);
        $institutionId = $this->institutionId($request);

        $data = $request->validate([
            'code' => ['required', 'string', 'max:32'],
            'name' => ['required', 'string', 'max:120'],
            'headName' => ['nullable', 'string', 'max:120'],
        ]);

        $dept = Department::create([
            'id' => 'dept-'.Str::lower(Str::ulid()),
            'institution_id' => $institutionId,
            'code' => $data['code'],
            'name' => $data['name'],
            'head_name' => $data['headName'] ?? null,
            'status' => 'active',
        ]);

        return response()->json([
            'id' => $dept->id,
            'code' => $dept->code,
            'name' => $dept->name,
            'headName' => $dept->head_name,
            'status' => $dept->status,
        ], 201);
    }

    public function currentInstitution(Request $request): JsonResponse
    {
        $id = $this->institutionId($request);
        $institution = Institution::with(['modules', 'subscription.plan', 'campuses'])->findOrFail($id);

        return response()->json(new InstitutionResource($institution));
    }

    public function modules(Request $request): JsonResponse
    {
        $id = $this->institutionId($request);
        $institution = Institution::with(['modules', 'subscription.plan'])->findOrFail($id);
        $enabled = $institution->modules->pluck('enabled', 'module_id');

        $catalog = collect(ModuleCatalog::all())->map(function (array $module) use ($institution, $enabled) {
            $available = $institution->type === 'school' ? $module['school'] : $module['university'];
            $planAllowed = \App\Support\SubscriptionAccess::planAllowsModule($institution, $module['id']);
            $enabledFlag = $available && $planAllowed
                ? (bool) ($enabled[$module['id']] ?? $module['default_enabled'])
                : false;

            return [
                'id' => $module['id'],
                'name' => $module['name'],
                'category' => $module['category'],
                'available' => $available && $planAllowed,
                'planAllowed' => $planAllowed,
                'enabled' => $enabledFlag,
            ];
        });

        return response()->json([
            'data' => $catalog->values(),
            'access' => \App\Support\SubscriptionAccess::accessPayload($institution),
        ]);
    }

    public function updateModules(Request $request): JsonResponse
    {
        $this->authorizeManage($request);
        $institutionId = $this->institutionId($request);
        $institution = Institution::with('subscription.plan')->findOrFail($institutionId);

        $data = $request->validate([
            'modules' => ['required', 'array'],
            'modules.*' => ['boolean'],
        ]);

        foreach ($data['modules'] as $moduleId => $enabled) {
            if (! \App\Support\SubscriptionAccess::planAllowsModule($institution, (string) $moduleId)) {
                continue;
            }
            InstitutionModule::updateOrCreate(
                ['institution_id' => $institutionId, 'module_id' => $moduleId],
                ['enabled' => $enabled],
            );
        }

        return $this->modules($request);
    }

    public function dashboard(Request $request): JsonResponse
    {
        $institutionId = $this->institutionId($request);

        return response()->json([
            'students' => Student::where('institution_id', $institutionId)->count(),
            'activeStudents' => Student::where('institution_id', $institutionId)->where('status', 'active')->count(),
            'teachers' => Teacher::where('institution_id', $institutionId)->count(),
            'departments' => Department::where('institution_id', $institutionId)->count(),
            'programs' => Program::where('institution_id', $institutionId)->count(),
            'courses' => Course::where('institution_id', $institutionId)->count(),
            'feeOverdue' => Student::where('institution_id', $institutionId)->where('fee_status', 'overdue')->count(),
        ]);
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

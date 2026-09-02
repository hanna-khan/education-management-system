<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Concerns\ResolvesInstitution;
use App\Http\Controllers\Controller;
use App\Models\Application;
use App\Models\ApplicationStep;
use App\Models\Workflow;
use App\Support\Roles;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class ApplicationController extends Controller
{
    use ResolvesInstitution;

    public function stats(Request $request): JsonResponse
    {
        $id = $this->institutionId($request);
        $base = Application::where('institution_id', $id);

        return response()->json([
            'all' => (clone $base)->count(),
            'pending' => (clone $base)->where('status', 'pending')->count(),
            'inReview' => (clone $base)->where('status', 'in_review')->count(),
            'approved' => (clone $base)->where('status', 'approved')->count(),
            'rejected' => (clone $base)->where('status', 'rejected')->count(),
            'slaBreached' => (clone $base)->where('sla_breached', true)->count(),
        ]);
    }

    public function index(Request $request): JsonResponse
    {
        $query = Application::where('institution_id', $this->institutionId($request));

        if ($status = $request->query('status')) {
            if ($status !== 'all') {
                $query->where('status', $status);
            }
        }

        if ($type = $request->query('type')) {
            if ($type !== 'all') {
                $query->where('type', $type);
            }
        }

        $rows = $query->orderByDesc('submitted_at')->get()->map(fn (Application $a) => $this->appPayload($a));

        return response()->json(['data' => $rows]);
    }

    public function show(Request $request, string $application): JsonResponse
    {
        $model = Application::with('steps')
            ->where('institution_id', $this->institutionId($request))
            ->where('id', $application)
            ->firstOrFail();

        return response()->json([
            ...$this->appPayload($model),
            'formData' => $model->form_data,
            'steps' => $model->steps->map(fn (ApplicationStep $s) => [
                'step' => $s->name,
                'status' => $s->status,
                'date' => $s->acted_at_label,
            ]),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $institutionId = $this->institutionId($request);
        $data = $request->validate([
            'applicant' => ['required', 'string', 'max:160'],
            'applicantId' => ['nullable', 'string'],
            'studentId' => ['nullable', 'string'],
            'type' => ['required', 'string', 'max:64'],
            'workflowId' => ['nullable', 'string'],
            'formData' => ['nullable', 'array'],
        ]);

        $workflow = null;
        if (! empty($data['workflowId'])) {
            $workflow = Workflow::with('steps')->where('institution_id', $institutionId)->find($data['workflowId']);
        } else {
            $workflow = Workflow::with('steps')
                ->where('institution_id', $institutionId)
                ->where('status', 'active')
                ->first();
        }

        $app = Application::create([
            'id' => 'APP-'.now()->format('Y').'-'.random_int(1000, 9999),
            'institution_id' => $institutionId,
            'workflow_id' => $workflow?->id,
            'applicant_name' => $data['applicant'],
            'applicant_ref' => $data['applicantId'] ?? null,
            'student_id' => $data['studentId'] ?? null,
            'type' => $data['type'],
            'submitted_at' => now()->toDateString(),
            'stage' => $workflow?->steps->first()?->name ?? 'Submitted',
            'assigned_to' => $workflow?->steps->first()?->role_label,
            'sla_label' => $workflow?->sla_label,
            'sla_breached' => false,
            'status' => 'pending',
            'form_data' => $data['formData'] ?? null,
        ]);

        if ($workflow) {
            foreach ($workflow->steps as $index => $step) {
                ApplicationStep::create([
                    'id' => 'astep-'.Str::lower(Str::ulid()),
                    'application_id' => $app->id,
                    'step_order' => $step->step_order,
                    'name' => $step->name,
                    'status' => $index === 0 ? 'current' : 'pending',
                    'acted_at_label' => $index === 0 ? 'In progress' : null,
                ]);
            }
        }

        return response()->json($this->appPayload($app->fresh()), 201);
    }

    public function decide(Request $request, string $application): JsonResponse
    {
        $this->authorizeManage($request);
        $data = $request->validate([
            'status' => ['required', Rule::in(['approved', 'rejected', 'changes_requested', 'in_review'])],
            'stage' => ['nullable', 'string'],
            'assignedTo' => ['nullable', 'string'],
        ]);

        $model = Application::with('steps')
            ->where('institution_id', $this->institutionId($request))
            ->where('id', $application)
            ->firstOrFail();

        $model->update([
            'status' => $data['status'],
            'stage' => $data['stage'] ?? ($data['status'] === 'approved' ? 'Completed' : $model->stage),
            'assigned_to' => $data['assignedTo'] ?? $model->assigned_to,
        ]);

        if (in_array($data['status'], ['approved', 'rejected'], true)) {
            $model->steps()->where('status', 'current')->update([
                'status' => 'completed',
                'acted_at_label' => now()->format('Y-m-d H:i'),
            ]);
        }

        return response()->json($this->appPayload($model->fresh()));
    }

    public function workflows(Request $request): JsonResponse
    {
        $rows = Workflow::withCount('steps')
            ->where('institution_id', $this->institutionId($request))
            ->orderBy('name')
            ->get()
            ->map(fn (Workflow $w) => [
                'id' => $w->id,
                'name' => $w->name,
                'trigger' => $w->trigger,
                'steps' => $w->steps_count,
                'status' => $w->status,
                'sla' => $w->sla_label,
            ]);

        return response()->json(['data' => $rows]);
    }

    public function showWorkflow(Request $request, string $workflow): JsonResponse
    {
        $model = Workflow::with('steps')
            ->where('institution_id', $this->institutionId($request))
            ->where('id', $workflow)
            ->firstOrFail();

        return response()->json([
            'id' => $model->id,
            'name' => $model->name,
            'description' => $model->description,
            'trigger' => $model->trigger,
            'form' => $model->form_label,
            'status' => $model->status,
            'steps' => $model->steps->map(fn ($s) => [
                'order' => $s->step_order,
                'name' => $s->name,
                'role' => $s->role_label,
                'sla' => $s->sla_label,
                'required' => (bool) $s->required,
            ]),
        ]);
    }

    private function appPayload(Application $a): array
    {
        return [
            'id' => $a->id,
            'applicant' => $a->applicant_name,
            'applicantId' => $a->applicant_ref,
            'studentId' => $a->student_id,
            'type' => $a->type,
            'submitted' => optional($a->submitted_at)?->toDateString(),
            'stage' => $a->stage,
            'assignedTo' => $a->assigned_to,
            'sla' => $a->sla_label,
            'slaBreached' => (bool) $a->sla_breached,
            'status' => $a->status,
        ];
    }

    private function authorizeManage(Request $request): void
    {
        if (! $request->user()?->hasAnyRole([
            ...Roles::institutionManagers(),
            Roles::TEACHER,
            Roles::ACCOUNTANT,
            Roles::HR,
        ])) {
            abort(403, 'Forbidden.');
        }
    }
}

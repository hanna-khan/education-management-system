<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Concerns\ResolvesInstitution;
use App\Http\Controllers\Controller;
use App\Models\AdmissionApplicant;
use App\Models\AdmissionCycle;
use App\Models\AdmissionInterview;
use App\Models\AdmissionOffer;
use App\Models\MeritList;
use App\Models\Student;
use App\Support\Roles;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class AdmissionController extends Controller
{
    use ResolvesInstitution;

    public function stats(Request $request): JsonResponse
    {
        $id = $this->institutionId($request);
        $base = AdmissionApplicant::where('institution_id', $id);

        return response()->json([
            'totalApplications' => (clone $base)->count(),
            'underReview' => (clone $base)->where('status', 'under_review')->count(),
            'accepted' => (clone $base)->whereIn('status', ['accepted', 'offered', 'enrolled'])->count(),
            'rejected' => (clone $base)->where('status', 'rejected')->count(),
            'pendingDocuments' => (clone $base)->where('status', 'pending_documents')->count(),
            'enrollmentConversion' => $this->conversionRate($id),
        ]);
    }

    public function cycles(Request $request): JsonResponse
    {
        $rows = AdmissionCycle::where('institution_id', $this->institutionId($request))
            ->orderByDesc('deadline')
            ->get()
            ->map(fn (AdmissionCycle $c) => [
                'id' => $c->id,
                'name' => $c->name,
                'status' => $c->status,
                'applications' => $c->applications_count,
                'deadline' => optional($c->deadline)?->toDateString(),
            ]);

        return response()->json(['data' => $rows]);
    }

    public function storeCycle(Request $request): JsonResponse
    {
        $this->authorizeManage($request);
        $data = $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'deadline' => ['nullable', 'date'],
            'status' => ['nullable', Rule::in(['open', 'closed'])],
        ]);

        $cycle = AdmissionCycle::create([
            'id' => 'cycle-'.Str::lower(Str::ulid()),
            'institution_id' => $this->institutionId($request),
            'name' => $data['name'],
            'deadline' => $data['deadline'] ?? null,
            'status' => $data['status'] ?? 'open',
            'applications_count' => 0,
        ]);

        return response()->json([
            'id' => $cycle->id,
            'name' => $cycle->name,
            'status' => $cycle->status,
            'applications' => 0,
            'deadline' => optional($cycle->deadline)?->toDateString(),
        ], 201);
    }

    public function applicants(Request $request): JsonResponse
    {
        $query = AdmissionApplicant::where('institution_id', $this->institutionId($request));

        if ($status = $request->query('status')) {
            if ($status !== 'all') {
                $query->where('status', $status);
            }
        }

        if ($search = $request->string('search')->toString()) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('id', 'like', "%{$search}%")
                    ->orWhere('program_name', 'like', "%{$search}%");
            });
        }

        $pageSize = min(max((int) $request->query('pageSize', 20), 1), 100);
        $paginator = $query->orderByDesc('submitted_at')->paginate($pageSize);

        return response()->json([
            'data' => collect($paginator->items())->map(fn (AdmissionApplicant $a) => $this->applicantPayload($a)),
            'total' => $paginator->total(),
            'page' => $paginator->currentPage(),
            'pageSize' => $paginator->perPage(),
            'totalPages' => $paginator->lastPage(),
        ]);
    }

    public function showApplicant(Request $request, string $applicant): JsonResponse
    {
        $model = AdmissionApplicant::where('institution_id', $this->institutionId($request))
            ->where('id', $applicant)
            ->firstOrFail();

        return response()->json($this->applicantPayload($model));
    }

    public function storeApplicant(Request $request): JsonResponse
    {
        $this->authorizeManage($request);
        $institutionId = $this->institutionId($request);

        $data = $request->validate([
            'name' => ['required', 'string', 'max:160'],
            'email' => ['nullable', 'email'],
            'phone' => ['nullable', 'string', 'max:40'],
            'program' => ['required', 'string', 'max:160'],
            'programId' => ['nullable', 'string'],
            'cycleId' => ['nullable', 'string'],
            'cycle' => ['nullable', 'string'],
            'score' => ['nullable', 'integer', 'min:0', 'max:100'],
            'status' => ['nullable', Rule::in(['under_review', 'accepted', 'pending_documents', 'interview', 'rejected', 'enrolled', 'offered'])],
        ]);

        $cycle = $data['cycleId'] ?? null
            ? AdmissionCycle::where('institution_id', $institutionId)->find($data['cycleId'])
            : AdmissionCycle::where('institution_id', $institutionId)->where('status', 'open')->first();

        $applicant = AdmissionApplicant::create([
            'id' => 'app-'.now()->format('Y').'-'.Str::lower(Str::random(6)),
            'institution_id' => $institutionId,
            'cycle_id' => $cycle?->id,
            'program_id' => $data['programId'] ?? null,
            'name' => $data['name'],
            'email' => $data['email'] ?? null,
            'phone' => $data['phone'] ?? null,
            'program_name' => $data['program'],
            'cycle_name' => $data['cycle'] ?? $cycle?->name,
            'status' => $data['status'] ?? 'under_review',
            'score' => $data['score'] ?? 0,
            'submitted_at' => now()->toDateString(),
        ]);

        if ($cycle) {
            $cycle->increment('applications_count');
        }

        return response()->json($this->applicantPayload($applicant), 201);
    }

    public function updateApplicant(Request $request, string $applicant): JsonResponse
    {
        $this->authorizeManage($request);
        $model = AdmissionApplicant::where('institution_id', $this->institutionId($request))
            ->where('id', $applicant)
            ->firstOrFail();

        $data = $request->validate([
            'status' => ['sometimes', Rule::in(['under_review', 'accepted', 'pending_documents', 'interview', 'rejected', 'enrolled', 'offered'])],
            'score' => ['sometimes', 'integer', 'min:0', 'max:100'],
            'name' => ['sometimes', 'string', 'max:160'],
            'program' => ['sometimes', 'string', 'max:160'],
        ]);

        $model->update([
            'status' => $data['status'] ?? $model->status,
            'score' => $data['score'] ?? $model->score,
            'name' => $data['name'] ?? $model->name,
            'program_name' => $data['program'] ?? $model->program_name,
        ]);

        return response()->json($this->applicantPayload($model->fresh()));
    }

    public function meritLists(Request $request): JsonResponse
    {
        $rows = MeritList::where('institution_id', $this->institutionId($request))
            ->orderByDesc('published_at')
            ->get()
            ->map(fn (MeritList $m) => [
                'id' => $m->id,
                'program' => $m->program_name,
                'published' => optional($m->published_at)?->toDateString(),
                'seats' => $m->seats,
                'filled' => $m->filled,
            ]);

        return response()->json(['data' => $rows]);
    }

    public function interviews(Request $request): JsonResponse
    {
        $rows = AdmissionInterview::with('applicant:id,name')
            ->where('institution_id', $this->institutionId($request))
            ->orderBy('scheduled_at')
            ->get()
            ->map(fn (AdmissionInterview $i) => [
                'id' => $i->id,
                'applicant' => $i->applicant?->name,
                'applicantId' => $i->applicant_id,
                'program' => $i->program_name,
                'date' => optional($i->scheduled_at)?->toDateTimeString(),
                'panel' => $i->panel,
                'status' => $i->status,
            ]);

        return response()->json(['data' => $rows]);
    }

    public function offers(Request $request): JsonResponse
    {
        $rows = AdmissionOffer::with('applicant:id,name')
            ->where('institution_id', $this->institutionId($request))
            ->orderByDesc('offer_date')
            ->get()
            ->map(fn (AdmissionOffer $o) => [
                'id' => $o->id,
                'applicant' => $o->applicant?->name,
                'applicantId' => $o->applicant_id,
                'program' => $o->program_name,
                'offerDate' => optional($o->offer_date)?->toDateString(),
                'deadline' => optional($o->deadline)?->toDateString(),
                'status' => $o->status,
            ]);

        return response()->json(['data' => $rows]);
    }

    public function storeOffer(Request $request): JsonResponse
    {
        $this->authorizeManage($request);
        $institutionId = $this->institutionId($request);

        $data = $request->validate([
            'applicantId' => ['required', 'string'],
            'deadline' => ['nullable', 'date'],
        ]);

        $applicant = AdmissionApplicant::where('institution_id', $institutionId)
            ->where('id', $data['applicantId'])
            ->firstOrFail();

        $offer = AdmissionOffer::create([
            'id' => 'offer-'.Str::lower(Str::ulid()),
            'institution_id' => $institutionId,
            'applicant_id' => $applicant->id,
            'program_name' => $applicant->program_name,
            'offer_date' => now()->toDateString(),
            'deadline' => $data['deadline'] ?? now()->addDays(14)->toDateString(),
            'status' => 'pending',
        ]);

        $applicant->update(['status' => 'offered']);

        return response()->json([
            'id' => $offer->id,
            'applicant' => $applicant->name,
            'applicantId' => $applicant->id,
            'program' => $offer->program_name,
            'offerDate' => $offer->offer_date?->toDateString(),
            'deadline' => $offer->deadline?->toDateString(),
            'status' => $offer->status,
        ], 201);
    }

    public function enroll(Request $request, string $offer): JsonResponse
    {
        $this->authorizeManage($request);
        $institutionId = $this->institutionId($request);

        $offerModel = AdmissionOffer::with('applicant')
            ->where('institution_id', $institutionId)
            ->where('id', $offer)
            ->firstOrFail();

        $applicant = $offerModel->applicant;
        if (! $applicant) {
            abort(422, 'Applicant missing.');
        }

        if ($applicant->student_id) {
            return response()->json([
                'message' => 'Already enrolled.',
                'studentId' => $applicant->student_id,
            ]);
        }

        $parts = preg_split('/\s+/', trim($applicant->name), 2);
        $student = Student::create([
            'id' => 'stu-'.Str::lower(Str::ulid()),
            'institution_id' => $institutionId,
            'student_number' => 'STU-'.now()->format('Y').'-'.random_int(1000, 9999),
            'first_name' => $parts[0] ?? 'Student',
            'last_name' => $parts[1] ?? 'New',
            'email' => $applicant->email ?: Str::slug($applicant->name).'@student.neddemo.edu.pk',
            'phone' => $applicant->phone,
            'program_id' => $applicant->program_id,
            'semester' => 1,
            'section' => 'A',
            'status' => 'active',
            'fee_status' => 'partial',
            'avatar_initials' => strtoupper(substr($parts[0] ?? 'S', 0, 1).substr($parts[1] ?? 'N', 0, 1)),
            'enrollment_date' => now()->toDateString(),
            'campus' => 'Main Campus',
        ]);

        $applicant->update(['status' => 'enrolled', 'student_id' => $student->id]);
        $offerModel->update(['status' => 'enrolled']);

        return response()->json([
            'message' => 'Applicant enrolled as student.',
            'studentId' => $student->id,
            'studentNumber' => $student->student_number,
            'offerId' => $offerModel->id,
        ], 201);
    }

    public function enrollmentSummary(Request $request): JsonResponse
    {
        $id = $this->institutionId($request);

        return response()->json([
            'offersAccepted' => AdmissionOffer::where('institution_id', $id)->whereIn('status', ['accepted', 'enrolled'])->count(),
            'enrolled' => AdmissionApplicant::where('institution_id', $id)->where('status', 'enrolled')->count(),
            'pending' => AdmissionOffer::where('institution_id', $id)->where('status', 'pending')->count(),
        ]);
    }

    private function applicantPayload(AdmissionApplicant $a): array
    {
        return [
            'id' => $a->id,
            'name' => $a->name,
            'email' => $a->email,
            'phone' => $a->phone,
            'program' => $a->program_name,
            'cycle' => $a->cycle_name,
            'status' => $a->status,
            'score' => $a->score,
            'submitted' => optional($a->submitted_at)?->toDateString(),
            'studentId' => $a->student_id,
        ];
    }

    private function conversionRate(string $institutionId): string
    {
        $accepted = AdmissionApplicant::where('institution_id', $institutionId)
            ->whereIn('status', ['accepted', 'offered', 'enrolled'])->count();
        $enrolled = AdmissionApplicant::where('institution_id', $institutionId)->where('status', 'enrolled')->count();
        if ($accepted === 0) {
            return '0%';
        }

        return number_format(($enrolled / $accepted) * 100, 1).'%';
    }

    private function authorizeManage(Request $request): void
    {
        if (! $request->user()?->hasAnyRole([
            ...Roles::institutionManagers(),
            Roles::ADMISSION_OFFICER,
        ])) {
            abort(403, 'Forbidden.');
        }
    }
}

<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Concerns\ResolvesInstitution;
use App\Http\Controllers\Controller;
use App\Models\AttendanceCorrection;
use App\Models\AttendanceRecord;
use App\Models\LeaveRequest;
use App\Models\Student;
use App\Support\Roles;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class AttendanceController extends Controller
{
    use ResolvesInstitution;

    public function stats(Request $request): JsonResponse
    {
        $id = $this->institutionId($request);
        $date = $request->query('date', now()->toDateString());
        $base = AttendanceRecord::where('institution_id', $id)
            ->where('subject_type', 'student')
            ->whereDate('attendance_date', $date);

        $present = (clone $base)->where('status', 'present')->count();
        $absent = (clone $base)->where('status', 'absent')->count();
        $late = (clone $base)->where('status', 'late')->count();
        $excused = (clone $base)->where('status', 'excused')->count();
        $total = (clone $base)->count();
        $rate = $total > 0 ? round((($present + $late + $excused) / $total) * 100, 1) : 0;

        return response()->json(compact('present', 'absent', 'late', 'excused', 'rate', 'total'));
    }

    public function daily(Request $request): JsonResponse
    {
        $query = AttendanceRecord::where('institution_id', $this->institutionId($request))
            ->where('subject_type', $request->query('subjectType', 'student'));

        if ($date = $request->query('date')) {
            $query->whereDate('attendance_date', $date);
        }

        $rows = $query->orderBy('student_name')->limit(200)->get()->map(fn (AttendanceRecord $r) => [
            'id' => $r->id,
            'recordId' => $r->id,
            'student' => $r->student_name,
            'studentId' => $r->student_id,
            'studentNumber' => $r->student_number,
            'program' => $r->program_name,
            'grade' => $r->grade_label,
            'section' => $r->section_code,
            'course' => $r->course_label,
            'status' => $r->status,
            'time' => $r->marked_at_time ?: '—',
            'method' => $r->method ?: '—',
            'remarks' => $r->remarks ?: '',
            'date' => optional($r->attendance_date)?->toDateString(),
        ]);

        return response()->json(['data' => $rows]);
    }

    public function mark(Request $request): JsonResponse
    {
        $this->authorizeManage($request);
        $institutionId = $this->institutionId($request);

        $data = $request->validate([
            'date' => ['required', 'date'],
            'course' => ['nullable', 'string', 'max:120'],
            'entries' => ['required', 'array', 'min:1'],
            'entries.*.studentId' => ['nullable', 'string'],
            'entries.*.studentNumber' => ['nullable', 'string'],
            'entries.*.status' => ['required', Rule::in(['present', 'absent', 'late', 'excused'])],
            'entries.*.method' => ['nullable', 'string', 'max:32'],
            'entries.*.remarks' => ['nullable', 'string', 'max:255'],
            'entries.*.time' => ['nullable', 'string', 'max:16'],
        ]);

        $created = [];
        foreach ($data['entries'] as $entry) {
            $student = null;
            if (! empty($entry['studentId'])) {
                $student = Student::with('program')->where('institution_id', $institutionId)->where('id', $entry['studentId'])->first();
            } elseif (! empty($entry['studentNumber'])) {
                $student = Student::with('program')
                    ->where('institution_id', $institutionId)
                    ->where('student_number', $entry['studentNumber'])
                    ->first();
            }

            $record = AttendanceRecord::create([
                'id' => 'att-'.Str::lower(Str::ulid()),
                'institution_id' => $institutionId,
                'student_id' => $student?->id,
                'attendance_date' => $data['date'],
                'student_number' => $student?->student_number ?? ($entry['studentNumber'] ?? null),
                'student_name' => $student ? trim($student->first_name.' '.$student->last_name) : ($entry['studentNumber'] ?? 'Unknown'),
                'program_name' => $student?->program?->name,
                'grade_label' => $student ? 'Semester '.$student->semester : null,
                'section_code' => $student?->section,
                'course_label' => $data['course'] ?? null,
                'status' => $entry['status'],
                'marked_at_time' => $entry['time'] ?? ($entry['status'] === 'present' || $entry['status'] === 'late' ? now()->format('H:i') : null),
                'method' => $entry['method'] ?? 'Manual',
                'remarks' => $entry['remarks'] ?? null,
                'subject_type' => 'student',
            ]);
            $created[] = $record->id;
        }

        return response()->json(['message' => 'Attendance marked.', 'ids' => $created], 201);
    }

    public function corrections(Request $request): JsonResponse
    {
        $rows = AttendanceCorrection::where('institution_id', $this->institutionId($request))
            ->orderByDesc('created_at')
            ->get()
            ->map(fn (AttendanceCorrection $c) => [
                'id' => $c->id,
                'student' => $c->student_name,
                'date' => optional($c->attendance_date)?->toDateString(),
                'course' => $c->course_label,
                'current' => $c->current_status,
                'requested' => $c->requested_status,
                'status' => $c->status,
                'reason' => $c->reason,
            ]);

        return response()->json(['data' => $rows]);
    }

    public function reviewCorrection(Request $request, string $correction): JsonResponse
    {
        $this->authorizeManage($request);
        $data = $request->validate([
            'status' => ['required', Rule::in(['approved', 'rejected'])],
        ]);

        $model = AttendanceCorrection::where('institution_id', $this->institutionId($request))
            ->where('id', $correction)
            ->firstOrFail();

        $model->update([
            'status' => $data['status'],
            'reviewed_by' => $request->user()->name,
        ]);

        if ($data['status'] === 'approved' && $model->student_id) {
            AttendanceRecord::where('institution_id', $model->institution_id)
                ->where('student_id', $model->student_id)
                ->whereDate('attendance_date', $model->attendance_date)
                ->where('course_label', $model->course_label)
                ->update(['status' => $model->requested_status]);
        }

        return response()->json(['id' => $model->id, 'status' => $model->status]);
    }

    public function leaves(Request $request): JsonResponse
    {
        $rows = LeaveRequest::where('institution_id', $this->institutionId($request))
            ->orderByDesc('start_date')
            ->get()
            ->map(fn (LeaveRequest $l) => [
                'id' => $l->id,
                'name' => $l->requester_name,
                'type' => $l->leave_type,
                'start' => optional($l->start_date)?->toDateString(),
                'end' => optional($l->end_date)?->toDateString(),
                'status' => $l->status,
                'balance' => $l->balance_label,
            ]);

        return response()->json(['data' => $rows]);
    }

    public function storeLeave(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:160'],
            'type' => ['required', 'string', 'max:80'],
            'start' => ['required', 'date'],
            'end' => ['required', 'date', 'after_or_equal:start'],
            'studentId' => ['nullable', 'string'],
            'reason' => ['nullable', 'string'],
            'balance' => ['nullable', 'string'],
        ]);

        $leave = LeaveRequest::create([
            'id' => 'leave-'.Str::lower(Str::ulid()),
            'institution_id' => $this->institutionId($request),
            'student_id' => $data['studentId'] ?? null,
            'requester_name' => $data['name'],
            'leave_type' => $data['type'],
            'start_date' => $data['start'],
            'end_date' => $data['end'],
            'status' => 'pending',
            'balance_label' => $data['balance'] ?? null,
            'reason' => $data['reason'] ?? null,
        ]);

        return response()->json([
            'id' => $leave->id,
            'name' => $leave->requester_name,
            'type' => $leave->leave_type,
            'start' => $leave->start_date?->toDateString(),
            'end' => $leave->end_date?->toDateString(),
            'status' => $leave->status,
            'balance' => $leave->balance_label,
        ], 201);
    }

    public function reviewLeave(Request $request, string $leave): JsonResponse
    {
        $this->authorizeManage($request);
        $data = $request->validate([
            'status' => ['required', Rule::in(['approved', 'rejected'])],
        ]);

        $model = LeaveRequest::where('institution_id', $this->institutionId($request))
            ->where('id', $leave)
            ->firstOrFail();
        $model->update(['status' => $data['status']]);

        return response()->json(['id' => $model->id, 'status' => $model->status]);
    }

    private function authorizeManage(Request $request): void
    {
        if (! $request->user()?->hasAnyRole([
            ...Roles::institutionManagers(),
            Roles::TEACHER,
            Roles::EXAM_OFFICER,
        ])) {
            abort(403, 'Forbidden.');
        }
    }
}

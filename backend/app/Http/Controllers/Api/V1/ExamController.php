<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Concerns\ResolvesInstitution;
use App\Http\Controllers\Controller;
use App\Models\ExamMark;
use App\Models\ExamSchedule;
use App\Models\StudentResult;
use App\Support\Roles;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class ExamController extends Controller
{
    use ResolvesInstitution;

    public function stats(Request $request): JsonResponse
    {
        $id = $this->institutionId($request);

        return response()->json([
            'upcoming' => ExamSchedule::where('institution_id', $id)->where('status', 'upcoming')->count(),
            'completed' => ExamSchedule::where('institution_id', $id)->where('status', 'completed')->count(),
            'resultsPending' => ExamMark::where('institution_id', $id)->where('published', false)->count(),
            'rooms' => ExamSchedule::where('institution_id', $id)->distinct('room')->count('room'),
            'invigilators' => ExamSchedule::where('institution_id', $id)->whereNotNull('invigilator')->distinct('invigilator')->count('invigilator'),
        ]);
    }

    public function schedules(Request $request): JsonResponse
    {
        $rows = ExamSchedule::where('institution_id', $this->institutionId($request))
            ->orderBy('exam_date')
            ->get()
            ->map(fn (ExamSchedule $e) => [
                'id' => $e->id,
                'course' => $e->course_label,
                'type' => $e->exam_type,
                'date' => optional($e->exam_date)?->toDateString(),
                'time' => $e->exam_time,
                'room' => $e->room,
                'invigilator' => $e->invigilator,
                'status' => $e->status,
            ]);

        return response()->json(['data' => $rows]);
    }

    public function storeSchedule(Request $request): JsonResponse
    {
        $this->authorizeManage($request);
        $data = $request->validate([
            'course' => ['required', 'string', 'max:180'],
            'type' => ['required', 'string', 'max:64'],
            'date' => ['required', 'date'],
            'time' => ['nullable', 'string', 'max:64'],
            'room' => ['nullable', 'string', 'max:120'],
            'invigilator' => ['nullable', 'string', 'max:120'],
        ]);

        $exam = ExamSchedule::create([
            'id' => 'exam-'.Str::lower(Str::ulid()),
            'institution_id' => $this->institutionId($request),
            'course_label' => $data['course'],
            'exam_type' => $data['type'],
            'exam_date' => $data['date'],
            'exam_time' => $data['time'] ?? null,
            'room' => $data['room'] ?? null,
            'invigilator' => $data['invigilator'] ?? null,
            'status' => 'upcoming',
        ]);

        return response()->json([
            'id' => $exam->id,
            'course' => $exam->course_label,
            'type' => $exam->exam_type,
            'date' => $exam->exam_date?->toDateString(),
            'time' => $exam->exam_time,
            'room' => $exam->room,
            'invigilator' => $exam->invigilator,
            'status' => $exam->status,
        ], 201);
    }

    public function marks(Request $request): JsonResponse
    {
        $rows = ExamMark::where('institution_id', $this->institutionId($request))
            ->orderBy('student_name')
            ->get()
            ->map(fn (ExamMark $m) => [
                'id' => $m->id,
                'student' => $m->student_name,
                'studentNumber' => $m->student_number,
                'studentId' => $m->student_id,
                'course' => $m->course_label,
                'assignment' => (float) $m->assignment,
                'midterm' => (float) $m->midterm,
                'final' => (float) $m->final,
                'total' => (float) $m->total,
                'grade' => $m->grade ?: '—',
                'published' => (bool) $m->published,
            ]);

        return response()->json(['data' => $rows]);
    }

    public function upsertMarks(Request $request): JsonResponse
    {
        $this->authorizeManage($request);
        $institutionId = $this->institutionId($request);

        $data = $request->validate([
            'entries' => ['required', 'array', 'min:1'],
            'entries.*.id' => ['nullable', 'string'],
            'entries.*.studentId' => ['nullable', 'string'],
            'entries.*.student' => ['required', 'string'],
            'entries.*.studentNumber' => ['nullable', 'string'],
            'entries.*.course' => ['nullable', 'string'],
            'entries.*.assignment' => ['nullable', 'numeric'],
            'entries.*.midterm' => ['nullable', 'numeric'],
            'entries.*.final' => ['nullable', 'numeric'],
            'entries.*.grade' => ['nullable', 'string'],
        ]);

        $saved = [];
        foreach ($data['entries'] as $entry) {
            $assignment = (float) ($entry['assignment'] ?? 0);
            $midterm = (float) ($entry['midterm'] ?? 0);
            $final = (float) ($entry['final'] ?? 0);
            $total = $assignment + $midterm + $final;

            $payload = [
                'institution_id' => $institutionId,
                'student_id' => $entry['studentId'] ?? null,
                'student_number' => $entry['studentNumber'] ?? null,
                'student_name' => $entry['student'],
                'course_label' => $entry['course'] ?? null,
                'assignment' => $assignment,
                'midterm' => $midterm,
                'final' => $final,
                'total' => $total,
                'grade' => $entry['grade'] ?? ($final > 0 ? $this->letterGrade($total) : null),
            ];

            if (! empty($entry['id'])) {
                $mark = ExamMark::where('institution_id', $institutionId)->where('id', $entry['id'])->firstOrFail();
                $mark->update($payload);
            } else {
                $mark = ExamMark::create($payload + ['id' => 'mark-'.Str::lower(Str::ulid())]);
            }
            $saved[] = $mark->id;
        }

        return response()->json(['message' => 'Marks saved.', 'ids' => $saved]);
    }

    public function publishMarks(Request $request): JsonResponse
    {
        $this->authorizeManage($request);
        $count = ExamMark::where('institution_id', $this->institutionId($request))
            ->where('published', false)
            ->update(['published' => true]);

        return response()->json(['message' => 'Marks published.', 'count' => $count]);
    }

    public function results(Request $request): JsonResponse
    {
        $institutionId = $this->institutionId($request);
        $studentId = $request->query('studentId');

        $query = StudentResult::with('courses')->where('institution_id', $institutionId);
        if ($studentId) {
            $query->where('student_id', $studentId);
        }

        $rows = $query->orderByDesc('created_at')->get()->map(fn (StudentResult $r) => [
            'id' => $r->id,
            'studentId' => $r->student_id,
            'semester' => $r->semester_label,
            'gpa' => $r->gpa,
            'cgpa' => $r->cgpa,
            'published' => $r->published,
            'courses' => $r->courses->map(fn ($c) => [
                'code' => $c->code,
                'name' => $c->name,
                'credits' => $c->credits,
                'marks' => (float) $c->marks,
                'grade' => $c->grade,
                'points' => (float) $c->points,
            ]),
        ]);

        return response()->json(['data' => $rows]);
    }

    private function letterGrade(float $total): string
    {
        return match (true) {
            $total >= 85 => 'A',
            $total >= 80 => 'A-',
            $total >= 75 => 'B+',
            $total >= 70 => 'B',
            $total >= 65 => 'B-',
            $total >= 60 => 'C+',
            $total >= 50 => 'C',
            default => 'F',
        };
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

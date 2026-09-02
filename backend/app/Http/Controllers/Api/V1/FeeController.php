<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Concerns\ResolvesInstitution;
use App\Http\Controllers\Controller;
use App\Models\FeeInvoice;
use App\Models\FeePayment;
use App\Models\Scholarship;
use App\Models\Student;
use App\Support\Roles;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class FeeController extends Controller
{
    use ResolvesInstitution;

    public function stats(Request $request): JsonResponse
    {
        $id = $this->institutionId($request);
        $invoices = FeeInvoice::where('institution_id', $id);

        return response()->json([
            'totalBilled' => (clone $invoices)->sum('total'),
            'collected' => (clone $invoices)->sum('paid'),
            'outstanding' => (clone $invoices)->sum('outstanding'),
            'overdue' => (clone $invoices)->where('status', 'overdue')->sum('outstanding'),
        ]);
    }

    public function invoices(Request $request): JsonResponse
    {
        $query = FeeInvoice::where('institution_id', $this->institutionId($request));
        if ($status = $request->query('status')) {
            if ($status !== 'all') {
                $query->where('status', $status);
            }
        }

        $rows = $query->orderByDesc('created_at')->get()->map(fn (FeeInvoice $i) => [
            'id' => $i->id,
            'student' => $i->student_name,
            'studentId' => $i->student_id,
            'program' => $i->program_name,
            'semester' => $i->semester_label,
            'total' => $i->total,
            'paid' => $i->paid,
            'outstanding' => $i->outstanding,
            'status' => $i->status,
            'breakdown' => $i->breakdown,
        ]);

        return response()->json(['data' => $rows]);
    }

    public function storeInvoice(Request $request): JsonResponse
    {
        $this->authorizeManage($request);
        $institutionId = $this->institutionId($request);

        $data = $request->validate([
            'studentId' => ['nullable', 'string'],
            'student' => ['required', 'string'],
            'program' => ['nullable', 'string'],
            'semester' => ['nullable', 'string'],
            'total' => ['required', 'integer', 'min:0'],
            'breakdown' => ['nullable', 'array'],
            'dueDate' => ['nullable', 'date'],
        ]);

        $invoice = FeeInvoice::create([
            'id' => 'INV-'.now()->format('Y').'-'.random_int(1000, 9999),
            'institution_id' => $institutionId,
            'student_id' => $data['studentId'] ?? null,
            'student_name' => $data['student'],
            'program_name' => $data['program'] ?? null,
            'semester_label' => $data['semester'] ?? null,
            'total' => $data['total'],
            'paid' => 0,
            'outstanding' => $data['total'],
            'status' => 'unpaid',
            'due_date' => $data['dueDate'] ?? null,
            'breakdown' => $data['breakdown'] ?? null,
        ]);

        return response()->json($this->invoicePayload($invoice), 201);
    }

    public function payments(Request $request): JsonResponse
    {
        $rows = FeePayment::where('institution_id', $this->institutionId($request))
            ->orderByDesc('paid_at')
            ->get()
            ->map(fn (FeePayment $p) => [
                'id' => $p->id,
                'student' => $p->student_name,
                'studentId' => $p->student_id,
                'invoiceId' => $p->invoice_id,
                'amount' => $p->amount,
                'method' => $p->method,
                'date' => optional($p->paid_at)?->toDateString(),
                'receipt' => $p->receipt,
            ]);

        return response()->json(['data' => $rows]);
    }

    public function recordPayment(Request $request): JsonResponse
    {
        $this->authorizeManage($request);
        $institutionId = $this->institutionId($request);

        $data = $request->validate([
            'invoiceId' => ['required', 'string'],
            'amount' => ['required', 'integer', 'min:1'],
            'method' => ['nullable', 'string', 'max:64'],
            'date' => ['nullable', 'date'],
        ]);

        $invoice = FeeInvoice::where('institution_id', $institutionId)
            ->where('id', $data['invoiceId'])
            ->firstOrFail();

        $payment = FeePayment::create([
            'id' => 'PAY-'.now()->format('Y').'-'.random_int(1000, 9999),
            'institution_id' => $institutionId,
            'invoice_id' => $invoice->id,
            'student_id' => $invoice->student_id,
            'student_name' => $invoice->student_name,
            'amount' => $data['amount'],
            'method' => $data['method'] ?? 'Cash',
            'paid_at' => $data['date'] ?? now()->toDateString(),
            'receipt' => 'RCP-'.now()->format('Y').'-'.random_int(1000, 9999),
        ]);

        $paid = $invoice->paid + $data['amount'];
        $outstanding = max(0, $invoice->total - $paid);
        $status = $outstanding === 0 ? 'paid' : ($paid > 0 ? 'partial' : $invoice->status);

        $invoice->update([
            'paid' => $paid,
            'outstanding' => $outstanding,
            'status' => $status,
        ]);

        if ($invoice->student_id) {
            Student::where('id', $invoice->student_id)->update([
                'fee_status' => $status === 'paid' ? 'paid' : ($status === 'partial' ? 'partial' : 'overdue'),
            ]);
        }

        return response()->json([
            'id' => $payment->id,
            'student' => $payment->student_name,
            'amount' => $payment->amount,
            'method' => $payment->method,
            'date' => $payment->paid_at?->toDateString(),
            'receipt' => $payment->receipt,
            'invoice' => $this->invoicePayload($invoice->fresh()),
        ], 201);
    }

    public function scholarships(Request $request): JsonResponse
    {
        $rows = Scholarship::where('institution_id', $this->institutionId($request))
            ->orderByDesc('created_at')
            ->get()
            ->map(fn (Scholarship $s) => [
                'id' => $s->id,
                'student' => $s->student_name,
                'studentId' => $s->student_id,
                'type' => $s->type,
                'amount' => $s->amount,
                'status' => $s->status,
                'semester' => $s->semester_label,
            ]);

        return response()->json(['data' => $rows]);
    }

    public function scholarshipStats(Request $request): JsonResponse
    {
        $id = $this->institutionId($request);
        $base = Scholarship::where('institution_id', $id);

        return response()->json([
            'applications' => (clone $base)->count(),
            'underReview' => (clone $base)->where('status', 'under_review')->count(),
            'approved' => (clone $base)->whereIn('status', ['approved', 'awarded'])->count(),
            'rejected' => (clone $base)->where('status', 'rejected')->count(),
            'awardedAmount' => (clone $base)->where('status', 'awarded')->sum('amount'),
        ]);
    }

    public function updateScholarship(Request $request, string $scholarship): JsonResponse
    {
        $this->authorizeManage($request);
        $data = $request->validate([
            'status' => ['required', Rule::in(['under_review', 'approved', 'rejected', 'awarded'])],
        ]);

        $model = Scholarship::where('institution_id', $this->institutionId($request))
            ->where('id', $scholarship)
            ->firstOrFail();
        $model->update(['status' => $data['status']]);

        return response()->json([
            'id' => $model->id,
            'student' => $model->student_name,
            'type' => $model->type,
            'amount' => $model->amount,
            'status' => $model->status,
            'semester' => $model->semester_label,
        ]);
    }

    public function breakdown(): JsonResponse
    {
        return response()->json([
            'data' => [
                ['head' => 'Tuition Fee', 'amount' => 65000],
                ['head' => 'Lab Fee', 'amount' => 8000],
                ['head' => 'Library Fee', 'amount' => 3000],
                ['head' => 'Transport Fee', 'amount' => 5000],
                ['head' => 'Other Charges', 'amount' => 4000],
            ],
        ]);
    }

    private function invoicePayload(FeeInvoice $i): array
    {
        return [
            'id' => $i->id,
            'student' => $i->student_name,
            'studentId' => $i->student_id,
            'program' => $i->program_name,
            'semester' => $i->semester_label,
            'total' => $i->total,
            'paid' => $i->paid,
            'outstanding' => $i->outstanding,
            'status' => $i->status,
            'breakdown' => $i->breakdown,
        ];
    }

    private function authorizeManage(Request $request): void
    {
        if (! $request->user()?->hasAnyRole([
            ...Roles::institutionManagers(),
            Roles::ACCOUNTANT,
        ])) {
            abort(403, 'Forbidden.');
        }
    }
}

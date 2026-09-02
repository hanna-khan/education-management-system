<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\DataImport;
use App\Services\Imports\DataImportProcessor;
use App\Services\Imports\SpreadsheetReader;
use App\Support\Roles;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class ImportController extends Controller
{
    public function templates(Request $request, string $type): BinaryFileResponse
    {
        $this->authorizeManage($request);
        abort_unless(in_array($type, ['students', 'teachers'], true), 404);

        $format = $request->query('format', 'xlsx') === 'csv' ? 'csv' : 'xlsx';
        $path = SpreadsheetReader::writeTemplate($type, $format);
        $filename = "zendrock-{$type}-template.{$format}";

        return response()->download($path, $filename, [
            'Content-Type' => $format === 'csv'
                ? 'text/csv'
                : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        ])->deleteFileAfterSend(true);
    }

    public function index(Request $request): JsonResponse
    {
        $this->authorizeManage($request);
        $rows = DataImport::query()
            ->where('institution_id', $this->institutionId($request))
            ->orderByDesc('created_at')
            ->limit(30)
            ->get()
            ->map(fn (DataImport $i) => $this->payload($i));

        return response()->json(['data' => $rows]);
    }

    public function store(Request $request): JsonResponse
    {
        $this->authorizeManage($request);
        $institutionId = $this->institutionId($request);

        $data = $request->validate([
            'type' => ['required', Rule::in(['students', 'teachers'])],
            'file' => ['required', 'file', 'max:20480', 'mimes:csv,txt,xlsx,xls'],
        ]);

        $file = $request->file('file');
        $importId = 'imp-'.Str::lower(Str::ulid());
        $stored = $file->storeAs(
            "imports/{$institutionId}",
            $importId.'.'.$file->getClientOriginalExtension(),
            'local'
        );

        $import = DataImport::create([
            'id' => $importId,
            'institution_id' => $institutionId,
            'uploaded_by' => $request->user()->id,
            'type' => $data['type'],
            'original_filename' => $file->getClientOriginalName(),
            'stored_path' => $stored,
            'status' => 'uploaded',
        ]);

        $processor = new DataImportProcessor;
        $import = $processor->validate($import);

        return response()->json([
            'import' => $this->payload($import),
            'message' => 'File uploaded and validated.',
        ], 201);
    }

    public function show(Request $request, string $import): JsonResponse
    {
        $this->authorizeManage($request);
        $model = $this->findImport($request, $import);

        return response()->json(['import' => $this->payload($model)]);
    }

    public function remap(Request $request, string $import): JsonResponse
    {
        $this->authorizeManage($request);
        $model = $this->findImport($request, $import);

        $data = $request->validate([
            'columnMap' => ['required', 'array'],
        ]);

        $model->update(['column_map' => $data['columnMap']]);
        $model = (new DataImportProcessor)->validate($model);

        return response()->json([
            'import' => $this->payload($model),
            'message' => 'Column mapping updated and re-validated.',
        ]);
    }

    public function run(Request $request, string $import): JsonResponse
    {
        $this->authorizeManage($request);
        $model = $this->findImport($request, $import);

        if (! in_array($model->status, ['validated', 'completed', 'failed'], true)) {
            return response()->json(['message' => 'Import is not ready to run.'], 422);
        }

        if ($model->valid_rows < 1) {
            return response()->json(['message' => 'No valid rows to import. Fix errors and re-upload.'], 422);
        }

        $model = (new DataImportProcessor)->import($model);

        return response()->json([
            'import' => $this->payload($model),
            'message' => "Imported {$model->imported_rows} row(s). {$model->skipped_rows} skipped.",
        ]);
    }

    public function errorReport(Request $request, string $import): BinaryFileResponse
    {
        $this->authorizeManage($request);
        $model = $this->findImport($request, $import);
        abort_unless($model->error_report_path && Storage::disk('local')->exists($model->error_report_path), 404);

        return Storage::disk('local')->download(
            $model->error_report_path,
            "{$model->type}-import-errors.csv"
        );
    }

    private function payload(DataImport $import): array
    {
        return [
            'id' => $import->id,
            'type' => $import->type,
            'originalFilename' => $import->original_filename,
            'status' => $import->status,
            'totalRows' => $import->total_rows,
            'validRows' => $import->valid_rows,
            'errorRows' => $import->error_rows,
            'importedRows' => $import->imported_rows,
            'skippedRows' => $import->skipped_rows,
            'processedRows' => $import->processed_rows,
            'columnMap' => $import->column_map,
            'preview' => $import->preview,
            'summary' => $import->summary,
            'hasErrorReport' => (bool) $import->error_report_path,
            'validatedAt' => optional($import->validated_at)?->toIso8601String(),
            'startedAt' => optional($import->started_at)?->toIso8601String(),
            'completedAt' => optional($import->completed_at)?->toIso8601String(),
            'createdAt' => optional($import->created_at)?->toIso8601String(),
        ];
    }

    private function findImport(Request $request, string $import): DataImport
    {
        return DataImport::query()
            ->where('institution_id', $this->institutionId($request))
            ->where('id', $import)
            ->firstOrFail();
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
        $user = $request->user();
        if (! $user?->hasAnyRole(Roles::institutionManagers())) {
            $role = $user?->role ?? 'unknown';
            abort(
                403,
                "Only institution admins can import data. You’re currently signed in as {$role}. Sign out and sign in with your admin account.",
            );
        }
    }
}

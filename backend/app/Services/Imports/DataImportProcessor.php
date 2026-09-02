<?php

namespace App\Services\Imports;

use App\Models\DataImport;
use App\Models\Department;
use App\Models\Institution;
use App\Models\Program;
use App\Models\Student;
use App\Models\Teacher;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

final class DataImportProcessor
{
    public function validate(DataImport $import): DataImport
    {
        $import->update(['status' => 'validating']);

        $absolute = Storage::disk('local')->path($import->stored_path);
        $parsed = SpreadsheetReader::read($absolute);
        $expected = SpreadsheetReader::headersFor($import->type);
        $map = $import->column_map ?: SpreadsheetReader::autoMap($parsed['headers'], $expected);

        $institution = Institution::findOrFail($import->institution_id);
        $departments = Department::where('institution_id', $institution->id)->get()->keyBy(fn ($d) => strtolower($d->name));
        $programs = Program::where('institution_id', $institution->id)->get()->keyBy(fn ($d) => strtolower($d->name));

        $errors = [];
        $valid = 0;
        $preview = [];
        $seenIds = [];
        $seenEmails = [];

        foreach ($parsed['rows'] as $row) {
            $mapped = $this->applyMap($row, $map);
            $rowNum = (int) ($row['_row'] ?? 0);
            $rowErrors = $import->type === 'teachers'
                ? $this->validateTeacherRow($mapped, $institution->id, $seenIds, $seenEmails, $departments)
                : $this->validateStudentRow($mapped, $institution->id, $seenIds, $seenEmails, $departments, $programs);

            if ($rowErrors) {
                foreach ($rowErrors as $err) {
                    $errors[] = ['row' => $rowNum, 'field' => $err['field'], 'message' => $err['message'], 'values' => $mapped];
                }
            } else {
                $valid++;
                if (count($preview) < 8) {
                    $preview[] = $mapped;
                }
            }
        }

        $errorPath = null;
        if ($errors) {
            $errorPath = $this->writeErrorReport($import, $errors);
        }

        $import->update([
            'status' => 'validated',
            'column_map' => $map,
            'total_rows' => count($parsed['rows']),
            'valid_rows' => $valid,
            'error_rows' => count(array_unique(array_column($errors, 'row'))),
            'preview' => $preview,
            'error_report_path' => $errorPath,
            'validated_at' => now(),
            'summary' => [
                'headers' => $parsed['headers'],
                'errorSamples' => array_slice($errors, 0, 50),
                'errorCount' => count($errors),
            ],
        ]);

        return $import->fresh();
    }

    public function import(DataImport $import): DataImport
    {
        $import->update([
            'status' => 'importing',
            'started_at' => now(),
            'imported_rows' => 0,
            'skipped_rows' => 0,
            'processed_rows' => 0,
        ]);

        @set_time_limit(0);

        $absolute = Storage::disk('local')->path($import->stored_path);
        $parsed = SpreadsheetReader::read($absolute);
        $expected = SpreadsheetReader::headersFor($import->type);
        $map = $import->column_map ?: SpreadsheetReader::autoMap($parsed['headers'], $expected);

        $institution = Institution::findOrFail($import->institution_id);
        $departments = Department::where('institution_id', $institution->id)->get()->keyBy(fn ($d) => strtolower($d->name));
        $programs = Program::where('institution_id', $institution->id)->get()->keyBy(fn ($d) => strtolower($d->name));

        $imported = 0;
        $skipped = 0;
        $processed = 0;
        $errors = [];

        foreach ($parsed['rows'] as $row) {
            $processed++;
            $mapped = $this->applyMap($row, $map);
            $rowNum = (int) ($row['_row'] ?? 0);

            try {
                if ($import->type === 'teachers') {
                    $rowErrors = $this->validateTeacherRow($mapped, $institution->id, [], [], $departments, false);
                    if ($rowErrors) {
                        $skipped++;
                        foreach ($rowErrors as $err) {
                            $errors[] = ['row' => $rowNum, 'field' => $err['field'], 'message' => $err['message']];
                        }
                        continue;
                    }
                    $this->upsertTeacher($mapped, $institution->id, $departments);
                    $imported++;
                } else {
                    $rowErrors = $this->validateStudentRow($mapped, $institution->id, [], [], $departments, $programs, false);
                    if ($rowErrors) {
                        $skipped++;
                        foreach ($rowErrors as $err) {
                            $errors[] = ['row' => $rowNum, 'field' => $err['field'], 'message' => $err['message']];
                        }
                        continue;
                    }
                    $this->upsertStudent($mapped, $institution->id, $departments, $programs);
                    $imported++;
                }
            } catch (\Throwable $e) {
                $skipped++;
                $errors[] = ['row' => $rowNum, 'field' => '_', 'message' => $e->getMessage()];
            }

            if ($processed % 100 === 0) {
                $import->update([
                    'processed_rows' => $processed,
                    'imported_rows' => $imported,
                    'skipped_rows' => $skipped,
                ]);
            }
        }

        $errorPath = $errors ? $this->writeErrorReport($import, $errors) : $import->error_report_path;

        $import->update([
            'status' => 'completed',
            'processed_rows' => $processed,
            'imported_rows' => $imported,
            'skipped_rows' => $skipped,
            'error_rows' => count(array_unique(array_column($errors, 'row'))),
            'error_report_path' => $errorPath,
            'completed_at' => now(),
            'summary' => array_merge($import->summary ?? [], [
                'imported' => $imported,
                'skipped' => $skipped,
                'errorSamples' => array_slice($errors, 0, 50),
            ]),
        ]);

        if ($import->type === 'students') {
            $institution->update([
                'student_count' => Student::where('institution_id', $institution->id)->count(),
            ]);
        } else {
            $institution->update([
                'staff_count' => Teacher::where('institution_id', $institution->id)->count(),
            ]);
        }

        return $import->fresh();
    }

    /**
     * @param  array<string, string|null>  $map
     * @param  array<string, string>  $row
     * @return array<string, string>
     */
    private function applyMap(array $row, array $map): array
    {
        $out = [];
        foreach ($map as $field => $source) {
            if (! $source) {
                $out[$field] = '';
                continue;
            }
            $normalized = SpreadsheetReader::normalizeHeader($source);
            $out[$field] = $row[$normalized] ?? $row[$source] ?? '';
        }

        return $out;
    }

    /**
     * @param  array<string, string>  $row
     * @param  array<string, bool>  $seenIds
     * @param  array<string, bool>  $seenEmails
     * @return list<array{field: string, message: string}>
     */
    private function validateStudentRow(
        array $row,
        string $institutionId,
        array &$seenIds,
        array &$seenEmails,
        $departments,
        $programs,
        bool $checkDuplicatesInFile = true,
    ): array {
        $errors = [];
        $id = trim($row['student_id'] ?? '');
        $email = strtolower(trim($row['email'] ?? ''));
        $first = trim($row['first_name'] ?? '');
        $last = trim($row['last_name'] ?? '');

        if ($id === '') {
            $errors[] = ['field' => 'student_id', 'message' => 'Student ID is required'];
        }
        if ($first === '') {
            $errors[] = ['field' => 'first_name', 'message' => 'First name is required'];
        }
        if ($last === '') {
            $errors[] = ['field' => 'last_name', 'message' => 'Last name is required'];
        }
        if ($email === '' || ! filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $errors[] = ['field' => 'email', 'message' => 'Valid email is required'];
        }

        if ($checkDuplicatesInFile && $id !== '') {
            if (isset($seenIds[$id])) {
                $errors[] = ['field' => 'student_id', 'message' => 'Duplicate Student ID in file'];
            }
            $seenIds[$id] = true;
        }
        if ($checkDuplicatesInFile && $email !== '') {
            if (isset($seenEmails[$email])) {
                $errors[] = ['field' => 'email', 'message' => 'Duplicate email in file'];
            }
            $seenEmails[$email] = true;
        }

        $dept = strtolower(trim($row['department'] ?? ''));
        if ($dept !== '' && ! $departments->has($dept)) {
            // soft warning only — we allow creating without department link
        }

        $status = strtolower(trim($row['status'] ?? 'active')) ?: 'active';
        if (! in_array($status, ['active', 'inactive', 'graduated', 'suspended', 'on_leave'], true)) {
            $errors[] = ['field' => 'status', 'message' => 'Invalid status'];
        }

        return $errors;
    }

    /**
     * @param  array<string, string>  $row
     * @return list<array{field: string, message: string}>
     */
    private function validateTeacherRow(
        array $row,
        string $institutionId,
        array &$seenIds,
        array &$seenEmails,
        $departments,
        bool $checkDuplicatesInFile = true,
    ): array {
        $errors = [];
        $id = trim($row['employee_id'] ?? '');
        $email = strtolower(trim($row['email'] ?? ''));
        $first = trim($row['first_name'] ?? '');
        $last = trim($row['last_name'] ?? '');

        if ($id === '') {
            $errors[] = ['field' => 'employee_id', 'message' => 'Employee ID is required'];
        }
        if ($first === '') {
            $errors[] = ['field' => 'first_name', 'message' => 'First name is required'];
        }
        if ($last === '') {
            $errors[] = ['field' => 'last_name', 'message' => 'Last name is required'];
        }
        if ($email === '' || ! filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $errors[] = ['field' => 'email', 'message' => 'Valid email is required'];
        }

        if ($checkDuplicatesInFile && $id !== '') {
            if (isset($seenIds[$id])) {
                $errors[] = ['field' => 'employee_id', 'message' => 'Duplicate Employee ID in file'];
            }
            $seenIds[$id] = true;
        }
        if ($checkDuplicatesInFile && $email !== '') {
            if (isset($seenEmails[$email])) {
                $errors[] = ['field' => 'email', 'message' => 'Duplicate email in file'];
            }
            $seenEmails[$email] = true;
        }

        $status = strtolower(trim($row['status'] ?? 'active')) ?: 'active';
        if (! in_array($status, ['active', 'inactive', 'on_leave'], true)) {
            $errors[] = ['field' => 'status', 'message' => 'Invalid status'];
        }

        return $errors;
    }

    private function upsertStudent(array $row, string $institutionId, $departments, $programs): void
    {
        $studentNumber = trim($row['student_id']);
        $email = strtolower(trim($row['email']));
        $deptName = strtolower(trim($row['department'] ?? ''));
        $programName = strtolower(trim($row['program'] ?? ''));

        $payload = [
            'first_name' => trim($row['first_name']),
            'last_name' => trim($row['last_name']),
            'email' => $email,
            'phone' => trim($row['phone'] ?? '') ?: null,
            'department_id' => $deptName && $departments->has($deptName) ? $departments[$deptName]->id : null,
            'program_id' => $programName && $programs->has($programName) ? $programs[$programName]->id : null,
            'semester' => (int) ($row['semester'] ?: 1),
            'section' => trim($row['section'] ?? '') ?: null,
            'status' => strtolower(trim($row['status'] ?? 'active')) ?: 'active',
            'fee_status' => strtolower(trim($row['fee_status'] ?? 'partial')) ?: 'partial',
            'avatar_initials' => strtoupper(substr(trim($row['first_name']), 0, 1).substr(trim($row['last_name']), 0, 1)),
            'enrollment_date' => $this->parseDate($row['enrollment_date'] ?? null) ?? now()->toDateString(),
            'date_of_birth' => $this->parseDate($row['date_of_birth'] ?? null),
            'gender' => trim($row['gender'] ?? '') ?: null,
            'cnic' => trim($row['cnic'] ?? '') ?: null,
            'address' => trim($row['address'] ?? '') ?: null,
            'city' => trim($row['city'] ?? '') ?: null,
            'guardian_name' => trim($row['guardian_name'] ?? '') ?: null,
            'guardian_phone' => trim($row['guardian_phone'] ?? '') ?: null,
            'guardian_relation' => trim($row['guardian_relation'] ?? '') ?: null,
            'campus' => trim($row['campus'] ?? '') ?: null,
        ];

        $existing = Student::where('institution_id', $institutionId)
            ->where(function ($q) use ($studentNumber, $email) {
                $q->where('student_number', $studentNumber)->orWhere('email', $email);
            })
            ->first();

        if ($existing) {
            $existing->update($payload + ['student_number' => $studentNumber]);
        } else {
            Student::create($payload + [
                'id' => 'stu-'.Str::lower(Str::ulid()),
                'institution_id' => $institutionId,
                'student_number' => $studentNumber,
            ]);
        }
    }

    private function upsertTeacher(array $row, string $institutionId, $departments): void
    {
        $employeeId = trim($row['employee_id']);
        $email = strtolower(trim($row['email']));
        $deptName = strtolower(trim($row['department'] ?? ''));

        $payload = [
            'first_name' => trim($row['first_name']),
            'last_name' => trim($row['last_name']),
            'email' => $email,
            'phone' => trim($row['phone'] ?? '') ?: null,
            'title' => trim($row['title'] ?? '') ?: null,
            'department_id' => $deptName && $departments->has($deptName) ? $departments[$deptName]->id : null,
            'status' => strtolower(trim($row['status'] ?? 'active')) ?: 'active',
            'joined_at' => $this->parseDate($row['joined_at'] ?? null) ?? now()->toDateString(),
        ];

        $existing = Teacher::where('institution_id', $institutionId)
            ->where(function ($q) use ($employeeId, $email) {
                $q->where('employee_id', $employeeId)->orWhere('email', $email);
            })
            ->first();

        if ($existing) {
            $existing->update($payload + ['employee_id' => $employeeId]);
        } else {
            Teacher::create($payload + [
                'id' => 'tch-'.Str::lower(Str::ulid()),
                'institution_id' => $institutionId,
                'employee_id' => $employeeId,
            ]);
        }
    }

    private function parseDate(?string $value): ?string
    {
        $value = trim((string) $value);
        if ($value === '') {
            return null;
        }
        try {
            return \Carbon\Carbon::parse($value)->toDateString();
        } catch (\Throwable) {
            return null;
        }
    }

    /**
     * @param  list<array<string, mixed>>  $errors
     */
    private function writeErrorReport(DataImport $import, array $errors): string
    {
        $path = "imports/{$import->institution_id}/{$import->id}-errors.csv";
        $fh = fopen('php://temp', 'r+');
        fputcsv($fh, ['row', 'field', 'message']);
        foreach ($errors as $error) {
            fputcsv($fh, [$error['row'] ?? '', $error['field'] ?? '', $error['message'] ?? '']);
        }
        rewind($fh);
        Storage::disk('local')->put($path, stream_get_contents($fh) ?: '');
        fclose($fh);

        return $path;
    }
}

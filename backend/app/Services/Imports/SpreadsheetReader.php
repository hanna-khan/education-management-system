<?php

namespace App\Services\Imports;

use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Csv as CsvWriter;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

final class SpreadsheetReader
{
    /**
     * @return list<string>
     */
    public static function studentHeaders(): array
    {
        return [
            'student_id',
            'first_name',
            'last_name',
            'email',
            'phone',
            'gender',
            'date_of_birth',
            'cnic',
            'campus',
            'department',
            'program',
            'semester',
            'section',
            'status',
            'fee_status',
            'enrollment_date',
            'guardian_name',
            'guardian_phone',
            'guardian_relation',
            'address',
            'city',
        ];
    }

    /**
     * @return list<string>
     */
    public static function teacherHeaders(): array
    {
        return [
            'employee_id',
            'first_name',
            'last_name',
            'email',
            'phone',
            'title',
            'department',
            'status',
            'joined_at',
        ];
    }

    /**
     * @return list<string>
     */
    public static function headersFor(string $type): array
    {
        return $type === 'teachers' ? self::teacherHeaders() : self::studentHeaders();
    }

    public static function writeTemplate(string $type, string $format = 'xlsx'): string
    {
        $headers = self::headersFor($type);
        $spreadsheet = new Spreadsheet;
        $sheet = $spreadsheet->getActiveSheet();
        $sheet->fromArray([$headers], null, 'A1');

        $sample = $type === 'teachers'
            ? [['T-1001', 'Sara', 'Ahmed', 'sara.ahmed@school.edu', '03001234567', 'Senior Teacher', 'Science', 'active', '2024-01-15']]
            : [['STU-1001', 'Ali', 'Khan', 'ali.khan@student.edu', '03007654321', 'male', '2008-05-12', '', 'Main Campus', 'Science', 'Matric', '1', 'A', 'active', 'paid', '2024-08-01', 'Imran Khan', '03001112233', 'Father', 'Street 1', 'Karachi']];

        $sheet->fromArray($sample, null, 'A2');
        foreach (range(1, count($headers)) as $col) {
            $sheet->getColumnDimensionByColumn($col)->setAutoSize(true);
        }

        $tmp = tempnam(sys_get_temp_dir(), 'ems_tpl_');
        if ($format === 'csv') {
            $path = $tmp.'.csv';
            (new CsvWriter($spreadsheet))->save($path);
        } else {
            $path = $tmp.'.xlsx';
            (new Xlsx($spreadsheet))->save($path);
        }
        @unlink($tmp);

        return $path;
    }

    /**
     * @return array{headers: list<string>, rows: list<array<string, string>>}
     */
    public static function read(string $absolutePath): array
    {
        $spreadsheet = IOFactory::load($absolutePath);
        $sheet = $spreadsheet->getActiveSheet();
        $matrix = $sheet->toArray(null, true, true, false);

        if (count($matrix) < 1) {
            return ['headers' => [], 'rows' => []];
        }

        $rawHeaders = array_map(fn ($h) => self::normalizeHeader((string) $h), $matrix[0]);
        $headers = [];
        foreach ($rawHeaders as $i => $header) {
            if ($header === '') {
                $header = 'column_'.($i + 1);
            }
            $headers[$i] = $header;
        }

        $rows = [];
        for ($r = 1; $r < count($matrix); $r++) {
            $line = $matrix[$r];
            $allEmpty = true;
            $assoc = [];
            foreach ($headers as $i => $header) {
                $value = isset($line[$i]) ? trim((string) $line[$i]) : '';
                if ($value !== '') {
                    $allEmpty = false;
                }
                $assoc[$header] = $value;
            }
            if ($allEmpty) {
                continue;
            }
            $assoc['_row'] = $r + 1; // 1-based spreadsheet row
            $rows[] = $assoc;
        }

        return [
            'headers' => array_values($headers),
            'rows' => $rows,
        ];
    }

    public static function normalizeHeader(string $header): string
    {
        $h = strtolower(trim($header));
        $h = str_replace([' ', '-', '.'], '_', $h);
        $h = preg_replace('/_+/', '_', $h) ?? $h;

        $aliases = [
            'student_number' => 'student_id',
            'reg_no' => 'student_id',
            'registration_no' => 'student_id',
            'registration_number' => 'student_id',
            'id' => 'student_id',
            'emp_id' => 'employee_id',
            'employee_no' => 'employee_id',
            'staff_id' => 'employee_id',
            'firstname' => 'first_name',
            'lastname' => 'last_name',
            'mobile' => 'phone',
            'contact' => 'phone',
            'dob' => 'date_of_birth',
            'birth_date' => 'date_of_birth',
            'dept' => 'department',
            'programme' => 'program',
            'class_section' => 'section',
            'fee' => 'fee_status',
            'parent_name' => 'guardian_name',
            'parent_phone' => 'guardian_phone',
            'parent_relation' => 'guardian_relation',
            'joining_date' => 'joined_at',
            'join_date' => 'joined_at',
            'designation' => 'title',
        ];

        return $aliases[$h] ?? $h;
    }

    /**
     * Auto-map file headers to expected fields.
     *
     * @param  list<string>  $fileHeaders
     * @param  list<string>  $expected
     * @return array<string, string|null> expected => fileHeader
     */
    public static function autoMap(array $fileHeaders, array $expected): array
    {
        $normalizedFile = [];
        foreach ($fileHeaders as $h) {
            $normalizedFile[self::normalizeHeader($h)] = $h;
        }

        $map = [];
        foreach ($expected as $field) {
            $map[$field] = $normalizedFile[$field] ?? null;
        }

        return $map;
    }
}

<?php

namespace Database\Seeders;

use App\Models\AdmissionApplicant;
use App\Models\AdmissionCycle;
use App\Models\AdmissionInterview;
use App\Models\AdmissionOffer;
use App\Models\Application;
use App\Models\ApplicationStep;
use App\Models\AttendanceCorrection;
use App\Models\AttendanceRecord;
use App\Models\ExamMark;
use App\Models\ExamSchedule;
use App\Models\FeeInvoice;
use App\Models\FeePayment;
use App\Models\LeaveRequest;
use App\Models\MeritList;
use App\Models\Notice;
use App\Models\Scholarship;
use App\Models\Student;
use App\Models\StudentResult;
use App\Models\StudentResultCourse;
use App\Models\Workflow;
use App\Models\WorkflowStep;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class Phase2Seeder extends Seeder
{
    public function run(): void
    {
        $institutionId = 'inst-ned-demo';

        $fall = AdmissionCycle::updateOrCreate(
            ['id' => 'cycle-f26'],
            [
                'institution_id' => $institutionId,
                'name' => 'Fall 2026',
                'status' => 'open',
                'deadline' => '2026-09-30',
                'applications_count' => 6,
            ]
        );

        AdmissionCycle::updateOrCreate(
            ['id' => 'cycle-s26'],
            [
                'institution_id' => $institutionId,
                'name' => 'Spring 2026',
                'status' => 'closed',
                'deadline' => '2026-02-28',
                'applications_count' => 1420,
            ]
        );

        $applicants = [
            ['id' => 'app-2026-001', 'name' => 'Hamza Siddiqui', 'program_name' => 'BS Computer Science', 'program_id' => 'prog-bscs', 'status' => 'under_review', 'score' => 82, 'submitted_at' => '2026-08-18'],
            ['id' => 'app-2026-002', 'name' => 'Amina Tariq', 'program_name' => 'BS Electrical Engineering', 'program_id' => 'prog-bsee', 'status' => 'accepted', 'score' => 91, 'submitted_at' => '2026-08-15'],
            ['id' => 'app-2026-003', 'name' => 'Rashid Mehmood', 'program_name' => 'BS Computer Science', 'program_id' => 'prog-bscs', 'status' => 'pending_documents', 'score' => 74, 'submitted_at' => '2026-08-20'],
            ['id' => 'app-2026-004', 'name' => 'Hina Akbar', 'program_name' => 'BS Software Engineering', 'program_id' => 'prog-bsse', 'status' => 'interview', 'score' => 88, 'submitted_at' => '2026-08-12'],
            ['id' => 'app-2026-005', 'name' => 'Danish Ali', 'program_name' => 'BS Computer Science', 'program_id' => 'prog-bscs', 'status' => 'rejected', 'score' => 58, 'submitted_at' => '2026-08-10'],
            ['id' => 'app-2026-006', 'name' => 'Sadia Noor', 'program_name' => 'BS Computer Science', 'program_id' => 'prog-bscs', 'status' => 'enrolled', 'score' => 86, 'submitted_at' => '2026-08-08', 'student_id' => 'stu-2024-1024'],
        ];

        foreach ($applicants as $row) {
            AdmissionApplicant::updateOrCreate(
                ['id' => $row['id']],
                $row + [
                    'institution_id' => $institutionId,
                    'cycle_id' => $fall->id,
                    'cycle_name' => 'Fall 2026',
                    'email' => Str::slug($row['name']).'@applicant.neddemo.edu.pk',
                ]
            );
        }

        MeritList::updateOrCreate(['id' => 'merit-cs'], [
            'institution_id' => $institutionId,
            'cycle_id' => $fall->id,
            'program_id' => 'prog-bscs',
            'program_name' => 'BS Computer Science',
            'published_at' => '2026-08-15',
            'seats' => 120,
            'filled' => 98,
        ]);

        MeritList::updateOrCreate(['id' => 'merit-ee'], [
            'institution_id' => $institutionId,
            'cycle_id' => $fall->id,
            'program_id' => 'prog-bsee',
            'program_name' => 'BS Electrical Engineering',
            'published_at' => '2026-08-14',
            'seats' => 100,
            'filled' => 87,
        ]);

        AdmissionInterview::updateOrCreate(['id' => 'int-001'], [
            'institution_id' => $institutionId,
            'applicant_id' => 'app-2026-004',
            'program_name' => 'BS Software Engineering',
            'scheduled_at' => '2026-09-02 10:00:00',
            'panel' => 'Dr. Imran Qureshi, Sana Iqbal',
            'status' => 'scheduled',
        ]);

        AdmissionOffer::updateOrCreate(['id' => 'offer-001'], [
            'institution_id' => $institutionId,
            'applicant_id' => 'app-2026-002',
            'program_name' => 'BS Electrical Engineering',
            'offer_date' => '2026-08-20',
            'deadline' => '2026-09-05',
            'status' => 'accepted',
        ]);

        AdmissionOffer::updateOrCreate(['id' => 'offer-002'], [
            'institution_id' => $institutionId,
            'applicant_id' => 'app-2026-001',
            'program_name' => 'BS Computer Science',
            'offer_date' => '2026-08-22',
            'deadline' => '2026-09-10',
            'status' => 'pending',
        ]);

        $today = '2026-09-02';
        $attendance = [
            ['student_id' => 'stu-2024-1024', 'student_number' => 'STU-2024-1024', 'student_name' => 'Ahmed Khan', 'program_name' => 'BS Computer Science', 'grade_label' => 'Semester 6', 'section_code' => 'A', 'course_label' => 'CS-301', 'status' => 'present', 'marked_at_time' => '09:02', 'method' => 'QR'],
            ['student_id' => 'stu-2024-0891', 'student_number' => 'STU-2024-0891', 'student_name' => 'Fatima Sheikh', 'program_name' => 'BS Software Engineering', 'grade_label' => 'Semester 4', 'section_code' => 'B', 'course_label' => 'CS-302', 'status' => 'present', 'marked_at_time' => '09:05', 'method' => 'Biometric'],
            ['student_id' => 'stu-2023-0456', 'student_number' => 'STU-2023-0456', 'student_name' => 'Hassan Raza', 'program_name' => 'BS Electrical Engineering', 'grade_label' => 'Semester 8', 'section_code' => 'A', 'course_label' => 'EE-210', 'status' => 'late', 'marked_at_time' => '09:18', 'method' => 'Manual', 'remarks' => 'Traffic delay'],
        ];

        foreach ($attendance as $i => $row) {
            AttendanceRecord::updateOrCreate(
                ['id' => 'att-demo-'.($i + 1)],
                $row + [
                    'institution_id' => $institutionId,
                    'attendance_date' => $today,
                    'subject_type' => 'student',
                ]
            );
        }

        // Fill remaining students as present for stats realism
        Student::with('program')->where('institution_id', $institutionId)
            ->whereNotIn('id', ['stu-2024-1024', 'stu-2024-0891', 'stu-2023-0456'])
            ->get()
            ->each(function (Student $student, int $index) use ($institutionId, $today) {
                AttendanceRecord::updateOrCreate(
                    ['id' => 'att-bulk-'.$student->id],
                    [
                        'institution_id' => $institutionId,
                        'student_id' => $student->id,
                        'attendance_date' => $today,
                        'student_number' => $student->student_number,
                        'student_name' => trim($student->first_name.' '.$student->last_name),
                        'program_name' => $student->program?->name,
                        'grade_label' => 'Semester '.$student->semester,
                        'section_code' => $student->section,
                        'course_label' => 'CS-301',
                        'status' => $index % 7 === 0 ? 'absent' : 'present',
                        'marked_at_time' => $index % 7 === 0 ? null : '09:0'.($index % 5),
                        'method' => 'QR',
                        'subject_type' => 'student',
                    ]
                );
            });

        AttendanceCorrection::updateOrCreate(['id' => 'corr-001'], [
            'institution_id' => $institutionId,
            'student_id' => 'stu-2024-1024',
            'student_name' => 'Ahmed Khan',
            'attendance_date' => '2026-08-20',
            'course_label' => 'CS-301',
            'current_status' => 'absent',
            'requested_status' => 'present',
            'status' => 'pending',
            'reason' => 'Marked absent incorrectly — was present in lab.',
        ]);

        LeaveRequest::updateOrCreate(['id' => 'leave-001'], [
            'institution_id' => $institutionId,
            'student_id' => 'stu-2024-1024',
            'requester_name' => 'Ahmed Khan',
            'leave_type' => 'Medical Leave',
            'start_date' => '2026-08-25',
            'end_date' => '2026-08-27',
            'status' => 'pending',
            'balance_label' => '8 days',
        ]);

        LeaveRequest::updateOrCreate(['id' => 'leave-002'], [
            'institution_id' => $institutionId,
            'student_id' => 'stu-2024-0891',
            'requester_name' => 'Fatima Sheikh',
            'leave_type' => 'Personal Leave',
            'start_date' => '2026-08-22',
            'end_date' => '2026-08-30',
            'status' => 'approved',
            'balance_label' => '4 days',
        ]);

        $exams = [
            ['id' => 'exam-001', 'course_label' => 'CS-301 Data Structures', 'exam_type' => 'Midterm', 'exam_date' => '2026-08-28', 'exam_time' => '10:00 AM', 'room' => 'Lab Block A · Hall 1', 'invigilator' => 'Dr. Kamran Hussain'],
            ['id' => 'exam-002', 'course_label' => 'EE-210 Circuit Analysis', 'exam_type' => 'Midterm', 'exam_date' => '2026-08-29', 'exam_time' => '10:00 AM', 'room' => 'Engineering Block · 112', 'invigilator' => 'Dr. Farah Naz'],
            ['id' => 'exam-003', 'course_label' => 'MTH-201 Linear Algebra', 'exam_type' => 'Midterm', 'exam_date' => '2026-08-30', 'exam_time' => '02:00 PM', 'room' => 'Science Block · 301', 'invigilator' => 'Dr. Asma Siddiqui'],
            ['id' => 'exam-004', 'course_label' => 'CS-302 Database Systems', 'exam_type' => 'Midterm', 'exam_date' => '2026-09-02', 'exam_time' => '10:00 AM', 'room' => 'Lab Block A · Hall 2', 'invigilator' => 'Sana Iqbal'],
        ];

        foreach ($exams as $exam) {
            ExamSchedule::updateOrCreate(['id' => $exam['id']], $exam + [
                'institution_id' => $institutionId,
                'status' => 'upcoming',
            ]);
        }

        ExamMark::updateOrCreate(['id' => 'mark-001'], [
            'institution_id' => $institutionId,
            'student_id' => 'stu-2024-1024',
            'student_number' => 'STU-2024-1024',
            'student_name' => 'Ahmed Khan',
            'course_label' => 'CS-301',
            'assignment' => 18,
            'midterm' => 32,
            'final' => 0,
            'total' => 50,
            'grade' => null,
            'published' => false,
        ]);

        ExamMark::updateOrCreate(['id' => 'mark-002'], [
            'institution_id' => $institutionId,
            'student_id' => 'stu-2024-0891',
            'student_number' => 'STU-2024-0891',
            'student_name' => 'Fatima Sheikh',
            'course_label' => 'CS-302',
            'assignment' => 20,
            'midterm' => 35,
            'final' => 0,
            'total' => 55,
            'published' => false,
        ]);

        $result = StudentResult::updateOrCreate(
            ['id' => 'res-ahmed-f25'],
            [
                'institution_id' => $institutionId,
                'student_id' => 'stu-2024-1024',
                'semester_label' => 'Fall 2025',
                'gpa' => 3.42,
                'cgpa' => 3.38,
                'published' => true,
            ]
        );

        $courses = [
            ['code' => 'CS-301', 'name' => 'Data Structures', 'credits' => 3, 'marks' => 82, 'grade' => 'A-', 'points' => 3.7],
            ['code' => 'CS-302', 'name' => 'Database Systems', 'credits' => 3, 'marks' => 78, 'grade' => 'B+', 'points' => 3.3],
            ['code' => 'MTH-201', 'name' => 'Linear Algebra', 'credits' => 3, 'marks' => 85, 'grade' => 'A', 'points' => 4.0],
            ['code' => 'EE-210', 'name' => 'Circuit Analysis', 'credits' => 3, 'marks' => 72, 'grade' => 'B', 'points' => 3.0],
            ['code' => 'SS-101', 'name' => 'Pakistan Studies', 'credits' => 2, 'marks' => 88, 'grade' => 'A', 'points' => 4.0],
        ];

        foreach ($courses as $i => $course) {
            StudentResultCourse::updateOrCreate(
                ['id' => 'resc-'.$result->id.'-'.$i],
                $course + ['result_id' => $result->id]
            );
        }

        $breakdown = [
            ['head' => 'Tuition Fee', 'amount' => 65000],
            ['head' => 'Lab Fee', 'amount' => 8000],
            ['head' => 'Library Fee', 'amount' => 3000],
            ['head' => 'Transport Fee', 'amount' => 5000],
            ['head' => 'Other Charges', 'amount' => 4000],
        ];

        FeeInvoice::updateOrCreate(['id' => 'INV-2026-8421'], [
            'institution_id' => $institutionId,
            'student_id' => 'stu-2024-1024',
            'student_name' => 'Ahmed Khan',
            'program_name' => 'BS Computer Science',
            'semester_label' => 'Fall 2026',
            'total' => 85000,
            'paid' => 85000,
            'outstanding' => 0,
            'status' => 'paid',
            'breakdown' => $breakdown,
        ]);

        FeeInvoice::updateOrCreate(['id' => 'INV-2026-8422'], [
            'institution_id' => $institutionId,
            'student_id' => 'stu-2024-0891',
            'student_name' => 'Fatima Sheikh',
            'program_name' => 'BS Software Engineering',
            'semester_label' => 'Fall 2026',
            'total' => 85000,
            'paid' => 42500,
            'outstanding' => 42500,
            'status' => 'partial',
            'breakdown' => $breakdown,
        ]);

        FeeInvoice::updateOrCreate(['id' => 'INV-2026-8423'], [
            'institution_id' => $institutionId,
            'student_id' => 'stu-2023-0456',
            'student_name' => 'Hassan Raza',
            'program_name' => 'BS Electrical Engineering',
            'semester_label' => 'Fall 2026',
            'total' => 88000,
            'paid' => 0,
            'outstanding' => 88000,
            'status' => 'overdue',
            'breakdown' => $breakdown,
        ]);

        FeePayment::updateOrCreate(['id' => 'PAY-2026-1201'], [
            'institution_id' => $institutionId,
            'invoice_id' => 'INV-2026-8421',
            'student_id' => 'stu-2024-1024',
            'student_name' => 'Ahmed Khan',
            'amount' => 85000,
            'method' => 'Bank Transfer',
            'paid_at' => '2026-08-21',
            'receipt' => 'RCP-2026-1201',
        ]);

        FeePayment::updateOrCreate(['id' => 'PAY-2026-1202'], [
            'institution_id' => $institutionId,
            'invoice_id' => 'INV-2026-8422',
            'student_id' => 'stu-2024-0891',
            'student_name' => 'Fatima Sheikh',
            'amount' => 42500,
            'method' => 'Online Payment',
            'paid_at' => '2026-08-20',
            'receipt' => 'RCP-2026-1202',
        ]);

        Scholarship::updateOrCreate(['id' => 'sch-001'], [
            'institution_id' => $institutionId,
            'student_name' => 'Maryam Hussain',
            'type' => 'Merit Scholarship',
            'amount' => 82000,
            'status' => 'awarded',
            'semester_label' => 'Fall 2026',
        ]);

        Scholarship::updateOrCreate(['id' => 'sch-002'], [
            'institution_id' => $institutionId,
            'student_id' => 'stu-2024-1024',
            'student_name' => 'Ahmed Khan',
            'type' => 'Need-Based Scholarship',
            'amount' => 40000,
            'status' => 'under_review',
            'semester_label' => 'Fall 2026',
        ]);

        $leaveWf = Workflow::updateOrCreate(['id' => 'wf-leave'], [
            'institution_id' => $institutionId,
            'name' => 'Student Leave Request',
            'trigger' => 'Application submitted',
            'form_label' => 'Leave Application Form',
            'description' => 'Multi-step approval for student leave applications.',
            'status' => 'active',
            'sla_label' => '5 days',
        ]);

        $leaveSteps = [
            [1, 'Teacher Approval', 'Teacher', '2 days', true],
            [2, 'HOD Approval', 'HOD', '2 days', true],
            [3, 'Finance Verification', 'Accountant', '1 day', false],
            [4, 'Principal Approval', 'Principal', '1 day', true],
        ];

        foreach ($leaveSteps as [$order, $name, $role, $sla, $required]) {
            WorkflowStep::updateOrCreate(
                ['id' => 'wfs-leave-'.$order],
                [
                    'workflow_id' => $leaveWf->id,
                    'step_order' => $order,
                    'name' => $name,
                    'role_label' => $role,
                    'sla_label' => $sla,
                    'required' => $required,
                ]
            );
        }

        foreach ([
            ['wf-scholarship', 'Scholarship Application', 5, '14 days'],
            ['wf-fee', 'Fee Concession Request', 4, '7 days'],
            ['wf-transcript', 'Transcript Request', 3, '3 days'],
            ['wf-profile', 'Profile Update Request', 2, '2 days'],
        ] as [$id, $name, $steps, $sla]) {
            Workflow::updateOrCreate(['id' => $id], [
                'institution_id' => $institutionId,
                'name' => $name,
                'trigger' => 'Application submitted',
                'status' => $id === 'wf-profile' ? 'draft' : 'active',
                'sla_label' => $sla,
            ]);
            for ($i = 1; $i <= $steps; $i++) {
                WorkflowStep::updateOrCreate(
                    ['id' => $id.'-step-'.$i],
                    [
                        'workflow_id' => $id,
                        'step_order' => $i,
                        'name' => 'Step '.$i,
                        'role_label' => 'Reviewer',
                        'sla_label' => '1 day',
                        'required' => true,
                    ]
                );
            }
        }

        $apps = [
            ['id' => 'APP-2026-1842', 'applicant_name' => 'Ayesha Sheikh', 'applicant_ref' => 'stu-2024-1156', 'type' => 'leave', 'submitted_at' => '2026-08-20', 'stage' => 'HOD Review', 'assigned_to' => 'Dr. Imran Malik', 'sla_label' => '2 days left', 'sla_breached' => false, 'status' => 'in_review', 'workflow_id' => 'wf-leave'],
            ['id' => 'APP-2026-1838', 'applicant_name' => 'Ahmed Khan', 'applicant_ref' => 'stu-2024-1024', 'student_id' => 'stu-2024-1024', 'type' => 'scholarship', 'submitted_at' => '2026-08-19', 'stage' => 'Finance Verification', 'assigned_to' => 'Finance Dept', 'sla_label' => 'Breached', 'sla_breached' => true, 'status' => 'in_review', 'workflow_id' => 'wf-scholarship'],
            ['id' => 'APP-2026-1835', 'applicant_name' => 'Fatima Sheikh', 'applicant_ref' => 'stu-2024-0891', 'student_id' => 'stu-2024-0891', 'type' => 'fee_concession', 'submitted_at' => '2026-08-18', 'stage' => 'Principal Approval', 'assigned_to' => 'Dr. Hassan Raza', 'sla_label' => '1 day left', 'sla_breached' => false, 'status' => 'in_review', 'workflow_id' => 'wf-fee'],
            ['id' => 'APP-2026-1825', 'applicant_name' => 'Maryam Hussain', 'applicant_ref' => 'stu-2024-0912', 'type' => 'transcript', 'submitted_at' => '2026-08-16', 'stage' => 'Completed', 'assigned_to' => 'Exam Office', 'sla_label' => '—', 'sla_breached' => false, 'status' => 'approved', 'workflow_id' => 'wf-transcript'],
        ];

        foreach ($apps as $app) {
            Application::updateOrCreate(['id' => $app['id']], $app + ['institution_id' => $institutionId]);
        }

        $stepDefs = [
            ['Submitted', 'completed', '2026-08-20 10:30'],
            ['Teacher Review', 'completed', '2026-08-21 14:15'],
            ['HOD Review', 'current', 'In progress'],
            ['Finance', 'pending', ''],
            ['Principal', 'pending', ''],
            ['Completed', 'pending', ''],
        ];

        foreach ($stepDefs as $i => [$name, $status, $date]) {
            ApplicationStep::updateOrCreate(
                ['id' => 'astep-1842-'.$i],
                [
                    'application_id' => 'APP-2026-1842',
                    'step_order' => $i + 1,
                    'name' => $name,
                    'status' => $status,
                    'acted_at_label' => $date,
                ]
            );
        }

        $notices = [
            ['id' => 'notice-001', 'title' => 'Fall 2026 Course Registration Opens Sep 1', 'audience' => 'All students', 'published_at' => '2026-08-20', 'expires_at' => '2026-09-15', 'status' => 'published'],
            ['id' => 'notice-002', 'title' => 'Midterm Examination Schedule Published', 'audience' => 'Faculty & students', 'published_at' => '2026-08-19', 'expires_at' => '2026-09-30', 'status' => 'published'],
            ['id' => 'notice-003', 'title' => 'Scholarship Application Deadline — Sep 15', 'audience' => 'Eligible students', 'published_at' => '2026-08-18', 'expires_at' => '2026-09-15', 'status' => 'published'],
            ['id' => 'notice-004', 'title' => 'Independence Day Holiday — Campus Closed', 'audience' => 'All', 'published_at' => '2026-08-10', 'expires_at' => '2026-08-14', 'status' => 'expired'],
            ['id' => 'notice-005', 'title' => 'Faculty Development Workshop', 'audience' => 'Faculty', 'published_at' => null, 'expires_at' => '2026-08-28', 'status' => 'draft'],
        ];

        foreach ($notices as $notice) {
            Notice::updateOrCreate(['id' => $notice['id']], $notice + [
                'institution_id' => $institutionId,
                'body' => $notice['title'],
                'created_by' => 'user-admin',
            ]);
        }
    }
}

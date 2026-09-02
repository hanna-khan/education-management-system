<?php

use App\Http\Controllers\Api\V1\AcademicController;
use App\Http\Controllers\Api\V1\AdmissionController;
use App\Http\Controllers\Api\V1\ApplicationController;
use App\Http\Controllers\Api\V1\AttendanceController;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\ExamController;
use App\Http\Controllers\Api\V1\FeeController;
use App\Http\Controllers\Api\V1\ImportController;
use App\Http\Controllers\Api\V1\InvitationController;
use App\Http\Controllers\Api\V1\NoticeController;
use App\Http\Controllers\Api\V1\RegistrationController;
use App\Http\Controllers\Api\V1\TenantController;
use App\Http\Controllers\Api\V1\Platform\InstitutionController as PlatformInstitutionController;
use App\Http\Controllers\Api\V1\StudentController;
use App\Http\Controllers\Api\V1\TeacherController;
use App\Support\Roles;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    Route::post('/auth/login', [AuthController::class, 'login']);
    Route::post('/auth/forgot-password', [AuthController::class, 'forgotPassword']);
    Route::post('/auth/reset-password', [AuthController::class, 'resetPassword']);

    Route::get('/plans', [RegistrationController::class, 'plans']);
    Route::post('/register', [RegistrationController::class, 'register']);

    Route::get('/invitations/accept/{token}', [InvitationController::class, 'showByToken']);
    Route::post('/invitations/accept', [InvitationController::class, 'accept']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/auth/me', [AuthController::class, 'me']);
        Route::post('/auth/logout', [AuthController::class, 'logout']);

        Route::middleware(['institution', 'subscription.write'])->group(function () {
            Route::get('/dashboard', [AcademicController::class, 'dashboard']);
            Route::get('/institution', [AcademicController::class, 'currentInstitution']);
            Route::put('/institution', [TenantController::class, 'updateInstitution']);
            Route::get('/subscription', [TenantController::class, 'subscription']);
            Route::post('/subscription/change-plan', [TenantController::class, 'changePlan']);
            Route::get('/campuses', [TenantController::class, 'campuses']);
            Route::post('/campuses', [TenantController::class, 'storeCampus']);
            Route::get('/onboarding', [TenantController::class, 'onboardingStatus']);
            Route::post('/onboarding/advance', [TenantController::class, 'advanceOnboarding']);
            Route::get('/modules', [AcademicController::class, 'modules']);
            Route::put('/modules', [AcademicController::class, 'updateModules']);

            Route::get('/staff', [InvitationController::class, 'staff']);
            Route::get('/invitations', [InvitationController::class, 'index']);
            Route::post('/invitations', [InvitationController::class, 'store']);
            Route::post('/invitations/{invitation}/resend', [InvitationController::class, 'resend']);
            Route::delete('/invitations/{invitation}', [InvitationController::class, 'destroy']);

            Route::get('/imports/templates/{type}', [ImportController::class, 'templates']);
            Route::get('/imports', [ImportController::class, 'index']);
            Route::post('/imports', [ImportController::class, 'store']);
            Route::get('/imports/{import}', [ImportController::class, 'show']);
            Route::put('/imports/{import}/mapping', [ImportController::class, 'remap']);
            Route::post('/imports/{import}/run', [ImportController::class, 'run']);
            Route::get('/imports/{import}/errors', [ImportController::class, 'errorReport']);

            Route::get('/departments', [AcademicController::class, 'departments']);
            Route::post('/departments', [AcademicController::class, 'storeDepartment']);
            Route::get('/programs', [AcademicController::class, 'programs']);
            Route::get('/courses', [AcademicController::class, 'courses']);
            Route::get('/sections', [AcademicController::class, 'sections']);

            Route::get('/students/stats', [StudentController::class, 'stats']);
            Route::get('/students/filter-options', [StudentController::class, 'filterOptions']);
            Route::get('/students', [StudentController::class, 'index']);
            Route::post('/students', [StudentController::class, 'store']);
            Route::get('/students/{student}', [StudentController::class, 'show']);
            Route::put('/students/{student}', [StudentController::class, 'update']);

            Route::get('/teachers', [TeacherController::class, 'index']);
            Route::post('/teachers', [TeacherController::class, 'store']);
            Route::get('/teachers/{teacher}', [TeacherController::class, 'show']);
            Route::put('/teachers/{teacher}', [TeacherController::class, 'update']);

            Route::get('/admissions/stats', [AdmissionController::class, 'stats']);
            Route::get('/admissions/cycles', [AdmissionController::class, 'cycles']);
            Route::post('/admissions/cycles', [AdmissionController::class, 'storeCycle']);
            Route::get('/admissions/applicants', [AdmissionController::class, 'applicants']);
            Route::post('/admissions/applicants', [AdmissionController::class, 'storeApplicant']);
            Route::get('/admissions/applicants/{applicant}', [AdmissionController::class, 'showApplicant']);
            Route::put('/admissions/applicants/{applicant}', [AdmissionController::class, 'updateApplicant']);
            Route::get('/admissions/merit-lists', [AdmissionController::class, 'meritLists']);
            Route::get('/admissions/interviews', [AdmissionController::class, 'interviews']);
            Route::get('/admissions/offers', [AdmissionController::class, 'offers']);
            Route::post('/admissions/offers', [AdmissionController::class, 'storeOffer']);
            Route::post('/admissions/offers/{offer}/enroll', [AdmissionController::class, 'enroll']);
            Route::get('/admissions/enrollment', [AdmissionController::class, 'enrollmentSummary']);

            Route::get('/attendance/stats', [AttendanceController::class, 'stats']);
            Route::get('/attendance/daily', [AttendanceController::class, 'daily']);
            Route::post('/attendance/mark', [AttendanceController::class, 'mark']);
            Route::get('/attendance/corrections', [AttendanceController::class, 'corrections']);
            Route::post('/attendance/corrections/{correction}/review', [AttendanceController::class, 'reviewCorrection']);
            Route::get('/attendance/leaves', [AttendanceController::class, 'leaves']);
            Route::post('/attendance/leaves', [AttendanceController::class, 'storeLeave']);
            Route::post('/attendance/leaves/{leave}/review', [AttendanceController::class, 'reviewLeave']);

            Route::get('/exams/stats', [ExamController::class, 'stats']);
            Route::get('/exams/schedules', [ExamController::class, 'schedules']);
            Route::post('/exams/schedules', [ExamController::class, 'storeSchedule']);
            Route::get('/exams/marks', [ExamController::class, 'marks']);
            Route::put('/exams/marks', [ExamController::class, 'upsertMarks']);
            Route::post('/exams/marks/publish', [ExamController::class, 'publishMarks']);
            Route::get('/exams/results', [ExamController::class, 'results']);

            Route::get('/fees/stats', [FeeController::class, 'stats']);
            Route::get('/fees/breakdown', [FeeController::class, 'breakdown']);
            Route::get('/fees/invoices', [FeeController::class, 'invoices']);
            Route::post('/fees/invoices', [FeeController::class, 'storeInvoice']);
            Route::get('/fees/payments', [FeeController::class, 'payments']);
            Route::post('/fees/payments', [FeeController::class, 'recordPayment']);
            Route::get('/fees/scholarships', [FeeController::class, 'scholarships']);
            Route::get('/fees/scholarships/stats', [FeeController::class, 'scholarshipStats']);
            Route::put('/fees/scholarships/{scholarship}', [FeeController::class, 'updateScholarship']);

            Route::get('/applications/stats', [ApplicationController::class, 'stats']);
            Route::get('/applications', [ApplicationController::class, 'index']);
            Route::post('/applications', [ApplicationController::class, 'store']);
            Route::get('/applications/{application}', [ApplicationController::class, 'show']);
            Route::post('/applications/{application}/decide', [ApplicationController::class, 'decide']);
            Route::get('/workflows', [ApplicationController::class, 'workflows']);
            Route::get('/workflows/{workflow}', [ApplicationController::class, 'showWorkflow']);

            Route::get('/notices', [NoticeController::class, 'index']);
            Route::post('/notices', [NoticeController::class, 'store']);
            Route::put('/notices/{notice}', [NoticeController::class, 'update']);
        });

        Route::prefix('platform')
            ->middleware('role:'.Roles::PLATFORM_ADMIN)
            ->group(function () {
                Route::get('/institutions', [PlatformInstitutionController::class, 'index']);
                Route::post('/institutions', [PlatformInstitutionController::class, 'store']);
                Route::get('/institutions/{institution}', [PlatformInstitutionController::class, 'show']);
                Route::put('/institutions/{institution}', [PlatformInstitutionController::class, 'update']);
            });
    });
});

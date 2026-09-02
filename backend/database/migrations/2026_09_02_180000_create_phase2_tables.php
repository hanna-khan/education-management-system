<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('admission_cycles', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('institution_id')->index();
            $table->string('name');
            $table->enum('status', ['open', 'closed'])->default('open');
            $table->date('deadline')->nullable();
            $table->unsignedInteger('applications_count')->default(0);
            $table->timestamps();
            $table->foreign('institution_id')->references('id')->on('institutions')->cascadeOnDelete();
        });

        Schema::create('admission_applicants', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('institution_id')->index();
            $table->string('cycle_id')->nullable()->index();
            $table->string('program_id')->nullable()->index();
            $table->string('name');
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->string('program_name')->nullable();
            $table->string('cycle_name')->nullable();
            $table->enum('status', [
                'under_review', 'accepted', 'pending_documents', 'interview', 'rejected', 'enrolled', 'offered',
            ])->default('under_review');
            $table->unsignedSmallInteger('score')->default(0);
            $table->date('submitted_at')->nullable();
            $table->string('student_id')->nullable()->index();
            $table->timestamps();
            $table->index(['institution_id', 'status']);
            $table->foreign('institution_id')->references('id')->on('institutions')->cascadeOnDelete();
            $table->foreign('cycle_id')->references('id')->on('admission_cycles')->nullOnDelete();
            $table->foreign('program_id')->references('id')->on('programs')->nullOnDelete();
            $table->foreign('student_id')->references('id')->on('students')->nullOnDelete();
        });

        Schema::create('merit_lists', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('institution_id')->index();
            $table->string('cycle_id')->nullable()->index();
            $table->string('program_id')->nullable()->index();
            $table->string('program_name');
            $table->date('published_at')->nullable();
            $table->unsignedInteger('seats')->default(0);
            $table->unsignedInteger('filled')->default(0);
            $table->timestamps();
            $table->foreign('institution_id')->references('id')->on('institutions')->cascadeOnDelete();
        });

        Schema::create('admission_interviews', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('institution_id')->index();
            $table->string('applicant_id')->index();
            $table->string('program_name')->nullable();
            $table->dateTime('scheduled_at')->nullable();
            $table->string('panel')->nullable();
            $table->enum('status', ['scheduled', 'completed', 'cancelled', 'no_show'])->default('scheduled');
            $table->text('notes')->nullable();
            $table->timestamps();
            $table->foreign('institution_id')->references('id')->on('institutions')->cascadeOnDelete();
            $table->foreign('applicant_id')->references('id')->on('admission_applicants')->cascadeOnDelete();
        });

        Schema::create('admission_offers', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('institution_id')->index();
            $table->string('applicant_id')->index();
            $table->string('program_name')->nullable();
            $table->date('offer_date')->nullable();
            $table->date('deadline')->nullable();
            $table->enum('status', ['pending', 'accepted', 'declined', 'expired', 'enrolled'])->default('pending');
            $table->timestamps();
            $table->foreign('institution_id')->references('id')->on('institutions')->cascadeOnDelete();
            $table->foreign('applicant_id')->references('id')->on('admission_applicants')->cascadeOnDelete();
        });

        Schema::create('attendance_records', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('institution_id')->index();
            $table->string('student_id')->nullable()->index();
            $table->string('teacher_id')->nullable()->index();
            $table->string('course_id')->nullable()->index();
            $table->string('section_id')->nullable()->index();
            $table->date('attendance_date')->index();
            $table->string('student_number')->nullable();
            $table->string('student_name')->nullable();
            $table->string('program_name')->nullable();
            $table->string('grade_label')->nullable();
            $table->string('section_code')->nullable();
            $table->string('course_label')->nullable();
            $table->enum('status', ['present', 'absent', 'late', 'excused', 'on_leave'])->default('present');
            $table->string('marked_at_time', 16)->nullable();
            $table->string('method', 32)->nullable();
            $table->string('remarks')->nullable();
            $table->enum('subject_type', ['student', 'teacher'])->default('student');
            $table->timestamps();
            $table->index(['institution_id', 'attendance_date', 'subject_type']);
            $table->foreign('institution_id')->references('id')->on('institutions')->cascadeOnDelete();
            $table->foreign('student_id')->references('id')->on('students')->nullOnDelete();
            $table->foreign('teacher_id')->references('id')->on('teachers')->nullOnDelete();
        });

        Schema::create('attendance_corrections', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('institution_id')->index();
            $table->string('student_id')->nullable()->index();
            $table->string('student_name');
            $table->date('attendance_date');
            $table->string('course_label')->nullable();
            $table->string('current_status', 32);
            $table->string('requested_status', 32);
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending');
            $table->text('reason')->nullable();
            $table->string('reviewed_by')->nullable();
            $table->timestamps();
            $table->foreign('institution_id')->references('id')->on('institutions')->cascadeOnDelete();
        });

        Schema::create('leave_requests', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('institution_id')->index();
            $table->string('student_id')->nullable()->index();
            $table->string('requester_name');
            $table->string('leave_type');
            $table->date('start_date');
            $table->date('end_date');
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending');
            $table->string('balance_label')->nullable();
            $table->text('reason')->nullable();
            $table->timestamps();
            $table->foreign('institution_id')->references('id')->on('institutions')->cascadeOnDelete();
        });

        Schema::create('exam_schedules', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('institution_id')->index();
            $table->string('course_id')->nullable()->index();
            $table->string('course_label');
            $table->string('exam_type', 64);
            $table->date('exam_date');
            $table->string('exam_time', 64)->nullable();
            $table->string('room')->nullable();
            $table->string('invigilator')->nullable();
            $table->enum('status', ['upcoming', 'completed', 'cancelled'])->default('upcoming');
            $table->timestamps();
            $table->foreign('institution_id')->references('id')->on('institutions')->cascadeOnDelete();
        });

        Schema::create('exam_marks', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('institution_id')->index();
            $table->string('student_id')->nullable()->index();
            $table->string('course_id')->nullable()->index();
            $table->string('student_number')->nullable();
            $table->string('student_name');
            $table->string('course_label')->nullable();
            $table->decimal('assignment', 5, 2)->default(0);
            $table->decimal('midterm', 5, 2)->default(0);
            $table->decimal('final', 5, 2)->default(0);
            $table->decimal('total', 5, 2)->default(0);
            $table->string('grade', 8)->nullable();
            $table->boolean('published')->default(false);
            $table->timestamps();
            $table->foreign('institution_id')->references('id')->on('institutions')->cascadeOnDelete();
        });

        Schema::create('student_results', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('institution_id')->index();
            $table->string('student_id')->index();
            $table->string('semester_label');
            $table->decimal('gpa', 3, 2)->default(0);
            $table->decimal('cgpa', 3, 2)->default(0);
            $table->boolean('published')->default(true);
            $table->timestamps();
            $table->unique(['student_id', 'semester_label']);
            $table->foreign('institution_id')->references('id')->on('institutions')->cascadeOnDelete();
            $table->foreign('student_id')->references('id')->on('students')->cascadeOnDelete();
        });

        Schema::create('student_result_courses', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('result_id')->index();
            $table->string('code');
            $table->string('name');
            $table->unsignedTinyInteger('credits')->default(3);
            $table->decimal('marks', 5, 2)->default(0);
            $table->string('grade', 8)->nullable();
            $table->decimal('points', 3, 2)->default(0);
            $table->timestamps();
            $table->foreign('result_id')->references('id')->on('student_results')->cascadeOnDelete();
        });

        Schema::create('fee_invoices', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('institution_id')->index();
            $table->string('student_id')->nullable()->index();
            $table->string('student_name');
            $table->string('program_name')->nullable();
            $table->string('semester_label')->nullable();
            $table->unsignedBigInteger('total')->default(0);
            $table->unsignedBigInteger('paid')->default(0);
            $table->unsignedBigInteger('outstanding')->default(0);
            $table->enum('status', ['paid', 'partial', 'overdue', 'waived', 'unpaid'])->default('unpaid');
            $table->date('due_date')->nullable();
            $table->json('breakdown')->nullable();
            $table->timestamps();
            $table->index(['institution_id', 'status']);
            $table->foreign('institution_id')->references('id')->on('institutions')->cascadeOnDelete();
            $table->foreign('student_id')->references('id')->on('students')->nullOnDelete();
        });

        Schema::create('fee_payments', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('institution_id')->index();
            $table->string('invoice_id')->nullable()->index();
            $table->string('student_id')->nullable()->index();
            $table->string('student_name');
            $table->unsignedBigInteger('amount');
            $table->string('method', 64)->nullable();
            $table->date('paid_at')->nullable();
            $table->string('receipt')->nullable();
            $table->timestamps();
            $table->foreign('institution_id')->references('id')->on('institutions')->cascadeOnDelete();
            $table->foreign('invoice_id')->references('id')->on('fee_invoices')->nullOnDelete();
        });

        Schema::create('scholarships', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('institution_id')->index();
            $table->string('student_id')->nullable()->index();
            $table->string('student_name');
            $table->string('type');
            $table->unsignedBigInteger('amount')->default(0);
            $table->enum('status', ['under_review', 'approved', 'rejected', 'awarded'])->default('under_review');
            $table->string('semester_label')->nullable();
            $table->timestamps();
            $table->foreign('institution_id')->references('id')->on('institutions')->cascadeOnDelete();
        });

        Schema::create('workflows', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('institution_id')->index();
            $table->string('name');
            $table->string('trigger')->nullable();
            $table->string('form_label')->nullable();
            $table->text('description')->nullable();
            $table->enum('status', ['active', 'draft', 'archived'])->default('active');
            $table->string('sla_label')->nullable();
            $table->timestamps();
            $table->foreign('institution_id')->references('id')->on('institutions')->cascadeOnDelete();
        });

        Schema::create('workflow_steps', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('workflow_id')->index();
            $table->unsignedSmallInteger('step_order');
            $table->string('name');
            $table->string('role_label')->nullable();
            $table->string('sla_label')->nullable();
            $table->boolean('required')->default(true);
            $table->timestamps();
            $table->foreign('workflow_id')->references('id')->on('workflows')->cascadeOnDelete();
        });

        Schema::create('applications', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('institution_id')->index();
            $table->string('workflow_id')->nullable()->index();
            $table->string('applicant_name');
            $table->string('applicant_ref')->nullable();
            $table->string('student_id')->nullable()->index();
            $table->string('type', 64);
            $table->date('submitted_at')->nullable();
            $table->string('stage')->nullable();
            $table->string('assigned_to')->nullable();
            $table->string('sla_label')->nullable();
            $table->boolean('sla_breached')->default(false);
            $table->enum('status', ['pending', 'in_review', 'approved', 'rejected', 'changes_requested'])->default('pending');
            $table->json('form_data')->nullable();
            $table->timestamps();
            $table->index(['institution_id', 'status']);
            $table->foreign('institution_id')->references('id')->on('institutions')->cascadeOnDelete();
            $table->foreign('workflow_id')->references('id')->on('workflows')->nullOnDelete();
        });

        Schema::create('application_steps', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('application_id')->index();
            $table->unsignedSmallInteger('step_order');
            $table->string('name');
            $table->enum('status', ['pending', 'current', 'completed', 'skipped'])->default('pending');
            $table->string('acted_at_label')->nullable();
            $table->timestamps();
            $table->foreign('application_id')->references('id')->on('applications')->cascadeOnDelete();
        });

        Schema::create('notices', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('institution_id')->index();
            $table->string('title');
            $table->string('audience')->nullable();
            $table->text('body')->nullable();
            $table->date('published_at')->nullable();
            $table->date('expires_at')->nullable();
            $table->enum('status', ['draft', 'published', 'expired'])->default('draft');
            $table->string('created_by')->nullable();
            $table->timestamps();
            $table->foreign('institution_id')->references('id')->on('institutions')->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('notices');
        Schema::dropIfExists('application_steps');
        Schema::dropIfExists('applications');
        Schema::dropIfExists('workflow_steps');
        Schema::dropIfExists('workflows');
        Schema::dropIfExists('scholarships');
        Schema::dropIfExists('fee_payments');
        Schema::dropIfExists('fee_invoices');
        Schema::dropIfExists('student_result_courses');
        Schema::dropIfExists('student_results');
        Schema::dropIfExists('exam_marks');
        Schema::dropIfExists('exam_schedules');
        Schema::dropIfExists('leave_requests');
        Schema::dropIfExists('attendance_corrections');
        Schema::dropIfExists('attendance_records');
        Schema::dropIfExists('admission_offers');
        Schema::dropIfExists('admission_interviews');
        Schema::dropIfExists('merit_lists');
        Schema::dropIfExists('admission_applicants');
        Schema::dropIfExists('admission_cycles');
    }
};

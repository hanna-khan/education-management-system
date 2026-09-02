<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('permissions', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->string('label');
            $table->string('group')->nullable();
            $table->timestamps();
        });

        Schema::create('role_permissions', function (Blueprint $table) {
            $table->id();
            $table->string('role', 64)->index();
            $table->foreignId('permission_id')->constrained()->cascadeOnDelete();
            $table->unique(['role', 'permission_id']);
        });

        Schema::create('institution_modules', function (Blueprint $table) {
            $table->id();
            $table->string('institution_id')->index();
            $table->string('module_id', 64);
            $table->boolean('enabled')->default(true);
            $table->timestamps();

            $table->unique(['institution_id', 'module_id']);
            $table->foreign('institution_id')->references('id')->on('institutions')->cascadeOnDelete();
        });

        Schema::create('departments', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('institution_id')->index();
            $table->string('code', 32);
            $table->string('name');
            $table->string('head_name')->nullable();
            $table->enum('status', ['active', 'inactive'])->default('active');
            $table->timestamps();

            $table->unique(['institution_id', 'code']);
            $table->foreign('institution_id')->references('id')->on('institutions')->cascadeOnDelete();
        });

        Schema::create('programs', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('institution_id')->index();
            $table->string('department_id')->index();
            $table->string('code', 32);
            $table->string('name');
            $table->string('degree_level')->nullable();
            $table->unsignedTinyInteger('duration_semesters')->default(8);
            $table->enum('status', ['active', 'inactive'])->default('active');
            $table->timestamps();

            $table->unique(['institution_id', 'code']);
            $table->foreign('institution_id')->references('id')->on('institutions')->cascadeOnDelete();
            $table->foreign('department_id')->references('id')->on('departments')->cascadeOnDelete();
        });

        Schema::create('courses', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('institution_id')->index();
            $table->string('department_id')->nullable()->index();
            $table->string('program_id')->nullable()->index();
            $table->string('code', 32);
            $table->string('name');
            $table->unsignedTinyInteger('credit_hours')->default(3);
            $table->enum('status', ['active', 'inactive'])->default('active');
            $table->timestamps();

            $table->unique(['institution_id', 'code']);
            $table->foreign('institution_id')->references('id')->on('institutions')->cascadeOnDelete();
            $table->foreign('department_id')->references('id')->on('departments')->nullOnDelete();
            $table->foreign('program_id')->references('id')->on('programs')->nullOnDelete();
        });

        Schema::create('sections', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('institution_id')->index();
            $table->string('course_id')->index();
            $table->string('code', 16);
            $table->unsignedTinyInteger('semester')->nullable();
            $table->string('academic_year', 16)->nullable();
            $table->unsignedSmallInteger('capacity')->default(40);
            $table->enum('status', ['active', 'inactive'])->default('active');
            $table->timestamps();

            $table->unique(['institution_id', 'course_id', 'code', 'academic_year']);
            $table->foreign('institution_id')->references('id')->on('institutions')->cascadeOnDelete();
            $table->foreign('course_id')->references('id')->on('courses')->cascadeOnDelete();
        });

        Schema::create('teachers', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('institution_id')->index();
            $table->string('user_id')->nullable()->unique();
            $table->string('department_id')->nullable()->index();
            $table->string('employee_id', 64);
            $table->string('first_name');
            $table->string('last_name');
            $table->string('email');
            $table->string('phone')->nullable();
            $table->string('title')->nullable();
            $table->enum('status', ['active', 'inactive', 'on_leave'])->default('active');
            $table->date('joined_at')->nullable();
            $table->timestamps();

            $table->unique(['institution_id', 'employee_id']);
            $table->unique(['institution_id', 'email']);
            $table->foreign('institution_id')->references('id')->on('institutions')->cascadeOnDelete();
            $table->foreign('user_id')->references('id')->on('users')->nullOnDelete();
            $table->foreign('department_id')->references('id')->on('departments')->nullOnDelete();
        });

        Schema::create('students', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('institution_id')->index();
            $table->string('user_id')->nullable()->unique();
            $table->string('department_id')->nullable()->index();
            $table->string('program_id')->nullable()->index();
            $table->string('student_number', 64);
            $table->string('first_name');
            $table->string('last_name');
            $table->string('email');
            $table->string('phone')->nullable();
            $table->unsignedTinyInteger('semester')->default(1);
            $table->string('section', 16)->nullable();
            $table->enum('status', ['active', 'inactive', 'graduated', 'suspended', 'on_leave'])->default('active');
            $table->decimal('attendance_rate', 5, 2)->default(0);
            $table->enum('fee_status', ['paid', 'partial', 'overdue', 'waived'])->default('partial');
            $table->string('avatar_initials', 8)->nullable();
            $table->date('enrollment_date')->nullable();
            $table->decimal('cgpa', 3, 2)->default(0);
            $table->date('date_of_birth')->nullable();
            $table->string('gender', 32)->nullable();
            $table->string('cnic', 32)->nullable();
            $table->string('address')->nullable();
            $table->string('city')->nullable();
            $table->string('guardian_name')->nullable();
            $table->string('guardian_phone')->nullable();
            $table->string('guardian_relation')->nullable();
            $table->string('campus')->nullable();
            $table->timestamps();

            $table->unique(['institution_id', 'student_number']);
            $table->unique(['institution_id', 'email']);
            $table->index(['institution_id', 'status']);
            $table->index(['institution_id', 'fee_status']);
            $table->foreign('institution_id')->references('id')->on('institutions')->cascadeOnDelete();
            $table->foreign('user_id')->references('id')->on('users')->nullOnDelete();
            $table->foreign('department_id')->references('id')->on('departments')->nullOnDelete();
            $table->foreign('program_id')->references('id')->on('programs')->nullOnDelete();
        });

        Schema::create('parent_student', function (Blueprint $table) {
            $table->id();
            $table->string('institution_id')->index();
            $table->string('parent_user_id')->index();
            $table->string('student_id')->index();
            $table->string('relation', 64)->nullable();
            $table->boolean('is_primary')->default(true);
            $table->timestamps();

            $table->unique(['parent_user_id', 'student_id']);
            $table->foreign('institution_id')->references('id')->on('institutions')->cascadeOnDelete();
            $table->foreign('parent_user_id')->references('id')->on('users')->cascadeOnDelete();
            $table->foreign('student_id')->references('id')->on('students')->cascadeOnDelete();
        });

        Schema::create('section_teacher', function (Blueprint $table) {
            $table->id();
            $table->string('section_id')->index();
            $table->string('teacher_id')->index();
            $table->boolean('is_primary')->default(true);
            $table->timestamps();

            $table->unique(['section_id', 'teacher_id']);
            $table->foreign('section_id')->references('id')->on('sections')->cascadeOnDelete();
            $table->foreign('teacher_id')->references('id')->on('teachers')->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('section_teacher');
        Schema::dropIfExists('parent_student');
        Schema::dropIfExists('students');
        Schema::dropIfExists('teachers');
        Schema::dropIfExists('sections');
        Schema::dropIfExists('courses');
        Schema::dropIfExists('programs');
        Schema::dropIfExists('departments');
        Schema::dropIfExists('institution_modules');
        Schema::dropIfExists('role_permissions');
        Schema::dropIfExists('permissions');
    }
};

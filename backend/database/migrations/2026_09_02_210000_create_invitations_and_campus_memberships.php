<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('invitations', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('institution_id');
            $table->string('invited_by')->nullable();
            $table->string('email');
            $table->string('name')->nullable();
            $table->string('role');
            $table->json('campus_ids')->nullable();
            $table->string('token', 64)->unique();
            $table->string('status')->default('pending'); // pending, accepted, revoked, expired
            $table->timestamp('expires_at');
            $table->timestamp('accepted_at')->nullable();
            $table->string('accepted_user_id')->nullable();
            $table->timestamps();

            $table->foreign('institution_id')->references('id')->on('institutions')->cascadeOnDelete();
            $table->foreign('invited_by')->references('id')->on('users')->nullOnDelete();
            $table->index(['institution_id', 'email']);
            $table->index(['institution_id', 'status']);
        });

        Schema::create('campus_memberships', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('institution_id');
            $table->string('campus_id');
            $table->string('user_id');
            $table->string('role'); // principal, vice_principal, teacher
            $table->timestamps();

            $table->foreign('institution_id')->references('id')->on('institutions')->cascadeOnDelete();
            $table->foreign('campus_id')->references('id')->on('campuses')->cascadeOnDelete();
            $table->foreign('user_id')->references('id')->on('users')->cascadeOnDelete();
            $table->unique(['campus_id', 'user_id']);
            $table->index(['institution_id', 'role']);
        });

        Schema::create('teacher_campus', function (Blueprint $table) {
            $table->id();
            $table->string('teacher_id');
            $table->string('campus_id');
            $table->boolean('is_primary')->default(false);
            $table->timestamps();

            $table->foreign('teacher_id')->references('id')->on('teachers')->cascadeOnDelete();
            $table->foreign('campus_id')->references('id')->on('campuses')->cascadeOnDelete();
            $table->unique(['teacher_id', 'campus_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('teacher_campus');
        Schema::dropIfExists('campus_memberships');
        Schema::dropIfExists('invitations');
    }
};

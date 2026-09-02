<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('data_imports', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('institution_id');
            $table->string('uploaded_by')->nullable();
            $table->string('type'); // students | teachers
            $table->string('original_filename');
            $table->string('stored_path');
            $table->string('status')->default('uploaded'); // uploaded, validating, validated, importing, completed, failed
            $table->unsignedInteger('total_rows')->default(0);
            $table->unsignedInteger('valid_rows')->default(0);
            $table->unsignedInteger('error_rows')->default(0);
            $table->unsignedInteger('imported_rows')->default(0);
            $table->unsignedInteger('skipped_rows')->default(0);
            $table->unsignedInteger('processed_rows')->default(0);
            $table->json('column_map')->nullable();
            $table->json('preview')->nullable();
            $table->json('summary')->nullable();
            $table->string('error_report_path')->nullable();
            $table->text('failure_reason')->nullable();
            $table->timestamp('validated_at')->nullable();
            $table->timestamp('started_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();

            $table->foreign('institution_id')->references('id')->on('institutions')->cascadeOnDelete();
            $table->foreign('uploaded_by')->references('id')->on('users')->nullOnDelete();
            $table->index(['institution_id', 'type', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('data_imports');
    }
};

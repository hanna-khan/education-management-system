<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('plans', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('name');
            $table->string('code')->unique();
            $table->enum('audience', ['school', 'university', 'both'])->default('both');
            $table->text('description')->nullable();
            $table->unsignedInteger('price_monthly')->default(0);
            $table->unsignedInteger('price_yearly')->default(0);
            $table->string('currency', 8)->default('PKR');
            $table->unsignedInteger('max_students')->nullable();
            $table->unsignedInteger('max_staff')->nullable();
            $table->unsignedInteger('max_campuses')->default(1);
            $table->unsignedTinyInteger('trial_days')->default(14);
            $table->json('features')->nullable();
            $table->json('modules')->nullable();
            $table->boolean('is_active')->default(true);
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('subscriptions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('institution_id')->unique();
            $table->string('plan_id')->index();
            $table->enum('status', ['trialing', 'active', 'past_due', 'cancelled', 'expired'])->default('trialing');
            $table->enum('billing_cycle', ['monthly', 'yearly'])->default('monthly');
            $table->timestamp('starts_at')->nullable();
            $table->timestamp('ends_at')->nullable();
            $table->timestamp('trial_ends_at')->nullable();
            $table->timestamp('cancelled_at')->nullable();
            $table->timestamps();
            $table->foreign('institution_id')->references('id')->on('institutions')->cascadeOnDelete();
            $table->foreign('plan_id')->references('id')->on('plans')->restrictOnDelete();
        });

        Schema::create('campuses', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('institution_id')->index();
            $table->string('name');
            $table->string('code', 32)->nullable();
            $table->string('address')->nullable();
            $table->string('city')->nullable();
            $table->string('phone')->nullable();
            $table->boolean('is_primary')->default(false);
            $table->enum('status', ['active', 'inactive'])->default('active');
            $table->timestamps();
            $table->unique(['institution_id', 'name']);
            $table->foreign('institution_id')->references('id')->on('institutions')->cascadeOnDelete();
        });

        Schema::table('institutions', function (Blueprint $table) {
            $table->timestamp('onboarding_completed_at')->nullable()->after('demo_note');
            $table->string('contact_email')->nullable()->after('city');
            $table->string('contact_phone')->nullable()->after('contact_email');
            $table->unsignedTinyInteger('onboarding_step')->default(0)->after('onboarding_completed_at');
        });
    }

    public function down(): void
    {
        Schema::table('institutions', function (Blueprint $table) {
            $table->dropColumn(['onboarding_completed_at', 'contact_email', 'contact_phone', 'onboarding_step']);
        });
        Schema::dropIfExists('campuses');
        Schema::dropIfExists('subscriptions');
        Schema::dropIfExists('plans');
    }
};

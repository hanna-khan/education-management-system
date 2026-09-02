<?php

namespace Database\Seeders;

use App\Models\Campus;
use App\Models\Institution;
use App\Models\Plan;
use App\Models\Subscription;
use Illuminate\Database\Seeder;

class PlansAndTenancySeeder extends Seeder
{
    public function run(): void
    {
        $plans = [
            [
                'id' => 'plan-starter',
                'name' => 'Starter',
                'code' => 'starter',
                'audience' => 'both',
                'description' => 'For small schools getting started with core academics and fees.',
                'price_monthly' => 15000,
                'price_yearly' => 150000,
                'max_students' => 1000,
                'max_staff' => 80,
                'max_campuses' => 1,
                'trial_days' => 14,
                'sort_order' => 1,
                'features' => ['Students & teachers', 'Attendance', 'Exams', 'Fees', '1 campus'],
                'modules' => [
                    'hostel' => false,
                    'career' => false,
                    'alumni' => false,
                    'quality' => false,
                    'accreditation' => false,
                    'inventory' => false,
                    'assets' => false,
                    'procurement' => false,
                    'ai' => false,
                    'emergency' => false,
                    'visitors' => false,
                    'degree_planning' => false,
                    'advising' => false,
                ],
            ],
            [
                'id' => 'plan-growth',
                'name' => 'Growth',
                'code' => 'growth',
                'audience' => 'both',
                'description' => 'Multi-campus operations with campus life modules.',
                'price_monthly' => 45000,
                'price_yearly' => 450000,
                'max_students' => 10000,
                'max_staff' => 500,
                'max_campuses' => 5,
                'trial_days' => 14,
                'sort_order' => 2,
                'features' => ['Everything in Starter', 'Library & transport', 'Hostel (university)', 'Up to 5 campuses', 'Workflows'],
                'modules' => [],
            ],
            [
                'id' => 'plan-enterprise',
                'name' => 'Enterprise',
                'code' => 'enterprise',
                'audience' => 'university',
                'description' => 'Full university suite with quality, accreditation, and high limits.',
                'price_monthly' => 120000,
                'price_yearly' => 1200000,
                'max_students' => 100000,
                'max_staff' => 5000,
                'max_campuses' => 50,
                'trial_days' => 30,
                'sort_order' => 3,
                'features' => ['Everything in Growth', 'Quality & accreditation', 'Unlimited-scale quotas', 'Priority support'],
                'modules' => [],
            ],
            [
                'id' => 'plan-school-plus',
                'name' => 'School Plus',
                'code' => 'school_plus',
                'audience' => 'school',
                'description' => 'School-focused pack with parent portal and transport.',
                'price_monthly' => 25000,
                'price_yearly' => 250000,
                'max_students' => 5000,
                'max_staff' => 250,
                'max_campuses' => 3,
                'trial_days' => 14,
                'sort_order' => 2,
                'features' => ['Parent portal', 'Transport', 'Discipline & health', 'Up to 3 campuses'],
                'modules' => [
                    'hostel' => false,
                    'degree_planning' => false,
                    'advising' => false,
                    'career' => false,
                    'alumni' => false,
                ],
            ],
        ];

        foreach ($plans as $plan) {
            Plan::updateOrCreate(['id' => $plan['id']], $plan + [
                'currency' => 'PKR',
                'is_active' => true,
            ]);
        }

        $this->attachDemoSubscriptions();
    }

    private function attachDemoSubscriptions(): void
    {
        $map = [
            'inst-ned-demo' => 'plan-enterprise',
            'inst-kec' => 'plan-growth',
            'inst-crescent' => 'plan-school-plus',
        ];

        foreach ($map as $institutionId => $planId) {
            if (! Institution::find($institutionId)) {
                continue;
            }

            Subscription::updateOrCreate(
                ['institution_id' => $institutionId],
                [
                    'id' => 'sub-'.$institutionId,
                    'plan_id' => $planId,
                    'status' => $institutionId === 'inst-ned-demo' ? 'trialing' : 'active',
                    'billing_cycle' => 'yearly',
                    'starts_at' => now()->subMonth(),
                    'trial_ends_at' => $institutionId === 'inst-ned-demo' ? now()->addDays(20) : null,
                    'ends_at' => now()->addYear(),
                ]
            );

            Campus::updateOrCreate(
                ['id' => 'camp-'.$institutionId.'-main'],
                [
                    'institution_id' => $institutionId,
                    'name' => 'Main Campus',
                    'code' => 'MAIN',
                    'city' => Institution::find($institutionId)?->city,
                    'is_primary' => true,
                    'status' => 'active',
                    'address' => 'Primary campus',
                ]
            );

            if ($institutionId === 'inst-ned-demo') {
                Campus::updateOrCreate(
                    ['id' => 'camp-ned-city'],
                    [
                        'institution_id' => $institutionId,
                        'name' => 'City Campus',
                        'code' => 'CITY',
                        'city' => 'Karachi',
                        'is_primary' => false,
                        'status' => 'active',
                        'address' => 'City Campus Road',
                    ]
                );
            }

            Institution::where('id', $institutionId)->update([
                'onboarding_completed_at' => now()->subDays(30),
                'onboarding_step' => 8,
                'contact_email' => match ($institutionId) {
                    'inst-ned-demo' => 'ayesha.malik@neddemo.edu.pk',
                    'inst-kec' => 'admin@kec.edu.pk',
                    default => 'admin@crescent.edu.pk',
                },
            ]);
        }
    }
}

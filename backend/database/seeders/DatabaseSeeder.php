<?php

namespace Database\Seeders;

use App\Models\Course;
use App\Models\Department;
use App\Models\Institution;
use App\Models\InstitutionModule;
use App\Models\Permission;
use App\Models\Program;
use App\Models\Section;
use App\Models\Student;
use App\Models\Teacher;
use App\Models\User;
use App\Support\ModuleCatalog;
use App\Support\Roles;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->seedPermissions();
        $this->seedInstitutions();
        $this->seedUsers();
        $this->seedAcademics();
        $this->seedPeople();
        $this->call(Phase2Seeder::class);
        $this->call(PlansAndTenancySeeder::class);
    }

    private function seedPermissions(): void
    {
        $permissions = [
            ['name' => 'students.view', 'label' => 'View students', 'group' => 'students'],
            ['name' => 'students.manage', 'label' => 'Manage students', 'group' => 'students'],
            ['name' => 'teachers.view', 'label' => 'View teachers', 'group' => 'teachers'],
            ['name' => 'teachers.manage', 'label' => 'Manage teachers', 'group' => 'teachers'],
            ['name' => 'academics.view', 'label' => 'View academics', 'group' => 'academics'],
            ['name' => 'academics.manage', 'label' => 'Manage academics', 'group' => 'academics'],
            ['name' => 'modules.manage', 'label' => 'Manage modules', 'group' => 'settings'],
            ['name' => 'platform.institutions', 'label' => 'Manage institutions', 'group' => 'platform'],
        ];

        foreach ($permissions as $permission) {
            Permission::updateOrCreate(['name' => $permission['name']], $permission);
        }

        $roleMap = [
            Roles::PLATFORM_ADMIN => Permission::pluck('id')->all(),
            Roles::INSTITUTION_ADMIN => Permission::where('group', '!=', 'platform')->pluck('id')->all(),
            Roles::PRINCIPAL => Permission::whereIn('name', [
                'students.view', 'students.manage', 'teachers.view', 'teachers.manage', 'academics.view', 'academics.manage', 'modules.manage',
            ])->pluck('id')->all(),
            Roles::REGISTRAR => Permission::whereIn('name', [
                'students.view', 'students.manage', 'teachers.view', 'academics.view', 'academics.manage',
            ])->pluck('id')->all(),
            Roles::TEACHER => Permission::whereIn('name', ['students.view', 'academics.view'])->pluck('id')->all(),
            Roles::STUDENT => [],
            Roles::PARENT => [],
        ];

        foreach ($roleMap as $role => $permissionIds) {
            foreach ($permissionIds as $permissionId) {
                DB::table('role_permissions')->updateOrInsert(
                    ['role' => $role, 'permission_id' => $permissionId],
                    []
                );
            }
        }
    }

    private function seedInstitutions(): void
    {
        $institutions = [
            [
                'id' => 'inst-ned-demo',
                'name' => 'NED Demo University',
                'short_name' => 'NED Demo',
                'slug' => 'ned-demo',
                'type' => 'university',
                'status' => 'trial',
                'logo_initials' => 'ND',
                'primary_color' => '#6B58F6',
                'secondary_color' => '#8C4AF2',
                'city' => 'Karachi',
                'student_count' => 8426,
                'staff_count' => 386,
                'demo_note' => 'Full university pack — forms, convocation, transport tokens, hostel.',
                'overrides' => [],
            ],
            [
                'id' => 'inst-kec',
                'name' => 'Karachi Education College',
                'short_name' => 'KEC',
                'slug' => 'kec',
                'type' => 'university',
                'status' => 'active',
                'logo_initials' => 'KE',
                'primary_color' => '#3B82F6',
                'secondary_color' => '#1BD0B4',
                'city' => 'Karachi',
                'student_count' => 4210,
                'staff_count' => 198,
                'demo_note' => 'University without hostel or alumni modules.',
                'overrides' => ['alumni' => false, 'hostel' => false],
            ],
            [
                'id' => 'inst-crescent',
                'name' => 'Crescent Demo School',
                'short_name' => 'Crescent',
                'slug' => 'crescent',
                'type' => 'school',
                'status' => 'active',
                'logo_initials' => 'CS',
                'primary_color' => '#1BD0B4',
                'secondary_color' => '#10B981',
                'city' => 'Lahore',
                'student_count' => 1840,
                'staff_count' => 112,
                'demo_note' => 'School pack — Principal labels; no hostel/career; maintenance off.',
                'overrides' => [
                    'library' => true,
                    'transport' => true,
                    'maintenance' => false,
                    'inventory' => false,
                    'assets' => false,
                    'procurement' => false,
                    'facilities' => false,
                    'it_helpdesk' => true,
                ],
            ],
        ];

        foreach ($institutions as $row) {
            $overrides = $row['overrides'];
            unset($row['overrides']);
            $institution = Institution::updateOrCreate(['id' => $row['id']], $row + ['country' => 'Pakistan']);

            $defaults = ModuleCatalog::defaultsForType($institution->type);
            foreach ($defaults as $moduleId => $enabled) {
                if (array_key_exists($moduleId, $overrides)) {
                    $enabled = $overrides[$moduleId];
                }
                InstitutionModule::updateOrCreate(
                    ['institution_id' => $institution->id, 'module_id' => $moduleId],
                    ['enabled' => $enabled],
                );
            }
        }
    }

    private function seedUsers(): void
    {
        $password = Hash::make('password');

        $users = [
            [
                'id' => 'user-platform',
                'institution_id' => null,
                'name' => 'Usman Ali',
                'email' => 'usman@zendrock.io',
                'role' => Roles::PLATFORM_ADMIN,
                'title' => 'Platform Administrator',
                'department' => null,
            ],
            [
                'id' => 'user-admin',
                'institution_id' => 'inst-ned-demo',
                'name' => 'Ayesha Malik',
                'email' => 'ayesha.malik@neddemo.edu.pk',
                'role' => Roles::INSTITUTION_ADMIN,
                'title' => 'Institution Administrator',
                'department' => 'Administration',
            ],
            [
                'id' => 'user-principal',
                'institution_id' => 'inst-ned-demo',
                'name' => 'Dr. Hassan Raza',
                'email' => 'hassan.raza@neddemo.edu.pk',
                'role' => Roles::PRINCIPAL,
                'title' => 'Vice Chancellor',
                'department' => 'Administration',
            ],
            [
                'id' => 'user-registrar',
                'institution_id' => 'inst-ned-demo',
                'name' => 'Prof. Nadia Sheikh',
                'email' => 'nadia.sheikh@neddemo.edu.pk',
                'role' => Roles::REGISTRAR,
                'title' => 'Registrar',
                'department' => 'Registrar Office',
            ],
            [
                'id' => 'user-teacher',
                'institution_id' => 'inst-ned-demo',
                'name' => 'Sana Iqbal',
                'email' => 'sana.iqbal@neddemo.edu.pk',
                'role' => Roles::TEACHER,
                'title' => 'Assistant Professor · Class Advisor',
                'department' => 'Computer Science',
            ],
            [
                'id' => 'user-student',
                'institution_id' => 'inst-ned-demo',
                'name' => 'Ahmed Khan',
                'email' => 'ahmed.khan@student.neddemo.edu.pk',
                'role' => Roles::STUDENT,
                'title' => 'BS Computer Science — Semester 6',
                'department' => 'Computer Science',
            ],
            [
                'id' => 'user-parent',
                'institution_id' => 'inst-crescent',
                'name' => 'Sara Ahmed',
                'email' => 'sara.ahmed@gmail.com',
                'role' => Roles::PARENT,
                'title' => 'Parent',
                'department' => null,
            ],
        ];

        foreach ($users as $user) {
            User::updateOrCreate(
                ['id' => $user['id']],
                $user + [
                    'password' => $password,
                    'status' => 'active',
                    'email_verified_at' => now(),
                ]
            );
        }
    }

    private function seedAcademics(): void
    {
        $cs = Department::updateOrCreate(
            ['id' => 'dept-cs'],
            [
                'institution_id' => 'inst-ned-demo',
                'code' => 'CS',
                'name' => 'Computer Science',
                'head_name' => 'Dr. Imran Qureshi',
                'status' => 'active',
            ]
        );

        $ee = Department::updateOrCreate(
            ['id' => 'dept-ee'],
            [
                'institution_id' => 'inst-ned-demo',
                'code' => 'EE',
                'name' => 'Electrical Engineering',
                'head_name' => 'Dr. Farah Nadeem',
                'status' => 'active',
            ]
        );

        $bscs = Program::updateOrCreate(
            ['id' => 'prog-bscs'],
            [
                'institution_id' => 'inst-ned-demo',
                'department_id' => $cs->id,
                'code' => 'BSCS',
                'name' => 'BS Computer Science',
                'degree_level' => 'undergraduate',
                'duration_semesters' => 8,
                'status' => 'active',
            ]
        );

        Program::updateOrCreate(
            ['id' => 'prog-bsse'],
            [
                'institution_id' => 'inst-ned-demo',
                'department_id' => $cs->id,
                'code' => 'BSSE',
                'name' => 'BS Software Engineering',
                'degree_level' => 'undergraduate',
                'duration_semesters' => 8,
                'status' => 'active',
            ]
        );

        Program::updateOrCreate(
            ['id' => 'prog-bsee'],
            [
                'institution_id' => 'inst-ned-demo',
                'department_id' => $ee->id,
                'code' => 'BSEE',
                'name' => 'BS Electrical Engineering',
                'degree_level' => 'undergraduate',
                'duration_semesters' => 8,
                'status' => 'active',
            ]
        );

        $course = Course::updateOrCreate(
            ['id' => 'course-cs301'],
            [
                'institution_id' => 'inst-ned-demo',
                'department_id' => $cs->id,
                'program_id' => $bscs->id,
                'code' => 'CS-301',
                'name' => 'Database Systems',
                'credit_hours' => 3,
                'status' => 'active',
            ]
        );

        Section::updateOrCreate(
            ['id' => 'sec-cs301-a'],
            [
                'institution_id' => 'inst-ned-demo',
                'course_id' => $course->id,
                'code' => 'A',
                'semester' => 6,
                'academic_year' => '2025-26',
                'capacity' => 45,
                'status' => 'active',
            ]
        );
    }

    private function seedPeople(): void
    {
        Teacher::updateOrCreate(
            ['id' => 'tch-sana'],
            [
                'institution_id' => 'inst-ned-demo',
                'user_id' => 'user-teacher',
                'department_id' => 'dept-cs',
                'employee_id' => 'EMP-1001',
                'first_name' => 'Sana',
                'last_name' => 'Iqbal',
                'email' => 'sana.iqbal@neddemo.edu.pk',
                'phone' => '+92 300 1112233',
                'title' => 'Assistant Professor',
                'status' => 'active',
                'joined_at' => '2019-08-15',
            ]
        );

        $students = [
            [
                'id' => 'stu-2024-1024',
                'student_number' => 'STU-2024-1024',
                'user_id' => 'user-student',
                'first_name' => 'Ahmed',
                'last_name' => 'Khan',
                'email' => 'ahmed.khan@student.neddemo.edu.pk',
                'phone' => '+92 300 1234567',
                'department_id' => 'dept-cs',
                'program_id' => 'prog-bscs',
                'semester' => 6,
                'section' => 'A',
                'status' => 'active',
                'attendance_rate' => 94.2,
                'fee_status' => 'paid',
                'avatar_initials' => 'AK',
                'enrollment_date' => '2022-09-01',
                'cgpa' => 3.42,
                'date_of_birth' => '2004-03-15',
                'gender' => 'Male',
                'cnic' => '42101-1234567-1',
                'address' => 'House 42, Block 7, Gulshan-e-Iqbal',
                'city' => 'Karachi',
                'guardian_name' => 'Sara Ahmed',
                'guardian_phone' => '+92 321 9876543',
                'guardian_relation' => 'Mother',
                'campus' => 'Main Campus',
            ],
            [
                'id' => 'stu-2024-0891',
                'student_number' => 'STU-2024-0891',
                'user_id' => null,
                'first_name' => 'Fatima',
                'last_name' => 'Sheikh',
                'email' => 'fatima.sheikh@student.neddemo.edu.pk',
                'phone' => '+92 301 2345678',
                'department_id' => 'dept-cs',
                'program_id' => 'prog-bsse',
                'semester' => 4,
                'section' => 'B',
                'status' => 'active',
                'attendance_rate' => 91.8,
                'fee_status' => 'partial',
                'avatar_initials' => 'FS',
                'enrollment_date' => '2023-09-01',
                'cgpa' => 3.68,
                'date_of_birth' => '2005-07-22',
                'gender' => 'Female',
                'cnic' => '42101-2345678-2',
                'address' => 'Flat 12, PECHS Block 2',
                'city' => 'Karachi',
                'guardian_name' => 'Imran Sheikh',
                'guardian_phone' => '+92 333 4567890',
                'guardian_relation' => 'Father',
                'campus' => 'Main Campus',
            ],
            [
                'id' => 'stu-2023-0456',
                'student_number' => 'STU-2023-0456',
                'user_id' => null,
                'first_name' => 'Hassan',
                'last_name' => 'Raza',
                'email' => 'hassan.raza@student.neddemo.edu.pk',
                'phone' => '+92 302 3456789',
                'department_id' => 'dept-ee',
                'program_id' => 'prog-bsee',
                'semester' => 8,
                'section' => 'A',
                'status' => 'active',
                'attendance_rate' => 88.5,
                'fee_status' => 'overdue',
                'avatar_initials' => 'HR',
                'enrollment_date' => '2021-09-01',
                'cgpa' => 3.15,
                'date_of_birth' => '2003-01-10',
                'gender' => 'Male',
                'cnic' => '42101-3456789-3',
                'address' => 'Street 5, North Nazimabad',
                'city' => 'Karachi',
                'guardian_name' => 'Nadia Raza',
                'guardian_phone' => '+92 345 1122334',
                'guardian_relation' => 'Mother',
                'campus' => 'Main Campus',
            ],
        ];

        foreach ($students as $student) {
            Student::updateOrCreate(
                ['id' => $student['id']],
                $student + ['institution_id' => 'inst-ned-demo']
            );
        }

        // Extra sample rows for list/pagination feel
        for ($i = 1; $i <= 12; $i++) {
            Student::updateOrCreate(
                ['id' => 'stu-demo-'.str_pad((string) $i, 3, '0', STR_PAD_LEFT)],
                [
                    'institution_id' => 'inst-ned-demo',
                    'student_number' => 'STU-DEMO-'.str_pad((string) $i, 3, '0', STR_PAD_LEFT),
                    'first_name' => 'Student',
                    'last_name' => 'Demo'.$i,
                    'email' => "demo{$i}@student.neddemo.edu.pk",
                    'phone' => '+92 300 500'.str_pad((string) $i, 4, '0', STR_PAD_LEFT),
                    'department_id' => $i % 2 === 0 ? 'dept-ee' : 'dept-cs',
                    'program_id' => $i % 2 === 0 ? 'prog-bsee' : 'prog-bscs',
                    'semester' => (($i - 1) % 8) + 1,
                    'section' => $i % 2 === 0 ? 'B' : 'A',
                    'status' => 'active',
                    'attendance_rate' => 80 + ($i % 15),
                    'fee_status' => ['paid', 'partial', 'overdue'][$i % 3],
                    'avatar_initials' => 'SD',
                    'enrollment_date' => '2024-09-01',
                    'cgpa' => round(2.5 + ($i * 0.1), 2),
                    'city' => 'Karachi',
                    'campus' => 'Main Campus',
                ]
            );
        }

        DB::table('parent_student')->updateOrInsert(
            [
                'parent_user_id' => 'user-parent',
                'student_id' => 'stu-2024-1024',
            ],
            [
                'institution_id' => 'inst-ned-demo',
                'relation' => 'Mother',
                'is_primary' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );

        DB::table('section_teacher')->updateOrInsert(
            [
                'section_id' => 'sec-cs301-a',
                'teacher_id' => 'tch-sana',
            ],
            [
                'is_primary' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );
    }
}

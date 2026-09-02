<?php

namespace App\Support;

final class ModuleCatalog
{
    /**
     * Mirrors frontend MODULE_CATALOG ids.
     *
     * @return list<array{id: string, name: string, category: string, university: bool, school: bool, default_enabled: bool}>
     */
    public static function all(): array
    {
        return [
            ['id' => 'admissions', 'name' => 'Admissions', 'category' => 'Core', 'university' => true, 'school' => true, 'default_enabled' => true],
            ['id' => 'academics', 'name' => 'Academics', 'category' => 'Core', 'university' => true, 'school' => true, 'default_enabled' => true],
            ['id' => 'attendance', 'name' => 'Attendance', 'category' => 'Core', 'university' => true, 'school' => true, 'default_enabled' => true],
            ['id' => 'exams', 'name' => 'Exams & Results', 'category' => 'Core', 'university' => true, 'school' => true, 'default_enabled' => true],
            ['id' => 'fees', 'name' => 'Fees & Finance', 'category' => 'Core', 'university' => true, 'school' => true, 'default_enabled' => true],
            ['id' => 'library', 'name' => 'Library', 'category' => 'Campus', 'university' => true, 'school' => true, 'default_enabled' => true],
            ['id' => 'lms', 'name' => 'LMS / Learning', 'category' => 'Academic', 'university' => true, 'school' => true, 'default_enabled' => true],
            ['id' => 'assignments', 'name' => 'Assignments / Homework', 'category' => 'Academic', 'university' => true, 'school' => true, 'default_enabled' => true],
            ['id' => 'degree_planning', 'name' => 'Degree Planning', 'category' => 'Academic', 'university' => true, 'school' => false, 'default_enabled' => true],
            ['id' => 'advising', 'name' => 'Student Advising', 'category' => 'Academic', 'university' => true, 'school' => false, 'default_enabled' => true],
            ['id' => 'student_services', 'name' => 'One-Window Services', 'category' => 'Campus', 'university' => true, 'school' => true, 'default_enabled' => true],
            ['id' => 'certificates', 'name' => 'Documents & Certificates', 'category' => 'Campus', 'university' => true, 'school' => true, 'default_enabled' => true],
            ['id' => 'forms', 'name' => 'Digital Forms & Applications', 'category' => 'Campus', 'university' => true, 'school' => true, 'default_enabled' => true],
            ['id' => 'hostel', 'name' => 'Hostel', 'category' => 'Campus', 'university' => true, 'school' => false, 'default_enabled' => true],
            ['id' => 'transport', 'name' => 'Transport', 'category' => 'Campus', 'university' => true, 'school' => true, 'default_enabled' => true],
            ['id' => 'health', 'name' => 'Health / Clinic', 'category' => 'Campus', 'university' => true, 'school' => true, 'default_enabled' => true],
            ['id' => 'discipline', 'name' => 'Discipline', 'category' => 'Campus', 'university' => true, 'school' => true, 'default_enabled' => true],
            ['id' => 'career', 'name' => 'Career & Internship', 'category' => 'Engagement', 'university' => true, 'school' => false, 'default_enabled' => true],
            ['id' => 'alumni', 'name' => 'Alumni', 'category' => 'Engagement', 'university' => true, 'school' => false, 'default_enabled' => true],
            ['id' => 'clubs', 'name' => 'Clubs / Societies', 'category' => 'Engagement', 'university' => true, 'school' => true, 'default_enabled' => true],
            ['id' => 'facilities', 'name' => 'Facility Management', 'category' => 'Operations', 'university' => true, 'school' => true, 'default_enabled' => true],
            ['id' => 'maintenance', 'name' => 'Maintenance', 'category' => 'Operations', 'university' => true, 'school' => true, 'default_enabled' => true],
            ['id' => 'it_helpdesk', 'name' => 'IT Helpdesk', 'category' => 'Operations', 'university' => true, 'school' => true, 'default_enabled' => true],
            ['id' => 'surveys', 'name' => 'Survey Builder', 'category' => 'Engagement', 'university' => true, 'school' => true, 'default_enabled' => true],
            ['id' => 'quality', 'name' => 'Quality Assurance', 'category' => 'Enterprise', 'university' => true, 'school' => false, 'default_enabled' => true],
            ['id' => 'accreditation', 'name' => 'Accreditation', 'category' => 'Enterprise', 'university' => true, 'school' => false, 'default_enabled' => true],
            ['id' => 'inventory', 'name' => 'Inventory', 'category' => 'Enterprise', 'university' => true, 'school' => true, 'default_enabled' => true],
            ['id' => 'assets', 'name' => 'Asset Management', 'category' => 'Enterprise', 'university' => true, 'school' => true, 'default_enabled' => true],
            ['id' => 'procurement', 'name' => 'Procurement', 'category' => 'Enterprise', 'university' => true, 'school' => true, 'default_enabled' => true],
            ['id' => 'emergency', 'name' => 'Emergency & Safety', 'category' => 'Enterprise', 'university' => true, 'school' => true, 'default_enabled' => true],
            ['id' => 'visitors', 'name' => 'Visitor Management', 'category' => 'Enterprise', 'university' => true, 'school' => true, 'default_enabled' => true],
            ['id' => 'ai', 'name' => 'Zendrock AI', 'category' => 'Enterprise', 'university' => true, 'school' => true, 'default_enabled' => true],
        ];
    }

    /**
     * @return array<string, bool>
     */
    public static function defaultsForType(string $type): array
    {
        $map = [];
        foreach (self::all() as $module) {
            $available = $type === 'school' ? $module['school'] : $module['university'];
            $map[$module['id']] = $available && $module['default_enabled'];
        }

        return $map;
    }
}

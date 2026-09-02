<?php

namespace App\Support;

final class Roles
{
    public const PLATFORM_ADMIN = 'platform_admin';

    public const SUPER_ADMIN = 'super_admin';

    public const INSTITUTION_ADMIN = 'institution_admin';

    public const PRINCIPAL = 'principal';

    public const VICE_PRINCIPAL = 'vice_principal';

    public const DEAN = 'dean';

    public const HOD = 'hod';

    public const TEACHER = 'teacher';

    public const STUDENT = 'student';

    public const PARENT = 'parent';

    public const ACCOUNTANT = 'accountant';

    public const HR = 'hr';

    public const EXAM_OFFICER = 'exam_officer';

    public const ADMISSION_OFFICER = 'admission_officer';

    public const LIBRARIAN = 'librarian';

    public const CAMPUS_ADMIN = 'campus_admin';

    public const REGISTRAR = 'registrar';

    public const COUNSELOR = 'counselor';

    public const CAREER_OFFICER = 'career_officer';

    public const ALUMNI_OFFICER = 'alumni_officer';

    public const SECURITY = 'security';

    public const QEC_OFFICER = 'qec_officer';

    public const TRANSPORT_MANAGER = 'transport_manager';

    public const HOSTEL_MANAGER = 'hostel_manager';

    public const IT_SUPPORT = 'it_support';

    public const FACILITY_MANAGER = 'facility_manager';

    /** @return list<string> */
    public static function all(): array
    {
        return [
            self::PLATFORM_ADMIN,
            self::SUPER_ADMIN,
            self::INSTITUTION_ADMIN,
            self::PRINCIPAL,
            self::VICE_PRINCIPAL,
            self::DEAN,
            self::HOD,
            self::TEACHER,
            self::STUDENT,
            self::PARENT,
            self::ACCOUNTANT,
            self::HR,
            self::EXAM_OFFICER,
            self::ADMISSION_OFFICER,
            self::LIBRARIAN,
            self::CAMPUS_ADMIN,
            self::REGISTRAR,
            self::COUNSELOR,
            self::CAREER_OFFICER,
            self::ALUMNI_OFFICER,
            self::SECURITY,
            self::QEC_OFFICER,
            self::TRANSPORT_MANAGER,
            self::HOSTEL_MANAGER,
            self::IT_SUPPORT,
            self::FACILITY_MANAGER,
        ];
    }

    /** Roles that can manage institution core data. */
    public static function institutionManagers(): array
    {
        return [
            self::PLATFORM_ADMIN,
            self::SUPER_ADMIN,
            self::INSTITUTION_ADMIN,
            self::PRINCIPAL,
            self::VICE_PRINCIPAL,
            self::REGISTRAR,
            self::DEAN,
            self::HOD,
        ];
    }

    /** Roles that can be invited by institution admins. */
    public static function invitable(): array
    {
        return [
            self::PRINCIPAL,
            self::VICE_PRINCIPAL,
            self::TEACHER,
            self::REGISTRAR,
            self::ACCOUNTANT,
            self::HR,
            self::ADMISSION_OFFICER,
            self::EXAM_OFFICER,
        ];
    }

    public static function requiresCampus(): array
    {
        return [
            self::PRINCIPAL,
            self::VICE_PRINCIPAL,
            self::TEACHER,
        ];
    }
}

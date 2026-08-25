const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..", "src", "app", "(app)");

const routes = [
  ["students/page.tsx", "StudentsPageContent", "@/modules/students/students-page"],

  ["teachers/page.tsx", "TeachersPage", "@/modules/teachers/page"],
  ["events/page.tsx", "EventsPage", "@/modules/events/page"],

  ["admissions/page.tsx", "AdmissionsDashboardPage", "@/modules/admissions/pages"],
  ["admissions/applicants/page.tsx", "AdmissionsApplicantsPage", "@/modules/admissions/pages"],
  ["admissions/programs/page.tsx", "AdmissionsProgramsPage", "@/modules/admissions/pages"],
  ["admissions/cycles/page.tsx", "AdmissionsCyclesPage", "@/modules/admissions/pages"],
  ["admissions/merit-lists/page.tsx", "AdmissionsMeritPage", "@/modules/admissions/pages"],
  ["admissions/interviews/page.tsx", "AdmissionsInterviewsPage", "@/modules/admissions/pages"],
  ["admissions/offers/page.tsx", "AdmissionsOffersPage", "@/modules/admissions/pages"],
  ["admissions/enrollment/page.tsx", "AdmissionsEnrollmentPage", "@/modules/admissions/pages"],

  ["academics/page.tsx", "AcademicsOverviewPage", "@/modules/academics/pages"],
  ["academics/departments/page.tsx", "AcademicsDepartmentsPage", "@/modules/academics/pages"],
  ["academics/programs/page.tsx", "AcademicsProgramsPage", "@/modules/academics/pages"],
  ["academics/courses/page.tsx", "AcademicsCoursesPage", "@/modules/academics/pages"],
  ["academics/sections/page.tsx", "AcademicsSectionsPage", "@/modules/academics/pages"],
  ["academics/timetable/page.tsx", "AcademicsTimetablePage", "@/modules/academics/pages"],

  ["attendance/page.tsx", "AttendanceDashboardPage", "@/modules/attendance/pages"],
  ["attendance/students/page.tsx", "AttendanceStudentsPage", "@/modules/attendance/pages"],
  ["attendance/teachers/page.tsx", "AttendanceTeachersPage", "@/modules/attendance/pages"],
  ["attendance/corrections/page.tsx", "AttendanceCorrectionsPage", "@/modules/attendance/pages"],
  ["attendance/leave/page.tsx", "AttendanceLeavePage", "@/modules/attendance/pages"],

  ["applications/page.tsx", "ApplicationsDashboardPage", "@/modules/applications/pages"],
  ["workflows/page.tsx", "WorkflowsListPage", "@/modules/workflows/pages"],

  ["exams/page.tsx", "ExamsDashboardPage", "@/modules/exams/pages"],
  ["exams/schedules/page.tsx", "ExamsSchedulesPage", "@/modules/exams/pages"],
  ["exams/marks/page.tsx", "ExamsMarksPage", "@/modules/exams/pages"],
  ["exams/results/page.tsx", "ExamsResultsPage", "@/modules/exams/pages"],

  ["fees/page.tsx", "FeesDashboardPage", "@/modules/fees/pages"],
  ["fees/students/page.tsx", "FeesStudentsPage", "@/modules/fees/pages"],
  ["fees/invoices/page.tsx", "FeesInvoicesPage", "@/modules/fees/pages"],
  ["fees/payments/page.tsx", "FeesPaymentsPage", "@/modules/fees/pages"],
  ["fees/scholarships/page.tsx", "FeesScholarshipsPage", "@/modules/fees/pages"],

  ["communication/notices/page.tsx", "NoticesPage", "@/modules/communication/pages"],
  ["communication/notifications/page.tsx", "NotificationsPage", "@/modules/communication/pages"],

  ["complaints/page.tsx", "ComplaintsDashboardPage", "@/modules/complaints/pages"],

  ["hr/page.tsx", "HRDashboardPage", "@/modules/hr/pages"],
  ["hr/employees/page.tsx", "HREmployeesPage", "@/modules/hr/pages"],
  ["hr/attendance/page.tsx", "HRAttendancePage", "@/modules/hr/pages"],
  ["hr/leave/page.tsx", "HRLeavePage", "@/modules/hr/pages"],
  ["hr/payroll/page.tsx", "HRPayrollPage", "@/modules/hr/pages"],

  ["documents/page.tsx", "DocumentsPage", "@/modules/documents/pages"],
  ["reports/page.tsx", "ReportsPage", "@/modules/reports/pages"],

  ["settings/page.tsx", "SettingsGeneralPage", "@/modules/settings/pages"],
  ["settings/branding/page.tsx", "SettingsBrandingPage", "@/modules/settings/pages"],
  ["settings/academic/page.tsx", "SettingsAcademicPage", "@/modules/settings/pages"],
  ["settings/users/page.tsx", "SettingsUsersPage", "@/modules/settings/pages"],
  ["settings/roles/page.tsx", "SettingsRolesPage", "@/modules/settings/pages"],
  ["settings/subscription/page.tsx", "SettingsSubscriptionPage", "@/modules/settings/pages"],

  ["platform/dashboard/page.tsx", "PlatformDashboardPage", "@/modules/platform/pages"],
  ["platform/tenants/page.tsx", "PlatformTenantsPage", "@/modules/platform/pages"],
  ["platform/subscriptions/page.tsx", "PlatformSubscriptionsPage", "@/modules/platform/pages"],
  ["platform/plans/page.tsx", "PlatformPlansPage", "@/modules/platform/pages"],
  ["platform/usage/page.tsx", "PlatformUsagePage", "@/modules/platform/pages"],
  ["platform/users/page.tsx", "PlatformUsersPage", "@/modules/platform/pages"],
  ["platform/system-health/page.tsx", "PlatformSystemHealthPage", "@/modules/platform/pages"],
  ["platform/audit-logs/page.tsx", "PlatformAuditLogsPage", "@/modules/platform/pages"],
  ["platform/settings/page.tsx", "PlatformSettingsPage", "@/modules/platform/pages"],

  ["student/dashboard/page.tsx", "StudentDashboardPage", "@/modules/portals/student-pages"],
  ["student/profile/page.tsx", "StudentProfilePage", "@/modules/portals/student-pages"],
  ["student/attendance/page.tsx", "StudentAttendancePage", "@/modules/portals/student-pages"],
  ["student/courses/page.tsx", "StudentCoursesPage", "@/modules/portals/student-pages"],
  ["student/timetable/page.tsx", "StudentTimetablePage", "@/modules/portals/student-pages"],
  ["student/exams/page.tsx", "StudentExamsPage", "@/modules/portals/student-pages"],
  ["student/results/page.tsx", "StudentResultsPage", "@/modules/portals/student-pages"],
  ["student/fees/page.tsx", "StudentFeesPage", "@/modules/portals/student-pages"],
  ["student/applications/page.tsx", "StudentApplicationsPage", "@/modules/portals/student-pages"],
  ["student/documents/page.tsx", "StudentDocumentsPage", "@/modules/portals/student-pages"],
  ["student/notices/page.tsx", "StudentNoticesPage", "@/modules/portals/student-pages"],

  ["teacher/dashboard/page.tsx", "TeacherDashboardPage", "@/modules/portals/teacher-pages"],
  ["teacher/classes/page.tsx", "TeacherClassesPage", "@/modules/portals/teacher-pages"],
  ["teacher/attendance/page.tsx", "TeacherAttendancePage", "@/modules/portals/teacher-pages"],
  ["teacher/marks/page.tsx", "TeacherMarksPage", "@/modules/portals/teacher-pages"],
  ["teacher/timetable/page.tsx", "TeacherTimetablePage", "@/modules/portals/teacher-pages"],
  ["teacher/leave/page.tsx", "TeacherLeavePage", "@/modules/portals/teacher-pages"],
  ["teacher/applications/page.tsx", "TeacherApplicationsPage", "@/modules/portals/teacher-pages"],

  ["parent/dashboard/page.tsx", "ParentDashboardPage", "@/modules/portals/parent-pages"],
  ["parent/children/page.tsx", "ParentChildrenPage", "@/modules/portals/parent-pages"],
  ["parent/attendance/page.tsx", "ParentAttendancePage", "@/modules/portals/parent-pages"],
  ["parent/results/page.tsx", "ParentResultsPage", "@/modules/portals/parent-pages"],
  ["parent/fees/page.tsx", "ParentFeesPage", "@/modules/portals/parent-pages"],
  ["parent/applications/page.tsx", "ParentApplicationsPage", "@/modules/portals/parent-pages"],
  ["parent/complaints/page.tsx", "ParentComplaintsPage", "@/modules/portals/parent-pages"],
  ["parent/notices/page.tsx", "ParentNoticesPage", "@/modules/portals/parent-pages"],

  ["calendar/page.tsx", "CalendarPage", "@/modules/calendar/page"],

  // Phase 2 Batch 1 — Library
  ["library/page.tsx", "LibraryDashboardPage", "@/modules/library/pages"],
  ["library/catalog/page.tsx", "LibraryCatalogPage", "@/modules/library/pages"],
  ["library/books/page.tsx", "LibraryBooksPage", "@/modules/library/pages"],
  ["library/authors/page.tsx", "LibraryAuthorsPage", "@/modules/library/pages"],
  ["library/publishers/page.tsx", "LibraryPublishersPage", "@/modules/library/pages"],
  ["library/categories/page.tsx", "LibraryCategoriesPage", "@/modules/library/pages"],
  ["library/shelves/page.tsx", "LibraryShelvesPage", "@/modules/library/pages"],
  ["library/racks/page.tsx", "LibraryRacksPage", "@/modules/library/pages"],
  ["library/copies/page.tsx", "LibraryCopiesPage", "@/modules/library/pages"],
  ["library/members/page.tsx", "LibraryMembersPage", "@/modules/library/pages"],
  ["library/circulation/page.tsx", "LibraryCirculationPage", "@/modules/library/pages"],
  ["library/reservations/page.tsx", "LibraryReservationsPage", "@/modules/library/pages"],
  ["library/overdue/page.tsx", "LibraryOverduePage", "@/modules/library/pages"],
  ["library/fines/page.tsx", "LibraryFinesPage", "@/modules/library/pages"],
  ["library/digital/page.tsx", "LibraryDigitalPage", "@/modules/library/pages"],
  ["library/reports/page.tsx", "LibraryReportsPage", "@/modules/library/pages"],
  ["library/settings/page.tsx", "LibrarySettingsPage", "@/modules/library/pages"],
  ["student/library/page.tsx", "StudentLibraryPage", "@/modules/library/pages"],

  // LMS
  ["lms/page.tsx", "LmsDashboardPage", "@/modules/lms/pages"],
  ["lms/courses/page.tsx", "LmsCoursesPage", "@/modules/lms/pages"],
  ["student/lms/page.tsx", "StudentLmsPage", "@/modules/lms/pages"],
  ["teacher/lms/page.tsx", "TeacherLmsPage", "@/modules/lms/pages"],

  // Assignments
  ["assignments/page.tsx", "AssignmentsDashboardPage", "@/modules/assignments/pages"],
  ["assignments/create/page.tsx", "AssignmentsCreatePage", "@/modules/assignments/pages"],
  ["teacher/assignments/page.tsx", "TeacherAssignmentsPage", "@/modules/assignments/pages"],
  ["student/assignments/page.tsx", "StudentAssignmentsPage", "@/modules/assignments/pages"],
  ["parent/assignments/page.tsx", "ParentAssignmentsPage", "@/modules/assignments/pages"],

  // Degree planning
  ["degree-planning/page.tsx", "DegreePlanningDashboardPage", "@/modules/degree-planning/pages"],
  ["degree-planning/planner/page.tsx", "DegreePlannerPage", "@/modules/degree-planning/pages"],
  ["student/degree-planning/page.tsx", "StudentDegreePlanningPage", "@/modules/degree-planning/pages"],

  // Advising
  ["advising/page.tsx", "AdvisingDashboardPage", "@/modules/advising/pages"],
  ["advising/students/page.tsx", "AdvisingStudentsPage", "@/modules/advising/pages"],
  ["advising/appointments/page.tsx", "AdvisingAppointmentsPage", "@/modules/advising/pages"],
  ["advising/requests/page.tsx", "AdvisingRequestsPage", "@/modules/advising/pages"],
  ["student/advising/page.tsx", "StudentAdvisingPage", "@/modules/advising/pages"],
  ["teacher/advising/page.tsx", "TeacherAdvisingPage", "@/modules/advising/pages"],

  // One-window services
  ["services/page.tsx", "ServicesCatalogPage", "@/modules/services/pages"],
  ["services/requests/page.tsx", "ServicesRequestsPage", "@/modules/services/pages"],
  ["student/services/page.tsx", "StudentServicesPage", "@/modules/services/pages"],

  // Certificates
  ["certificates/page.tsx", "CertificatesDashboardPage", "@/modules/certificates/pages"],
  ["certificates/templates/page.tsx", "CertificatesTemplatesPage", "@/modules/certificates/pages"],
  ["certificates/requests/page.tsx", "CertificatesRequestsPage", "@/modules/certificates/pages"],
  ["certificates/verify/page.tsx", "CertificatesVerifyAdminPage", "@/modules/certificates/pages"],
  ["student/certificates/page.tsx", "StudentCertificatesPage", "@/modules/certificates/pages"],

  ["admin/system-audit/page.tsx", "SystemAuditPage", "@/modules/system-audit/page"],

  // Phase 2 Batch 2 — Hostel
  ["hostel/page.tsx", "HostelDashboardPage", "@/modules/hostel/pages"],
  ["hostel/hostels/page.tsx", "HostelHostelsPage", "@/modules/hostel/pages"],
  ["hostel/buildings/page.tsx", "HostelBuildingsPage", "@/modules/hostel/pages"],
  ["hostel/floors/page.tsx", "HostelFloorsPage", "@/modules/hostel/pages"],
  ["hostel/rooms/page.tsx", "HostelRoomsPage", "@/modules/hostel/pages"],
  ["hostel/beds/page.tsx", "HostelBedsPage", "@/modules/hostel/pages"],
  ["hostel/students/page.tsx", "HostelStudentsPage", "@/modules/hostel/pages"],
  ["hostel/applications/page.tsx", "HostelApplicationsPage", "@/modules/hostel/pages"],
  ["hostel/allocations/page.tsx", "HostelAllocationsPage", "@/modules/hostel/pages"],
  ["hostel/waiting-list/page.tsx", "HostelWaitingListPage", "@/modules/hostel/pages"],
  ["hostel/fees/page.tsx", "HostelFeesPage", "@/modules/hostel/pages"],
  ["hostel/complaints/page.tsx", "HostelComplaintsPage", "@/modules/hostel/pages"],
  ["hostel/maintenance/page.tsx", "HostelMaintenancePage", "@/modules/hostel/pages"],
  ["hostel/settings/page.tsx", "HostelSettingsPage", "@/modules/hostel/pages"],
  ["student/hostel/page.tsx", "StudentHostelPage", "@/modules/hostel/pages"],

  // Transport
  ["transport/page.tsx", "TransportDashboardPage", "@/modules/transport/pages"],
  ["transport/vehicles/page.tsx", "TransportVehiclesPage", "@/modules/transport/pages"],
  ["transport/routes/page.tsx", "TransportRoutesPage", "@/modules/transport/pages"],
  ["transport/stops/page.tsx", "TransportStopsPage", "@/modules/transport/pages"],
  ["transport/drivers/page.tsx", "TransportDriversPage", "@/modules/transport/pages"],
  ["transport/conductors/page.tsx", "TransportConductorsPage", "@/modules/transport/pages"],
  ["transport/students/page.tsx", "TransportStudentsPage", "@/modules/transport/pages"],
  ["transport/assignments/page.tsx", "TransportAssignmentsPage", "@/modules/transport/pages"],
  ["transport/fees/page.tsx", "TransportFeesPage", "@/modules/transport/pages"],
  ["transport/maintenance/page.tsx", "TransportMaintenancePage", "@/modules/transport/pages"],
  ["transport/tracking/page.tsx", "TransportTrackingPage", "@/modules/transport/pages"],
  ["student/transport/page.tsx", "StudentTransportPage", "@/modules/transport/pages"],
  ["parent/transport/page.tsx", "ParentTransportPage", "@/modules/transport/pages"],

  // Health / Clinic
  ["health/page.tsx", "HealthDashboardPage", "@/modules/health/pages"],
  ["health/profiles/page.tsx", "HealthProfilesPage", "@/modules/health/pages"],
  ["health/visits/page.tsx", "HealthVisitsPage", "@/modules/health/pages"],
  ["health/incidents/page.tsx", "HealthIncidentsPage", "@/modules/health/pages"],
  ["health/allergies/page.tsx", "HealthAllergiesPage", "@/modules/health/pages"],
  ["health/vaccinations/page.tsx", "HealthVaccinationsPage", "@/modules/health/pages"],
  ["health/documents/page.tsx", "HealthDocumentsPage", "@/modules/health/pages"],
  ["student/health/page.tsx", "StudentHealthPage", "@/modules/health/pages"],
  ["parent/health/page.tsx", "ParentHealthPage", "@/modules/health/pages"],

  // Discipline
  ["discipline/page.tsx", "DisciplineDashboardPage", "@/modules/discipline/pages"],
  ["discipline/incidents/page.tsx", "DisciplineIncidentsPage", "@/modules/discipline/pages"],
  ["discipline/warnings/page.tsx", "DisciplineWarningsPage", "@/modules/discipline/pages"],
  ["discipline/actions/page.tsx", "DisciplineActionsPage", "@/modules/discipline/pages"],
  ["teacher/discipline/page.tsx", "TeacherDisciplinePage", "@/modules/discipline/pages"],
  ["parent/discipline/page.tsx", "ParentDisciplinePage", "@/modules/discipline/pages"],

  // Career & Internship
  ["career/page.tsx", "CareerDashboardPage", "@/modules/career/pages"],
  ["career/jobs/page.tsx", "CareerJobsPage", "@/modules/career/pages"],
  ["career/internships/page.tsx", "CareerInternshipsPage", "@/modules/career/pages"],
  ["career/companies/page.tsx", "CareerCompaniesPage", "@/modules/career/pages"],
  ["career/applications/page.tsx", "CareerApplicationsPage", "@/modules/career/pages"],
  ["career/interviews/page.tsx", "CareerInterviewsPage", "@/modules/career/pages"],
  ["career/events/page.tsx", "CareerEventsPage", "@/modules/career/pages"],
  ["career/placements/page.tsx", "CareerPlacementsPage", "@/modules/career/pages"],
  ["student/career/page.tsx", "StudentCareerPage", "@/modules/career/pages"],

  // Alumni
  ["alumni/page.tsx", "AlumniDashboardPage", "@/modules/alumni/pages"],
  ["alumni/directory/page.tsx", "AlumniDirectoryPage", "@/modules/alumni/pages"],
  ["alumni/profiles/page.tsx", "AlumniProfilesPage", "@/modules/alumni/pages"],
  ["alumni/events/page.tsx", "AlumniEventsPage", "@/modules/alumni/pages"],
  ["alumni/mentorship/page.tsx", "AlumniMentorshipPage", "@/modules/alumni/pages"],
  ["alumni/donations/page.tsx", "AlumniDonationsPage", "@/modules/alumni/pages"],
  ["student/alumni/page.tsx", "StudentAlumniPage", "@/modules/alumni/pages"],

  // Phase 2 Batch 3 — Clubs
  ["clubs/page.tsx", "ClubsDashboardPage", "@/modules/clubs/pages"],
  ["clubs/organizations/page.tsx", "ClubsOrganizationsPage", "@/modules/clubs/pages"],
  ["clubs/members/page.tsx", "ClubsMembersPage", "@/modules/clubs/pages"],
  ["clubs/events/page.tsx", "ClubsEventsPage", "@/modules/clubs/pages"],
  ["clubs/applications/page.tsx", "ClubsApplicationsPage", "@/modules/clubs/pages"],
  ["clubs/achievements/page.tsx", "ClubsAchievementsPage", "@/modules/clubs/pages"],
  ["clubs/houses/page.tsx", "ClubsHousesPage", "@/modules/clubs/pages"],
  ["clubs/points/page.tsx", "ClubsPointsPage", "@/modules/clubs/pages"],
  ["student/clubs/page.tsx", "StudentClubsPage", "@/modules/clubs/pages"],

  // Facilities
  ["facilities/page.tsx", "FacilitiesDashboardPage", "@/modules/facilities/pages"],
  ["facilities/buildings/page.tsx", "FacilitiesBuildingsPage", "@/modules/facilities/pages"],
  ["facilities/rooms/page.tsx", "FacilitiesRoomsPage", "@/modules/facilities/pages"],
  ["facilities/labs/page.tsx", "FacilitiesLabsPage", "@/modules/facilities/pages"],
  ["facilities/classrooms/page.tsx", "FacilitiesClassroomsPage", "@/modules/facilities/pages"],
  ["facilities/equipment/page.tsx", "FacilitiesEquipmentPage", "@/modules/facilities/pages"],
  ["facilities/bookings/page.tsx", "FacilitiesBookingsPage", "@/modules/facilities/pages"],
  ["facilities/settings/page.tsx", "FacilitiesSettingsPage", "@/modules/facilities/pages"],
  ["student/facilities/page.tsx", "StudentFacilitiesPage", "@/modules/facilities/pages"],

  // Maintenance
  ["maintenance/page.tsx", "MaintenanceDashboardPage", "@/modules/maintenance/pages"],
  ["maintenance/tickets/page.tsx", "MaintenanceTicketsPage", "@/modules/maintenance/pages"],
  ["maintenance/categories/page.tsx", "MaintenanceCategoriesPage", "@/modules/maintenance/pages"],
  ["maintenance/staff/page.tsx", "MaintenanceStaffPage", "@/modules/maintenance/pages"],
  ["maintenance/reports/page.tsx", "MaintenanceReportsPage", "@/modules/maintenance/pages"],
  ["student/maintenance/page.tsx", "StudentMaintenancePage", "@/modules/maintenance/pages"],
  ["teacher/maintenance/page.tsx", "TeacherMaintenancePage", "@/modules/maintenance/pages"],

  // IT Helpdesk
  ["it-helpdesk/page.tsx", "ItHelpdeskDashboardPage", "@/modules/it-helpdesk/pages"],
  ["it-helpdesk/tickets/page.tsx", "ItHelpdeskTicketsPage", "@/modules/it-helpdesk/pages"],
  ["it-helpdesk/categories/page.tsx", "ItHelpdeskCategoriesPage", "@/modules/it-helpdesk/pages"],
  ["it-helpdesk/technicians/page.tsx", "ItHelpdeskTechniciansPage", "@/modules/it-helpdesk/pages"],
  ["it-helpdesk/reports/page.tsx", "ItHelpdeskReportsPage", "@/modules/it-helpdesk/pages"],
  ["student/it-helpdesk/page.tsx", "StudentItHelpdeskPage", "@/modules/it-helpdesk/pages"],
  ["teacher/it-helpdesk/page.tsx", "TeacherItHelpdeskPage", "@/modules/it-helpdesk/pages"],

  // Surveys
  ["surveys/page.tsx", "SurveysDashboardPage", "@/modules/surveys/pages"],
  ["surveys/list/page.tsx", "SurveysListPage", "@/modules/surveys/pages"],
  ["surveys/create/page.tsx", "SurveysCreatePage", "@/modules/surveys/pages"],
  ["student/surveys/page.tsx", "StudentSurveysPage", "@/modules/surveys/pages"],

  // Phase 2 Batch 4 — Enterprise modules
  ["quality/page.tsx", "QualityDashboardPage", "@/modules/quality/pages"],
  ["quality/kpis/page.tsx", "QualityKpisPage", "@/modules/quality/pages"],
  ["quality/program-reviews/page.tsx", "QualityProgramReviewsPage", "@/modules/quality/pages"],
  ["quality/course-evaluations/page.tsx", "QualityCourseEvaluationsPage", "@/modules/quality/pages"],
  ["quality/improvement-plans/page.tsx", "QualityImprovementPlansPage", "@/modules/quality/pages"],
  ["quality/evidence/page.tsx", "QualityEvidencePage", "@/modules/quality/pages"],
  ["quality/reports/page.tsx", "QualityReportsPage", "@/modules/quality/pages"],

  ["accreditation/page.tsx", "AccreditationDashboardPage", "@/modules/accreditation/pages"],
  ["accreditation/bodies/page.tsx", "AccreditationBodiesPage", "@/modules/accreditation/pages"],
  ["accreditation/programs/page.tsx", "AccreditationProgramsPage", "@/modules/accreditation/pages"],
  ["accreditation/requirements/page.tsx", "AccreditationRequirementsPage", "@/modules/accreditation/pages"],
  ["accreditation/standards/page.tsx", "AccreditationStandardsPage", "@/modules/accreditation/pages"],
  ["accreditation/evidence/page.tsx", "AccreditationEvidencePage", "@/modules/accreditation/pages"],
  ["accreditation/documents/page.tsx", "AccreditationDocumentsPage", "@/modules/accreditation/pages"],
  ["accreditation/cycles/page.tsx", "AccreditationCyclesPage", "@/modules/accreditation/pages"],
  ["accreditation/audits/page.tsx", "AccreditationAuditsPage", "@/modules/accreditation/pages"],
  ["accreditation/findings/page.tsx", "AccreditationFindingsPage", "@/modules/accreditation/pages"],
  ["accreditation/corrective-actions/page.tsx", "AccreditationCorrectiveActionsPage", "@/modules/accreditation/pages"],

  ["inventory/page.tsx", "InventoryDashboardPage", "@/modules/inventory/pages"],
  ["inventory/items/page.tsx", "InventoryItemsPage", "@/modules/inventory/pages"],
  ["inventory/categories/page.tsx", "InventoryCategoriesPage", "@/modules/inventory/pages"],
  ["inventory/stock/page.tsx", "InventoryStockPage", "@/modules/inventory/pages"],
  ["inventory/locations/page.tsx", "InventoryLocationsPage", "@/modules/inventory/pages"],
  ["inventory/suppliers/page.tsx", "InventorySuppliersPage", "@/modules/inventory/pages"],
  ["inventory/movements/page.tsx", "InventoryMovementsPage", "@/modules/inventory/pages"],
  ["inventory/low-stock/page.tsx", "InventoryLowStockPage", "@/modules/inventory/pages"],
  ["inventory/damaged/page.tsx", "InventoryDamagedPage", "@/modules/inventory/pages"],

  ["assets/page.tsx", "AssetsDashboardPage", "@/modules/assets/pages"],
  ["assets/register/page.tsx", "AssetsRegisterPage", "@/modules/assets/pages"],
  ["assets/categories/page.tsx", "AssetsCategoriesPage", "@/modules/assets/pages"],
  ["assets/maintenance/page.tsx", "AssetsMaintenancePage", "@/modules/assets/pages"],
  ["assets/disposed/page.tsx", "AssetsDisposedPage", "@/modules/assets/pages"],
  ["assets/reports/page.tsx", "AssetsReportsPage", "@/modules/assets/pages"],

  ["procurement/page.tsx", "ProcurementDashboardPage", "@/modules/procurement/pages"],
  ["procurement/requests/page.tsx", "ProcurementRequestsPage", "@/modules/procurement/pages"],
  ["procurement/vendors/page.tsx", "ProcurementVendorsPage", "@/modules/procurement/pages"],
  ["procurement/quotations/page.tsx", "ProcurementQuotationsPage", "@/modules/procurement/pages"],
  ["procurement/orders/page.tsx", "ProcurementOrdersPage", "@/modules/procurement/pages"],
  ["procurement/receiving/page.tsx", "ProcurementReceivingPage", "@/modules/procurement/pages"],
  ["procurement/history/page.tsx", "ProcurementHistoryPage", "@/modules/procurement/pages"],

  ["emergency/page.tsx", "EmergencyDashboardPage", "@/modules/emergency/pages"],
  ["emergency/alerts/page.tsx", "EmergencyAlertsPage", "@/modules/emergency/pages"],
  ["emergency/contacts/page.tsx", "EmergencyContactsPage", "@/modules/emergency/pages"],
  ["emergency/incidents/page.tsx", "EmergencyIncidentsPage", "@/modules/emergency/pages"],
  ["emergency/evacuation/page.tsx", "EmergencyEvacuationPage", "@/modules/emergency/pages"],
  ["emergency/announce/page.tsx", "EmergencyAnnouncePage", "@/modules/emergency/pages"],

  ["visitors/page.tsx", "VisitorsDashboardPage", "@/modules/visitors/pages"],
  ["visitors/register/page.tsx", "VisitorsRegisterPage", "@/modules/visitors/pages"],
  ["visitors/passes/page.tsx", "VisitorsPassesPage", "@/modules/visitors/pages"],
  ["visitors/pickup-requests/page.tsx", "VisitorsPickupRequestsPage", "@/modules/visitors/pages"],
  ["visitors/approval/page.tsx", "VisitorsApprovalPage", "@/modules/visitors/pages"],
  ["visitors/security/page.tsx", "VisitorsSecurityPage", "@/modules/visitors/pages"],
  ["visitors/scan/page.tsx", "VisitorsScanPage", "@/modules/visitors/pages"],

  ["ai/page.tsx", "AiChatPage", "@/modules/ai/pages"],

  ["admin/audit-logs/page.tsx", "AdminAuditLogsPage", "@/modules/admin-audit/pages"],

  ["parent/visitors/page.tsx", "ParentVisitorsPage", "@/modules/visitors/pages"],
];

for (const [filePath, component, importPath] of routes) {
  const fullPath = path.join(root, filePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  const content = `import { ${component} } from "${importPath}";\n\nexport default function Page() {\n  return <${component} />;\n}\n`;
  fs.writeFileSync(fullPath, content);
}

// Dynamic routes
const dynamicRoutes = [
  ["applications/[id]/page.tsx", "ApplicationDetailPage", "@/modules/applications/pages", "id"],
  ["workflows/[id]/page.tsx", "WorkflowDetailPage", "@/modules/workflows/pages", "id"],
  ["library/books/[id]/page.tsx", "LibraryBookDetailPage", "@/modules/library/pages", "id"],
  ["lms/courses/[id]/page.tsx", "LmsCourseDetailPage", "@/modules/lms/pages", "id"],
  ["assignments/[id]/page.tsx", "AssignmentDetailPage", "@/modules/assignments/pages", "id"],
  ["assignments/[id]/submissions/page.tsx", "AssignmentSubmissionsPage", "@/modules/assignments/pages", "id"],
  ["advising/students/[id]/page.tsx", "AdvisingStudentDetailPage", "@/modules/advising/pages", "id"],
  ["services/requests/[id]/page.tsx", "ServicesRequestDetailPage", "@/modules/services/pages", "id"],
  ["discipline/incidents/[id]/page.tsx", "DisciplineIncidentDetailPage", "@/modules/discipline/pages", "id"],
  ["maintenance/tickets/[id]/page.tsx", "MaintenanceTicketDetailPage", "@/modules/maintenance/pages", "id"],
  ["it-helpdesk/tickets/[id]/page.tsx", "ItHelpdeskTicketDetailPage", "@/modules/it-helpdesk/pages", "id"],
  ["surveys/[id]/page.tsx", "SurveyDetailPage", "@/modules/surveys/pages", "id"],
  ["surveys/[id]/analytics/page.tsx", "SurveyAnalyticsPage", "@/modules/surveys/pages", "id"],
  ["surveys/[id]/responses/page.tsx", "SurveyResponsesPage", "@/modules/surveys/pages", "id"],
  ["procurement/requests/[id]/page.tsx", "ProcurementRequestDetailPage", "@/modules/procurement/pages", "id"],
  ["visitors/passes/[id]/page.tsx", "VisitorPassDetailPage", "@/modules/visitors/pages", "id"],
];

for (const [filePath, component, importPath, param] of dynamicRoutes) {
  const fullPath = path.join(root, filePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  const content = `import { ${component} } from "${importPath}";\n\nexport default async function Page({ params }: { params: Promise<{ ${param}: string }> }) {\n  const { ${param} } = await params;\n  return <${component} ${param}={${param}} />;\n}\n`;
  fs.writeFileSync(fullPath, content);
}

// Multi-param dynamic routes
const multiParamRoutes = [
  [
    "assignments/[id]/submissions/[submissionId]/page.tsx",
    "AssignmentSubmissionDetailPage",
    "@/modules/assignments/pages",
  ],
];

for (const [filePath, component, importPath] of multiParamRoutes) {
  const fullPath = path.join(root, filePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  const content = `import { ${component} } from "${importPath}";\n\nexport default async function Page({ params }: { params: Promise<{ id: string; submissionId: string }> }) {\n  const { id, submissionId } = await params;\n  return <${component} id={id} submissionId={submissionId} />;\n}\n`;
  fs.writeFileSync(fullPath, content);
}

console.log(`Generated ${routes.length + dynamicRoutes.length + multiParamRoutes.length} route files`);

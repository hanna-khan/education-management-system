# Backend — Phase 1 + Phase 2

Laravel 13 API for the Zendrock Education Management System.

## Quick start

```bash
cd education-management-system/backend
composer install
php artisan migrate:fresh --seed
php artisan serve
```

API base: `http://localhost:8000/api/v1`  
Demo password: `password`  
Admin: `ayesha.malik@neddemo.edu.pk`

## Phase 2 modules

| Domain | Endpoints |
|--------|-----------|
| Admissions | `/admissions/stats`, `/cycles`, `/applicants`, `/merit-lists`, `/interviews`, `/offers`, `/offers/{id}/enroll`, `/enrollment` |
| Attendance | `/attendance/stats`, `/daily`, `/mark`, `/corrections`, `/leaves` |
| Exams | `/exams/stats`, `/schedules`, `/marks`, `/marks/publish`, `/results` |
| Fees | `/fees/stats`, `/invoices`, `/payments`, `/scholarships` |
| Applications | `/applications`, `/applications/{id}/decide`, `/workflows` |
| Notices | `/notices` |

### Key flows

1. **Admit → enroll:** create/update applicant → create offer → `POST /admissions/offers/{id}/enroll` creates a student record
2. **Attendance:** `POST /attendance/mark` with class entries; corrections & leave review endpoints
3. **Fees:** create invoice → `POST /fees/payments` updates invoice + student `fee_status`
4. **Applications:** submit against a workflow; staff `decide` to approve/reject

## Frontend services

Swap-ready services with mock fallback:

- `src/services/admissions.ts`
- `src/services/attendance.ts`
- `src/services/exams.ts`
- `src/services/fees.ts`
- `src/services/applications.ts`
- `src/services/notices.ts`

## Next (Phase 3)

Teacher / Student / Parent portal APIs for daily teaching & learning (LMS, assignments, portal dashboards).

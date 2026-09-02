# Phase 1 & 2 — Dynamic features, flows & endpoints

Base URL: `http://127.0.0.1:8000/api/v1`  
Auth: `Authorization: Bearer <token>`  
Tenant context: user `institution_id` (platform admins may send `X-Institution-Id`)

Data comes **only from the database** (seeders / registration). Frontend Phase 1–2 services have **no mock fallback**.

---

## Multi-tenant registration flow (new)

```
School/University
  → GET /plans?type=school|university
  → POST /register  (creates tenant + admin + primary campus + trial subscription + modules)
  → Login token returned
  → /onboarding (details → campuses → branding → modules → complete)
  → /dashboard
```

| What they provide | Stored as |
|-------------------|-----------|
| Institution name, short name, type, city | `institutions` (tenant) |
| Contact email/phone | `institutions.contact_*` |
| Plan + billing cycle | `subscriptions` + `plans` |
| Primary campus name/address | `campuses` |
| Admin name/email/password | `users` (`institution_admin`) |

Plans seed: Starter, Growth, Enterprise (university), School Plus.  
Trial starts automatically; upgrade via `POST /subscription/change-plan`.  
Campus count limited by plan `max_campuses`.

### Public tenancy endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/plans` | List active plans |
| POST | `/register` | Self-register institution + admin |

### Authenticated tenancy endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/subscription` | Current plan/trial |
| POST | `/subscription/change-plan` | Upgrade/change plan |
| GET/POST | `/campuses` | List / add campuses |
| GET/PUT | `/institution` | Tenant profile / branding |
| GET | `/onboarding` | Onboarding status |
| POST | `/onboarding/advance` | Save step / complete |
| GET/PUT | `/modules` | Module toggles |

Frontend: `/register`, `/onboarding`, `/login` (empty fields, link to register).

---

## Phase 1 — Foundation (dynamic)

| Feature | Endpoints | Flow |
|---------|-----------|------|
| Login / logout / me | `POST /auth/login`, `POST /auth/logout`, `GET /auth/me` | Credentials → Bearer token → app shell |
| Password reset | `POST /auth/forgot-password`, `POST /auth/reset-password` | Email token reset |
| Dashboard KPIs | `GET /dashboard` | Live counts for tenant |
| Students CRUD | `GET/POST /students`, `GET/PUT /students/{id}`, `GET /students/stats`, `GET /students/filter-options` | Paginated list + create/update |
| Teachers CRUD | `GET/POST /teachers`, `GET/PUT /teachers/{id}` | Staff roster |
| Academics | `GET/POST /departments`, `GET /programs`, `GET /courses`, `GET /sections` | Academic structure |
| Platform tenants | `GET/POST/PUT /platform/institutions` | Platform admin only |

Seeded demo tenants (via seeder, not frontend mocks): NED Demo, KEC, Crescent + users (password `password`).

---

## Phase 2 — Academic operations (dynamic)

| Feature | Endpoints | Flow |
|---------|-----------|------|
| Admissions stats/cycles | `GET /admissions/stats`, `GET/POST /admissions/cycles` | Open cycle tracking |
| Applicants | `GET/POST /admissions/applicants`, `GET/PUT .../{id}` | Pipeline statuses |
| Merit / interviews / offers | `GET /admissions/merit-lists`, `/interviews`, `/offers`, `POST /admissions/offers` | Selection → offer |
| Enroll | `POST /admissions/offers/{id}/enroll` | Offer → creates `students` row |
| Enrollment summary | `GET /admissions/enrollment` | Accepted / enrolled / pending |
| Attendance | `GET /attendance/stats`, `/daily`, `POST /attendance/mark` | Class marking |
| Corrections / leave | `GET /attendance/corrections`, `POST .../review`, `GET/POST /attendance/leaves`, `POST .../review` | Approvals |
| Exams | `GET/POST /exams/schedules`, `GET/PUT /exams/marks`, `POST /exams/marks/publish`, `GET /exams/results` | Schedule → marks → publish → GPA |
| Fees | `GET /fees/stats`, `/invoices`, `POST /fees/invoices`, `GET/POST /fees/payments` | Invoice → payment updates fee status |
| Scholarships | `GET /fees/scholarships`, `/fees/scholarships/stats`, `PUT /fees/scholarships/{id}` | Award workflow |
| Applications | `GET/POST /applications`, `GET .../{id}`, `POST .../decide` | Inbox + approve/reject |
| Workflows | `GET /workflows`, `GET /workflows/{id}` | Definition + steps |
| Notices | `GET/POST /notices`, `PUT /notices/{id}` | Publish notices |

---

## Frontend services (API only)

`students`, `admissions`, `attendance`, `exams`, `fees`, `applications`, `notices`, `auth`, `tenancy`

Admissions UI module pages load from these services (no mock data arrays).

---

## Still mock / not Phase 1–2 backend

LMS, library, hostel, transport, HR portals extras, AI, inventory, etc. (later phases). Those pages may still import `@/mock/*` until Phase 3+.

---

## Run

```bash
cd backend && php artisan migrate:fresh --seed && php artisan serve
cd frontend && npm run dev
```

Register: http://localhost:3000/register  
Login: http://localhost:3000/login  

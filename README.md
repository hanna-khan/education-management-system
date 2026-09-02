# Education Management System

Multi-tenant Education Operations & Student Lifecycle SaaS — part of **Zendrock**.

## Structure

```
education-management-system/
├── frontend/     # Next.js — API-only for Phase 1–2 (no mock fallback)
├── backend/      # Laravel 13 + Sanctum
└── PHASES.md     # Full endpoint + flow catalogue
```

## What’s dynamic (Phase 1 + 2)

- Auth, students, teachers, academics, platform institutions
- Admissions → enroll, attendance, exams/results, fees/scholarships, applications/workflows, notices
- **Institution self-registration**: plan → tenant → admin → campus → trial subscription → onboarding

See **[PHASES.md](./PHASES.md)** for every endpoint and flow.

## Run

```bash
cd backend
php artisan migrate:fresh --seed
php artisan serve

cd ../frontend
npm install
npm run dev
```

- Register: http://localhost:3000/register  
- Login: http://localhost:3000/login (empty form — no prefills)  
- Seeded demo admin (optional): `ayesha.malik@neddemo.edu.pk` / `password`

## Next

**Phase 3** — Teacher / Student / Parent portal APIs; remaining campus modules off mocks.

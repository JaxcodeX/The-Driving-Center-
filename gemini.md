# 📜 gemini.md — Project Constitution
> **The Driving Center** | Last updated: 2026-02-25

---

## 1. Project Identity

| Field | Value |
|---|---|
| **Name** | The Driving Center |
| **Type** | Driving school management platform (PWA) |
| **Stack** | Next.js 16 · React 19 · Supabase · Stripe · TailwindCSS 4 · n8n |
| **Owner** | Single-operator (instructor) business |

---

## 2. Architectural Invariants

1. **Single Operator** — There is exactly ONE instructor. The `/dashboard` route is locked to their user ID via Supabase Auth middleware.
2. **RLS-First** — All Supabase tables enforce Row Level Security. Public users never touch raw rows.
3. **Security-by-Default** — API routes under `/api/admin/*` require verified JWT. Webhooks under `/api/webhooks/*` verify Stripe signatures.
4. **PWA** — The dashboard is a Progressive Web App (`@ducanh2912/next-pwa`).
5. **Data Encryption** — `legal_name` and `permit_number` are encrypted at the application level.

---

## 3. Data Schema (Synced from Live DB: 2026-02-25)

### 3.1 `students_driver_ed` (0 rows)
| Column | Type | Nullable | Default | Notes |
|---|---|---|---|---|
| `id` | UUID | NO | `uuid_generate_v4()` | PK |
| `legal_name` | TEXT | NO | — | Encrypted |
| `permit_number` | TEXT | YES | — | Encrypted |
| `dob` | DATE | NO | — | CHECK: age ≥ 15 |
| `parent_email` | TEXT | NO | — | |
| `contract_signed_url` | TEXT | YES | — | DocuSign link |
| `classroom_hours` | INTEGER | YES | `0` | |
| `driving_hours` | INTEGER | YES | `0` | |
| `certificate_issued_at` | TIMESTAMPTZ | YES | — | |
| `class_session_id` | TEXT | YES | — | Session inventory link |
| `created_at` | TIMESTAMPTZ | YES | `now()` | |
| `permit_expiration` | DATE | YES | — | |
| `date_of_birth` | DATE | YES | — | ⚠️ Duplicate of `dob` |
| `address_street` | TEXT | YES | — | |
| `address_city` | TEXT | YES | — | |
| `emergency_contact_name` | TEXT | YES | — | |
| `emergency_contact_phone` | TEXT | YES | — | |
| `signature_url` | TEXT | YES | — | |

### 3.2 `traffic_school_compliance` (0 rows)
| Column | Type | Nullable | Default | Notes |
|---|---|---|---|---|
| `id` | UUID | NO | `uuid_generate_v4()` | PK |
| `citation_number` | TEXT | NO | — | |
| `court_jurisdiction` | ENUM | NO | — | Anderson, Knox, Oak Ridge, Clinton |
| `certificate_sent_to_clerk` | BOOLEAN | YES | `false` | |
| `created_at` | TIMESTAMPTZ | YES | `now()` | |

### 3.3 `audit_logs` (0 rows)
| Column | Type | Nullable | Default | Notes |
|---|---|---|---|---|
| `id` | UUID | NO | `uuid_generate_v4()` | PK |
| `timestamp` | TIMESTAMPTZ | YES | `now()` | |
| `action` | TEXT | NO | — | |
| `details` | JSONB | YES | — | |

### 3.4 `sessions` (8 rows — LIVE DATA)
| Column | Type | Nullable | Default | Notes |
|---|---|---|---|---|
| `id` | UUID | NO | `gen_random_uuid()` | PK |
| `start_date` | DATE | NO | — | |
| `end_date` | DATE | NO | — | |
| `max_seats` | INTEGER | YES | `30` | |
| `seats_booked` | INTEGER | YES | `0` | |
| `created_at` | TIMESTAMPTZ | YES | `now()` | |

### 3.5 `payments` (0 rows)
| Column | Type | Nullable | Default | Notes |
|---|---|---|---|---|
| `id` | UUID | NO | `uuid_generate_v4()` | PK |
| `student_id` | UUID | NO | — | FK → `students_driver_ed.id` |
| `stripe_session_id` | TEXT | NO | — | UNIQUE |
| `amount` | INTEGER | NO | — | |
| `status` | TEXT | NO | `'pending'` | CHECK: pending/paid/refunded/failed |
| `created_at` | TIMESTAMPTZ | YES | `now()` | |

### 3.6 RLS Policy Summary
| Table | Policy | Roles | Action |
|---|---|---|---|
| `students_driver_ed` | Service Role Full Access | `service_role` | ALL |
| `traffic_school_compliance` | Service Role Full Access Traffic | `service_role` | ALL |
| `audit_logs` | Service Role Full Access Audit | `service_role` | ALL |
| `sessions` | Enable read access for all users | `public` | SELECT |
| `payments` | Service Role Full Access | `service_role` | ALL |
| `payments` | No Public Read | `anon, authenticated` | SELECT (denied) |
| `payments` | No Public Insert | `anon, authenticated` | INSERT (denied) |

---

## 4. Behavioral Rules

> ⚠️ **PENDING** — Will be filled from Discovery Q5.

---

## 5. External Services

| Service | Status | Notes |
|---|---|---|
| Supabase | ✅ Verified (MCP + `.env.local`) | Project: `evswdlsqlaztvajibgta`, 5 tables live |
| Stripe | ⏭️ Skipped for now | Keys deferred to later phase |
| n8n | 🔗 Connected (MCP available) | Workflow: "The Driving Center - Student Onboarding" |

---

## 6. Maintenance Log

| Date | Change | Author |
|---|---|---|
| 2026-02-25 | Initial constitution created via Protocol 0 | System Pilot |
| 2026-02-25 | Architectural Refactor: Logged Red Wires and tech debt | System Pilot |
| 2026-02-25 | Full schema sync from live DB (5 tables, all columns, RLS policies) | System Pilot |

---

## 7. Red Wires & Technical Debt

- **Stripe Keys Deferred:** `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` — skipped by user order.
- **Incomplete APIs:** Stripe webhooks undefined, Kill Switch missing SMS execution context.
- **Middleware Flow:** Missing `/login` boundary for unauthenticated requests bouncing from `/dashboard`.
- **Schema Note:** `date_of_birth` column duplicates `dob` in `students_driver_ed` — candidate for cleanup.

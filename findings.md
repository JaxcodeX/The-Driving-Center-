# 🔍 findings.md — Research & Discoveries
> **The Driving Center** | Last updated: 2026-02-25

---

## Initial Project Survey (2026-02-25)

### Tech Stack
- **Framework:** Next.js 16.1.6 with React 19, TypeScript 5
- **Auth & DB:** Supabase (`@supabase/ssr` 0.8.0 + `@supabase/supabase-js` 2.93.3)
- **Payments:** Stripe (`stripe` 20.3.0)
- **PWA:** `@ducanh2912/next-pwa` 10.2.9
- **UI:** TailwindCSS 4, Radix UI primitives, `vaul` (drawer), `lucide-react` icons
- **Forms:** `react-hook-form` + `zod` validation
- **Styling:** `class-variance-authority` + `tailwind-merge` + `clsx`

### Existing Components
| Component | Path | Purpose |
|---|---|---|
| `ActiveSessionCard` | `src/components/dashboard/active-session-card.tsx` | Shows current driving session |
| `QuickStatsRow` | `src/components/dashboard/quick-stats-row.tsx` | Dashboard metrics strip |
| `LogDriveDrawer` | `src/components/dashboard/log-drive-drawer.tsx` | Slide-up form for logging drives |
| `SplitHero` | `src/components/split-hero.tsx` | Landing page hero section |
| `GeofenceCheck` | `src/components/geofence-check.tsx` | Location-based availability check |
| `InventoryCard` | `src/components/inventory-card.tsx` | Class session seat availability |
| `LegalFooter` | `src/components/legal-footer.tsx` | Compliance footer |

### API Routes
- `/api/admin/emergency-log` — Kill-switch incident logging
- `/api/webhooks/` — Stripe webhook handler (TBD)

### Database (from `supabase/schema.sql`)
- 3 tables: `students_driver_ed`, `traffic_school_compliance`, `audit_logs`
- RLS enabled on all tables; only `service_role` has full access
- Secure function: `get_class_enrollment_count(session_id)`
- Court jurisdictions enum: Anderson, Knox, Oak Ridge, Clinton

### Constraints Discovered
1. `.env.local` contains **placeholder** credentials — no live Supabase/Stripe keys configured
2. n8n has a workflow named "The Driving Center - Student Onboarding" (found in prior conversation)
3. Middleware protects `/dashboard` and `/api/admin/*` routes via `supabase.auth.getUser()`
4. Single-operator model — dashboard is for one instructor only

### Prior Conversation Work
- Conversation `cd227faf`: Built the Instructor Command Center dashboard (PWA, dark mode, kill switch)
- Conversation `211da2c7`: Generated a System Blueprint document
- Conversation `25c7128d`: Attempted a Notion workspace rebuild
- Conversation `b97ab9c3`: Searched n8n workflows, confirmed "Student Onboarding" workflow exists

## 🚨 Red Wire Audit (2026-02-25)
1. **[🔴 CRITICAL] Env Keys (.env.local):** Supabase and Stripe keys are placeholders. Blocks Phase 2 Connectivity.
2. **[🔴 CRITICAL] Stripe Webhooks:** `/api/webhooks/` exists but logic is TBD. Requires signature verification.
3. **[🟡 HIGH] Middleware Auth:** Guarding `/dashboard`, but no `/login` route exists yet for redirect on fail.
4. **[🟡 HIGH] Kill Switch API:** `/api/admin/emergency-log` is skeleton. Needs Twilio/SMS keys and n8n wiring.

## 🔄 Schema Drift Discovery (2026-02-25)

Live Supabase DB has **5 tables** but local `supabase/schema.sql` only defines **3**:

| Table | In `schema.sql` | In Live DB | Rows |
|---|---|---|---|
| `students_driver_ed` | ✅ | ✅ | 0 |
| `traffic_school_compliance` | ✅ | ✅ | 0 |
| `audit_logs` | ✅ | ✅ | 0 |
| `sessions` | ❌ | ✅ | 8 |
| `payments` | ❌ | ✅ | 0 |

Live `students_driver_ed` also has extra columns not in local schema: `permit_expiration`, `date_of_birth`, `address_street`, `address_city`, `emergency_contact_name`, `emergency_contact_phone`, `signature_url`.

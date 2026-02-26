# 📋 task_plan.md — B.L.A.S.T. Task Plan
> **The Driving Center** | Status: 🟡 Protocol 0 — Discovery Phase

---

## Protocol 0: Initialization ✅ → Discovery

- [x] Survey project structure
- [x] Create `gemini.md`, `task_plan.md`, `findings.md`, `progress.md`
- [x] Discovery Questions answered / Refactor ordered
- [ ] Data Schema finalized in `gemini.md`
- [x] Blueprint approved (Red Wires mapped)

## Phase 1: Blueprint (Vision & Logic)

**Goal:** Lock in the North Star, define all data shapes, and research resources.

- [ ] Confirm North Star outcome
- [ ] Confirm integrations & verify API keys are ready
- [ ] Define source of truth
- [ ] Define delivery payload shape
- [ ] Set behavioral rules
- [ ] Research GitHub repos for driving-school tooling

## Phase 2: Link (Connectivity)

**Goal:** Verify every external service is responding before building logic.

- [ ] Test Supabase connection (real credentials)
- [ ] Test Stripe webhook handshake
- [ ] Test n8n workflow trigger
- [ ] Build minimal handshake scripts in `tools/`

## Phase 3: Architect (3-Layer Build)

**Goal:** Build the deterministic engine.

- [ ] Write Architecture SOPs in `architecture/`
- [ ] Build atomic tools in `tools/`
- [ ] Wire the navigation/decision layer

## Phase 4: Stylize (Refinement)

**Goal:** Professional-grade output formatting and UI polish.

- [ ] Format all output payloads (Notion, emails, Slack if applicable)
- [ ] Polish dashboard UI/UX
- [ ] User feedback round

## Phase 5: Trigger (Deployment)

**Goal:** Ship to production.

- [ ] Move logic to cloud
- [ ] Set up triggers (cron, webhooks, listeners)
- [ ] Finalize maintenance log

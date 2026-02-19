# The Driving Center OS (BOS)
An autonomous, event-driven Business Operating System designed to automate logistics, compliance, and payments for a driving school.

## 🏗️ System Architecture
* **Orchestration:** n8n (Self-hosted workflows for webhook handling & logic).
* **Cognitive Layer:** Google Gemini (LLM) for parsing unstructured email data into structured JSON.
* **Database:** Supabase (PostgreSQL) with strict Row-Level Security (RLS).
* **Frontend:** Next.js 14 (React) + Tailwind CSS.

## 🔐 Zero-Trust Security Model
* **Identity Isolation:** Root business accounts are isolated via a Proton Mail bridge to prevent identity bleed.
* **Hardware Auth:** Access to production environment is secured via YubiKey 5 NFC (FIDO2).
* **Compliance:** Schema designed for T.C.A. 1340-03-07 data retention standards.

## ⚡ Core Workflows
1.  **Lead Injection:** Gmail Watch -> Gemini Extraction -> Supabase Insert.
2.  **Payment Verification:** Stripe Webhook -> Signature Check -> Student Status Update.
3.  **Dynamic Scheduling:** Real-time slot availability matching (Anti-Collision logic).

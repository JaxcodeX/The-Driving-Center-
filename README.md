# The Driving Center OS 2.0
An autonomous, event-driven Business Operating System (BOS) for driver education logistics.

## 🏗️ System Architecture
* **Orchestration:** n8n (Workflow automation and webhook handling).
* **Cognitive Processing:** Google Gemini LLM for unstructured data extraction.
* **Data Persistence:** Supabase (PostgreSQL) with Row-Level Security (RLS).
* **Compliance:** Architected for Tennessee T.C.A. 1340-03-07 record retention.

## 🔐 Security Moat
* **Identity Isolation:** Hardened Proton bridge with isolated business root accounts.
* **Hardware Trust:** Root-level access secured via physical YubiKey 2FA.
* **Deployment:** Zero-trust pipeline managed via GitHub Actions.

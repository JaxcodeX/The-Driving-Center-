# 🚘 The Driving Center: AntiGravity OS

**An Autonomous Business Operating System (BOS) built on the MAPS Framework.**

## 📡 System Overview
This is not a static website. It is an **Agentic System** that orchestrates the logistics of a driving academy. It utilizes an event-driven architecture to decouple the "Frontend" (Next.js) from the "Business Logic" (n8n/Gemini).

## 🗺️ The MAPS Architecture
This project follows the **AntiGravity** architectural standard:

### 🧬 M - Mission (Context)
* **Goal:** Zero-Admin operations for a high-throughput service business.
* **Identity Isolation:** Dev/Prod environments separated via **Proton** bridge and **YubiKey** hardware authentication.

### ⚡ A - Actions (Agents)
* **Orchestrator:** **n8n** (Self-Hosted).
* **Cognitive Layer:** **Google Gemini 1.5 Pro** via Vertex AI.
* **Function:** Parses unstructured inputs (emails, forms) into structured SQL transactions.

### 📚 P - Past (Memory)
* **Data Sovereignty:** Strict adherence to **T.C.A. 1340-03-07** for record retention.
* **Context:** Notion acting as the "Long Term Memory" (LTM) via **Model Context Protocol (MCP)**.

### 📊 S - Stats (Truth)
* **The Vault:** **Supabase** (PostgreSQL) with Row-Level Security (RLS).
* **Verification:** Stripe Webhooks with cryptographic signature checks.

## 🛠️ Tech Stack
* **Frontend:** Next.js 14, Tailwind, Lucide
* **Backend:** Supabase, Edge Functions
* **AI/Logic:** n8n, Gemini, MCP

## 🚀 Deployment
Deployed via Vercel with strict environment variable encryption. Zero hardcoded secrets.

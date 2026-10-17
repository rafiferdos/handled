# API integration and hosted acceptance

The existing Next.js/shadcn UI connects to the separately maintained Nest API.
The API, BullMQ worker, Supabase business database, and Gemini adapter retain
their existing architecture. Only synthetic data and simulated effects are used.
No paid resource or plan is authorized.

## Data and session boundaries

With `HANDLED_API_URL` configured, dashboard pages use real workspace-scoped API
requests. Unconfigured local development retains the clearly labeled sample UI.
Live mode never falls back to sample data on an API error. The server proxies a
fixed API base and allowed resource paths; the backend enforces membership,
roles, proposal versions, and idempotency.

Password login uses Supabase Auth. Access and refresh tokens stay in HttpOnly,
SameSite cookies, with Secure enabled on HTTPS. API requests renew an expired
session once and preserve the original decision body and idempotency key.
Logout clears private query data. Workspace changes cancel and remove tenant
queries. Account creation and password recovery are explicitly administrator
managed in this preview; those forms do not pretend to send email.

Business screens read actual ticket messages, verified customer context,
investigation steps/sources, proposals, action outcomes, audit events, and policy
index state. Approval HTTP 202 means queued; only a persisted `SUCCEEDED` action
and its saved state establish completion. Refresh and reload reread REST state.
Extra company branding fields are not silently saved locally in connected mode.

## Public support form

`/support/:workspaceSlug` accepts a customer request without sign-in. The
same-origin server route validates the request and injects a workspace form token
from `SUPPORT_FORMS_JSON`. It never returns the token. The exact hosted origin
must be in the backend `PUBLIC_INTAKE_ORIGINS` allowlist. The same private
`SUPPORT_PROXY_SECRET` is set on the API and web server.

On Vercel, the server uses the platform-provided `x-vercel-forwarded-for` client
IP and signs the timestamp, workspace slug, exact origin, and IP. Backend
verification rejects spoofed, missing, or stale attestations. Express does not
globally trust forwarded headers. The signature keeps the database-backed
per-client intake limiter meaningful through both hosting proxies. See
[Vercel request headers](https://vercel.com/docs/headers/request-headers#x-vercel-forwarded-for)
and the backend ticket module guide for the precise wire contract.

The form retains its idempotency key for retries of the same payload. Its receipt
does not authorize private reads or customer identity. An agent must record a
separate customer verification before AI investigation.

## Required hosted proof

- Real browser login and HttpOnly session; anonymous private denial.
- Public customer form, persisted ticket, explicit customer verification.
- Published policy revision indexed READY by the hosted worker and real provider.
- Real AI/RAG investigation with recorded sources and actionable proposal.
- Human approval, simulated action, saved before/after state and audit.
- Reload/refetch, duplicate approval/intake, retry safety, cross-tenant denial.

Health checks, local provider probes, unit tests, and mocked browser tests do not
fulfil this acceptance gate. Hosted evidence will be recorded after execution.
Render Free sleeps while idle and Redis is volatile; this preview cannot promise
continuous queue processing.

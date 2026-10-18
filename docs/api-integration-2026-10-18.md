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
queries. The selected workspace is stored per account/tab as a non-secret ID and
revalidated against current memberships before children request tenant data.
Account creation and password recovery are explicitly administrator
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

Approval errors appear inside the confirmation dialog. A verified, rejected case
can start a fresh investigation while preserving the prior proposal and decision.

## Hosted proof completed on 18 October 2026

Acceptance ran on frontend commit `83655c168e020f74202472bd88cad3a5b5d10992`,
Vercel production `dpl_Bb3oWjXPFAhELjH16DEEwuVK9iHU`, and backend `testing`
commit `51943d71a1a9adf41ef23042479eaaeb280b0736`, Render live deployment
`dep-dba9f5eq1p3s73ar399g`. Both resource plans stayed Hobby/Free.

The [actual public form](https://handled-rafiferdos.vercel.app/support/acme-cloud-301fad4d)
created TKT-1004 without login. Through the browser, an authenticated administrator
verified synthetic Maya Rahman / CUS-1001, investigated with real
`gemini-3.5-flash-lite` / `handled-core-v2`, reviewed cited customer/payment/policy
evidence and approved refund of PAY-9002. The worker persisted a successful
simulated refund, before/after state and completion audit. Reload restored the
correct workspace and refetched the RESOLVED ticket and saved result.

- Ticket: `b9e0ca12-6497-43a1-a666-2e1bd4926878`.
- Investigation: `de372dab-9334-43a7-838a-5492f9810d0f`.
- Proposal: `97691eac-49ac-4472-960a-6d9567ba7eae`.
- Action: `54b02b30-aa0f-4be4-9d6d-33677b06b34a`, SUCCEEDED, simulation true,
  one attempt; payment SETTLED → REFUNDED, confirmed by fresh account read.

All three independent API acceptance cases also passed: refund, period-end
cancellation and product-access restoration, each with real AI/RAG, approved
action, persisted effect/audit and RESOLVED refetch. The probe verified public
idempotency/replay conflict, stale approval denial, duplicate approval returning
the same action, successful-action retry denial and cross-tenant denial.
The browser exercised the refund case; the other two were real HTTP/worker tests.

Deployed session checks verified password login, HttpOnly/Secure/SameSite cookies,
refresh after invalid access, account switching, scoped workspaces, logout revoke/
cookie clearing and subsequent private 401. Viewer approval and foreign action
access were denied. Public intake rejected lookalike origin, missing form token,
missing/forged/stale proxy signature and spoofed forwarded IP, all with 403.

An earlier malformed AI proposal was safely blocked at approval with no action
and explicitly rejected. Backend schema/grounding fixes and a new investigation
produced the final valid proposal; no model content was edited to force a pass.
See [backend evidence](https://github.com/rafiferdos/handled-api/blob/testing/docs/hosted-deployment-verification.md)
for the full case IDs, changes and limits.

Final monorepo check passed lint, types, 39 web tests, 111 embedded API tests and
both builds. Backend separately passed 165 unit/process, 37 HTTP and 93 disposable
local database/queue tests. Local tests are separate from the hosted proof above.

## Remaining operational limits

Render Free sleeps both processes while idle and Redis is volatile. Controlled
idle/wake, in-flight restart and real Redis-data-loss recovery were not exercised.
No continuous queue guarantee or external payment/subscription/product action is
claimed. Replies remain drafts; signup/password recovery are administrator
managed. Gemini Free quotas can stop generation; no paid fallback was enabled.
Synthetic form tokens expire 25 October 2026 at 02:35 UTC and must be renewed with
the server-only Vercel mapping before expiry.

The acceptance gate remains:

- Real browser login and HttpOnly session; anonymous private denial.
- Public customer form, persisted ticket, explicit customer verification.
- Published policy revision indexed READY by the hosted worker and real provider.
- Real AI/RAG investigation with recorded sources and actionable proposal.
- Human approval, simulated action, saved before/after state and audit.
- Reload/refetch, duplicate approval/intake, retry safety, cross-tenant denial.

Health checks, local provider probes, unit tests, and mocked browser tests do not
fulfil this acceptance gate; the real hosted evidence above establishes the
recorded synthetic flows only.

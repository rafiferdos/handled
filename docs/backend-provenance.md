# Preserved backend source

`apps/api` preserves the tracked NestJS source from the existing local Handled API checkout, `https://github.com/rafiferdos/handled-api.git`, at development commit `e56351516d80d10df8eba8327b27b5ffc474dbf2` (15 October 2026). The original checkout was clean and remains untouched.

The import used `git archive HEAD`, excluding only its standalone `pnpm-lock.yaml` and `pnpm-workspace.yaml`; dependency graphs and build approvals now share the root workspace. No backend implementation was rewritten. Ignored files, local credentials, generated clients, dependencies and Git metadata were not copied. The tracked `.env.example` has empty credentials; the Supabase CA is a public certificate.

The backend pins Node 22 and pnpm 11.25.0. This workspace preserves those runtime constraints instead of changing the backend for Node 24. Run package scripts from the root using `pnpm --filter handled-api <script>`; `.env` belongs in `apps/api` and must remain local.

Backend ownership remains with the existing Lead/A/B/C/D domains. Source documents that describe the earlier separate repository remain preserved as historical source; this structural relocation follows the user's explicit monorepo instruction. Future backend synchronization should be reviewed against the provenance commit, not copied over newer source blindly.

Business endpoints and production authentication are unfinished. Contract files are G0 proposals; they are not proof of registered, working routes. The frontend sample adapter cannot establish backend integration or release-gate completion.

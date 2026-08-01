# Features Guideline

## Upstream counterparts

21 of the docs below came from `@mydaogs/shared-docs` (adopted at 0.9.0). This tree is not redundant with the kit and is not a mirror to be collapsed: upstream states each one against placeholders, and a doc is only actionable once it names the thing you actually edit, so the local copy carries this project's paths, entities, and tooling

**A fix to the rule itself belongs upstream; a fix to how this project binds it belongs here.** When the two disagree on package behaviour the kit wins and the local copy is stale — check the version actually resolved in the lockfile

| Local | Upstream file |
| --- | --- |
| `ARCH-react-hook-form-integration.md` | `@mydaogs/shared-docs` → `features/ARCH-react-hook-form-integration.md` |
| `ARCH-zod-schema-validation.md` | `@mydaogs/shared-docs` → `features/ARCH-zod-schema-validation.md` |

An entry in the list below marked `→ @mydaogs/<package>` is not in this folder at all: it ships with that package and is read at its root

The other 19 upstream `ARCH-*` docs this kit ships (cron auth middleware, dangerous-action dialogs, a `src/data` layer, shared loading primitives, a query error boundary, the `"use cache"` pattern, `_widgets` folders, route groups, semantic CSS tokens, server actions with a backend contract, string shorteners, URL-synced tabs, TanStack Query with a backend cache handler, toast lifecycle, URL query state, URL toasts, Reown AppKit wagmi integration, organization-aware web3 buttons, HMAC webhook verification) describe a different product's architecture — this app has no cron, no `apps/backend`, no `@mydaogs/ui` package, no tabs, and its wagmi connector and webhook auth work differently. Deleted rather than kept as placeholders, per the kit's own adoption steps

- This folder contains docs for general summarized architectural features
- Each feature summary has its own markdown file with a kebab-case name
- All architecture (ARCH) features must be listed below for easy navigation. Keep this list updated

## Template for documenting a feature

- Feature name `[ARCH] - <Feature Name>`
- Feature description - summary of what it does and achieves, summary of main implementation details
- Related files list

## Scope of this folder in the shared kit

Only `ARCH-*` docs are carried between projects. `STORY-*` docs describe user stories and are by definition project-specific — write them fresh in each repo, alongside these

The list below covers every blueprint the kit carries, including the ones that ship **with a package** rather than in this folder. An entry marked `→ @mydaogs/<package>` lives at that package's root and renders on its npm page; read it there. The list is one index, not one directory listing, so a reader finds the doc without knowing which half of the kit it landed in

## Features list (file name + one sentence short description)

### Web3 (2)

1. `ARCH-network-config.md` → `@mydaogs/web3` - Centralized chain selection driven by env config
2. `ARCH-env-config-split.md` → `@mydaogs/web3` - Client/server environment variable separation with Zod validation

### Indexing (1)

3. `ARCH-event-processing-pipeline.md` → `@mydaogs/indexer` - Event processor with atomic deduplication, retries, ordering guards, and a terminal-failure taxonomy

### Data Fetching & Caching (1)

4. `ARCH-query-invalidation-pattern.md` → `@mydaogs/web3-client` - Automatic query invalidation on blockchain transactions

### API & Server Actions (3)

5. `ARCH-backend-api-contract.md` → `@mydaogs/contract` - Versioned backend route contract and transport rules
6. `ARCH-api-response-wrapper.md` → `@mydaogs/contract` - Standardized response creation utilities for routes and actions
7. `ARCH-app-business-error.md` → `@mydaogs/contract` - Custom error class with status codes and localized code resolution

### Forms & Validation (2)

8. `ARCH-zod-schema-validation.md` - Zod schemas for all forms and request payloads
9. `ARCH-react-hook-form-integration.md` - Form handling with react-hook-form and zodResolver

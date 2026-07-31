# Decisions Guideline

## Upstream counterparts

12 of the docs below came from `@mydaogs/shared-docs` (adopted at 0.8.1). This tree is not redundant with the kit and is not a mirror to be collapsed: upstream states each one against placeholders, and a doc is only actionable once it names the thing you actually edit, so the local copy carries this project's paths, entities, and tooling

**A fix to the rule itself belongs upstream; a fix to how this project binds it belongs here.** When the two disagree on package behaviour the kit wins and the local copy is stale — check the version actually resolved in the lockfile

| Local | Upstream file |
| --- | --- |
| `auth.md` | `@mydaogs/shared-docs` → `decisions/auth.md` |
| `backend-app-extraction.md` | `@mydaogs/shared-docs` → `decisions/backend-app-extraction.md` |
| `backend.md` | `@mydaogs/shared-docs` → `decisions/backend.md` |
| `data-flow.md` | `@mydaogs/shared-docs` → `decisions/data-flow.md` |
| `database-per-environment.md` | `@mydaogs/shared-docs` → `decisions/database-per-environment.md` |
| `frontend.md` | `@mydaogs/shared-docs` → `decisions/frontend.md` |
| `monorepo.md` | `@mydaogs/shared-docs` → `decisions/monorepo.md` |
| `nextjs-runtime-and-cache-components.md` | `@mydaogs/shared-docs` → `decisions/nextjs-runtime-and-cache-components.md` |
| `ppr-postponed-state-invariant.md` | `@mydaogs/shared-docs` → `decisions/ppr-postponed-state-invariant.md` |
| `solidity-upgradeability.md` | `@mydaogs/shared-docs` → `decisions/solidity-upgradeability.md` |
| `tech-stack.md` | `@mydaogs/shared-docs` → `decisions/tech-stack.md` |
| `viewport-driven-read-marking.md` | `@mydaogs/shared-docs` → `decisions/viewport-driven-read-marking.md` |

An entry in the list below marked `→ @mydaogs/<package>` is not in this folder at all: it ships with that package and is read at its root

## Rules for working with decisions docs

- Most decisions are written for `<monorepo>/apps/app` unless specified otherwise
- Every time a new decision is created it must be added to the `Decisions list` below with file name and short description for easier navigation
- An entry marked `→ @mydaogs/<package>` ships with that package rather than in this folder; read it at the package root. An entry marked `→ project-authored` has no upstream copy and is written fresh per project

## Decisions list (file name + one sentence short description)

1. `tech-stack.md` - chosen tech stack and why
2. `monorepo.md` - monorepo structure and the Turbo transit-task pattern
3. `frontend.md` - client-side structure
4. `backend.md` - server-side structure
5. `data-flow.md` - all onchain and offchain, client and server side data flow
6. `auth.md` - auth provider, solutions and flows
7. `backend-app-extraction.md` - standalone backend deployment, contract versioning, and deploy-ordering rules
8. `cache-handlers-shared-store.md` → `@mydaogs/cache-handler` - cross-deployment Next.js server cache invalidation via a shared Redis store
9. `nextjs-runtime-and-cache-components.md` - Next.js/React versions, Turbopack, Cache Components, React Compiler config
10. `ppr-postponed-state-invariant.md` - the `cacheComponents` PPR postponed-state invariant on dynamic routes and its workaround
11. `database-per-environment.md` - dedicated database cluster per environment to prevent dev reseeds from orphaning onchain references
12. `solidity-upgradeability.md` - UUPS proxy deployment, initializer, and upgrade authorization model
13. `viewport-driven-read-marking.md` - receipt-based, viewport-triggered, chunked read marking for feeds and chat

## Decisions a project must add for itself

These are always required and always project-specific — write them fresh rather than porting:

- `data-models.md` → project-authored - the offchain data entities
- `blockchain.md` → project-authored - which contracts exist and what each owns
- `integrations.md` → project-authored - third-party services chosen
- `non-goals.md` → project-authored - what is explicitly not to be built

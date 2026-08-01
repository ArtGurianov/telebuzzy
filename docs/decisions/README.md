# Decisions Guideline

## Upstream counterparts

12 of the docs below came from `@mydaogs/shared-docs` (adopted at 0.9.0). This tree is not redundant with the kit and is not a mirror to be collapsed: upstream states each one against placeholders, and a doc is only actionable once it names the thing you actually edit, so the local copy carries this project's paths, entities, and tooling

**A fix to the rule itself belongs upstream; a fix to how this project binds it belongs here.** When the two disagree on package behaviour the kit wins and the local copy is stale — check the version actually resolved in the lockfile

| Local | Upstream file |
| --- | --- |
| `solidity-upgradeability.md` | `@mydaogs/shared-docs` → `decisions/solidity-upgradeability.md` |

An entry in the list below marked `→ @mydaogs/<package>` is not in this folder at all: it ships with that package and is read at its root

Several upstream decision docs shipped by `@mydaogs/shared-docs` (`auth.md`, `monorepo.md`, `tech-stack.md`, `backend.md`, `backend-app-extraction.md`, `data-flow.md`, `frontend.md`, `database-per-environment.md`, `nextjs-runtime-and-cache-components.md`, `ppr-postponed-state-invariant.md`, `viewport-driven-read-marking.md`) describe stack choices this project does not adopt (Better Auth + organizations, a Turborepo monorepo with a separate backend app, Next.js Cache Components/PPR, chat-style read receipts). Per the kit's own adoption steps, those docs were deleted rather than kept as placeholders

## Rules for working with decisions docs

- Every time a new decision is created it must be added to the `Decisions list` below with file name and short description for easier navigation
- An entry marked `→ @mydaogs/<package>` ships with that package rather than in this folder; read it at the package root. An entry marked `→ project-authored` has no upstream copy and is written fresh per project

## Decisions list (file name + one sentence short description)

1. `solidity-upgradeability.md` - UUPS proxy deployment, initializer, and upgrade authorization model

## Decisions a project must add for itself

These are always required and always project-specific — write them fresh rather than porting:

- `data-models.md` → project-authored - the offchain data entities
- `blockchain.md` → project-authored - which contracts exist and what each owns
- `integrations.md` → project-authored - third-party services chosen
- `non-goals.md` → project-authored - what is explicitly not to be built

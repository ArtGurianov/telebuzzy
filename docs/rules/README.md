# General Rules Guideline

## Upstream counterparts

15 of the docs below came from `@mydaogs/shared-docs` (adopted at 0.8.1). This tree is not redundant with the kit and is not a mirror to be collapsed: upstream states each one against placeholders, and a doc is only actionable once it names the thing you actually edit, so the local copy carries this project's paths, entities, and tooling

**A fix to the rule itself belongs upstream; a fix to how this project binds it belongs here.** When the two disagree on package behaviour the kit wins and the local copy is stale — check the version actually resolved in the lockfile

| Local | Upstream file |
| --- | --- |
| `admin-actions-rules.md` | `@mydaogs/shared-docs` → `rules/admin-actions-rules.md` |
| `auth-permission-rules.md` | `@mydaogs/shared-docs` → `rules/auth-permission-rules.md` |
| `code-organization-rules.md` | `@mydaogs/shared-docs` → `rules/code-organization-rules.md` |
| `contract-lifecycle-rules.md` | `@mydaogs/shared-docs` → `rules/contract-lifecycle-rules.md` |
| `dev-phase-state-rules.md` | `@mydaogs/shared-docs` → `rules/dev-phase-state-rules.md` |
| `dev-workflow-rules.md` | `@mydaogs/shared-docs` → `rules/dev-workflow-rules.md` |
| `docs-rules.md` | `@mydaogs/shared-docs` → `rules/docs-rules.md` |
| `external-docs-rules.md` | `@mydaogs/shared-docs` → `rules/external-docs-rules.md` |
| `forms-rules.md` | `@mydaogs/shared-docs` → `rules/forms-rules.md` |
| `loading-state-rules.md` | `@mydaogs/shared-docs` → `rules/loading-state-rules.md` |
| `pagination-rules.md` | `@mydaogs/shared-docs` → `rules/pagination-rules.md` |
| `prisma-mongodb-rules.md` | `@mydaogs/shared-docs` → `rules/prisma-mongodb-rules.md` |
| `testing-rules.md` | `@mydaogs/shared-docs` → `rules/testing-rules.md` |

An entry in the list below marked `→ @mydaogs/<package>` is not in this folder at all: it ships with that package and is read at its root

`i18n-string-rules.md` (next-intl) and `tabs-query-param-rules.md` (a URL-synced tab-section registry) were deleted: this project ships no i18n library and has no tab-section UI

## Rules for adding a new General Rule

- All _General Rules_ must be listed in this current file list below for easy navigation. Keep this list updated
- _General Rules_ file must be structured following a template below
- An entry marked `→ @mydaogs/<package>` ships with that package rather than in this folder; read it at the package root

## Template for documenting General Rules

- File name `[<rule-name>]-rules.md`
- Rules bullet list
- When to use and when NOT to use (if applicable)
- Examples (if applicable)

## General Rules list (file name + one sentence short description)

1. `docs-rules.md` - Rules for writing docs
2. `testing-rules.md` - Rules for where tests are required and where they are not
3. `external-docs-rules.md` - Rules for external libraries and packages
4. `code-organization-rules.md` - Rules for where new code should live and how to export it
5. `dev-workflow-rules.md` - Rules for running dev, build, lint, format, and DB tasks
6. `loading-state-rules.md` - Rules requiring shared loading primitives instead of ad-hoc loaders
7. `auth-permission-rules.md` - Rules for checking permissions in server actions and API route handlers
8. `forms-rules.md` - Rules for implementing consistent forms with `react-hook-form`, Zod schemas, shared form UI, and server actions
9. `pagination-rules.md` - Rules for cursor pagination, lazy infinite scrolling, and approved exceptions
10. `admin-actions-rules.md` - Rules requiring wallet-signature submission and onchain role verification for all admin actions
11. `prisma-mongodb-rules.md` - Rules for avoiding null-vs-missing filter pitfalls and intra-handler retry loops when using Prisma with MongoDB
12. `bigint-serialization-rules.md` → `@mydaogs/core` - Rules for serializing and consuming `bigint` values across JSON boundaries
13. `contract-lifecycle-rules.md` - Rules coupling contract deploys/upgrades with database prunes, webhook regeneration, and the indexer cold-start floor
14. `dev-phase-state-rules.md` - Rules forbidding old-vs-current documentation and requiring a version bump instead of a migration while data is disposable

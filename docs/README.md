# Docs

## Table of contents

- [`product/README.md`](product/README.md) - domain entities, user types, product vision
- [`decisions/README.md`](decisions/README.md) - architecture decisions and system structure
- [`rules/README.md`](rules/README.md) - hard rules for working in the repo
- [`units/README.md`](units/README.md) - reusable code unit tracking (components, hooks, utils, types)
- [`features/README.md`](features/README.md) - architecture blueprints and user stories
- [`runbooks/README.md`](runbooks/README.md) - operational procedures (deployment, database, integrations)

## Recommended reading order

1. [`product/README.md`](product/README.md)
2. [`decisions/blockchain.md`](decisions/blockchain.md)
3. [`decisions/solidity-upgradeability.md`](decisions/solidity-upgradeability.md)
4. [`rules/README.md`](rules/README.md)
5. [`units/README.md`](units/README.md)

## Reusable code pieces

Some docs live next to their implementation rather than in this tree, so they
move when the code moves. This repo is two independent packages, not a pnpm
workspace — there is no shared package boundary, only within-app reuse. The
barrels a new unit is exported from:

- `telebuzzy-frontend/src/lib/utils/index.ts` - reusable utilities
- `telebuzzy-frontend/src/lib/hooks/` - reusable hooks
- `telebuzzy-frontend/src/components/**/index.ts` - reusable components (re-exported per component folder, where present)
- `telebuzzy-frontend/src/app/actions/*.ts` - server actions, imported directly by path (no barrel yet)

## Rules for creating new code pieces

See [`rules/code-organization-rules.md`](rules/code-organization-rules.md)

## Docs that live in packages

Parts of this tree are adopted from [`@mydaogs/shared-docs`](https://www.npmjs.com/package/@mydaogs/shared-docs)
and the `@mydaogs/*` packages. The two are **not** copies of each other and
neither replaces the other:

- A **kit doc** describes the package's behaviour — its exported API, its
  invariants, what breaks if you change them. It ships with the package and
  renders on its npm page
- The **doc of the same name here** describes this product's adoption of that
  pattern: which apps use it, which routes, which entities, and the decisions
  that only make sense with this project's constraints in view

So a shared name means the two are related, not redundant. The kit doc is
authoritative for package behaviour; this tree is authoritative for how the
product uses it and for everything product-specific

Each folder's `README.md` records which of its docs have an upstream counterpart
and which file each one tracks. Check the version actually resolved in the
lockfile before treating an upstream doc as current

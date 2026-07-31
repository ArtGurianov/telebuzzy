# Code organization rules

_unit_ stands for either _React component_, _React hook_, _utility function_, or _TypeScript type_

## Rules description

These rules define where new code should live so the codebase stays discoverable and reusable code is centralized

## When to use

- Every time you add a new _unit_
- Every time you move or refactor code and need to decide whether it should be local or reusable

## When NOT to use

- If new piece of code is tightly coupled and is not expected to be reused

## Rules

- Before creating a _unit_, check `units/README.md` and the relevant units page to see if something already exists
- Prefer reusing or extending an existing _unit_ over creating a new one
- If you create a new _unit_, start by placing it close to where it is used and promote it later if it becomes reusable
- Non-reusable units live colocated next to the route or component that uses them
- Reusable units live under `telebuzzies-frontend/src/lib/{utils,hooks}/` or `telebuzzies-frontend/src/components/` and are re-exported via the relevant `index.ts` barrel, where one exists
- After creating or moving a unit, update the relevant file under `units/` so units stay discoverable
- Prefer `export const` rather than default exports
- This repo has no shared package — `telebuzzies-frontend` and `telebuzzies-solidity` are two independent, non-workspace packages, so "reusable" here means reusable within the frontend app, not across packages

## Barrel locations

- `telebuzzies-frontend/src/lib/utils/index.ts` - reusable utilities
- `telebuzzies-frontend/src/lib/hooks/` - reusable hooks
- `telebuzzies-frontend/src/components/**/index.ts` - reusable components (re-exported per component folder, where present)

## Examples

- A helper function used across multiple pages should go into `telebuzzies-frontend/src/lib/utils/` and be re-exported from `telebuzzies-frontend/src/lib/utils/index.ts`
- A component used by only one route stays colocated with that route instead of moving to `src/components/`

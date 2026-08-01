# Code Units Guideline

## Upstream counterparts

5 of the docs below came from `@mydaogs/shared-docs` (adopted at 0.9.0). This tree is not redundant with the kit and is not a mirror to be collapsed: upstream states each one against placeholders, and a doc is only actionable once it names the thing you actually edit, so the local copy carries this project's paths, entities, and tooling

**A fix to the rule itself belongs upstream; a fix to how this project binds it belongs here.** When the two disagree on package behaviour the kit wins and the local copy is stale — check the version actually resolved in the lockfile

| Local | Upstream file |
| --- | --- |
| `components.md` | `@mydaogs/shared-docs` → `units/components.md` |
| `hooks.md` | `@mydaogs/shared-docs` → `units/hooks.md` |
| `types.md` | `@mydaogs/shared-docs` → `units/types.md` |
| `utils.md` | `@mydaogs/shared-docs` → `units/utils.md` |

An entry in the list below marked `→ @mydaogs/<package>` is not in this folder at all: it ships with that package and is read at its root

`useMarkReadOnView.md` was deleted: it documents a viewport-driven chat/notification read-marking hook this project does not have

## General purpose

Units are _react components_, _react hooks_, _utility functions_, _typescript types_ — pieces of code that should be tracked and documented

Use these docs as an index to discover what already exists before creating new code pieces

## Placement

Units can be placed in several locations and moved depending on reusability of a unit:

- Reusable across the app are placed in the app's high-level shared folder
- Non-reusable are placed close to where they are being used

Exact locations are described in each unit doc markdown file. Placement rules are defined in `rules/code-organization-rules.md`

## Unit lifecycle

- Before creating a _unit_, the list of existing units should be analyzed and a decision made whether there is a suitable one, or one that requires modification to be reused
- If a new _unit_ is created, it should first be placed close to where it is being used (non-reusable) and documented in the list of non-reusable units in the dedicated file
- If a unit that suits the needs is found, it should be reused. The code location should be changed as needed — moving the unit either from non-reusable to shared, from shared within an app to shared between apps, or from non-reusable to shared between apps. Documentation should be updated accordingly

## Units docs list (file name + description)

- `./components.md` - React Components
- `./hooks.md` - React Hooks
- `./utils.md` - Utility Functions
- `./types.md` - TypeScript Types

## How the inventories work

`components.md`, `hooks.md`, `utils.md`, and `types.md` ship as **empty templates**. They are per-project inventories by nature — the value is the structure and the discipline of keeping them current, not any inherited contents. Fill them as units are created

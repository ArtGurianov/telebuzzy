# Dev phase state rules

The project is pre-production. No environment holds data worth preserving, so a persisted shape that no longer matches the code is **reset or rejected**, never migrated. These rules stop being true at launch

What that does and does not mean:

- The **database** is pruned only as part of a fresh contract deploy — pruning and deploying are one operation, not two (see `contract-lifecycle-rules.md`). It is not pruned on every dev cycle
- **Browser storage** (`localStorage`, `sessionStorage`) lives on each user's device and can never be centrally cleared. The only lever is the reader: it rejects what it does not recognize, and the stale bytes sit there until the browser or the user drops them

So the guarantee is not "everything is wiped", it is "nothing old is ever read"

## Never document old-vs-current behavior

- Docs describe the system **as it is now**. Do not write before/after comparisons, migration narration, dated decision layers that supersede one another, or step-by-step build chronologies
- Do not write "previously", "no longer", "used to", "the old X was removed", "this replaces", "now uses … instead of", "pre-existing", "unchanged by this change", "stays unchanged", "preserves the existing X", "was tried and reverted", or `Legacy/…` section headings
- State rationale as a present-tense constraint. Not "X previously returned silently, now it throws" but "X throws on these two states, which would otherwise be indistinguishable from success"
- A doc whose only subject is a removed feature must be deleted, and its `README.md` index entry removed with the surrounding list renumbered

### When it is NOT old-vs-current

Keep wording that describes **live** behavior rather than repo history:

- runtime state — "when the member no longer exists", "a record that is no longer `ACTIVE`", "if the event is no longer newer"
- a real enum value or status — a `LEGACY` status value, an active/legacy list filter
- domain history the product itself stores — historical slug arrays, invitation history, onchain event audit rows, browser/modal navigation history
- rolling-deploy compatibility windows, previous local-chain session warnings, and previously deployed contract addresses — these are operational recovery facts
- rejected alternatives and the reasoning against them; that is current rationale, not history

## Bump the version, do not write a migration

This applies to a **versioned envelope**: an independently retained record whose shape the code must validate before trusting it, and which no deploy can reach out and rewrite. Browser storage records, KV cache entries, and cross-service wire contracts qualify. It does **not** apply to Prisma documents (no per-row shape version; schema changes go through `db:push` and, if rows cannot satisfy them, a prune) or to values re-derived on every load

For a versioned envelope, when the shape changes:

- **Bump the version.** Do not write a migration, a backfill, a compatibility branch, or a reader for the older shape
- The reader must accept **only** the current version and discard anything else. One equality check, no fallbacks
- Do not add cleanup code for keys or shapes from an earlier generation. A rejecting reader already makes them unreachable, and the cleanup itself becomes stale history
- Do not document the earlier generations. The doc describes the current version only

Maintain a table of every versioned envelope in the project (its `wagmi` cookie-storage state follows wagmi's own versioning, not one this project defines, so it is not listed here)

When adding a versioned envelope, give it a version from the start and add it here:

| Envelope | Location | How a mismatch resolves |
| --- | --- | --- |
| Pending subscription tx record | `localStorage`, key `tx_sync:<hash>` (`@mydaogs/web3-tx`'s `createTxSyncStorage`, wired in `telebuzzy-frontend/src/config/web3/txSync.ts`) | Reader accepts only `version: 1` with a recognized entity/action/conflict key from the `SUBSCRIPTION` vocabulary; anything else is discarded on read | --- |

An **unversioned** persisted record is acceptable only when every read is a defensive lookup that falls back to a default, so a shape change degrades to "value not restored" rather than corrupting state. Give it a version the moment it carries anything a stale value could break

## When to use and when NOT to use

- Applies to everything under `docs/` and to every versioned-envelope reader in `telebuzzy-frontend`
- Does **not** apply to Solidity. Onchain state is not disposable in the same way: storage layout must be preserved across upgrades, migration initializers are legitimate, and `contract-lifecycle-rules.md` governs when a fresh deploy plus prune is allowed instead
- Does **not** apply to legally required retention wording, which must describe prior processing to be accurate

## Revisit at launch

Once real user data exists, the second half of this file inverts: shape changes then need migrations and backfills, and version bumps stop being free. Delete or rewrite this file at that point rather than letting it drift

# Testing rules

- Do not add tests for `telebuzzies-frontend/`. Validate changes with lint/build instead
- Add and maintain tests for smart contracts in `telebuzzies-solidity/` using Foundry (`forge test`)

## Rationale

Offchain code in this stack is validated by TypeScript, ESLint, and the production build. Onchain code has no such safety net and handles value, so it carries the full test burden. A project that wants offchain coverage should replace this file rather than partially relax it — a half-enforced testing rule is worse than an explicit absence

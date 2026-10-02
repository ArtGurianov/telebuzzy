# Dev workflow rules

## Rule description

These rules define where to run commands and what the supported workflows are for local development, builds, linting, formatting, and database tasks

## When to use

- Any time you need to run dev, build, lint, or format commands
- Any time you need to work with Prisma (generate or push)
- Any time you need to set up environment variables

## When NOT to use

- Smart contract development, testing, and deployment (see `decisions/solidity-upgradeability.md` and `contract-lifecycle-rules.md`)

## Rules

- This repo is two independent packages, not a pnpm workspace: run frontend commands from `telebuzzy-frontend/` and Foundry commands from `telebuzzy-solidity/`. There is no root script that runs both
- Use `pnpm` for the frontend package
- `pnpm install` in `telebuzzy-frontend/` runs `postinstall` (`prisma generate` + webhook registration), which calls `getServerConfig()` — a complete, valid `.env` is required for install to finish, not just for running the dev server
- Prisma client generation
  - Run `pnpm db:generate` when `telebuzzy-frontend/prisma/schema.prisma` changes or the Prisma client is stale
- Database schema push
  - `pnpm db:push` pushes schema changes to MongoDB (skips `generate`)
  - `pnpm db:flush` force-resets the database — destructive, dev/test only
- Telegram webhook
  - `pnpm webhook:register` re-registers the bot webhook URL with the Telegram Bot API; runs automatically on `postinstall` too
- Dev server
  - `pnpm dev` starts Next.js on port 80 with `--experimental-https`; binding a privileged port requires elevated privileges
  - If you hit permissions issues with the privileged port, either run with `sudo` or change the port in `telebuzzy-frontend/package.json`
  - If you hit permissions issues reading certificates, check `telebuzzy-frontend/certificates/` ownership and permissions
- Environment variables
  - Full env var lists are in each package's `.env.example`
  - `telebuzzy-frontend/src/config/env.ts` validates client and server env vars via Zod at module scope, so an invalid `.env` fails at import time, not request time

## Troubleshooting

- `EACCES` on a local certificate key
  - Check file ownership and permissions under `telebuzzy-frontend/certificates/`
  - Either run the dev server with `sudo` or fix the file permissions locally so your user can read the key
- Privileged port binding errors
  - Either run the dev server with `sudo` or change the dev port in `telebuzzy-frontend/package.json`

## Examples

```bash
cd telebuzzy-frontend
pnpm install
pnpm dev
pnpm build
pnpm lint
```

```bash
cd telebuzzy-frontend
pnpm db:generate
pnpm db:push
```

```bash
cd telebuzzy-solidity
forge build
forge test
```

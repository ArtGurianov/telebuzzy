# Runbooks

Operational procedures — one-time environment setup and the repeatable steps behind deploys, database management, and integrations

The kit ships no copy of this folder — it is project-specific by nature

## Rules for working with these docs

- Every doc in this folder must be listed below with its file name and a one-sentence description, so the index and the folder never disagree

## Runbooks list (file name + when to use it)

1. `deploy-contracts.md` - deploy a fresh `Telebuzzy` proxy (plus TestUSDT and dividends on testnet) to Sepolia with Foundry, then point the frontend at it

# Telebuzzy

**Get your business notifications straight into your personal Telegram.**

New customer signed up? Payment failed? Server went down? Send one HTTP request from your app and the message lands in your Telegram chat. No SDK to install, no Telegram bot to build.

🌐 **[telebuzzy.xyz](https://telebuzzy.xyz)** · 🤖 **[@telebuzzy_bot](https://t.me/telebuzzy_bot)**

---

## Getting started (3 steps)

### 1. Get your API key

Sign in at **[telebuzzy.xyz](https://telebuzzy.xyz)** with your email (we send you a magic link, no password). Under **1. Get Api key**, press **Get** and copy the key with the clipboard button.

> 🔒 Treat the API key like a password. Keep it in an environment variable (e.g. `TELEBUZZY_API_KEY`) and never commit it to a public repository. If it leaks, press **Reset** on the website to get a new one.

### 2. Connect the Telegram bot

Open **[@telebuzzy_bot](https://t.me/telebuzzy_bot)** in Telegram, press **Start**, and send:

```
/set_api_key YOUR_API_KEY
```

The bot replies *"Success! You can now start sending notifications from your services."*

> ⚠️ The bot is **@telebuzzy_bot**. Older versions of this service used `@bleadio_bot`, which is no longer used. Make sure you are talking to **@telebuzzy_bot**.

### 3. Send your first notification

```bash
curl -X POST https://telebuzzy.xyz/api/notify \
  -H "Content-Type: application/json" \
  -d '{
    "apiKey": "'"$TELEBUZZY_API_KEY"'",
    "title": "From My Business",
    "action": "New customer",
    "email": "jane@example.com",
    "timestamp": "'"$(date -u +%Y-%m-%dT%H:%M:%SZ)"'"
  }'
```

That's it. Check your Telegram. 🎉

Ready-to-copy examples for **JavaScript, Python, Go, PHP and curl** are on [telebuzzy.xyz](https://telebuzzy.xyz).

---

## API reference

There is a single endpoint:

```
POST https://telebuzzy.xyz/api/notify
Content-Type: application/json
```

### Request body

| Field | Required | Type | Description |
|---|---|---|---|
| `apiKey` | ✅ | string | Your API key |
| `title` | ✅ | string | Headline of the notification |
| `app` | | string | Which app or service sent it |
| `action` | | string | What happened, e.g. `"New customer"` |
| `timestamp` | | string or number | When it happened: an ISO 8601 string (`"2026-10-02T04:49:38Z"`) or a Unix timestamp in seconds or milliseconds. Shown in UTC |
| *any other field* | | string, number or boolean | Shown under **OTHER DATA FIELDS**, e.g. `"orderTotal": 42` |

Nested objects and arrays are not supported. Send them as strings if you need them.

### What you get in Telegram

```
TITLE: From My Business
APP: Shop
ACTION: New customer
DATE: 2026-10-02 04:49:38 UTC

OTHER DATA FIELDS
email: jane@example.com
orderTotal: 67
```

### Responses

Success returns `200` with `{}`. Errors return a JSON body `{ "error": "<what went wrong>" }` and one of these statuses:

| Status | Meaning | What to do |
|---|---|---|
| `400` | Invalid JSON, a missing/invalid field, or the API key isn't connected to Telegram yet | Check the `error` message; if it says to register your key, do [step 2](#2-connect-the-telegram-bot) |
| `404` | API key not found | Copy the key again from the website (it changes when you reset it) |
| `422` | Telegram refused the message, e.g. you blocked @telebuzzy_bot | Open [@telebuzzy_bot](https://t.me/telebuzzy_bot) and press **Start** again |
| `429` | You've used up your plan's monthly messages | Wait for the next billing period or upgrade to PRO |
| `502` / `503` | Telegram is temporarily unavailable or rate-limiting | Retry after a short wait |

Messages that fail to deliver are **not** counted against your limit.

---

## Plans

| | LITE | PRO |
|---|---|---|
| Price | Free | Monthly or annual subscription |
| Messages | Limited per 30-day period | Much higher limit per 30-day period |

Current limits and prices are shown on the **Billing** page at [telebuzzy.xyz](https://telebuzzy.xyz). PRO is paid in USD stablecoin from a crypto wallet (MetaMask). We email you when you reach your limit, and when your first message of a new billing period resets the counter.

> 🧪 The app currently runs on the **Sepolia testnet**, so PRO is paid with free test tokens.

---

## FAQ

**Do I need to install a library?**
No. It's a plain HTTPS `POST`, so any language or tool that can send JSON works.

**Can I send notifications to several people?**
An API key delivers to the one Telegram account that registered it. Each person needs their own Telebuzzy account.

**I switched Telegram accounts. How do I move my notifications?**
Send `/set_api_key YOUR_API_KEY` to [@telebuzzy_bot](https://t.me/telebuzzy_bot) from the new account.

**Where can I get help?**
Email [support@telebuzzy.xyz](mailto:support@telebuzzy.xyz).

---

## For developers

This repository is a monorepo with two independent packages:

| Package | What it is | Setup guide |
|---|---|---|
| [`telebuzzy-frontend/`](telebuzzy-frontend/README.md) | Next.js web app, the `/api/notify` endpoint and the Telegram bot webhook | [README](telebuzzy-frontend/README.md) |
| [`telebuzzy-solidity/`](telebuzzy-solidity/README.md) | Foundry project with the `Telebuzzy` subscription smart contract | [README](telebuzzy-solidity/README.md) |

Architecture decisions, rules and runbooks live in [`docs/`](docs/README.md).

## License

See [LICENSE](LICENSE).

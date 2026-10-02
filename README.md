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
  -H "Authorization: Bearer $TELEBUZZY_API_KEY" \
  -d '{
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
Authorization: Bearer <your API key>
Idempotency-Key: <unique id of this event>   (optional)
```

### Headers

| Header | Required | Description |
|---|---|---|
| `Authorization` | ✅ | `Bearer <your API key>`. Headers are less likely than request bodies to end up in proxy and application logs. Sending `apiKey` in the JSON body still works for older integrations |
| `Idempotency-Key` | | Any string up to 255 characters that identifies this event, e.g. your event or order id. See [Safe retries](#safe-retries) |

### Request body

| Field | Required | Type | Description |
|---|---|---|---|
| `title` | ✅ | string | Headline of the notification |
| `severity` | | `"critical"`, `"warning"` or `"info"` | How urgent it is. See [Severity](#severity) |
| `app` | | string | Which app or service sent it |
| `action` | | string | What happened, e.g. `"New customer"` |
| `timestamp` | | string or number | When it happened: an ISO 8601 string (`"2026-10-02T04:49:38Z"`) or a Unix timestamp in seconds or milliseconds. Shown in UTC |
| *any other field* | | string, number or boolean | Shown under **OTHER DATA FIELDS**, e.g. `"orderTotal": 42` |

Nested objects and arrays are not supported. Send them as strings if you need them. `apiKey` and `idempotencyKey` are also accepted as body fields; the headers take precedence.

### What you get in Telegram

```
🔴 CRITICAL
TITLE: Payments are failing
APP: Shop
ACTION: Checkout error rate > 20%
DATE: 2026-10-02 04:49:38 UTC

OTHER DATA FIELDS
region: eu-west-1
errorRate: 0.23
```

### Severity

| `severity` | Badge | Telegram notification |
|---|---|---|
| `critical` | 🔴 **CRITICAL** | With sound. May go over your monthly limit, see [Limits](#limits-and-the-critical-reserve) |
| `warning` | 🟡 **WARNING** | With sound |
| `info` | ℹ️ *INFO* | **Silent**: the message arrives without sound or vibration |
| *(not set)* | none | With sound |

Telegram doesn't let a bot make a notification louder than normal, so `critical` stands out by its badge and by `info` messages being silent.

### Safe retries

If a request times out, you can't know whether the message was delivered. Send an `Idempotency-Key` and retry with **the same key**:

- If the first attempt was delivered, the retry returns `200` with `{ "duplicate": true }`. Nothing is sent again and nothing is counted
- If the first attempt failed, the retry delivers normally
- If the first attempt is still being processed, the retry gets `409`. Wait a few seconds and retry again

Keys are remembered for **24 hours**. In one rare case a retry can still produce a duplicate: Telebuzzy crashes after Telegram accepted the message but before recording it. Delivery is therefore *at least once*, with duplicates only in that edge case.

### Limits and the critical reserve

Every response (including errors, once your key is recognized) tells you where you stand:

| Response header | Meaning |
|---|---|
| `X-Telebuzzy-Limit` | Messages included in your plan per 30-day period |
| `X-Telebuzzy-Remaining` | Messages left in the current period |
| `X-Telebuzzy-Critical-Reserve-Remaining` | `critical` messages that can still go out after the limit is used up |
| `X-Telebuzzy-Reset` | When the period resets, as a Unix timestamp in seconds |

When `X-Telebuzzy-Remaining` reaches `0`, ordinary messages get `429`, but `severity: "critical"` messages keep going through the **critical reserve: 10 extra messages per period on every plan**, so an important alert isn't lost because of the limit. Once the reserve is used up too, `critical` messages also get `429`.

### Responses

Success returns `200` with `{ "duplicate": false }` (or `true`, see [Safe retries](#safe-retries)). Errors return `{ "error": "<what went wrong>" }` and one of these statuses:

| Status | Meaning | What to do |
|---|---|---|
| `400` | Invalid JSON, a missing/invalid field, or the API key isn't connected to Telegram yet | Check the `error` message; if it says to register your key, do [step 2](#2-connect-the-telegram-bot) |
| `401` | No API key, or a malformed `Authorization` header | Send `Authorization: Bearer <your API key>` |
| `404` | API key not found | Copy the key again from the website (it changes when you reset it) |
| `409` | A request with the same `Idempotency-Key` is still being processed | Retry with the same key after a few seconds |
| `422` | Telegram refused the message, e.g. you blocked @telebuzzy_bot | Open [@telebuzzy_bot](https://t.me/telebuzzy_bot) and press **Start** again |
| `429` | You've used up your plan's messages (and the critical reserve, for `critical`) | Wait for `X-Telebuzzy-Reset` or upgrade to PRO |
| `502` / `503` | Telegram is temporarily unavailable or rate-limiting | Retry after a short wait, with the same `Idempotency-Key` |

Messages that fail to deliver are **not** counted against your limit.

---

## Plans

| | LITE | PRO |
|---|---|---|
| Price | Free | Monthly or annual subscription |
| Messages | Limited per 30-day period | Much higher limit per 30-day period |
| Critical reserve | 10 extra `critical` messages per period | 10 extra `critical` messages per period |

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

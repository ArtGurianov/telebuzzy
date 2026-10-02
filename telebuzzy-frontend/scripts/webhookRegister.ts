import { getServerConfig } from "@/config/env";
import "dotenv/config";

const ENV_CONFIG = getServerConfig();
const TELEGRAM_API_URL = `https://api.telegram.org/bot${ENV_CONFIG.TG_BOT_TOKEN}`;
const WEBHOOK_URL = `${ENV_CONFIG.APP_DOMAIN}/api/webhook/${ENV_CONFIG.TG_BOT_TOKEN}`;
// Safe to print in build logs
const MASKED_WEBHOOK_URL = `${ENV_CONFIG.APP_DOMAIN}/api/webhook/<TG_BOT_TOKEN>`;

// Never fails the install: a Telegram outage must not block deployments.
// Check the build log for the outcome.
const register = async () => {
  try {
    const response = await fetch(`${TELEGRAM_API_URL}/setWebhook`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: WEBHOOK_URL, drop_pending_updates: true }),
    });
    const result = await response.json().catch(() => ({}));
    if (response.ok && result.ok) {
      console.log(`Telegram webhook registered: ${MASKED_WEBHOOK_URL}`);
      return;
    }
    console.error(
      `Telegram webhook NOT registered (${MASKED_WEBHOOK_URL}): ${
        result.description ?? `HTTP ${response.status}`
      }`
    );
  } catch (error) {
    console.error(
      `Telegram webhook NOT registered (${MASKED_WEBHOOK_URL}): ${
        error instanceof Error ? error.message : error
      }`
    );
  }
};

register();

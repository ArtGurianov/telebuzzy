import { getServerConfig } from "@/config/env";
import "dotenv/config";

const ENV_CONFIG = getServerConfig();
const TELEGRAM_API_URL = `https://api.telegram.org/bot${ENV_CONFIG.TG_BOT_TOKEN}`;
const WEBHOOK_URL = `${ENV_CONFIG.APP_DOMAIN}/api/webhook/${ENV_CONFIG.TG_BOT_TOKEN}`;

fetch(
  `${TELEGRAM_API_URL}/setWebhook?url=${WEBHOOK_URL}&drop_pending_updates=true`
)
  .then(() => {
    console.log("Successfully registered webhook");
  })
  .catch(() => {
    console.error("An error occured while registering webhook");
  });

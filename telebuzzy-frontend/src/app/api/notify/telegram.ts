import { getServerConfig } from "@/config/env";
import { AppBusinessError } from "@/lib/utils";

const ENV_CONFIG = getServerConfig();
const TELEGRAM_API_URL = `https://api.telegram.org/bot${ENV_CONFIG.TG_BOT_TOKEN}`;

export const sendTelegramMessage = async ({
  chatId,
  text,
  silent,
}: {
  chatId: number;
  text: string;
  silent: boolean;
}) => {
  let response: Response;
  try {
    response = await fetch(`${TELEGRAM_API_URL}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "HTML",
        disable_notification: silent,
      }),
    });
  } catch {
    throw new AppBusinessError("Telegram is unreachable, please retry", 502);
  }
  if (response.ok) return;

  const { description } = await response.json().catch(() => ({}));
  const reason = description ?? `status ${response.status}`;
  if (response.status === 429) {
    throw new AppBusinessError(`Telegram rate limit: ${reason}`, 503);
  }
  if (response.status >= 500) {
    throw new AppBusinessError(`Telegram error: ${reason}`, 502);
  }
  throw new AppBusinessError(`Telegram rejected the message: ${reason}`, 422);
};

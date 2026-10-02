import { z } from "zod";
import { ommitedKeySchema } from "../schemas/appDataSchema";
import { NOTIFY_SEVERITIES } from "./contsants";
import { NotifySeverity } from "../types";

// Telegram's HTML parse mode only requires these three to be escaped.
const escapeHtml = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const SEVERITY_BADGES: Record<NotifySeverity, string> = {
  [NOTIFY_SEVERITIES.CRITICAL]: "🔴 <b>CRITICAL</b>\n",
  [NOTIFY_SEVERITIES.WARNING]: "🟡 <b>WARNING</b>\n",
  [NOTIFY_SEVERITIES.INFO]: "ℹ️ <i>INFO</i>\n",
};

// Rendered in UTC: the sender's timezone is unknown and the server's is arbitrary.
const formatUtcDate = (date: Date) =>
  `${date.toISOString().slice(0, 19).replace("T", " ")} UTC`;

export const formatDataMessage = ({
  severity,
  title,
  app,
  action,
  timestamp,
  ...rest
}: z.output<typeof ommitedKeySchema>) => {
  const fmtSeverity = severity ? SEVERITY_BADGES[severity] : "";
  const fmtTitle = `<i>TITLE:</i> <b><u>${escapeHtml(title)}</u></b>`;
  const fmtApp = app ? `\n<i>APP:</i> <b>${escapeHtml(app)}</b>` : "";
  const fmtAction = action
    ? `\n<i>ACTION:</i> <b>${escapeHtml(action)}</b>`
    : "";
  const fmtTimestamp = timestamp
    ? `\n<i>DATE:</i> <b>${formatUtcDate(timestamp)}</b>`
    : "";

  const restEntries = Object.entries(rest);
  const restLabel = restEntries.length ? "\n\n<u>OTHER DATA FIELDS</u>\n" : "";
  const fmtRest = restEntries
    .map(
      ([key, value]) =>
        `<i>${escapeHtml(key)}</i>: <b>${escapeHtml(String(value))}</b>`
    )
    .join("\n");

  return `${fmtSeverity}${fmtTitle}${fmtApp}${fmtAction}${fmtTimestamp}${restLabel}${fmtRest}`;
};

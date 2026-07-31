import { z } from "zod";
import { ommitedKeySchema } from "../schemas/appDataSchema";

export const formatDataMessage = ({
  title,
  app,
  action,
  timestamp,
  ...rest
}: z.infer<typeof ommitedKeySchema>) => {
  const fmtTitle = `<i>TITLE:</i> <b><u>${title}</u></b>`;
  const fmtApp = app ? `\n<i>APP:</i> <b>${app}</b>` : "";
  const fmtAction = action ? `\n<i>ACTION:</i> <b>${action}</b>` : "";

  const date = timestamp ? new Date(timestamp) : null;
  const fmtTimestamp = date
    ? `\n<i>DATE:</i> <b>${date.toLocaleString()}</b>`
    : "";

  const restEntries = Object.entries(rest);
  const restLabel = restEntries.length ? "\n\n<u>OTHER DATA FIELDS</u>\n" : "";
  const fmtRest = restEntries.length
    ? restEntries
        .map(([key, value]) => `<i>${key}</i>: <b>${value}</b>`)
        .join("\n")
    : "";

  return `${fmtTitle}${fmtApp}${fmtAction}${fmtTimestamp}${restLabel}${fmtRest}`;
};

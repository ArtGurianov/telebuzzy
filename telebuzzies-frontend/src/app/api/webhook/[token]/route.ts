import db from "@/config/db";
import { getServerConfig } from "@/config/env";
import { uuidSchema } from "@/lib/schemas/uuidSchema";
import { AppBusinessError } from "@/lib/utils";
import { formatErrorMessage } from "@mydaogs/contract";
import { NextResponse } from "next/server";

const ENV_CONFIG = getServerConfig();
const TELEGRAM_API_URL = `https://api.telegram.org/bot${ENV_CONFIG.TG_BOT_TOKEN}`;

export async function POST(
  request: Request,
  {
    params,
  }: {
    params: Promise<{ token: string }>;
  }
) {
  let userId: number | null = null;
  let userIsBot: boolean | null = null;
  let userText: string | null = null;

  try {
    const { token } = await params;
    if (token !== ENV_CONFIG.TG_BOT_TOKEN) {
      throw new AppBusinessError("Unauthorized webhook call", 401);
    }

    const body = await request.json();
    const {
      message: {
        from: { id, is_bot },
        text,
      },
    } = body as {
      message: {
        from: { id: number; is_bot: boolean };
        text: string;
      };
    };

    if (
      typeof id !== "number" ||
      typeof text !== "string" ||
      typeof is_bot !== "boolean"
    ) {
      throw new AppBusinessError("Error while parsing data.", 400);
    }
    userId = id;
    userText = text;
    userIsBot = is_bot;
  } catch (error) {
    return NextResponse.json(
      { error: formatErrorMessage(error) },
      { status: 400 }
    );
  }

  try {
    if (userIsBot) {
      throw new AppBusinessError("Only human interaction.", 400);
    }
    if (userText.startsWith("/start")) {
      throw new AppBusinessError(
        "Welcome to telebuzzies.xyz bot! Get your api key from the website and paste it here via /set_api_key command!",
        200
      );
    }
    if (userText.startsWith("/set_api_key")) {
      const parsed = userText.split(" ");
      if (
        parsed.length !== 2 ||
        parsed[0] !== "/set_api_key" ||
        !uuidSchema.safeParse(parsed[1]).success
      ) {
        throw new AppBusinessError(
          "Invalid format. Please send as `/set_api_key YOUR_KEY`",
          400
        );
      }

      try {
        const alreadySet = await db.user.findFirst({
          where: { tgUserId: userId },
        });
        if (alreadySet) {
          await db.user.update({
            where: { id: alreadySet.id },
            data: { tgUserId: null },
          });
        }
      } catch {}

      const updateUser = await db.user.findFirst({
        where: { apiKey: parsed[1] },
      });
      if (!updateUser) {
        throw new AppBusinessError("ApiKey not found", 404);
      }
      await db.user.update({
        where: { id: updateUser.id },
        data: { tgUserId: userId },
      });

      throw new AppBusinessError(
        "Success! You can now start sending notifications from your services.",
        200
      );
    }
    throw new AppBusinessError("Command not recognized.", 400);
  } catch (error) {
    try {
      const qs = new URLSearchParams({
        text: formatErrorMessage(error),
      }).toString();
      await fetch(`${TELEGRAM_API_URL}/sendMessage?chat_id=${userId}&${qs}`);
    } catch (error) {
      return NextResponse.json(
        { error: formatErrorMessage(error) },
        { status: 400 }
      );
    }
  }

  return NextResponse.json({}, { status: 200 });
}

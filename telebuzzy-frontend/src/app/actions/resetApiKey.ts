"use server";

import db from "@/config/db";
import { v4 } from "uuid";
import { createActionResponse } from "@/lib/utils";

export const resetApiKey = async (userId: string) => {
  try {
    const apiKey = v4();
    await db.user.update({ where: { id: userId }, data: { apiKey } });
    return createActionResponse({ data: apiKey });
  } catch (error) {
    return createActionResponse({ error });
  }
};

"use server";

import { EmailTemplateData } from "@/components/EmailTemplate/constants";
import { EmailTemplate } from "@/components/EmailTemplate/EmailTemplate";
import { EmailMessageType } from "@/lib/types";
import { createActionResponse } from "@/lib/utils";
import { Resend } from "resend";
const resend = new Resend(process.env.AUTH_RESEND_KEY);

export const sendEmail = async (to: string, type: EmailMessageType) => {
  try {
    const { data, error } = await resend.emails.send({
      from: "noreply@blead.io",
      to,
      subject: EmailTemplateData[type].subject,
      react: EmailTemplate({ type }),
    });

    if (error) {
      return createActionResponse({ error });
    }

    return createActionResponse({ data });
  } catch (error) {
    return createActionResponse({ error });
  }
};

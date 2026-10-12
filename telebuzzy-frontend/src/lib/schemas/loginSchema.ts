import { z } from "zod";
import { emailSchema } from "./emailSchema";

export const loginSchema = emailSchema.extend({
  captchaToken: z.string().min(1, "Please complete the captcha"),
});

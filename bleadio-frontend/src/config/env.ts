import { z } from "zod";

const CLIENT_ENV = {
  NEXT_PUBLIC_APP_ENV: process.env.NEXT_PUBLIC_APP_ENV,
  NEXT_PUBLIC_NETWORK: process.env.NEXT_PUBLIC_NETWORK,
  NEXT_PUBLIC_CONTRACT_ADDRESS: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
  NEXT_PUBLIC_MESSAGES_LIMIT_LITE: process.env.NEXT_PUBLIC_MESSAGES_LIMIT_LITE,
  NEXT_PUBLIC_MESSAGES_LIMIT_PRO: process.env.NEXT_PUBLIC_MESSAGES_LIMIT_PRO,
} as const;

const clientEnvSchema = z.object({
  NEXT_PUBLIC_APP_ENV: z
    .enum(["development", "test", "production"], {
      description:
        "For more flexible deployments control. (To test a production build locally)",
    })
    .default("development"),
  NEXT_PUBLIC_NETWORK: z
    .enum(["testnet", "mainnet"], {
      description: "Network for blockchain deployments",
    })
    .default("testnet"),
  NEXT_PUBLIC_CONTRACT_ADDRESS: z
    .string({
      description: "Contract address for BLEAD solidity smart contract.",
    })
    .startsWith("0x"),
  NEXT_PUBLIC_MESSAGES_LIMIT_LITE: z.coerce.number({
    description: "Free limit for api",
  }),
  NEXT_PUBLIC_MESSAGES_LIMIT_PRO: z.coerce.number({
    description: "Paid limit for api",
  }),
});

const serverEnvSchema = clientEnvSchema.extend({
  NODE_ENV: z
    .enum(["development", "test", "production"], {
      description: "This gets updated depending on your environment",
    })
    .default("development"),
  DATABASE_URL: z
    .string({
      description: "MongoDB Connection string",
    })
    .url(),
  AUTH_SECRET: z.string({
    description: "Random secret string to use in Auth.js library",
  }),
  AUTH_RESEND_KEY: z.string({
    description: "Resend key for Auth.js library",
  }),
  TG_BOT_TOKEN: z.string({
    description: "Secret token of Blead telegram bot",
  }),
  APP_DOMAIN: z
    .string({
      description: "App domain url",
    })
    .url(),
});

export const getClientConfig = () => {
  const validationResult = clientEnvSchema.safeParse(CLIENT_ENV);
  if (!validationResult.success) {
    const errorStr = validationResult.error.errors.reduce(
      (temp, next) =>
        `${temp} ${next.path.toString().toUpperCase()} - ${next.message};`,
      ""
    );
    throw new Error(`Env vars validation failed: ${errorStr}`);
  }
  return validationResult.data;
};

export const getServerConfig = () => {
  const validationResult = serverEnvSchema.safeParse(process.env);
  if (!validationResult.success) {
    const errorStr = validationResult.error.errors.reduce(
      (temp, next) =>
        `${temp} ${next.path.toString().toUpperCase()} - ${next.message};`,
      ""
    );
    throw new Error(`Env vars validation failed: ${errorStr}`);
  }
  return validationResult.data;
};

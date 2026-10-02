import { z } from "zod";
import { createEnvConfig } from "@mydaogs/web3";

const CLIENT_ENV = {
  NEXT_PUBLIC_APP_ENV: process.env.NEXT_PUBLIC_APP_ENV,
  NEXT_PUBLIC_NETWORK: process.env.NEXT_PUBLIC_NETWORK,
  NEXT_PUBLIC_CONTRACT_ADDRESS: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
  NEXT_PUBLIC_RPC_URL: process.env.NEXT_PUBLIC_RPC_URL,
  NEXT_PUBLIC_MESSAGES_LIMIT_LITE: process.env.NEXT_PUBLIC_MESSAGES_LIMIT_LITE,
  NEXT_PUBLIC_MESSAGES_LIMIT_PRO: process.env.NEXT_PUBLIC_MESSAGES_LIMIT_PRO,
} as const;

const baseClientEnvSchema = z.object({
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
      description:
        "UUPS proxy address for the TELEBUZZY solidity smart contract (not the implementation address).",
    })
    .startsWith("0x"),
  NEXT_PUBLIC_RPC_URL: z
    .string({
      description:
        "JSON-RPC endpoint for the app chain, used by the browser and as the server fallback. Ships to the browser, so use a domain-restricted key. Required in production: viem's built-in public endpoints are not reliable",
    })
    .url()
    .optional(),
  NEXT_PUBLIC_MESSAGES_LIMIT_LITE: z.coerce.number({
    description: "Free limit for api",
  }),
  NEXT_PUBLIC_MESSAGES_LIMIT_PRO: z.coerce.number({
    description: "Paid limit for api",
  }),
});

const requireRpcUrlInProduction = (
  env: { NEXT_PUBLIC_APP_ENV: string; NEXT_PUBLIC_RPC_URL?: string },
  ctx: z.RefinementCtx
) => {
  if (env.NEXT_PUBLIC_APP_ENV === "production" && !env.NEXT_PUBLIC_RPC_URL) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["NEXT_PUBLIC_RPC_URL"],
      message: "Required when NEXT_PUBLIC_APP_ENV is production",
    });
  }
};

const clientEnvSchema = baseClientEnvSchema.superRefine(
  requireRpcUrlInProduction
);

const serverEnvSchema = baseClientEnvSchema
  .extend({
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
      description: "Secret token of Telebuzzy telegram bot",
    }),
    APP_DOMAIN: z
      .string({
        description: "App domain url",
      })
      .url(),
    RPC_URL: z
      .string({
        description:
          "Server-only JSON-RPC endpoint; overrides NEXT_PUBLIC_RPC_URL for server-side contract reads, so an unrestricted key never reaches the browser",
      })
      .url()
      .optional(),
  })
  .superRefine(requireRpcUrlInProduction);

export const getClientConfig = createEnvConfig({
  schema: clientEnvSchema,
  source: CLIENT_ENV,
});

export const getServerConfig = createEnvConfig({
  schema: serverEnvSchema,
  source: process.env,
});

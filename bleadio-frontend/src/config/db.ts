import { PrismaClient } from "@prisma/client";
import { getServerConfig } from "./env";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const prisma = globalForPrisma.prisma || new PrismaClient();

export default prisma;

if (getServerConfig().NODE_ENV !== "production")
  globalForPrisma.prisma = prisma;

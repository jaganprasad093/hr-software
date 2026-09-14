import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
  // eslint-disable-next-line no-var
  var prismaUrl: string | undefined;
}

const currentUrl = process.env.DATABASE_URL;

// Reset stale cached instance if DATABASE_URL was updated
if (global.prisma && global.prismaUrl && global.prismaUrl !== currentUrl) {
  try {
    global.prisma.$disconnect().catch(() => {});
  } catch {}
  global.prisma = undefined;
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    datasources: currentUrl ? { db: { url: currentUrl } } : undefined,
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
  global.prismaUrl = currentUrl;
}

export default prisma;


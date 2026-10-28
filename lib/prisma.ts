import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

/**
 * Resolve the correct database URL based on the runtime environment.
 *
 * - In development we use `DIRECT_DEV_URL` (or fall back to `DATABASE_DEV_URL`).
 * - In production we use `DATABASE_URL_PROD` (or fall back to `DATABASE_URL`).
 *
 * This function is deliberately tiny and pure, making it easy to unit‑test
 * and keeping side‑effects out of the Prisma client configuration.
 */
function getDatabaseUrl(): string {
  const env = process.env.NODE_ENV ?? 'development';
  let rawUrl = '';
  if (env === 'production') {
    rawUrl = process.env.DATABASE_URL_PROD ?? process.env.DATABASE_URL ?? '';
  } else {
    rawUrl = process.env.DIRECT_DEV_URL ?? process.env.DATABASE_DEV_URL ?? '';
  }
  // Remove surrounding quotes if present (common copy‑paste from .env files)
  return rawUrl.replace(/^"|"$/g, '');
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

/**
 * Build or reuse a singleton PrismaClient.
 *
 * The adapter and client are created lazily the first time `prisma` is accessed,
 * which ensures that environment variables (loaded by Next.js or dotenv) are
 * available before the connection string is read.
 */
function createPrismaClient(): PrismaClient {
  const resolvedUrl = getDatabaseUrl();
  if (resolvedUrl) {
    process.env.DATABASE_URL = resolvedUrl;
  }

  // Create a pg.Pool instance — PrismaPg delegates all I/O through this pool.
  const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

  // Gracefully handle unexpected idle‑client errors to prevent app crashes.
  pool.on('error', (err) => {
    console.error('Unexpected idle pg client error:', err);
  });

  const adapter = new PrismaPg(pool);

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

// Preserve the singleton across hot‑module reloads in development.
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

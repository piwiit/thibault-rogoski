import 'dotenv/config';
import { defineConfig } from 'prisma/config';

/**
 * Prisma CLI configuration (migrations, db push, studio, etc.).
 *
 * In development the CLI connects via the direct (non‑pooled) URL so that
 * Prisma Migrate can manage advisory locks.  In production the pooled URL
 * is used for runtime queries while the direct URL is passed here for
 * migrations executed in CI/CD.
 */
function getDatasourceUrl(): string {
  const env = process.env.NODE_ENV ?? 'development';
  let rawUrl = '';
  if (env === 'production') {
    // For migrations in production, prefer the direct (session‑mode) URL.
    rawUrl = process.env.DIRECT_URL ?? process.env.DATABASE_URL ?? '';
  } else {
    rawUrl = process.env.DIRECT_DEV_URL ?? process.env.DATABASE_DEV_URL ?? '';
  }
  return rawUrl.replace(/^"|"$/g, '');
}

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: getDatasourceUrl(),
  },
});

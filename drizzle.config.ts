import type { Config } from 'drizzle-kit';
import { join } from 'path';

export default {
  schema: './src/db/schema/index.ts',
  out: './src/db/migrations',
  dialect: 'sqlite',
  driver: 'better-sqlite3',
  dbCredentials: {
    url: join(process.cwd(), 'data', 'segmentfault.db'),
  },
} satisfies Config;

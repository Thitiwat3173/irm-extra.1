import { getRequestContext } from '@cloudflare/next-on-pages';

export function getDB(): D1Database {
  const { env } = getRequestContext();
  if (!env.DB) throw new Error('D1 database binding (DB) is not configured.');
  return env.DB;
}

export function getR2(): R2Bucket {
  const { env } = getRequestContext();
  if (!env.BUCKET) throw new Error('R2 bucket binding (BUCKET) is not configured.');
  return env.BUCKET;
}

export function getEnv() {
  const { env } = getRequestContext();
  return env;
}

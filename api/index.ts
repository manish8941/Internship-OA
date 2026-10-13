import type { Request, Response } from 'express';
import { app, bootstrap } from '../server/src/app.js';

let initialized = false;
let initPromise: Promise<void> | null = null;

async function ensureInitialized() {
  if (initialized) return;
  if (!initPromise) {
    initPromise = (async () => {
      try {
        await bootstrap();
        initialized = true;
      } catch (err) {
        console.error('[Vercel Serverless] Database bootstrap error:', err);
      }
    })();
  }
  return initPromise;
}

export default async function handler(req: Request, res: Response) {
  await ensureInitialized();

  // Ensure /api prefix is retained for Express routing
  if (req.url && !req.url.startsWith('/api')) {
    req.url = '/api' + (req.url.startsWith('/') ? req.url : '/' + req.url);
  }

  return app(req, res);
}

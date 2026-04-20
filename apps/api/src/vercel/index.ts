import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createNestApp } from "../bootstrap";

let cachedHandler: ((req: VercelRequest, res: VercelResponse) => Promise<void>) | undefined;

async function getHandler(): Promise<(req: VercelRequest, res: VercelResponse) => Promise<void>> {
  if (!cachedHandler) {
    const app = await createNestApp();
    await app.init();
    cachedHandler = app.getHttpAdapter().getInstance() as unknown as (
      req: VercelRequest,
      res: VercelResponse,
    ) => Promise<void>;
  }
  return cachedHandler;
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
): Promise<void> {
  const fn = await getHandler();
  await fn(req, res);
}

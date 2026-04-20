import type { Request, Response } from "express";
import serverlessExpress from "@vendia/serverless-express";
import { createNestApp } from "./bootstrap";

/**
 * Lambda-style entry point used by Vercel. The Nest application is created
 * once per cold start and cached at module scope so subsequent invocations
 * on the same worker reuse the bootstrapped container.
 */
type GenericHandler = (
  req: unknown,
  res: unknown,
  ...rest: unknown[]
) => unknown;
let cachedHandler: GenericHandler | undefined;

async function buildHandler(): Promise<GenericHandler> {
  const app = await createNestApp();
  await app.init();
  const expressApp = app.getHttpAdapter().getInstance();
  return serverlessExpress({ app: expressApp }) as GenericHandler;
}

export async function handler(
  req: Request,
  res: Response,
  ...rest: unknown[]
): Promise<unknown> {
  if (!cachedHandler) {
    cachedHandler = await buildHandler();
  }
  return cachedHandler(req, res, ...rest);
}

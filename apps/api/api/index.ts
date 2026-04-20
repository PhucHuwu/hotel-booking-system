import type { VercelRequest, VercelResponse } from "@vercel/node";
import { handler } from "../dist/lambda";

/**
 * Vercel routes any request matching `/api/*` to this function.
 * NestJS is configured with a global prefix of `/api`, so the URL Nest
 * receives matches the public URL 1:1 (e.g. /api/v1/auth/login).
 */
export default async function vercelHandler(
  req: VercelRequest,
  res: VercelResponse,
): Promise<void> {
  await (
    handler as unknown as (
      req: VercelRequest,
      res: VercelResponse,
    ) => Promise<void>
  )(req, res);
}

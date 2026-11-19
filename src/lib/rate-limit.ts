import "server-only";

type UpstashResult = { result?: number | string | null };

/** Fixed-window counter in Upstash Redis. Fails closed when not configured or unreachable. */
export async function enforceRateLimit(
  namespace: string,
  identifier: string,
  max: number,
  windowSeconds: number
) {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return { allowed: false, configured: false };

  const key = `parallax:${namespace}:${identifier}`;
  try {
    const response = await fetch(`${url}/pipeline`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify([
        ["INCR", key],
        ["EXPIRE", key, windowSeconds, "NX"]
      ]),
      cache: "no-store",
      signal: AbortSignal.timeout(5000)
    });
    if (!response.ok) return { allowed: false, configured: true };
    const result = (await response.json()) as UpstashResult[];
    const count = Number(result?.[0]?.result ?? 0);
    return { allowed: count > 0 && count <= max, configured: true };
  } catch {
    return { allowed: false, configured: true };
  }
}

/** Public contact form: 5 submissions per IP per hour. */
export function enforceContactRateLimit(identifier: string) {
  return enforceRateLimit("contact", identifier, 5, 3600);
}

/** Admin sign-in: 10 attempts per IP per 15 minutes. */
export function enforceAdminLoginRateLimit(identifier: string) {
  return enforceRateLimit("admin-login", identifier, 10, 900);
}

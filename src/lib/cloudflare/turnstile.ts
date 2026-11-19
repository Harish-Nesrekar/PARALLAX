import "server-only";

type TurnstileResponse = {
  success: boolean;
  hostname?: string;
  action?: string;
  "error-codes"?: string[];
};

export async function verifyTurnstile(token: string, remoteIp?: string) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  const expectedHostname = process.env.TURNSTILE_EXPECTED_HOSTNAME;

  if (!secret || !token) {
    return { success: false, reason: "Turnstile is not configured." };
  }

  const body = new URLSearchParams({
    secret,
    response: token
  });

  if (remoteIp) body.set("remoteip", remoteIp);

  const response = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
      cache: "no-store",
      signal: AbortSignal.timeout(8000)
    }
  );

  if (!response.ok) {
    return { success: false, reason: "Turnstile verification service unavailable." };
  }

  const result = (await response.json()) as TurnstileResponse;

  if (!result.success) {
    return { success: false, reason: "Turnstile verification failed." };
  }

  if (expectedHostname && result.hostname !== expectedHostname) {
    return { success: false, reason: "Turnstile hostname mismatch." };
  }

  if (result.action !== "contact") {
    return { success: false, reason: "Turnstile action mismatch." };
  }

  return { success: true as const };
}

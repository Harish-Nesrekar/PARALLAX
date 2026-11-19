import "server-only";
import { scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scrypt = promisify(scryptCallback);

/**
 * Accepts "scrypt:<salt>:<hash>" (recommended: ":" is safe in .env files) or
 * "scrypt$<salt>$<hash>". Next.js expands "$" in .env values, so prefer ":".
 */
function parseHash(encoded: string) {
  const value = encoded.trim().replace(/^["']|["']$/g, "");
  const separator = value.startsWith("scrypt:") ? ":" : value.startsWith("scrypt$") ? "$" : null;
  if (!separator) return null;
  const [scheme, salt, hash] = value.split(separator);
  if (scheme !== "scrypt" || !salt || !hash || !/^[0-9a-f]+$/i.test(hash)) return null;
  return { salt, hash };
}

export async function verifyAdminPassword(password: string, encoded: string) {
  const parsed = parseHash(encoded);
  if (!parsed) return false;
  try {
    const expected = Buffer.from(parsed.hash, "hex");
    const actual = (await scrypt(password, parsed.salt, expected.length)) as Buffer;
    return expected.length === actual.length && timingSafeEqual(expected, actual);
  } catch {
    return false;
  }
}

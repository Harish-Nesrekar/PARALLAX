// Usage: ADMIN_PASSWORD='a-long-passphrase' pnpm admin:hash-password
import { randomBytes, scryptSync } from "node:crypto";

const password = process.env.ADMIN_PASSWORD;
if (!password || password.length < 14) {
  console.error("Set ADMIN_PASSWORD to a password of at least 14 characters before running this script.");
  process.exit(1);
}
const salt = randomBytes(16).toString("hex");
const hash = scryptSync(password, salt, 64).toString("hex");
// ":" separators avoid Next.js "$" variable expansion inside .env files.
console.log(`ADMIN_PASSWORD_HASH=scrypt:${salt}:${hash}`);

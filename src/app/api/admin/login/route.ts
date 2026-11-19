import { NextRequest, NextResponse } from "next/server";
import { createHash } from "node:crypto";
import { verifyAdminPassword } from "@/lib/admin/password";
import { requireSameOrigin, setAdminCookie } from "@/lib/admin/session";
import { enforceAdminLoginRateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";
export async function POST(request: NextRequest) {
  if (!requireSameOrigin(request)) return NextResponse.json({ message: "Request origin is not allowed." }, { status: 403 });
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const ipHash = createHash("sha256").update(`admin:${ip}`).digest("hex");
  const limit = await enforceAdminLoginRateLimit(ipHash);
  if (!limit.configured) return NextResponse.json({ message: "Login protection is not configured. Configure Upstash first." }, { status: 503 });
  if (!limit.allowed) return NextResponse.json({ message: "Too many attempts. Try again later." }, { status: 429 });
  try {
    const body = await request.json();
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body.password === "string" ? body.password : "";
    const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    const passwordHash = process.env.ADMIN_PASSWORD_HASH;
    if (!adminEmail || !passwordHash || !process.env.ADMIN_SESSION_SECRET) {
      return NextResponse.json({ message: "Admin authentication is not configured." }, { status: 503 });
    }
    const emailOkay = email === adminEmail;
    const passwordOkay = await verifyAdminPassword(password, passwordHash);
    if (!emailOkay || !password.length || !passwordOkay) return NextResponse.json({ message: "Invalid email or password." }, { status: 401 });
    const response = NextResponse.json({ success: true });
    setAdminCookie(response, adminEmail);
    return response;
  } catch {
    return NextResponse.json({ message: "Unable to sign in." }, { status: 400 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { getRequestAdmin } from "@/lib/admin/session";
export async function GET(request: NextRequest) {
  const session = getRequestAdmin(request);
  return NextResponse.json({ authenticated: Boolean(session), email: session?.email ?? null });
}

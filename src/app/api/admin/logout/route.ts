import { NextRequest, NextResponse } from "next/server";
import { clearAdminCookie, requireSameOrigin } from "@/lib/admin/session";
export async function POST(request: NextRequest) {
  if (!requireSameOrigin(request)) return NextResponse.json({ message: "Request origin is not allowed." }, { status: 403 });
  const response = NextResponse.json({ success: true });
  clearAdminCookie(response);
  return response;
}

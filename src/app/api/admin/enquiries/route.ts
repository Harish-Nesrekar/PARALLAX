import { NextRequest, NextResponse } from "next/server";
import { getRequestAdmin } from "@/lib/admin/session";
import { getNeonSql } from "@/lib/neon/client";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function GET(request: NextRequest) {
  if (!getRequestAdmin(request)) return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  try {
    const sql = getNeonSql();
    const status = request.nextUrl.searchParams.get("status");
    const search = request.nextUrl.searchParams.get("q")?.trim().slice(0, 100) || "";
    const rows = await sql`
      SELECT id, name, email, company, project_type, budget, timeline, message, status, source, created_at, updated_at
      FROM public.contact_enquiries
      WHERE (${status === null || status === "all" ? null : status}::text IS NULL OR status = ${status})
        AND (${search} = '' OR name ILIKE ${`%${search}%`} OR email ILIKE ${`%${search}%`} OR company ILIKE ${`%${search}%`})
      ORDER BY created_at DESC LIMIT 200
    `;
    const stats = await sql`
      SELECT count(*)::int AS total,
        count(*) FILTER (WHERE status = 'new')::int AS new,
        count(*) FILTER (WHERE status IN ('reviewing','contacted','qualified','proposal_sent'))::int AS active,
        count(*) FILTER (WHERE status = 'converted')::int AS converted
      FROM public.contact_enquiries
    `;
    const enquiryRows = Array.isArray(rows) ? rows : [];
    const statRows = Array.isArray(stats) ? stats : [];
    return NextResponse.json({ enquiries: enquiryRows, stats: statRows[0] ?? { total: 0, new: 0, active: 0, converted: 0 } });
  } catch (error) {
    console.error("Admin enquiries GET failed:", error instanceof Error ? error.message : "unknown");
    return NextResponse.json({ message: "Unable to load enquiries." }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getRequestAdmin, requireSameOrigin } from "@/lib/admin/session";
import { getNeonSql } from "@/lib/neon/client";
const schema = z.object({ status: z.enum(["new", "reviewing", "contacted", "qualified", "proposal_sent", "converted", "closed"]) });
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Full detail for one enquiry: the enquiry itself, internal notes and activity history. */
export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  if (!getRequestAdmin(request)) return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  const { id } = await context.params;
  if (!UUID.test(id)) return NextResponse.json({ message: "Invalid enquiry ID." }, { status: 400 });
  try {
    const sql = getNeonSql();
    const [enquiryRows, noteRows, activityRows] = await Promise.all([
      sql`SELECT id, name, email, company, project_type, budget, timeline, message, status, source, created_at, updated_at
          FROM public.contact_enquiries WHERE id = ${id}::uuid`,
      sql`SELECT id, note, created_by, created_at FROM public.enquiry_notes
          WHERE enquiry_id = ${id}::uuid ORDER BY created_at DESC LIMIT 100`,
      sql`SELECT id, action, details, created_by, created_at FROM public.enquiry_activity
          WHERE enquiry_id = ${id}::uuid ORDER BY created_at DESC LIMIT 100`
    ]);
    const enquiries = Array.isArray(enquiryRows) ? enquiryRows : [];
    if (!enquiries.length) return NextResponse.json({ message: "Enquiry not found." }, { status: 404 });
    return NextResponse.json({
      enquiry: enquiries[0],
      notes: Array.isArray(noteRows) ? noteRows : [],
      activity: Array.isArray(activityRows) ? activityRows : []
    });
  } catch (error) {
    console.error("Admin enquiry GET failed:", error instanceof Error ? error.message : "unknown");
    return NextResponse.json({ message: "Unable to load enquiry details." }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  if (!getRequestAdmin(request)) return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  if (!requireSameOrigin(request)) return NextResponse.json({ message: "Request origin is not allowed." }, { status: 403 });
  const { id } = await context.params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) return NextResponse.json({ message: "Invalid enquiry ID." }, { status: 400 });
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ message: "Invalid status." }, { status: 400 });
  try {
    const sql = getNeonSql();
    const rows = await sql`
      WITH updated AS (
        UPDATE public.contact_enquiries
        SET status = ${parsed.data.status}
        WHERE id = ${id}::uuid
        RETURNING id, status, updated_at
      ), logged AS (
        INSERT INTO public.enquiry_activity (enquiry_id, action, details, created_by)
        SELECT id, 'status_changed', ${JSON.stringify({ status: parsed.data.status })}::jsonb,
          ${process.env.ADMIN_EMAIL || "admin"}
        FROM updated
        RETURNING enquiry_id
      )
      SELECT updated.id, updated.status, updated.updated_at
      FROM updated INNER JOIN logged ON logged.enquiry_id = updated.id
    `;
    const updatedRows = Array.isArray(rows) ? rows : [];
    if (!updatedRows.length) return NextResponse.json({ message: "Enquiry not found." }, { status: 404 });
    return NextResponse.json({ enquiry: updatedRows[0] });
  } catch (error) {
    console.error("Admin enquiry PATCH failed:", error instanceof Error ? error.message : "unknown");
    return NextResponse.json({ message: "Unable to update enquiry." }, { status: 500 });
  }
}

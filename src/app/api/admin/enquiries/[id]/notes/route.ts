import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getRequestAdmin, requireSameOrigin } from "@/lib/admin/session";
import { getNeonSql } from "@/lib/neon/client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const schema = z.object({ note: z.string().trim().min(1).max(5000) });

/** Add an internal note to an enquiry (never visible to the customer). */
export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  if (!getRequestAdmin(request)) return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  if (!requireSameOrigin(request)) return NextResponse.json({ message: "Request origin is not allowed." }, { status: 403 });
  const { id } = await context.params;
  if (!UUID.test(id)) return NextResponse.json({ message: "Invalid enquiry ID." }, { status: 400 });
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ message: "Write a note between 1 and 5000 characters." }, { status: 400 });

  const author = process.env.ADMIN_EMAIL?.trim() || "admin";
  try {
    const sql = getNeonSql();
    const rows = await sql`
      WITH target AS (SELECT id FROM public.contact_enquiries WHERE id = ${id}::uuid),
      added AS (
        INSERT INTO public.enquiry_notes (enquiry_id, note, created_by)
        SELECT id, ${parsed.data.note}, ${author} FROM target
        RETURNING id, note, created_by, created_at, enquiry_id
      ),
      logged AS (
        INSERT INTO public.enquiry_activity (enquiry_id, action, details, created_by)
        SELECT enquiry_id, 'note_added', '{}'::jsonb, ${author} FROM added
        RETURNING enquiry_id
      )
      SELECT added.id, added.note, added.created_by, added.created_at
      FROM added INNER JOIN logged ON logged.enquiry_id = added.enquiry_id
    `;
    const added = Array.isArray(rows) ? rows : [];
    if (!added.length) return NextResponse.json({ message: "Enquiry not found." }, { status: 404 });
    return NextResponse.json({ note: added[0] }, { status: 201 });
  } catch (error) {
    console.error("Admin note POST failed:", error instanceof Error ? error.message : "unknown");
    return NextResponse.json({ message: "Unable to save note." }, { status: 500 });
  }
}

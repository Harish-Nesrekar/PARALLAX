import { NextRequest, NextResponse } from "next/server";
import { createHash } from "node:crypto";
import { contactSchema } from "@/lib/validations/contact";
import { getNeonSql } from "@/lib/neon/client";
import { verifyTurnstile } from "@/lib/cloudflare/turnstile";
import { enforceContactRateLimit } from "@/lib/rate-limit";
import { notifyNewEnquiry } from "@/lib/notify";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 12_000;

function jsonError(message: string, status: number) {
  return NextResponse.json({ success: false, message }, { status });
}

function getClientIp(request: NextRequest) {
  // Vercel supplies x-forwarded-for. Use only the first address and hash it
  // before using it as a rate-limit identifier.
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() || "unknown";
  return createHash("sha256").update(ip).digest("hex");
}

export async function POST(request: NextRequest) {
  try {
    const contentLength = Number(request.headers.get("content-length") || 0);
    if (contentLength > MAX_BODY_BYTES) {
      return jsonError("Request is too large.", 413);
    }

    const contentType = request.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      return jsonError("Expected application/json.", 415);
    }

    const origin = request.headers.get("origin");
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
    if (origin && siteUrl) {
      try {
        const expectedOrigin = new URL(siteUrl).origin;
        if (new URL(origin).origin !== expectedOrigin) {
          return jsonError("Request origin is not allowed.", 403);
        }
      } catch {
        return jsonError("Request origin is not allowed.", 403);
      }
    }

    const rawText = await request.text();
    if (Buffer.byteLength(rawText, "utf8") > MAX_BODY_BYTES) {
      return jsonError("Request is too large.", 413);
    }

    let raw: unknown;
    try {
      raw = JSON.parse(rawText);
    } catch {
      return jsonError("Invalid JSON request.", 400);
    }

    const parsed = contactSchema.safeParse(raw);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Please check the highlighted fields.",
          errors: parsed.error.flatten().fieldErrors
        },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // Honeypot: return a generic success to bots without storing anything.
    if (data.website) {
      return NextResponse.json({
        success: true,
        message: "Your enquiry has been received."
      });
    }

    const ipHash = getClientIp(request);
    const limit = await enforceContactRateLimit(ipHash);

    if (!limit.configured) {
      return jsonError("Contact service is not fully configured yet.", 503);
    }

    if (!limit.allowed) {
      return jsonError("Too many requests. Please try again later.", 429);
    }

    const turnstile = await verifyTurnstile(
      data.turnstileToken,
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    );

    if (!turnstile.success) {
      return jsonError("Verification failed. Please try again.", 403);
    }

    const sql = getNeonSql();

    // Neon serverless HTTP driver is suitable for short-lived Next.js/Vercel
    // route handlers. The unique submission_id makes retries idempotent.
    const inserted = await sql`
      INSERT INTO public.contact_enquiries (
        submission_id, name, email, company, project_type, budget,
        timeline, message, consent_at, source
      ) VALUES (
        ${data.submissionId}::uuid,
        ${data.name},
        ${data.email},
        ${data.company || null},
        ${data.projectType},
        ${data.budget || null},
        ${data.timeline || null},
        ${data.message},
        ${new Date().toISOString()}::timestamptz,
        'website'
      )
      ON CONFLICT (submission_id) DO NOTHING
      RETURNING id
    `;

    // The default Neon HTTP query mode returns an array of rows. Narrow the
    // library union explicitly so TypeScript does not assume fullResults mode.
    const insertedRows = Array.isArray(inserted) ? inserted : [];

    // Email the owner only for genuinely new enquiries (not retried duplicates).
    if (insertedRows.length) {
      await notifyNewEnquiry({
        name: data.name,
        email: data.email,
        company: data.company,
        projectType: data.projectType,
        budget: data.budget,
        timeline: data.timeline,
        message: data.message
      });
    }

    // A duplicate submission is still acknowledged, but customer data is
    // never returned to the browser.
    return NextResponse.json(
      {
        success: true,
        message: insertedRows.length
          ? "Thank you. Your enquiry has been received."
          : "Your enquiry has already been received."
      },
      { status: insertedRows.length ? 201 : 200 }
    );
  } catch (error) {
    console.error(
      "PARALLAX contact route failed:",
      error instanceof Error ? error.message : "Unknown error"
    );

    return jsonError("Something went wrong. Please try again later.", 500);
  }
}

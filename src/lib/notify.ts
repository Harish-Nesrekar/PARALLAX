import "server-only";

type NewEnquiry = {
  name: string;
  email: string;
  company?: string;
  projectType: string;
  budget?: string;
  timeline?: string;
  message: string;
};

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string);
const oneLine = (value: string) => value.replace(/[\r\n]+/g, " ").slice(0, 120);

/**
 * Best-effort email alert to the owner via Resend's REST API.
 * Does nothing unless RESEND_API_KEY, CONTACT_NOTIFICATION_EMAIL and CONTACT_FROM_EMAIL
 * are all set. A failure never blocks the enquiry, which is already saved in the database.
 */
export async function notifyNewEnquiry(enquiry: NewEnquiry) {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_NOTIFICATION_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;
  if (!key || !to || !from) return { sent: false as const, reason: "not configured" };

  const rows: [string, string][] = [
    ["Name", enquiry.name],
    ["Email", enquiry.email],
    ["Company", enquiry.company || "-"],
    ["Project type", enquiry.projectType],
    ["Budget", enquiry.budget || "-"],
    ["Timeline", enquiry.timeline || "-"]
  ];
  const html =
    `<h2>New website enquiry</h2><table cellpadding="6">` +
    rows.map(([k, v]) => `<tr><td><b>${k}</b></td><td>${escapeHtml(v)}</td></tr>`).join("") +
    `</table><p style="white-space:pre-wrap">${escapeHtml(enquiry.message)}</p>`;

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: enquiry.email,
        subject: `New PARALLAX enquiry: ${oneLine(enquiry.name)} (${enquiry.projectType})`,
        html
      }),
      signal: AbortSignal.timeout(5000)
    });
    if (!response.ok) console.error("Enquiry notification rejected:", response.status);
    return { sent: response.ok };
  } catch {
    console.error("Enquiry notification failed to send.");
    return { sent: false as const };
  }
}

"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { ArrowUpRight, X } from "lucide-react";
import type { Enquiry, EnquiryActivity, EnquiryNote } from "@/types/admin";

export const STATUSES = ["new", "reviewing", "contacted", "qualified", "proposal_sent", "converted", "closed"];
const LABELS: Record<string, string> = {
  new: "New", reviewing: "Reviewing", contacted: "Contacted", qualified: "Qualified",
  proposal_sent: "Proposal sent", converted: "Converted", closed: "Closed"
};
const statusLabel = (s: string) => LABELS[s] ?? s;

function describe(item: EnquiryActivity) {
  if (item.action === "status_changed") return `Status changed to ${statusLabel(String(item.details?.status ?? ""))}`;
  if (item.action === "note_added") return "Note added";
  return item.action.replace(/_/g, " ");
}

type Props = {
  enquiry: Enquiry;
  onClose: () => void;
  onStatusChanged: (id: string, status: string) => void;
};

export function EnquiryDrawer({ enquiry, onClose, onStatusChanged }: Props) {
  const [notes, setNotes] = useState<EnquiryNote[]>([]);
  const [activity, setActivity] = useState<EnquiryActivity[]>([]);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadDetail = useCallback(async () => {
    try {
      const response = await fetch(`/api/admin/enquiries/${enquiry.id}`, { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Unable to load details.");
      setNotes(data.notes);
      setActivity(data.activity);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to load details.");
    } finally {
      setLoading(false);
    }
  }, [enquiry.id]);

  useEffect(() => {
    void loadDetail();
  }, [loadDetail]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  async function changeStatus(status: string) {
    setSaving(true);
    setError("");
    try {
      const response = await fetch(`/api/admin/enquiries/${enquiry.id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ status })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Status update failed.");
      onStatusChanged(enquiry.id, status);
      await loadDetail();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Status update failed.");
    } finally {
      setSaving(false);
    }
  }

  async function addNote(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draft.trim()) return;
    setSaving(true);
    setError("");
    try {
      const response = await fetch(`/api/admin/enquiries/${enquiry.id}/notes`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ note: draft })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Unable to save note.");
      setDraft("");
      await loadDetail();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to save note.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="admin-drawer-backdrop" onClick={onClose}>
      <aside className="admin-drawer" role="dialog" aria-label={`Enquiry from ${enquiry.name}`} onClick={(e) => e.stopPropagation()}>
        <div className="admin-drawer-head">
          <div>
            <p className="admin-kicker">ENQUIRY DETAILS</p>
            <h2>{enquiry.name}</h2>
          </div>
          <button onClick={onClose} aria-label="Close details"><X /></button>
        </div>
        <a className="admin-email-link" href={`mailto:${enquiry.email}`}>{enquiry.email} <ArrowUpRight size={14} /></a>

        <div className="admin-detail-grid">
          <div><small>Company</small><strong>{enquiry.company || "-"}</strong></div>
          <div><small>Project type</small><strong>{enquiry.project_type}</strong></div>
          <div><small>Budget</small><strong>{enquiry.budget || "-"}</strong></div>
          <div><small>Timeline</small><strong>{enquiry.timeline || "-"}</strong></div>
          <div><small>Received</small><strong>{new Date(enquiry.created_at).toLocaleString()}</strong></div>
          <div><small>Source</small><strong>{enquiry.source}</strong></div>
        </div>

        <div className="admin-message"><small>MESSAGE</small><p>{enquiry.message}</p></div>

        <label className="admin-status-select">
          Update lead status
          <select disabled={saving} value={enquiry.status} onChange={(e) => void changeStatus(e.target.value)}>
            {STATUSES.map((s) => <option key={s} value={s}>{statusLabel(s)}</option>)}
          </select>
        </label>

        <a className="admin-primary admin-mail-button" href={`mailto:${enquiry.email}?subject=${encodeURIComponent("Re: your PARALLAX enquiry")}`}>
          Reply by email <ArrowUpRight size={16} />
        </a>

        {error && <p className="admin-error admin-drawer-error" role="alert">{error}</p>}

        <section className="admin-notes">
          <small className="admin-section-label">INTERNAL NOTES</small>
          <form onSubmit={addNote}>
            <textarea value={draft} onChange={(e) => setDraft(e.target.value)} maxLength={5000} rows={3}
              placeholder="Private note: call summary, next step, quote details" aria-label="New internal note" />
            <button className="admin-primary" disabled={saving || !draft.trim()}>Save note</button>
          </form>
          {loading ? <p className="admin-muted">Loading notes...</p> : notes.length === 0 ? (
            <p className="admin-muted">No notes yet. Notes are visible only to you.</p>
          ) : (
            <ul className="admin-note-list">
              {notes.map((n) => (
                <li key={n.id}><p>{n.note}</p><small>{new Date(n.created_at).toLocaleString()}</small></li>
              ))}
            </ul>
          )}
        </section>

        <section className="admin-timeline">
          <small className="admin-section-label">ACTIVITY</small>
          {!loading && activity.length === 0 ? <p className="admin-muted">No activity yet.</p> : (
            <ol>
              {activity.map((a) => (
                <li key={a.id}><span>{describe(a)}</span><small>{new Date(a.created_at).toLocaleString()}</small></li>
              ))}
            </ol>
          )}
        </section>
      </aside>
    </div>
  );
}

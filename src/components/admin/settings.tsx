"use client";

import { useState } from "react";
import { LogOut, ShieldCheck, UserRound, ArrowLeft, ArrowRightFromLine } from "lucide-react";

export function AdminSettings({ email }: { email: string }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function logout() {
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/admin/logout", { method: "POST" });
      if (!response.ok) throw new Error("Unable to end the session. Please try again.");
      window.location.assign("/admin/login");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Logout failed.");
      setBusy(false);
    }
  }

  return (
    <main className="admin-shell">
      <aside className="admin-sidebar">
        <a href="/" className="admin-brand">PARALLAX<span>.</span></a>
        <p className="admin-side-label">WORKSPACE</p>
        <a className="admin-side-link" href="/admin"><span>◫</span> Enquiries</a>
        <a className="admin-side-link active" href="/admin/settings"><span>⚙</span> Settings</a>
        <div className="admin-sidebar-bottom">
          <div className="admin-secure"><ShieldCheck size={17}/><span>Private admin area<br/><small>Secure session active</small></span></div>
          <div className="admin-profile">
            <div className="admin-avatar">{email.slice(0, 1).toUpperCase()}</div>
            <div><strong>{email}</strong><small>Administrator</small></div>
            <button onClick={() => void logout()} aria-label="Sign out" title="Sign out" disabled={busy}><LogOut size={17}/></button>
          </div>
        </div>
      </aside>
      <section className="admin-main">
        <header className="admin-topbar">
          <div><p className="admin-kicker">PARALLAX / PREFERENCES</p><h1>Workspace <em>settings</em></h1></div>
          <a className="admin-refresh" href="/admin"><ArrowLeft size={16}/> Back to enquiries</a>
        </header>
        <div className="admin-content admin-settings-content">
          <div className="admin-welcome"><div><h2>Account & security</h2><p>Review your administrator account and end your session securely.</p></div></div>
          <section className="admin-settings-card">
            <div className="admin-settings-card-icon"><UserRound size={20}/></div>
            <div className="admin-settings-card-copy"><p className="admin-kicker">ADMINISTRATOR ACCOUNT</p><h2>{email}</h2><p>This is the single administrator account configured for this PARALLAX workspace.</p></div>
            <span className="admin-settings-pill"><ShieldCheck size={14}/> Active</span>
          </section>
          <section className="admin-settings-card">
            <div className="admin-settings-card-icon"><ShieldCheck size={20}/></div>
            <div className="admin-settings-card-copy"><p className="admin-kicker">SESSION SECURITY</p><h2>Protected administrator session</h2><p>Your session is managed by the server using a secure HTTP-only cookie. Keep your environment secrets private and never commit them to source control.</p></div>
          </section>
          <section className="admin-settings-card admin-settings-danger">
            <div className="admin-settings-card-icon"><LogOut size={20}/></div>
            <div className="admin-settings-card-copy"><p className="admin-kicker">END SESSION</p><h2>Sign out of PARALLAX</h2><p>End this administrator session on this browser. You will need to sign in again to manage enquiries.</p></div>
            <button className="admin-danger-button" onClick={() => void logout()} disabled={busy}>{busy ? "Signing out…" : "Sign out"} <ArrowRightFromLine size={15}/></button>
          </section>
          {error && <p className="admin-error" role="alert">{error}</p>}
        </div>
      </section>
    </main>
  );
}

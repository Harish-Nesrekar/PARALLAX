"use client";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { LockKeyhole, ArrowRight } from "lucide-react";
import { LiquidLoader } from "@/components/admin/liquid-loader";
export function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(""); setBusy(true);
    try {
      const response = await fetch("/api/admin/login", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ email, password }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Sign in failed.");
      window.location.assign("/admin");
    } catch (e) { setError(e instanceof Error ? e.message : "Unable to sign in."); setBusy(false); }
  }
  return <main className="admin-login-shell"><div className="admin-login-card"><Link href="/" className="admin-brand">PARALLAX<span>.</span></Link><div className="admin-login-icon"><LockKeyhole size={22}/></div><p className="admin-kicker">PRIVATE WORKSPACE</p><h1>Welcome <em>back.</em></h1><p className="admin-muted">Sign in to manage your agency enquiries.</p><form onSubmit={submit} className="admin-form"><label>Email address<input type="email" autoComplete="username" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@company.com"/></label><label>Password<input type="password" autoComplete="current-password" required value={password} onChange={e=>setPassword(e.target.value)} placeholder="Enter your password"/></label>{error && <p className="admin-error" role="alert">{error}</p>}<button className="admin-primary" disabled={busy}>{busy ? <><LiquidLoader size="sm" label="Signing in" /> Signing in…</> : <>Sign in <ArrowRight size={17}/></>}</button></form><p className="admin-login-foot">Protected administrator access · PARALLAX</p></div></main>;
}

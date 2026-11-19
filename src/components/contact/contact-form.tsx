"use client";

import { FormEvent, useCallback, useState } from "react";
import { TurnstileWidget } from "@/components/contact/turnstile-widget";
import { Send, CheckCircle2, AlertCircle } from "lucide-react";

const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "";

type FormState = "idle" | "submitting" | "success" | "error";

export function ContactForm() {
  const [token, setToken] = useState("");
  const [state, setState] = useState<FormState>("idle");
  const [message, setMessage] = useState("");
  const [submissionId, setSubmissionId] = useState("");
  const [captchaVersion, setCaptchaVersion] = useState(0);

  const onToken = useCallback((value: string) => setToken(value), []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state === "submitting") return;

    if (!token) {
      setState("error");
      setMessage("Please complete the verification before submitting.");
      return;
    }

    const form = event.currentTarget;
    const data = new FormData(form);

    const currentSubmissionId = submissionId || crypto.randomUUID();
    setSubmissionId(currentSubmissionId);

    const payload = {
      submissionId: currentSubmissionId,
      name: String(data.get("name") || ""),
      email: String(data.get("email") || ""),
      company: String(data.get("company") || ""),
      projectType: String(data.get("projectType") || ""),
      budget: String(data.get("budget") || ""),
      timeline: String(data.get("timeline") || ""),
      message: String(data.get("message") || ""),
      consent: data.get("consent") === "on",
      turnstileToken: token,
      website: String(data.get("website") || "")
    };

    setState("submitting");
    setMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Unable to send your enquiry.");
      }

      setState("success");
      setMessage("Thank you. Your enquiry has been received.");
      form.reset();
      setToken("");
      setSubmissionId("");
      setCaptchaVersion((version) => version + 1);
    } catch (error) {
      setState("error");
      setMessage(error instanceof Error ? error.message : "Something went wrong.");
      setToken("");
      setCaptchaVersion((version) => version + 1);
    }
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <div className="form-row">
        <label className="field"><span className="field-label">Full name</span><input name="name" required minLength={2} maxLength={100} autoComplete="name" placeholder="Your name" /></label>
        <label className="field"><span className="field-label">Business email</span><input name="email" type="email" required maxLength={254} autoComplete="email" placeholder="you@company.com" /></label>
      </div>
      <div className="form-row">
        <label className="field"><span className="field-label">Company name <i>(optional)</i></span><input name="company" maxLength={150} autoComplete="organization" placeholder="Your company" /></label>
        <label className="field"><span className="field-label">Project type</span>
          <select name="projectType" required defaultValue="">
            <option value="" disabled>Select a service</option>
            <option>Custom software</option>
            <option>Web application</option>
            <option>Mobile application</option>
            <option>AI and automation</option>
            <option>SaaS product</option>
            <option>API development</option>
            <option>Other</option>
          </select>
        </label>
      </div>
      <div className="form-row">
        <label className="field"><span className="field-label">Estimated budget</span>
          <select name="budget" defaultValue="">
            <option value="">Prefer not to say</option>
            <option>5k to 20k INR</option>
            <option>20k to 40k INR</option>
            <option>40k to 60k INR</option>
            <option>60k to 80k INR</option>
            <option>80k to 1 lakh INR</option>
          </select>
        </label>
        <label className="field"><span className="field-label">Project timeline</span>
          <select name="timeline" defaultValue="">
            <option value="">Not sure yet</option>
            <option>Under 1 month</option>
            <option>1 to 3 months</option>
            <option>3 to 6 months</option>
            <option>6 months or more</option>
          </select>
        </label>
      </div>
      <label className="field"><span className="field-label">Tell us about your project</span><textarea name="message" required minLength={20} maxLength={5000} rows={5} placeholder="What are you looking to build? What challenge are you trying to solve?" /></label>

      <label className="honeypot" aria-hidden="true">Leave this field empty<input name="website" tabIndex={-1} autoComplete="off" /></label>

      <label className="consent-label"><input type="checkbox" name="consent" required /><span>I agree that PARALLAX may use these details to respond to my enquiry.</span></label>

      {siteKey ? (
        <TurnstileWidget key={captchaVersion} siteKey={siteKey} onToken={onToken} />
      ) : (
        <p className="form-hint">Turnstile site key is not configured. Add it to your environment to enable submissions.</p>
      )}

      <button className="button button-primary form-submit" disabled={state === "submitting" || !siteKey} type="submit">
        {state === "submitting" ? "Sending..." : "Send project enquiry"}
        <Send size={16} />
      </button>

      {message && (
        <p className={`form-feedback ${state}`} role="status" aria-live="polite">
          {state === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          {message}
        </p>
      )}
    </form>
  );
}
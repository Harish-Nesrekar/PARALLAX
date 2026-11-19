import type { Metadata } from "next";
import { ContactForm } from "@/components/contact/contact-form";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <main className="inner-page">
      <section className="inner-hero container contact-hero">
        <span className="eyebrow">Start a conversation</span>
        <h1>Have a challenge<br />worth <em>solving?</em></h1>
        <p className="section-lead">Tell us what you are working on. We will review your enquiry and consider the next step.</p>
      </section>
      <section className="section section-soft">
        <div className="container contact-layout">
          <div className="contact-side"><span className="eyebrow">Project enquiry</span><h2>Let&apos;s make<br /><em>something useful.</em></h2><p className="section-lead">Share a little about your goals, your users and the challenge you want to solve.</p><p className="form-hint">Please do not include passwords, payment card details or other sensitive information.</p><p className="form-hint">Please rest assured that once you submit your project enquiry, our team will contact you via email with further details.</p></div>
          <div className="contact-card"><ContactForm /></div>
        </div>
      </section>
    </main>
  );
}

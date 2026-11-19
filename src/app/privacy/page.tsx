import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <main className="inner-page legal-page container">
      <span className="eyebrow">Legal</span>
      <h1>Privacy <em>Policy.</em></h1>
      <p className="section-lead">This starter policy must be reviewed and completed for the actual legal entity, operating location, data practices and applicable law before publication.</p>
      <h2>Information submitted</h2>
      <p>When you submit a project enquiry, the website may collect your name, business email, company, project preferences and message so PARALLAX can respond.</p>
      <h2>Use of information</h2>
      <p>Enquiry information is intended to be used to review and respond to business enquiries, maintain communication and protect the website from abuse.</p>
      <h2>Storage and security</h2>
      <p>Enquiry records are stored using the configured backend provider. Access should be restricted to authorized personnel. No online service can guarantee absolute security.</p>
      <h2>Contact and retention</h2>
      <p>Replace this section with the legal business name, contact email, retention period, data-subject request process, cookie practices and applicable jurisdiction before launch.</p>
      <p className="placeholder-note">Legal review required. This is a content scaffold, not legal advice or a finalized privacy policy.</p>
    </main>
  );
}

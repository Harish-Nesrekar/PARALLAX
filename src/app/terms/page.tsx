import type { Metadata } from "next";

export const metadata: Metadata = { title: "Terms and Conditions" };

export default function TermsPage() {
  return (
    <main className="inner-page legal-page container">
      <span className="eyebrow">Legal</span>
      <h1>Terms &amp; <em>Conditions.</em></h1>
      <p className="section-lead">This starter page must be reviewed and completed before publication.</p>
      <h2>Website information</h2>
      <p>Website content is provided for general information about PARALLAX and its software services. A website enquiry does not create a client engagement or project contract.</p>
      <h2>Project agreements</h2>
      <p>Any software development engagement should be governed by a separate written agreement defining scope, deliverables, fees, timelines, responsibilities and intellectual property.</p>
      <h2>Acceptable use</h2>
      <p>Visitors must not misuse the website, attempt unauthorized access or submit unlawful, malicious or misleading content.</p>
      <h2>Business details</h2>
      <p>Add the correct legal business name, registered address if applicable, jurisdiction, governing law and contact information before publishing.</p>
      <p className="placeholder-note">Legal review required. This is a content scaffold, not legal advice or a finalized contract.</p>
    </main>
  );
}

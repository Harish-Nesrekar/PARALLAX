import Link from "next/link";

export default function NotFound() {
  return (
    <main className="not-found container">
      <span className="not-found-code" aria-hidden="true">404</span>
      <span className="eyebrow">Page not found</span>
      <h1>This perspective<br /><em>doesn&apos;t exist.</em></h1>
      <p className="section-lead">The page may have moved or the address may be incorrect.</p>
      <Link href="/" className="button button-primary">Return home</Link>
    </main>
  );
}

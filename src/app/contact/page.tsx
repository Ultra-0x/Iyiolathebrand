import Link from "next/link";
import { SiteFooter, SiteHeader } from "@/components/SiteLayout";
import { BRAND, MAIL_URL, TEL_URL, whatsappUrl } from "@/lib/brand";

export default function ContactPage() {
  return (
    <>
      <SiteHeader />
      <main className="wrap">
        <section className="section">
          <div className="panel contact">
            <h2>Talk to us</h2>
            <p>Call or WhatsApp {BRAND.phoneDisplay}, or send an email.</p>
            <div className="actions">
              <a
                className="btn btn--wa"
                href={whatsappUrl("Hello, I'd like to make an enquiry.")}
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp
              </a>
              <a className="btn" href={TEL_URL}>Call {BRAND.phoneDisplay}</a>
              <a className="btn" href={MAIL_URL}>{BRAND.email}</a>
            </div>
            <div className="actions" style={{ marginTop: "1rem" }}>
              <Link href="/shop" className="btn">Browse fabrics</Link>
              <Link href="/sourcing" className="btn">Ask about sourcing</Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

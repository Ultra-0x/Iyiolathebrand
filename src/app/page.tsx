import Link from "next/link";
import { BRAND, MAIL_URL, SERVICES, STEPS, TEL_URL, whatsappUrl } from "@/lib/brand";
import { SiteFooter, SiteHeader } from "@/components/SiteLayout";
import { MaterialCard } from "@/components/MaterialCard";
import { listMaterials } from "@/lib/store";
import { MATERIAL_TYPES } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function Home() {
  const newestMaterials = [...(await listMaterials())]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 20);

  return (
    <>
      <SiteHeader />

      <header className="masthead">
        <div className="wrap">
          <p className="eyebrow">{BRAND.descriptor}</p>
          <h1>{BRAND.tagline}</h1>
          <p className="lede">
            {BRAND.offerings}. {BRAND.seasonal}.
          </p>
          <div className="actions">
            <Link href="/shop" className="btn btn--solid">Shop fabrics</Link>
            <a
              className="btn btn--wa"
              href={whatsappUrl("Hello, I'd like to ask about your fabrics.")}
              target="_blank"
              rel="noopener noreferrer"
            >
              Chat on WhatsApp
            </a>
          </div>
        </div>
        <div className="tape" aria-hidden="true" />
      </header>

      <main className="wrap">
        {newestMaterials.length > 0 && (
          <section className="section" aria-labelledby="new-arrivals-title">
            <h2 id="new-arrivals-title">New arrivals</h2>
            <div className="new-arrivals-marquee" aria-label="Newest fabric arrivals">
              <div className="new-arrivals-track">
                {[...newestMaterials, ...newestMaterials].map((material, index) => (
                  <div key={`${material.id}-${index}`} className="new-arrival-item">
                    <MaterialCard material={material} />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="section" aria-labelledby="shop-title">
          <h2 id="shop-title">Browse our fabrics</h2>
          <div className="tiles">
            {MATERIAL_TYPES.map((type) => (
              <Link key={type} href={`/shop?type=${type}`} className="tile">
                <strong>{type}</strong>
                <span>Explore {type}</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="section" aria-labelledby="services-title">
          <h2 id="services-title">Beyond the shelf</h2>
          <p className="section-lede">Sourcing, styling and tailoring, from the first idea to the finished outfit.</p>
          <div className="service-grid">
            {SERVICES.map((s) => (
              <article key={s.id} className="panel service">
                <h3>{s.title}</h3>
                <p>{s.blurb}</p>
                <ul>
                  {s.points.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
                <Link href={`/${s.id}`} className="btn btn--wa">{s.cta}</Link>
              </article>
            ))}
          </div>
        </section>

        <section className="section" aria-labelledby="how-title">
          <h2 id="how-title">How it works</h2>
          <ol className="steps">
            {STEPS.map((s) => (
              <li key={s.title} className="panel">
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </li>
            ))}
          </ol>
        </section>

        <section id="contact" className="section" aria-labelledby="contact-title">
          <div className="panel contact">
            <h2 id="contact-title">Talk to us</h2>
            <p>Call or WhatsApp {BRAND.phoneDisplay}, or send an email.</p>
            <div className="actions">
              <Link href="/contact" className="btn">View contact page</Link>
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
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}

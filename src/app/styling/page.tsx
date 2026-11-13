import Link from "next/link";
import { SiteFooter, SiteHeader } from "@/components/SiteLayout";
import { SERVICES, whatsappUrl } from "@/lib/brand";

export default function StylingPage() {
  const service = SERVICES[1];

  return (
    <>
      <SiteHeader />
      <main className="wrap">
        <section className="section">
          <div className="panel service">
            <h2>{service.title}</h2>
            <p>{service.blurb}</p>
            <ul>
              {service.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
            <div className="actions">
              <a
                className="btn btn--wa"
                href={whatsappUrl(service.message)}
                target="_blank"
                rel="noopener noreferrer"
              >
                {service.cta}
              </a>
              <Link href="/shop" className="btn">Browse fabrics</Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

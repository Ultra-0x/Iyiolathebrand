import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteFooter, SiteHeader } from "@/components/SiteLayout";
import { getMaterialById } from "@/lib/store";
import { formatPrice, unitFor } from "@/lib/format";
import { whatsappUrl } from "@/lib/brand";

export const dynamic = "force-dynamic";

export default async function FabricDetailPage({ params }: { params: { id: string } }) {
  const material = await getMaterialById(params.id);
  if (!material) notFound();

  const unit = unitFor(material.type);
  const gallery = Array.from(new Set([...(Array.isArray(material.images) ? material.images : []), material.image].filter(Boolean) as string[]));
  const primaryMedia = material.video ?? gallery[0] ?? null;
  const orderMessage =
    `Hello, I'd like to order this:\n` +
    `${material.name} (${material.colorName} ${material.type.toLowerCase()})\n` +
    `Price: ${formatPrice(material.pricePerMeter)} per ${unit}\n` +
    `How many ${unit === "metre" ? "metres" : "pieces"}: `;

  return (
    <>
      <SiteHeader />
      <main className="wrap">
        <section className="section">
          <Link href="/shop" className="back-link">← Back to fabrics</Link>
          <div className="fabric-page" style={{ marginTop: "1rem" }}>
            <div className="fabric-visual">
              {material.video ? (
                <video
                  src={`/api/uploads/${material.video}`}
                  controls
                  playsInline
                  preload="metadata"
                  style={{ width: "100%", minHeight: 420, background: material.colorHex }}
                />
              ) : primaryMedia ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={`/api/uploads/${primaryMedia}`} alt={`${material.name} ${material.colorName} ${material.type}`} />
              ) : (
                <div className="swatch" style={{ backgroundColor: material.colorHex, minHeight: 420 }}>
                  <div className="weave" aria-hidden="true" />
                </div>
              )}

              {gallery.length > 1 && (
                <div className="fabric-gallery" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))", gap: "0.75rem", marginTop: "1rem" }}>
                  {gallery.map((file) => (
                    <img key={file} src={`/api/uploads/${file}`} alt={`${material.name} additional view`} style={{ width: "100%", height: 110, objectFit: "cover", borderRadius: 12, border: "1px solid rgba(255,255,255,0.2)" }} />
                  ))}
                </div>
              )}
            </div>

            <div className="fabric-details">
              <p className="eyebrow">{material.type}</p>
              <h1>{material.name}</h1>
              <p className="meta">{material.colorName}</p>
              <p className="price">
                {formatPrice(material.pricePerMeter)} <span>per {unit}</span>
              </p>
              {material.widthCm > 0 && <p className="meta">{material.widthCm} cm wide</p>}
              {material.description && <p className="desc">{material.description}</p>}

              <div className="actions">
                {material.inStock ? (
                  <a
                    className="btn btn--wa"
                    href={whatsappUrl(orderMessage)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Order on WhatsApp
                  </a>
                ) : (
                  <button className="btn" disabled>Sold out</button>
                )}
                <Link href="/shop" className="btn">Browse more fabrics</Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

import type { Material } from "@/lib/types";
import { formatPrice, unitFor } from "@/lib/format";
import { whatsappUrl } from "@/lib/brand";
import Link from "next/link";
import { Swatch } from "./Swatch";

function orderMessage(m: Material, unit: string): string {
  return (
    `Hello, I'd like to order this:\n` +
    `${m.name} (${m.colorName} ${m.type.toLowerCase()})\n` +
    `Price: ${formatPrice(m.pricePerMeter)} per ${unit}\n` +
    `How many ${unit === "metre" ? "metres" : "pieces"}: `
  );
}

export function MaterialCard({ material }: { material: Material }) {
  const unit = unitFor(material.type);
  return (
    <article className="card">
      <Link href={`/fabric/${material.id}`} aria-label={`View details for ${material.name}`}>
        <Swatch material={material} />
      </Link>
      <div className="card-body">
        <Link href={`/fabric/${material.id}`} className="material-card-title">
          <h2>{material.name}</h2>
        </Link>
        <p className="meta">
          {material.type}, {material.colorName}
        </p>
        <p className="price">
          {formatPrice(material.pricePerMeter)} <span>per {unit}</span>
        </p>
        {material.widthCm > 0 && <p className="meta">{material.widthCm} cm wide</p>}
        {material.description && <p className="desc">{material.description}</p>}
        <div className="card-actions">
          <Link href={`/fabric/${material.id}`} className="btn">
            View details
          </Link>
          {material.inStock ? (
            <a
              className="btn btn--wa"
              href={whatsappUrl(orderMessage(material, unit))}
              target="_blank"
              rel="noopener noreferrer"
            >
              Order on WhatsApp
            </a>
          ) : (
            <button className="btn" disabled>
              Sold out
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

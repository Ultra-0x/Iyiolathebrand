import type { Material } from "@/lib/types";

export function Swatch({ material }: { material: Material }) {
  const soldOut = !material.inStock;
  const gallery = Array.isArray(material.images) ? material.images : [];
  const preview = material.video ?? gallery[0] ?? material.image;

  return (
    <div
      className={`swatch${soldOut ? " swatch--soldout" : ""}`}
      style={{ backgroundColor: material.colorHex }}
    >
      {material.video ? (
        <video
          src={`/api/uploads/${material.video}`}
          muted
          playsInline
          autoPlay
          loop
          preload="metadata"
          aria-label={`${material.name}, ${material.colorName} ${material.type.toLowerCase()} fabric video`}
        />
      ) : preview ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={`/api/uploads/${preview}`} alt={`${material.name}, ${material.colorName} ${material.type.toLowerCase()} fabric`} />
      ) : (
        <div className="weave" aria-hidden="true" />
      )}
      {soldOut && <span className="stamp">Sold out</span>}
    </div>
  );
}

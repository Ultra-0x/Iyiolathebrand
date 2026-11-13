import Link from "next/link";
import { listMaterials } from "@/lib/store";
import { MATERIAL_TYPES, type Material, type MaterialType } from "@/lib/types";
import { BRAND, CATEGORY_BLURBS } from "@/lib/brand";
import { MaterialCard } from "@/components/MaterialCard";
import { SiteFooter, SiteHeader } from "@/components/SiteLayout";

export const dynamic = "force-dynamic";

function Group({ type, items }: { type: MaterialType; items: Material[] }) {
  return (
    <div className="group">
      <div className="group-head">
        <h3>{type}</h3>
        <span>{CATEGORY_BLURBS[type]}</span>
      </div>
      <div className="grid">
        {items.map((m) => (
          <MaterialCard key={m.id} material={m} />
        ))}
      </div>
    </div>
  );
}

export default async function ShopPage({ searchParams }: { searchParams: { type?: string } }) {
  const all = await listMaterials();
  const selected = MATERIAL_TYPES.find((t) => t === searchParams.type);

  const sorted = [...all].sort(
    (a, b) => Number(b.inStock) - Number(a.inStock) || b.createdAt.localeCompare(a.createdAt),
  );
  const byType = (t: MaterialType) => sorted.filter((m) => m.type === t);

  const present = MATERIAL_TYPES.filter((t) => byType(t).length > 0);
  const fabricGroups = present.filter((t) => t !== "Abaya" && (!selected || selected === t));
  const showFabrics = selected !== "Abaya";
  const showAbaya = !selected || selected === "Abaya";
  const abayas = byType("Abaya");

  return (
    <>
      <SiteHeader />

      <main className="wrap">
        <section className="section" aria-labelledby="shop-title">
          <h2 id="shop-title">Shop by category</h2>
          {present.length > 0 && (
            <div className="tiles">
              <Link href="/shop" className={`tile${!selected ? " active" : ""}`}>
                <strong>All</strong>
                <span>{all.length} items</span>
              </Link>
              {present.map((t) => (
                <Link
                  key={t}
                  href={`/shop?type=${t}`}
                  className={`tile${selected === t ? " active" : ""}`}
                >
                  <strong>{t}</strong>
                  <span>{byType(t).length} {byType(t).length === 1 ? "item" : "items"}</span>
                </Link>
              ))}
            </div>
          )}

          {showFabrics && (
            <div>
              {fabricGroups.length > 0 ? (
                fabricGroups.map((t) => <Group key={t} type={t} items={byType(t)} />)
              ) : (
                <p className="empty">
                  {all.length === 0
                    ? "New fabrics are being added. Message us on WhatsApp to ask what's available."
                    : `No ${selected} listed right now.`}
                </p>
              )}
            </div>
          )}
        </section>

        {showAbaya && (
          <section className="section" aria-labelledby="abaya-title">
            <h2 id="abaya-title">Abaya: festive collections</h2>
            <p className="section-lede">In-season festive abayas, sold by the piece.</p>
            {abayas.length > 0 ? (
              <div className="grid">
                {abayas.map((m) => (
                  <MaterialCard key={m.id} material={m} />
                ))}
              </div>
            ) : (
              <p className="empty">
                Festive pieces arrive in season. Message us on WhatsApp to be the first to know.
              </p>
            )}
          </section>
        )}

        <section className="section">
          <div className="panel contact">
            <h2>Need something specific?</h2>
            <p>Tell us what you're looking for and we will help source the right fabric.</p>
            <div className="actions">
              <Link href="/sourcing" className="btn">Ask about sourcing</Link>
              <Link href="/styling" className="btn">Get styling help</Link>
              <Link href="/contact" className="btn btn--solid">Contact us</Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}

import Link from "next/link";
import { MaterialCard } from "@/components/MaterialCard";
import { SiteFooter, SiteHeader } from "@/components/SiteLayout";
import { listMaterials } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function AbayaPage() {
  const abayas = (await listMaterials()).filter((m) => m.type === "Abaya");

  return (
    <>
      <SiteHeader />
      <main className="wrap">
        <section className="section">
          <h2>Abaya: festive collections</h2>
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
          <div className="actions" style={{ marginTop: "1.5rem" }}>
            <Link href="/shop" className="btn">Browse all fabrics</Link>
            <Link href="/contact" className="btn btn--solid">Book a styling chat</Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

import Link from "next/link";
import { BRAND, NAV } from "@/lib/brand";

export function SiteHeader() {
  return (
    <nav className="topnav" aria-label="Main navigation">
      <div className="wrap topnav-row">
        <Link href="/" className="wordmark">{BRAND.name}</Link>
        <ul>
          {NAV.map((n) => (
            <li key={n.href}>
              <Link href={n.href}>{n.label}</Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

export function SiteFooter() {
  return (
    <footer className="wrap foot">
      <span>© {new Date().getFullYear()} {BRAND.name}. All rights reserved.</span>
      <span>Fabrics | Adire | Lace | Abaya | Sourcing | Styling | Tailoring</span>
      <Link href="/admin">Admin</Link>
    </footer>
  );
}

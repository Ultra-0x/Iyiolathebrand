import Link from "next/link";
import { isAdmin } from "@/lib/auth";
import { listMaterials } from "@/lib/store";
import { AdminClient } from "./AdminClient";
import { LoginForm } from "./LoginForm";
import { BRAND } from "@/lib/brand";

export const dynamic = "force-dynamic";
export const metadata = { title: `Admin: ${BRAND.name}`, robots: { index: false } };

export default async function AdminPage() {
  const signedIn = isAdmin();
  return (
    <main className="wrap admin">
      <div className="admin-top">
        <Link href="/" className="wordmark">{BRAND.name}</Link>
        <Link href="/" className="admin-link">View shop</Link>
      </div>
      {signedIn ? <AdminClient initial={await listMaterials()} /> : <LoginForm />}
    </main>
  );
}

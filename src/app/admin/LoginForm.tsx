"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setBusy(false);
    if (res.ok) router.refresh();
    else setError((await res.json().catch(() => null))?.error ?? "Could not sign in.");
  }

  return (
    <form className="panel login" onSubmit={submit}>
      <h1>Admin sign in</h1>
      <label>
        Password
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoFocus required />
      </label>
      {error && <p className="error" role="alert">{error}</p>}
      <button className="btn btn--solid" disabled={busy}>{busy ? "Signing in…" : "Sign in"}</button>
    </form>
  );
}

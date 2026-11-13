"use client";

import { FormEvent, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { MATERIAL_TYPES, type Material } from "@/lib/types";
import { formatPrice, unitFor } from "@/lib/format";

export function AdminClient({ initial }: { initial: Material[] }) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [items, setItems] = useState<Material[]>(initial);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [previewKind, setPreviewKind] = useState<"image" | "video" | null>(null);

  function resetForm() {
    formRef.current?.reset();
    setPreview(null);
    setPreviewKind(null);
    setEditingId(null);
  }

  function fillFormFromMaterial(material: Material) {
    const form = formRef.current;
    if (!form) return;

    const setValue = (name: string, value: string) => {
      const input = form.elements.namedItem(name) as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null;
      if (input) input.value = value;
    };

    setValue("name", material.name);
    setValue("type", material.type);
    setValue("colorName", material.colorName);
    setValue("colorHex", material.colorHex);
    setValue("pricePerMeter", String(material.pricePerMeter));
    setValue("widthCm", String(material.widthCm));
    setValue("description", material.description);

    const media = material.video ? `/api/uploads/${material.video}` : material.images?.[0] ? `/api/uploads/${material.images[0]}` : material.image ? `/api/uploads/${material.image}` : null;
    if (media) {
      setPreview(media);
      setPreviewKind(material.video ? "video" : "image");
    } else {
      setPreview(null);
      setPreviewKind(null);
    }
  }

  async function submitForm(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const endpoint = editingId ? `/api/materials/${editingId}` : "/api/materials";
    const res = await fetch(endpoint, {
      method: editingId ? "PATCH" : "POST",
      body: formData,
    });
    setBusy(false);

    const data = await res.json().catch(() => null);
    if (!res.ok) {
      setError(data?.error ?? (editingId ? "Could not update the material." : "Could not add the material."));
      if (res.status === 401) router.refresh();
      return;
    }

    if (editingId) {
      setItems((prev) => prev.map((x) => (x.id === editingId ? (data as Material) : x)));
      setError("");
    } else {
      setItems((prev) => [data as Material, ...prev]);
    }

    resetForm();
  }

  async function toggleStock(m: Material) {
    setError("");
    const next = !m.inStock;
    setItems((prev) => prev.map((x) => (x.id === m.id ? { ...x, inStock: next } : x)));
    const res = await fetch(`/api/materials/${m.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ inStock: next }),
    });
    if (!res.ok) {
      setItems((prev) => prev.map((x) => (x.id === m.id ? { ...x, inStock: m.inStock } : x)));
      setError("Could not update stock. Try again.");
    }
  }

  async function remove(m: Material) {
    if (!confirm(`Delete "${m.name}"? This can't be undone.`)) return;
    setError("");
    const res = await fetch(`/api/materials/${m.id}`, { method: "DELETE" });
    if (res.ok) setItems((prev) => prev.filter((x) => x.id !== m.id));
    else setError("Could not delete the material. Try again.");
  }

  async function signOut() {
    await fetch("/api/auth", { method: "DELETE" });
    router.refresh();
  }

  return (
    <>
      <div className="admin-head">
        <h1>Manage fabrics</h1>
        <button className="btn" onClick={signOut}>Sign out</button>
      </div>

      {error && <p className="error" role="alert">{error}</p>}

      <form ref={formRef} className="panel add" onSubmit={submitForm}>
        <h2>{editingId ? "Edit fabric" : "Add a fabric"}</h2>
        <div className="fields">
          <label>Name<input name="name" required maxLength={100} placeholder="Hand-dyed adire" /></label>
          <label>
            Category
            <select name="type" required defaultValue="">
              <option value="" disabled>Choose…</option>
              {MATERIAL_TYPES.map((t) => <option key={t}>{t}</option>)}
            </select>
          </label>
          <label>Colour name<input name="colorName" required maxLength={50} placeholder="Indigo" /></label>
          <label>Colour<input name="colorHex" type="color" defaultValue="#23306b" /></label>
          <label>Price (per metre, or per piece for abayas)<input name="pricePerMeter" type="number" min="0.01" step="0.01" required /></label>
          <label>Width in cm (optional for abayas)<input name="widthCm" type="number" min="1" max="400" step="1" /></label>
        </div>
        <label>
          Description
          <textarea name="description" rows={3} maxLength={1000} placeholder="Weight, finish, best uses" />
        </label>
        <label>
          {editingId ? "Replace photos or video (optional)" : "Photos or video (select multiple photos at once)"}
          <input
            name="media"
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp,video/mp4,video/webm,video/quicktime"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) {
                setPreview(null);
                setPreviewKind(null);
                return;
              }
              setPreview(URL.createObjectURL(file));
              setPreviewKind(file.type.startsWith("video/") ? "video" : "image");
            }}
          />
        </label>
        {preview && (
          <div className="preview-wrap">
            {previewKind === "video" ? (
              <video className="preview" src={preview} controls playsInline muted />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img className="preview" src={preview} alt="Selected media preview" />
            )}
          </div>
        )}
        <div className="actions">
          <button className="btn btn--solid" disabled={busy}>{busy ? (editingId ? "Saving…" : "Adding…") : (editingId ? "Save changes" : "Add fabric")}</button>
          {editingId && (
            <button type="button" className="btn" onClick={resetForm} disabled={busy}>Cancel</button>
          )}
        </div>
      </form>

      <h2 className="list-title">Listed fabrics ({items.length})</h2>
      {items.length === 0 ? (
        <p className="empty">Nothing listed yet. Add your first fabric above.</p>
      ) : (
        <ul className="rows">
          {items.map((m) => (
            <li key={m.id} className="row">
              <span className="chip" style={{ backgroundColor: m.colorHex }} aria-hidden="true" />
              <div className="row-main">
                <strong>{m.name}</strong>
                <span>{m.type}, {m.colorName}, {formatPrice(m.pricePerMeter)} per {unitFor(m.type)}</span>
              </div>
              <label className="switch">
                <input type="checkbox" checked={m.inStock} onChange={() => toggleStock(m)} />
                <span>{m.inStock ? "In stock" : "Sold out"}</span>
              </label>
              <button className="btn" onClick={() => {
                setEditingId(m.id);
                fillFormFromMaterial(m);
              }}>Edit</button>
              <button className="btn btn--danger" onClick={() => remove(m)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

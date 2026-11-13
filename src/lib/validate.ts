import { MATERIAL_TYPES, type MaterialType } from "./types";

export interface MaterialInput {
  name: string;
  type: MaterialType;
  colorName: string;
  colorHex: string;
  pricePerMeter: number;
  widthCm: number;
  description: string;
}

type Result = { ok: true; data: MaterialInput } | { ok: false; error: string };

export function parseMaterialForm(form: FormData): Result {
  const str = (key: string) => String(form.get(key) ?? "").trim();

  const name = str("name");
  if (!name || name.length > 100) return { ok: false, error: "Enter a name up to 100 characters." };

  const type = str("type") as MaterialType;
  if (!MATERIAL_TYPES.includes(type)) return { ok: false, error: "Choose a category." };

  const colorName = str("colorName");
  if (!colorName || colorName.length > 50) return { ok: false, error: "Enter a colour name." };

  const colorHex = str("colorHex");
  if (!/^#[0-9a-fA-F]{6}$/.test(colorHex)) return { ok: false, error: "Pick a valid colour." };

  const pricePerMeter = Number(str("pricePerMeter"));
  if (!Number.isFinite(pricePerMeter) || pricePerMeter <= 0)
    return { ok: false, error: "Enter a price per metre greater than 0." };

  // Abayas are sold as pieces, so width is optional for them.
  const rawWidth = str("widthCm");
  let widthCm = 0;
  if (type !== "Abaya" || rawWidth) {
    widthCm = Number(rawWidth);
    if (!Number.isFinite(widthCm) || widthCm <= 0 || widthCm > 400)
      return { ok: false, error: "Enter a width between 1 and 400 cm." };
  }

  const description = str("description");
  if (description.length > 1000) return { ok: false, error: "Keep the description under 1000 characters." };

  return { ok: true, data: { name, type, colorName, colorHex, pricePerMeter, widthCm, description } };
}

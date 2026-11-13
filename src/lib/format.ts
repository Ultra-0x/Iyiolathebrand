import type { MaterialType } from "./types";

export function formatPrice(amount: number): string {
  const currency = process.env.NEXT_PUBLIC_CURRENCY ?? "NGN";
  const locale = currency === "NGN" ? "en-NG" : "en";
  return new Intl.NumberFormat(locale, { style: "currency", currency }).format(amount);
}

/** Fabrics are sold by the metre; abayas are sold as whole pieces. */
export function unitFor(type: MaterialType): "metre" | "piece" {
  return type === "Abaya" ? "piece" : "metre";
}

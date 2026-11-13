export const MATERIAL_TYPES = [
  "Adire",
  "Lace",
  "Abaya",
  "Cotton",
  "Linen",
  "Silk",
  "Wool",
  "Denim",
  "Polyester",
  "Velvet",
  "Leather",
  "Other",
] as const;

export type MaterialType = (typeof MATERIAL_TYPES)[number];

export interface Material {
  id: string;
  name: string;
  type: MaterialType;
  colorName: string;
  colorHex: string;
  pricePerMeter: number;
  widthCm: number;
  description: string;
  /** File names inside the uploads folder, served at /api/uploads/<image> */
  image: string | null;
  /** Additional photos for a single fabric; older records may not have this property */
  images?: string[];
  /** File name inside the uploads folder, served at /api/uploads/<video> */
  video: string | null;
  inStock: boolean;
  createdAt: string;
}

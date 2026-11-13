/** Brand details shown across the shop. Edit here to change them everywhere. */
export const BRAND = {
  name: "IYIOLA THE BRAND",
  descriptor: "Luxury Fabrics & Fashion House",
  tagline: "Curating quality fabrics for every style.",
  offerings: "Fabrics, Adire, Lace and more",
  seasonal: "Abaya, with in-season festive collections",
  services: ["Fabric sourcing", "Styling", "Tailoring"],
  phoneDisplay: "07080175599",
  email: "labukola82@gmail.com",
} as const;

// WhatsApp and tel: links need the international format: 07080175599 becomes 2347080175599 (Nigeria, +234).
const digits = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "2347080175599").replace(/\D/g, "");

export const TEL_URL = `tel:+${digits}`;
export const MAIL_URL = `mailto:${BRAND.email}`;

export function whatsappUrl(message: string): string {
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export const NAV = [
  { href: "/shop", label: "Shop" },
  { href: "/abaya", label: "Abaya" },
  { href: "/sourcing", label: "Sourcing" },
  { href: "/styling", label: "Styling" },
  { href: "/tailoring", label: "Tailoring" },
  { href: "/contact", label: "Contact" },
] as const;

export const SERVICES = [
  {
    id: "sourcing",
    title: "Fabric sourcing",
    blurb: "Have a fabric in mind, or a photo to match? Tell us what you need and we'll find it.",
    points: ["Send a photo or describe the look", "Colour, texture and budget matched", "Adire, lace, cotton and more"],
    cta: "Ask about sourcing",
    message: "Hello, I need help sourcing a fabric. Here is what I'm looking for: ",
  },
  {
    id: "styling",
    title: "Styling",
    blurb: "Not sure what works together? We help you choose fabrics, colours and styles for your occasion.",
    points: ["Looks for events and festive seasons", "Colour and fabric pairing", "Everyday and occasion outfits"],
    cta: "Ask about styling",
    message: "Hello, I'd like styling advice for: ",
  },
  {
    id: "tailoring",
    title: "Tailoring",
    blurb: "Turn your fabric into an outfit that fits you well.",
    points: ["Made to your measurements", "Designs for occasions and everyday wear", "Chat with us to agree the details"],
    cta: "Ask about tailoring",
    message: "Hello, I'd like to get something tailored. Here is what I have in mind: ",
  },
] as const;

export const STEPS = [
  { title: "Browse or describe", text: "Pick a fabric from the shop, or tell us the look you want." },
  { title: "Message us on WhatsApp", text: "Confirm the details, quantity and any sourcing, styling or tailoring you need." },
  { title: "We take it from there", text: "We prepare your order and keep you updated in the same chat." },
] as const;

import type { MaterialType } from "./types";

export const CATEGORY_BLURBS: Record<MaterialType, string> = {
  Adire: "Hand-dyed indigo and resist-dyed cloth with traditional patterns.",
  Lace: "Delicate lace for weddings, aso ebi and festive wear.",
  Abaya: "Festive and in-season abaya collections.",
  Cotton: "Breathable everyday cotton for shirts, dresses and more.",
  Linen: "Light, airy linen for warm days.",
  Silk: "Smooth silk with a soft drape.",
  Wool: "Warm wool for tailored pieces.",
  Denim: "Durable denim for jackets, trousers and bags.",
  Polyester: "Easy-care polyester for everyday wear.",
  Velvet: "Rich velvet for evening and festive outfits.",
  Leather: "Leather for accessories and statement pieces.",
  Other: "More fabrics and trims.",
};

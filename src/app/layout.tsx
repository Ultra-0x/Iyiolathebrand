import type { Metadata } from "next";
import "./globals.css";
import { BRAND } from "@/lib/brand";
import { Protection } from "@/components/Protection";

export const metadata: Metadata = {
  title: `${BRAND.name}: ${BRAND.descriptor}`,
  description: `${BRAND.tagline} ${BRAND.offerings}. ${BRAND.seasonal}.`,
  other: {
    copyright: `${BRAND.name} © ${new Date().getFullYear()}. All rights reserved.`,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,800&family=Instrument+Sans:wght@400;500;600&display=swap"
        />
      </head>
      <body>
        <Protection />
        {children}
      </body>
    </html>
  );
}

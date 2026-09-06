import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { site } from "@/content/site";

/**
 * Tre roller, tre snit:
 *  - Archivo i bred variant til overskrifter. Bredden er hele pointen — den
 *    giver den plakat-agtige, redaktionelle vægt som en almindelig grotesk
 *    ikke har, og den er dét der adskiller sitet fra ethvert andet bureau.
 *  - Geist til brødtekst, fordi den er neutral og læses roligt i lange afsnit.
 *  - Geist Mono til labels, tal og tællere — instrumenterne i Markus' fag.
 */
/**
 * Archivo er selv-hostet frem for hentet gennem next/font/google, fordi den
 * fil, Google udleverer, er dobbelt sÃ¥ stor som den, sitet har brug for.
 *
 * Den variable skrift bærer bredde 62-125 og vægt 100-900. Sitet bruger to
 * punkter på de akser — wdth 112/600 til overskrifter og wdth 80/500 til
 * ordet i mærket — og resten er data, ingen ser. 88 KiB blev til 52.
 *
 * Det er ikke en anden skrift: scripts/byg-skrift.py henter fra samme kilde
 * som next/font gjorde og klipper kun akserne. Filen er kontrolleret bit for
 * bit mod den, der lå i byggeriet før. Skal båndet uden for 80-112, så ret
 * scriptet og kør det igen.
 *
 * Det betyder til gengæld at skriften ikke opdaterer sig selv længere. Det
 * er prisen, og for et snit, der er valgt én gang og bærer identiteten, er
 * det en billig pris.
 */
const archivo = localFont({
  src: "./fonts/archivo-mnmedia.woff2",
  variable: "--font-display",
  weight: "500 600",
  display: "swap",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — Branding, sociale medier og annoncering`,
    template: `%s — ${site.name}`,
  },
  description:
    "MNmedia hjælper virksomheder med at bygge et stærkt brand gennem content, sociale medier og annoncering. Baseret i Aarhus.",
  openGraph: {
    type: "website",
    locale: "da_DK",
    siteName: site.name,
    url: site.url,
  },
};

/** Hjælper Google med at vise adresse og kontaktinfo for et lokalt bureau. */
const localBusiness = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: site.name,
  email: site.email,
  telephone: site.phone,
  url: site.url,
  address: {
    "@type": "PostalAddress",
    streetAddress: site.address.street,
    postalCode: site.address.postal,
    addressLocality: site.address.city,
    addressCountry: "DK",
  },
  sameAs: site.socials.map((s) => s.href),
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="da"
      className={`${archivo.variable} ${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      {/* Header, indhold og sidefod ligger i (site)/layout.tsx. Root-layoutet
          holder kun det, ALLE ruter deler — skrifterne, farverne og
          strukturdataene — så /studio kan få hele skærmen for sig selv. */}
      <body className="flex min-h-full flex-col">
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusiness) }}
        />
      </body>
    </html>
  );
}

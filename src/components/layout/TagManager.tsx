import Script from "next/script";
import { GoogleTagManager } from "@next/third-parties/google";
import { site } from "@/content/site";
import { standardScript } from "@/lib/samtykke";
import { Cookiebanner } from "./Cookiebanner";

/**
 * Google Tag Manager på det offentlige site.
 *
 * Markus sendte Googles to kodestumper — én til <head> og én til <body>. De
 * er rigtige, men de er skrevet til en almindelig HTML-side. Her gør Nexts
 * egen komponent det samme arbejde: den henter gtm.js, når siden er blevet
 * interaktiv, frem for at lade den stå i vejen for det første billede.
 *
 * Samtykket står FØR containeren og er sat til afvist. Det er Consent Mode
 * v2: indtil en besøgende har sagt ja, må Googles tags hverken sætte eller
 * læse cookies. Rækkefølgen er ikke ligegyldig — et tag, der når at fyre før
 * standarden er sat, opfører sig, som om der var givet lov. Selve scriptet
 * og banneret, der ændrer valget, hører sammen: se src/lib/samtykke.ts.
 *
 * Bruges i (site)/layout.tsx og app/not-found.tsx, ikke i root-layoutet, så
 * /studio går fri: Markus' egne redigeringer skal ikke tælles som besøg.
 */
export function TagManager() {
  return (
    <>
      <Script id="samtykke-standard">{standardScript}</Script>
      <GoogleTagManager gtmId={site.gtmId} />
      <Cookiebanner />
    </>
  );
}

/**
 * Den anden af Googles to stumper: reserven til browsere uden JavaScript.
 * Den skal stå først i <body>, og det er også den, Search Console leder
 * efter, hvis sitet skal bekræftes gennem Tag Manager.
 */
export function TagManagerNoscript() {
  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${site.gtmId}`}
        height="0"
        width="0"
        style={{ display: "none", visibility: "hidden" }}
      />
    </noscript>
  );
}

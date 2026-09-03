import type { NextConfig } from "next";

import { site } from "./src/content/site";

/** Domænet uden protokol — bruges til at genkende www-varianten. */
const vaert = new URL(site.url).host;

const nextConfig: NextConfig = {
  images: {
    // Case-billeder kommer fra Sanitys CDN. Uden det her afviser next/image
    // dem — den henter kun fra værter, den udtrykkeligt har fået lov til.
    //
    // Sanity beskærer allerede til det rigtige format ud fra det fokuspunkt,
    // Markus har sat (se src/sanity/billede.ts). next/image sørger derefter
    // for at levere den rigtige BREDDE til den enkelte skærm.
    remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io" }],

    // AVIF først. Hero-posteren er en droneoptagelse fuld af løv og
    // tagtekstur — den slags højfrekvente motiver er dyre i webp: at skrue
    // kvaliteten fra 68 ned til 44 sparede kun 21 %, og billedet blev grimt.
    // AVIF ved samme oplevede kvalitet er 27 % mindre. Browseren vælger selv
    // via Accept-headeren, så den, der ikke kan AVIF, får webp.
    formats: ["image/avif", "image/webp"],

    // 52 til hero-posteren, 75 til alt andet. Next 16 kræver at hver værdi
    // står her — ellers kan enhver bede optimeringstjenesten om vilkårlige
    // kvaliteter og bruge vores kvote.
    qualities: [52, 75],
  },

  experimental: {
    // CSS'en lægges i <head> som <style> frem for et <link>. Sitets
    // stilark er 9,7 KiB — Tailwind udsender kun det, der bruges — og det
    // var render-blokerende: browseren skulle hente HTML, finde link-tagget
    // og hente stilarket, før den kunne tegne noget. Målt af Lighthouse til
    // 150 ms af både FCP og LCP på mobil.
    //
    // Prisen er at stilarket ikke kan caches for sig: en gengangere henter
    // de 9,7 KiB igen. For et markedsføringssite, hvor de fleste besøg er
    // første besøg, er det den rigtige handel.
    inlineCss: true,
  },

  async redirects() {
    return [
      // www sender videre til domænet uden.
      //
      // Uden det her svarer begge adresser med det samme indhold, og så har
      // sitet reelt to adresser: søgemaskiner skal gætte hvilken der tæller,
      // og delte links bliver inkonsekvente. 308 frem for 302, fordi valget
      // er permanent — så husker browsere og søgemaskiner det.
      {
        source: "/:sti*",
        has: [{ type: "host", value: `www.${vaert}` }],
        destination: `${site.url}/:sti*`,
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

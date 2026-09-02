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

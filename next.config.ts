import type { NextConfig } from "next";

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
};

export default nextConfig;

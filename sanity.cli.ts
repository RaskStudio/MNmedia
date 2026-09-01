import { defineCliConfig } from "sanity/cli";

/**
 * Konfiguration til `sanity`-kommandoen i terminalen.
 *
 * Adskilt fra sanity.config.ts, som er studiets opsætning. Den her bruges kun
 * af CLI'en — til at importere, liste datasæt og deploye et skema.
 *
 * Værdierne læses fra miljøet, samme sted som resten af sitet henter dem, så
 * der ikke står et projekt-id to steder. CLI'en indlæser selv .env.local.
 */
export default defineCliConfig({
  api: {
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  },
});

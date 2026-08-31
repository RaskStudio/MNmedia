/**
 * Sanity-miljøet, ét sted.
 *
 * `konfigureret` er ikke pynt. Sitet skal kunne bygge og deploye, FØR
 * Sanity-projektet findes — ellers står man med et site, der er nede, mens
 * nogen leder efter et login. Er variablerne der ikke, falder datalaget
 * tilbage til frødataene i src/content/cases.ts, og alt virker som før.
 *
 * Når projektet er oprettet og cases er importeret, skal frødataene væk. De
 * er en rampe, ikke en reserve: to kilder til de samme cases er præcis dét,
 * resten af projektet er bygget for at undgå.
 */

export const projektId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "";
export const datasaet = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";

/**
 * Datoen låser API'ets opførsel fast. Sanity ruller ændringer ud bag nye
 * datoer, så en fast dato betyder, at et svar ikke ændrer form under os.
 * Flyt den bevidst, ikke tilfældigt.
 */
export const apiVersion = "2026-08-31";

/** Er der overhovedet et projekt at hente fra? */
export const konfigureret = projektId.length > 0;

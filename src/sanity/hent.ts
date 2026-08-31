import type { SanityImageSource } from "@sanity/image-url";

import {
  cases as froCases,
  type Billede,
  type Case,
  type Fakta,
  type Ydelse,
} from "@/content/cases";
import { sanity } from "./client";
import { konfigureret } from "./env";
import { billedeUrl } from "./billede";

/**
 * Datalaget for cases. Ét sted henter sitet dem, og ét sted afgøres det,
 * hvor de kommer fra.
 *
 * Så længe Sanity ikke er konfigureret, kommer de fra frødataene i
 * src/content/cases.ts, og sitet opfører sig præcis som før. Det er en
 * rampe, ikke en reserve — når cases er importeret, skal frødataene slettes,
 * og så bliver `konfigureret` den eneste vej igennem. To kilder til de samme
 * cases er dét, resten af projektet er bygget for at undgå.
 *
 * Komponenterne ser samme form uanset kilden: `Case` med billeder som
 * URL-strenge. Derfor kunne skiftet blive et query-skift.
 */

/** Formen, som Sanity leverer den — billeder er objekter, ikke stier. */
type SanityBillede = SanityImageSource & { alt?: string };

type SanityCase = {
  slug: string;
  kunde: string;
  kortBeskrivelse: string;
  langBeskrivelse: string;
  ydelser: Ydelse[];
  fakta: Fakta[] | null;
  visPaaForsiden: boolean | null;
  cover: SanityBillede;
  bred: SanityBillede;
  galleri: SanityBillede[] | null;
  udtalelse: { citat: string; navn: string; titel: string } | null;
};

const FELTER = `
  "slug": slug.current,
  kunde,
  kortBeskrivelse,
  langBeskrivelse,
  ydelser,
  fakta[]{ tal, label },
  visPaaForsiden,
  cover,
  bred,
  galleri[],
  udtalelse{ citat, navn, titel }
`;

/**
 * Cachemærket. Webhooken fra Sanity rammer dette mærke, når Markus udgiver,
 * så siderne bygges om uden et deploy. Ét mærke for alle cases: de vises på
 * kryds af forside, oversigt og enkeltsider, og en ændring ét sted kan
 * ramme dem alle.
 */
export const CASE_MAERKE = "cases";

const ALLE = `*[_type == "case"] | order(_createdAt asc){${FELTER}}`;

/**
 * Ét billede med sin beskrivelse.
 *
 * Beskrivelsen er påkrævet i skemaet, men et gammelt dokument kan mangle den.
 * Reserven er ikke god alt-tekst — den siger intet om, hvad man ser — men den
 * er bedre end en tom streng, som en skærmlæser springer over i tavshed.
 */
function tilBillede(
  b: SanityBillede,
  format: "staaende" | "bred",
  kunde: string,
): Billede {
  return {
    url: billedeUrl(b, format),
    alt: b.alt?.trim() || `Content produceret for ${kunde}`,
  };
}

/** Oversætter Sanitys form til den, komponenterne allerede kender. */
function tilCase(c: SanityCase): Case {
  return {
    slug: c.slug,
    kunde: c.kunde,
    kortBeskrivelse: c.kortBeskrivelse,
    langBeskrivelse: c.langBeskrivelse,
    ydelser: c.ydelser,
    fakta: c.fakta ?? [],
    visPaaForsiden: c.visPaaForsiden ?? false,
    cover: tilBillede(c.cover, "staaende", c.kunde),
    bred: tilBillede(c.bred, "bred", c.kunde),
    galleri: (c.galleri ?? []).map((b) => tilBillede(b, "staaende", c.kunde)),
    udtalelse: c.udtalelse ?? undefined,
  };
}

/** Alle cases, i den rækkefølge de er oprettet. */
export async function hentCases(): Promise<Case[]> {
  if (!konfigureret) return froCases;

  const raa = await sanity().fetch<SanityCase[]>(
    ALLE,
    {},
    { next: { tags: [CASE_MAERKE] } },
  );
  return raa.map(tilCase);
}

/** Én case, eller undefined hvis den ikke findes. */
export async function hentCase(slug: string): Promise<Case | undefined> {
  const alle = await hentCases();
  return alle.find((c) => c.slug === slug);
}

/** De to cases, forsiden viser. */
export async function hentForsideCases(): Promise<Case[]> {
  const alle = await hentCases();
  return alle.filter((c) => c.visPaaForsiden).slice(0, 2);
}

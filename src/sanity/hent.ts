import type { SanityImageSource } from "@sanity/image-url";

import type { Billede, Case, Fakta, Ydelse } from "@/content/cases";
import { sanity } from "./client";
import { konfigureret } from "./env";
import { billedeUrl } from "./billede";

/**
 * Datalaget for cases. Ét sted henter sitet dem.
 *
 * Der er ingen reserve. Under migreringen lå der en kopi af casene i koden,
 * så sitet kunne bygge før Sanity fandtes — den er væk nu. To kilder til de
 * samme cases kan blive uenige, og så opdager ingen hvilken der vandt.
 *
 * Komponenterne ser `Case` med billeder som URL-strenge, præcis som da
 * indholdet lå i koden. Det var dét, der gjorde skiftet til et query-skift.
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

// Rækkefølgen er Markus'. _createdAt er kun en nødplan, hvis to cases skulle
// få samme tal — så står de i det mindste ikke og bytter plads mellem to
// besøg.
const ALLE = `*[_type == "case"] | order(orden asc, _createdAt asc){${FELTER}}`;

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

/** Alle cases, i den rækkefølge Markus har sat. */
export async function hentCases(): Promise<Case[]> {
  if (!konfigureret) {
    throw new Error(
      "Sanity er ikke konfigureret. Kopiér .env.example til .env.local og " +
        "udfyld NEXT_PUBLIC_SANITY_PROJECT_ID — se SANITY.md.",
    );
  }

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

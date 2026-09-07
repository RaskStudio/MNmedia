import type { SanityImageSource } from "@sanity/image-url";

import type { IconName } from "@/components/shared/Icon";
import { billedeUrl, type FORMAT } from "./billede";
import { sanity } from "./client";
import { konfigureret } from "./env";

/**
 * Datalaget for siderne.
 *
 * Samme mønster som cases: ét sted henter sitet dem, og Sanitys form
 * oversættes til den, komponenterne allerede kender. Billeder bliver til
 * `{ url, alt }`, ikke til objekter, komponenterne skal pakke ud.
 *
 * Skjulte sektioner filtreres fra i selve forespørgslen frem for i React.
 * Forskellen er ikke kosmetisk: filtrerer man i komponenten, er indholdet
 * allerede sendt til browseren, og «skjult» bliver noget, man kan læse i
 * kildekoden.
 */

export const SIDE_MAERKE = "sider";

/* --------------------------------------------------------------- formen */

export type Knap = { label: string; href: string };
export type SektionBillede = { url: string; alt: string };

type Kort = { titel: string; beskrivelse: string; ikon: IconName };

export type Sektion =
  | {
      _type: "heroSektion";
      _key: string;
      overskrift: string;
      undertekst: string;
      primaer: Knap;
      sekundaer?: Knap;
    }
  | { _type: "kundelogoerSektion"; _key: string; label: string }
  | {
      _type: "ydelseskortSektion";
      _key: string;
      eyebrow?: string;
      overskrift: string;
      kort: Kort[];
    }
  | {
      _type: "caseudvalgSektion";
      _key: string;
      eyebrow?: string;
      overskrift: string;
      linkLabel: string;
    }
  | {
      _type: "omblokSektion";
      _key: string;
      eyebrow?: string;
      overskrift: string;
      afsnit: string[];
      punchlines: string[];
      knap: Knap;
    }
  | {
      _type: "sidehovedSektion";
      _key: string;
      eyebrow: string;
      overskrift: string;
      undertekst: string;
      cta?: Knap;
      billede?: SektionBillede;
    }
  | {
      _type: "toSpalterSektion";
      _key: string;
      overskrift: string;
      afsnit: string[];
    }
  | {
      _type: "punktlisteSektion";
      _key: string;
      eyebrow?: string;
      overskrift: string;
      undertekst?: string;
      visning: "bokse" | "trin";
      punkter: Kort[];
    }
  | {
      _type: "ctaSektion";
      _key: string;
      eyebrow?: string;
      overskrift: string;
      undertekst?: string;
      primaer: Knap;
      sekundaer?: Knap;
    }
  | {
      _type: "servicesSektion";
      _key: string;
      eyebrow?: string;
      overskrift: string;
      services: (Kort & { punkter: string[]; billede: SektionBillede })[];
    }
  | {
      _type: "personenBagSektion";
      _key: string;
      eyebrow?: string;
      overskrift: string;
      afsnit: string[];
      portraet?: SektionBillede;
    }
  | {
      _type: "caselisteSektion";
      _key: string;
      eyebrow?: string;
      overskrift: string;
    }
  | {
      _type: "udtalelserSektion";
      _key: string;
      eyebrow?: string;
      overskrift: string;
    }
  | {
      _type: "kontaktSektion";
      _key: string;
      eyebrow?: string;
      overskrift: string;
      undertekst?: string;
    };

export type Side = {
  sektioner: Sektion[];
  sidetitel: string;
  sidebeskrivelse: string;
};

/** De fem sider, og dermed de fem dokument-id'er. Se src/sanity/struktur.ts. */
export type SideNavn =
  "forside" | "ydelserSide" | "casesSide" | "omSide" | "kontaktSide";

/* ------------------------------------------------------------ forespørgsel */

/**
 * Billedfelterne hentes råt og oversættes i TypeScript, ikke i GROQ.
 *
 * Beskæringen skal ske omkring det fokuspunkt, Markus har sat, og det tal
 * bor i selve billedobjektet. Bad vi GROQ om en URL, mistede vi det.
 */
type RaatBillede = SanityImageSource & { alt?: string };

const FELTER = `
  sidetitel,
  sidebeskrivelse,
  "sektioner": sektioner[skjul != true]
`;

/* ------------------------------------------------------------ oversættelse */

function tilBillede(
  b: RaatBillede | undefined,
  format: keyof typeof FORMAT,
): SektionBillede | undefined {
  if (!b) return undefined;
  return {
    url: billedeUrl(b, format),
    // Beskrivelsen er påkrævet i skemaet, men et dokument fra før den regel
    // kan mangle den. Tom streng frem for en opfundet tekst: en skærmlæser
    // springer et tomt alt over, og det er ærligere end at lyve om motivet.
    alt: b.alt?.trim() ?? "",
  };
}

/**
 * Formen, Sanity leverer: som `Sektion`, men med billederne som rå objekter.
 *
 * De tre sektioner med billeder står skrevet ud frem for at blive udledt med
 * en betinget type. Udledningen ville være kortere og ulæselig, og den ville
 * skjule netop dét, læseren skal vide: hvilke sektioner der har billeder, og
 * hvilket format hvert af dem beskæres til.
 */
type MedBillede<T extends Sektion, N extends keyof T> = Omit<T, N> & {
  [K in N]?: RaatBillede;
};

type Sidehoved = Extract<Sektion, { _type: "sidehovedSektion" }>;
type PersonenBag = Extract<Sektion, { _type: "personenBagSektion" }>;
type Services = Extract<Sektion, { _type: "servicesSektion" }>;

type RaaSektion =
  | Exclude<Sektion, Sidehoved | PersonenBag | Services>
  | MedBillede<Sidehoved, "billede">
  | MedBillede<PersonenBag, "portraet">
  | (Omit<Services, "services"> & {
      services: (Omit<Services["services"][number], "billede"> & {
        billede: RaatBillede;
      })[];
    });

/** Sanitys form → komponenternes. Kun billederne skal reelt laves om. */
function tilSektion(raa: RaaSektion): Sektion {
  switch (raa._type) {
    case "sidehovedSektion":
      return { ...raa, billede: tilBillede(raa.billede, "sidehoved") };
    case "personenBagSektion":
      return { ...raa, portraet: tilBillede(raa.portraet, "portraet") };
    case "servicesSektion":
      return {
        ...raa,
        services: raa.services.map((t) => ({
          ...t,
          // Billedet er påkrævet i skemaet, og kortet giver ingen mening uden
          // — derfor en tom placeholder frem for at udelade feltet.
          billede: tilBillede(t.billede, "kort") ?? { url: "", alt: "" },
        })),
      };
    default:
      return raa;
  }
}

/**
 * Hent en side.
 *
 * Kaster, hvis dokumentet ikke findes. Det er med vilje og af samme grund som
 * ved cases: en tom side, der ser bevidst ud, er værre end en fejl, nogen
 * opdager. Findes dokumentet ikke, er indholdet ikke lagt ind — se
 * scripts/saa-sider.mjs.
 */
export async function hentSide(navn: SideNavn): Promise<Side> {
  if (!konfigureret) {
    throw new Error(
      "Sanity er ikke konfigureret. Kopiér .env.example til .env.local og " +
        "udfyld NEXT_PUBLIC_SANITY_PROJECT_ID — se SANITY.md.",
    );
  }

  const raa = await sanity().fetch<
    (Omit<Side, "sektioner"> & { sektioner: RaaSektion[] }) | null
  >(
    `*[_id == $id][0]{${FELTER}}`,
    { id: navn },
    // Se noten i hent.ts: caching er opt-in i Next 16, og uden force-cache
    // har mærket intet at gøre ugyldigt.
    { cache: "force-cache", next: { tags: [SIDE_MAERKE] } },
  );

  if (!raa) {
    throw new Error(
      `Siden «${navn}» findes ikke i Sanity. Kør scripts/saa-sider.mjs for at ` +
        "lægge indholdet ind — se SANITY.md.",
    );
  }

  return {
    sidetitel: raa.sidetitel,
    sidebeskrivelse: raa.sidebeskrivelse,
    sektioner: (raa.sektioner ?? []).map(tilSektion),
  };
}

/**
 * Seed-data for cases. Formen matcher 1:1 det Sanity-skema vi bygger i fase 3,
 * så skiftet til CMS bliver et query-skift — ikke en omskrivning af komponenter.
 */

export type Ydelse =
  "Branding" | "Sociale medier" | "Video og foto" | "Annoncering";

export type Fakta = { tal: string; label: string };

export type Case = {
  slug: string;
  kunde: string;
  kortBeskrivelse: string;
  langBeskrivelse: string;
  ydelser: Ydelse[];
  fakta: Fakta[];
  visPaaForsiden: boolean;
  /** 4:5 — samme format stillbillederne er skudt i. Se scripts/build-assets.mjs */
  cover: string;
  /** 16:9 til toppen af case-siden */
  bred: string;
  galleri: string[];
  udtalelse?: { citat: string; navn: string; titel: string };
};

export const cases: Case[] = [
  {
    slug: "rs-tomrer",
    kunde: "RS Tømrer",
    kortBeskrivelse:
      "Sociale medier og annoncering der gav markant mere synlighed og konkrete henvendelser.",
    langBeskrivelse:
      "RS Tømrer ønskede at styrke deres brand online og skabe flere henvendelser omkring renoveringer og tilbygninger. Gennem personlige kundeinterview, projektvideoer og målrettet annoncering skabte vi markant mere synlighed, troværdighed og flere kunder.",
    ydelser: ["Branding", "Sociale medier", "Video og foto", "Annoncering"],
    fakta: [
      { tal: "300.000+", label: "visninger" },
      { tal: "10 mio.+", label: "kr. i opgaver" },
      { tal: "100+", label: "leads" },
      { tal: "1.000+", label: "interaktioner" },
    ],
    visPaaForsiden: true,
    cover: "/cases/rs-tomrer/cover.webp",
    bred: "/cases/rs-tomrer/bred.webp",
    galleri: [
      "/cases/rs-tomrer/01.webp",
      "/cases/rs-tomrer/02.webp",
      "/cases/rs-tomrer/03.webp",
      "/cases/rs-tomrer/04.webp",
    ],
    udtalelse: {
      citat:
        "Det bedste ved samarbejdet er, at vi ikke længere skal bruge tid på at finde på idéer eller tænke over vores sociale medier. Markus har sat en klar retning for vores online tilstedeværelse og tager ansvar for hele processen – fra idé og optagelser til redigering og annoncering. Det giver os ro til at fokusere på det, vi er bedst til.",
      navn: "Rasmus Stampe",
      titel: "Indehaver, RS Tømrer",
    },
  },
  {
    slug: "mc-tag",
    kunde: "MC TAG",
    kortBeskrivelse:
      "En tydeligere position online gennem brandstrategi, personligt content og annoncering.",
    langBeskrivelse:
      "MC TAG ønskede at styrke deres brand og skabe en tydeligere position online. Gennem en målrettet brandstrategi, personligt content og annoncering hjælper vi med at skabe en stærkere online tilstedeværelse, hvor virksomhedens værdier og kvalitet kommer til udtryk. Samarbejdet omfatter blandt andet projektvideoer, bag-om-virksomheden-indhold og løbende udvikling af deres sociale medier.",
    ydelser: ["Branding", "Sociale medier", "Video og foto", "Annoncering"],
    fakta: [
      { tal: "500.000+", label: "visninger" },
      { tal: "1.000+", label: "interaktioner" },
      // TODO: leads-tal mangler fra Markus
    ],
    visPaaForsiden: true,
    cover: "/cases/mc-tag/cover.webp",
    bred: "/cases/mc-tag/bred.webp",
    galleri: [
      "/cases/mc-tag/01.webp",
      "/cases/mc-tag/02.webp",
      "/cases/mc-tag/03.webp",
      "/cases/mc-tag/04.webp",
    ],
  },
  {
    slug: "ao-byggeri",
    kunde: "AO Byggeri ApS",
    kortBeskrivelse:
      "LinkedIn som primær platform for en virksomhed hvor relationer og troværdighed afgør alt.",
    langBeskrivelse:
      "AO Byggeri arbejder primært med større erhvervsprojekter, hvor relationer og troværdighed spiller en afgørende rolle. Derfor har samarbejdet haft fokus på LinkedIn som den primære platform, hvor vi gennem projektopdateringer, virksomhedssamarbejder og fagligt indhold styrker virksomhedens synlighed og position i branchen.",
    ydelser: ["Branding", "Sociale medier", "Video og foto"],
    fakta: [],
    visPaaForsiden: false,
    cover: "/cases/ao-byggeri/cover.webp",
    bred: "/cases/ao-byggeri/bred.webp",
    galleri: [
      "/cases/ao-byggeri/01.webp",
      "/cases/ao-byggeri/02.webp",
      "/cases/ao-byggeri/03.webp",
      "/cases/ao-byggeri/04.webp",
    ],
    udtalelse: {
      citat:
        "Vi havde brug for en samarbejdspartner, der forstod vores branche og kunne styrke vores professionelle profil over for erhvervskunder. Gennem en målrettet strategi på LinkedIn har vi fået en langt mere aktiv og troværdig tilstedeværelse, som afspejler den virksomhed, vi gerne vil være.",
      navn: "Anders Olesen",
      titel: "Indehaver, AO Byggeri ApS",
    },
  },
];

export const forsideCases = cases.filter((c) => c.visPaaForsiden).slice(0, 2);

/** Kundelogoer til karrusellen — hvide mærker på transparent baggrund. */
export const kundeLogoer = [
  // `skala` retter den optiske vægt op. Med samme pixelhøjde fylder et bredt
  // mærke som MC TAG langt mere end et cirkulært som RS, og rækken kommer til
  // at se tilfældig ud. Tallene er justeret i øjet, ikke udregnet.
  { navn: "RS Tømrer", fil: "/logoer/rs-tomrer.webp", skala: 1.35 },
  { navn: "MC TAG", fil: "/logoer/mc-tag.webp", skala: 0.75 },
  { navn: "AO Byggeri", fil: "/logoer/ao-byggeri.webp", skala: 1 },
  { navn: "Viston Entreprise", fil: "/logoer/viston.webp", skala: 0.78 },
];

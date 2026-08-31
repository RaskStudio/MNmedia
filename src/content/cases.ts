/**
 * Typerne for en case — og indtil videre også selve indholdet.
 *
 * TYPERNE bliver her. De er den form, komponenterne arbejder med, og
 * src/sanity/hent.ts oversætter Sanitys svar til dem. Det var dét, der gjorde
 * skiftet til CMS til et query-skift frem for en omskrivning.
 *
 * `cases`-arrayet er derimod en RAMPE. Det bruges kun, så længe Sanity ikke
 * er konfigureret, så sitet kan bygge og deploye, før projektet findes.
 * Når cases er importeret (se SANITY.md), skal arrayet slettes — to kilder
 * til de samme cases er præcis dét, opsætningen er lavet for at undgå.
 *
 * `kundeLogoer` bliver derimod liggende. Se noten ved den.
 */

export type Ydelse =
  "Branding" | "Sociale medier" | "Video og foto" | "Annoncering";

export type Fakta = { tal: string; label: string };

/**
 * Et billede med sin egen beskrivelse.
 *
 * Beskrivelsen hører til billedet, ikke til casen. Seks billeder med samme
 * tekst — «Content produceret for RS Tømrer» — hjælper ingen, der får siden
 * læst højt. Derfor er `alt` et felt i CMS'et, og derfor bærer typen det med.
 */
export type Billede = { url: string; alt: string };

export type Case = {
  slug: string;
  kunde: string;
  kortBeskrivelse: string;
  langBeskrivelse: string;
  ydelser: Ydelse[];
  fakta: Fakta[];
  visPaaForsiden: boolean;
  /** 4:5 — samme format stillbillederne er skudt i. Se scripts/build-assets.mjs */
  cover: Billede;
  /** 16:9 til toppen af case-siden */
  bred: Billede;
  galleri: Billede[];
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
    cover: { url: "/cases/rs-tomrer/cover.webp", alt: "Stillbillede fra content produceret for RS Tømrer" },
    bred: { url: "/cases/rs-tomrer/bred.webp", alt: "Bredt stillbillede fra content produceret for RS Tømrer" },
    galleri: [
      { url: "/cases/rs-tomrer/01.webp", alt: "Stillbillede 1 fra content produceret for RS Tømrer" },
      { url: "/cases/rs-tomrer/02.webp", alt: "Stillbillede 2 fra content produceret for RS Tømrer" },
      { url: "/cases/rs-tomrer/03.webp", alt: "Stillbillede 3 fra content produceret for RS Tømrer" },
      { url: "/cases/rs-tomrer/04.webp", alt: "Stillbillede 4 fra content produceret for RS Tømrer" },
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
    cover: { url: "/cases/mc-tag/cover.webp", alt: "Stillbillede fra content produceret for MC TAG" },
    bred: { url: "/cases/mc-tag/bred.webp", alt: "Bredt stillbillede fra content produceret for MC TAG" },
    galleri: [
      { url: "/cases/mc-tag/01.webp", alt: "Stillbillede 1 fra content produceret for MC TAG" },
      { url: "/cases/mc-tag/02.webp", alt: "Stillbillede 2 fra content produceret for MC TAG" },
      { url: "/cases/mc-tag/03.webp", alt: "Stillbillede 3 fra content produceret for MC TAG" },
      { url: "/cases/mc-tag/04.webp", alt: "Stillbillede 4 fra content produceret for MC TAG" },
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
    cover: { url: "/cases/ao-byggeri/cover.webp", alt: "Stillbillede fra content produceret for AO Byggeri" },
    bred: { url: "/cases/ao-byggeri/bred.webp", alt: "Bredt stillbillede fra content produceret for AO Byggeri" },
    galleri: [
      { url: "/cases/ao-byggeri/01.webp", alt: "Stillbillede 1 fra content produceret for AO Byggeri" },
      { url: "/cases/ao-byggeri/02.webp", alt: "Stillbillede 2 fra content produceret for AO Byggeri" },
      { url: "/cases/ao-byggeri/03.webp", alt: "Stillbillede 3 fra content produceret for AO Byggeri" },
      { url: "/cases/ao-byggeri/04.webp", alt: "Stillbillede 4 fra content produceret for AO Byggeri" },
    ],
    udtalelse: {
      citat:
        "Vi havde brug for en samarbejdspartner, der forstod vores branche og kunne styrke vores professionelle profil over for erhvervskunder. Gennem en målrettet strategi på LinkedIn har vi fået en langt mere aktiv og troværdig tilstedeværelse, som afspejler den virksomhed, vi gerne vil være.",
      navn: "Anders Olesen",
      titel: "Indehaver, AO Byggeri ApS",
    },
  },
];

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

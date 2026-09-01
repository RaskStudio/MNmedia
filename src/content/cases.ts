/**
 * Formen på en case, og kundelogoerne.
 *
 * Selve casene ligger i Sanity — se src/sanity/hent.ts. Typerne bliver her,
 * fordi det er dem, komponenterne arbejder med: datalaget oversætter Sanitys
 * svar til dem, og derfor kendte komponenterne allerede formen, da indholdet
 * flyttede.
 *
 * `kundeLogoer` bliver liggende med vilje. Se noten ved den.
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

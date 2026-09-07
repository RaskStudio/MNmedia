import { defineArrayMember, defineField, defineType } from "sanity";

import {
  afsnitFelt,
  eyebrowFelt,
  IKONER,
  knapFelt,
  overskriftFelt,
  sektionPreview,
  skjulFelt,
} from "./felter";

/**
 * Sektionerne, en side kan sættes sammen af.
 *
 * Hver type her svarer til præcis én komponent i src/components/. Det er ikke
 * en tilfældighed, og det er heller ikke en begrænsning, der skal væk med
 * tiden: en sektionstype uden en komponent er et løfte, sitet ikke kan
 * indfri, og en komponent uden en type er indhold, Markus ikke kan røre.
 * Oversættelsen mellem de to sker ét sted — se src/components/sektioner/.
 *
 * Det, der IKKE er felter her, er lige så bevidst som det, der er. Hero-
 * klippene, kundelogoerne og ikonernes udseende bliver i koden; se tabellen
 * i SANITY.md for hvorfor. Reglen er den samme hver gang: kan feltet ikke
 * udfyldes rigtigt uden et øje for det, hører det ikke hjemme i et felt.
 */

/* ------------------------------------------------------------------ forside */

export const heroSektion = defineType({
  name: "heroSektion",
  title: "Hero",
  type: "object",
  fields: [
    overskriftFelt(
      "Forsidens store overskrift. Den er sat i linjer i hånden — ét linjeskift per linje. Rytmen i brede versaler afgøres af, hvor du bryder, så det er en designbeslutning og ikke en tilfældighed. Sitet sørger for, at hver linje kan stå hel, også på den smalleste telefon.",
    ),
    defineField({
      name: "undertekst",
      title: "Undertekst",
      type: "text",
      rows: 3,
      validation: (r) => r.required(),
    }),
    knapFelt("primaer", "Primær knap"),
    knapFelt("sekundaer", "Sekundær knap"),
    skjulFelt(),
  ],
  preview: sektionPreview("Hero"),
});

export const kundelogoerSektion = defineType({
  name: "kundelogoerSektion",
  title: "Kundelogoer",
  type: "object",
  // Selve logoerne bliver i koden. Hvert mærke har en `skala`, der retter den
  // optiske vægt op — et bredt mærke fylder mere end et cirkulært ved samme
  // pixelhøjde — og det tal kræver et øje, ikke et felt.
  fields: [
    defineField({
      name: "label",
      title: "Tekst over rækken",
      type: "string",
      description:
        "Vises som spærret versaltekst over logoerne. Logoerne selv ligger i koden.",
      validation: (r) => r.required(),
    }),
    skjulFelt(),
  ],
  preview: {
    select: { label: "label", skjul: "skjul" },
    prepare: ({ label, skjul }: { label?: string; skjul?: boolean }) => ({
      title: label || "Kundelogoer",
      subtitle: skjul ? "Kundelogoer — skjult" : "Kundelogoer",
    }),
  },
});

export const ydelseskortSektion = defineType({
  name: "ydelseskortSektion",
  title: "Ydelseskort",
  type: "object",
  fields: [
    eyebrowFelt(),
    overskriftFelt(),
    defineField({
      name: "kort",
      title: "Kort",
      type: "array",
      description:
        "Fire kort er det, rækken er tegnet til. Færre virker; flere efterlader et hul i sidste række.",
      of: [
        defineArrayMember({
          type: "object",
          name: "ydelseskort",
          fields: [
            defineField({
              name: "titel",
              title: "Titel",
              type: "string",
              validation: (r) => r.required(),
            }),
            defineField({
              name: "beskrivelse",
              title: "Beskrivelse",
              type: "text",
              rows: 3,
              validation: (r) => r.required(),
            }),
            defineField({
              name: "ikon",
              title: "Ikon",
              type: "string",
              description: "Vælg fra sættet. Nye ikoner tegnes i koden.",
              options: { list: [...IKONER] },
              validation: (r) => r.required(),
            }),
          ],
          preview: { select: { title: "titel", subtitle: "beskrivelse" } },
        }),
      ],
      validation: (r) => r.required().min(1).max(4),
    }),
    skjulFelt(),
  ],
  preview: sektionPreview("Ydelseskort"),
});

export const caseudvalgSektion = defineType({
  name: "caseudvalgSektion",
  title: "Udvalgte cases",
  type: "object",
  // Selve casene kommer fra case-dokumenterne — dem, der har «Vis på
  // forsiden» slået til. Her sættes kun rammen om dem.
  fields: [
    eyebrowFelt(),
    overskriftFelt(),
    defineField({
      name: "linkLabel",
      title: "Tekst på linket til oversigten",
      type: "string",
      initialValue: "Se alle cases",
      validation: (r) => r.required(),
    }),
    skjulFelt(),
  ],
  preview: sektionPreview("Udvalgte cases"),
});

export const omblokSektion = defineType({
  name: "omblokSektion",
  title: "Om-blok",
  type: "object",
  fields: [
    eyebrowFelt(),
    overskriftFelt(),
    afsnitFelt("Tekst"),
    defineField({
      name: "punchlines",
      title: "Punkter",
      type: "array",
      description: "Tre korte punkter med prik foran. Få ord hver.",
      of: [defineArrayMember({ type: "string" })],
      validation: (r) => r.max(4),
    }),
    knapFelt("knap", "Knap"),
    skjulFelt(),
  ],
  preview: sektionPreview("Om-blok"),
});

/* ------------------------------------------------------------- fælles sider */

export const sidehovedSektion = defineType({
  name: "sidehovedSektion",
  title: "Sidehoved",
  type: "object",
  fields: [
    eyebrowFelt(true),
    overskriftFelt(),
    defineField({
      name: "undertekst",
      title: "Undertekst",
      type: "text",
      rows: 4,
      validation: (r) => r.required(),
    }),
    knapFelt(
      "cta",
      "Knap",
      "Valgfri. Udelad den, hvis siden ikke skal bede om noget her.",
    ),
    defineField({
      name: "billede",
      title: "Billede",
      type: "image",
      options: { hotspot: true },
      description:
        "Valgfrit. Vises ved siden af teksten på brede skærme. Sæt fokuspunktet på det, der skal blive i billedet, når det beskæres.",
      fields: [
        defineField({
          name: "alt",
          title: "Billedbeskrivelse",
          type: "string",
          description: "Hvad man ser. Læses højt for blinde.",
          validation: (r) => r.required(),
        }),
      ],
    }),
    skjulFelt(),
  ],
  preview: sektionPreview("Sidehoved"),
});

export const toSpalterSektion = defineType({
  name: "toSpalterSektion",
  title: "Overskrift og tekst",
  type: "object",
  // Overskrift til venstre, brødtekst til højre. Bruges der, hvor et
  // synspunkt skal foldes ud — «Hvorfor MNmedia?», «Vi producerer ikke bare
  // content».
  fields: [overskriftFelt(), afsnitFelt("Tekst"), skjulFelt()],
  preview: sektionPreview("Overskrift og tekst"),
});

export const punktlisteSektion = defineType({
  name: "punktlisteSektion",
  title: "Nummererede punkter",
  type: "object",
  fields: [
    eyebrowFelt(),
    overskriftFelt(),
    defineField({
      name: "undertekst",
      title: "Undertekst",
      type: "text",
      rows: 2,
      description: "Valgfri linje under overskriften.",
    }),
    defineField({
      name: "visning",
      title: "Udseende",
      type: "string",
      description:
        "«Bokse» sætter punkterne i et gitter med kant imellem — det bærer tre punkter. «Trin» sætter dem på en linje med ikoner, som en proces — det bærer fem. Vælger du forkert, ser det ikke i stykker ud, bare forkert afbalanceret.",
      options: {
        list: [
          { title: "Bokse", value: "bokse" },
          { title: "Trin", value: "trin" },
        ],
        layout: "radio",
      },
      initialValue: "bokse",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "punkter",
      title: "Punkter",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "punkt",
          fields: [
            defineField({
              name: "titel",
              title: "Titel",
              type: "string",
              validation: (r) => r.required(),
            }),
            defineField({
              name: "beskrivelse",
              title: "Beskrivelse",
              type: "text",
              rows: 3,
              validation: (r) => r.required(),
            }),
            defineField({
              name: "ikon",
              title: "Ikon",
              type: "string",
              description: "Bruges kun i visningen «Trin».",
              options: { list: [...IKONER] },
            }),
          ],
          preview: { select: { title: "titel", subtitle: "beskrivelse" } },
        }),
      ],
      validation: (r) => r.required().min(1),
    }),
    skjulFelt(),
  ],
  preview: sektionPreview("Nummererede punkter"),
});

export const ctaSektion = defineType({
  name: "ctaSektion",
  title: "Afsluttende CTA",
  type: "object",
  fields: [
    eyebrowFelt(),
    overskriftFelt(),
    defineField({
      name: "undertekst",
      title: "Undertekst",
      type: "text",
      rows: 2,
    }),
    knapFelt("primaer", "Primær knap"),
    knapFelt("sekundaer", "Sekundær knap", "Valgfri."),
    skjulFelt(),
  ],
  preview: sektionPreview("Afsluttende CTA"),
});

/* -------------------------------------------------------------- ydelser, om */

export const servicesSektion = defineType({
  name: "servicesSektion",
  title: "Services",
  type: "object",
  fields: [
    eyebrowFelt(),
    overskriftFelt(),
    defineField({
      name: "services",
      title: "Services",
      type: "array",
      description: "Tre store kort med billede, beskrivelse og en liste under.",
      of: [
        defineArrayMember({
          type: "object",
          name: "service",
          fields: [
            defineField({
              name: "titel",
              title: "Titel",
              type: "string",
              validation: (r) => r.required(),
            }),
            defineField({
              name: "beskrivelse",
              title: "Beskrivelse",
              type: "text",
              rows: 3,
              validation: (r) => r.required(),
            }),
            defineField({
              name: "punkter",
              title: "Hvad det dækker",
              type: "array",
              description: "Korte punkter. Få ord hver.",
              of: [defineArrayMember({ type: "string" })],
              validation: (r) => r.required().min(1),
            }),
            defineField({
              name: "ikon",
              title: "Ikon",
              type: "string",
              options: { list: [...IKONER] },
              validation: (r) => r.required(),
            }),
            defineField({
              name: "billede",
              title: "Billede",
              type: "image",
              options: { hotspot: true },
              fields: [
                defineField({
                  name: "alt",
                  title: "Billedbeskrivelse",
                  type: "string",
                  validation: (r) => r.required(),
                }),
              ],
              validation: (r) => r.required(),
            }),
          ],
          preview: { select: { title: "titel", media: "billede" } },
        }),
      ],
      validation: (r) => r.required().min(1),
    }),
    skjulFelt(),
  ],
  preview: sektionPreview("Services"),
});

export const personenBagSektion = defineType({
  name: "personenBagSektion",
  title: "Personen bag",
  type: "object",
  fields: [
    eyebrowFelt(),
    overskriftFelt(),
    afsnitFelt("Tekst"),
    defineField({
      name: "portraet",
      title: "Portræt",
      type: "image",
      options: { hotspot: true },
      description:
        "Stående billede i 3:4. Uden det står feltet tomt med teksten «Portræt af Markus» — og det er med vilje: et lånt billede af en anden er værre end et tomt felt.",
      fields: [
        defineField({
          name: "alt",
          title: "Billedbeskrivelse",
          type: "string",
          validation: (r) => r.required(),
        }),
      ],
    }),
    skjulFelt(),
  ],
  preview: sektionPreview("Personen bag"),
});

/* ------------------------------------------------------------------- cases */

export const caselisteSektion = defineType({
  name: "caselisteSektion",
  title: "Case-oversigt",
  type: "object",
  // Casene kommer fra case-dokumenterne og står i den rækkefølge, deres
  // «Rækkefølge»-felt angiver. Her sættes kun overskriften over dem.
  fields: [eyebrowFelt(), overskriftFelt(), skjulFelt()],
  preview: sektionPreview("Case-oversigt"),
});

export const udtalelserSektion = defineType({
  name: "udtalelserSektion",
  title: "Udtalelser",
  type: "object",
  // Udtalelserne hentes fra de cases, der har en. Skal en case' udtalelse
  // vises her, skrives den på casen — ikke her.
  fields: [eyebrowFelt(), overskriftFelt(), skjulFelt()],
  preview: sektionPreview("Udtalelser"),
});

/* --------------------------------------------------------------- kontakt */

export const kontaktSektion = defineType({
  name: "kontaktSektion",
  title: "Kontakt",
  type: "object",
  // Formularen selv bliver i koden: felterne, valideringen og afsendelsen er
  // ikke indhold. Her sættes teksten omkring den.
  fields: [
    eyebrowFelt(),
    overskriftFelt(),
    defineField({
      name: "undertekst",
      title: "Undertekst",
      type: "text",
      rows: 3,
    }),
    skjulFelt(),
  ],
  preview: sektionPreview("Kontakt"),
});

/** Alle sektionstyper, til registrering i studiet. */
export const sektionTyper = [
  heroSektion,
  kundelogoerSektion,
  ydelseskortSektion,
  caseudvalgSektion,
  omblokSektion,
  sidehovedSektion,
  toSpalterSektion,
  punktlisteSektion,
  ctaSektion,
  servicesSektion,
  personenBagSektion,
  caselisteSektion,
  udtalelserSektion,
  kontaktSektion,
];

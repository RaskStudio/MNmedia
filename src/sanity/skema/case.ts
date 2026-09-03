import { defineArrayMember, defineField, defineType } from "sanity";

/**
 * En case.
 *
 * Formen er den samme som `Case` i src/content/cases.ts — den blev skrevet
 * med det her skema for øje, så skiftet blev et query-skift og ikke en
 * omskrivning af komponenterne. Ændrer du et feltnavn her, skal typen og
 * GROQ-forespørgslen følge med.
 *
 * Felterne er skrevet, som Markus skal læse dem. `description` er ikke
 * hjælpetekst for en udvikler: det er stedet, hvor reglen for feltet står,
 * så han ikke skal huske den eller ringe efter den.
 */

const YDELSER = [
  "Branding",
  "Sociale medier",
  "Video og foto",
  "Annoncering",
] as const;

export const caseType = defineType({
  name: "case",
  title: "Case",
  type: "document",
  groups: [
    { name: "tekst", title: "Tekst", default: true },
    { name: "tal", title: "Tal og ydelser" },
    { name: "billeder", title: "Billeder" },
  ],
  fields: [
    defineField({
      name: "kunde",
      title: "Kunde",
      type: "string",
      group: "tekst",
      description: "Virksomhedens navn, som det skal stå på sitet.",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      title: "Adresse",
      type: "slug",
      group: "tekst",
      description:
        "Den del af adressen, der kommer efter /cases/. Tryk Generate, så laves den ud fra kundenavnet. Lav den ikke om, når casen først er udgivet — så dør de links, der er delt.",
      options: { source: "kunde", maxLength: 60 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "kortBeskrivelse",
      title: "Kort beskrivelse",
      type: "text",
      rows: 2,
      group: "tekst",
      description:
        "Én sætning. Vises på forsiden og i case-oversigten, og er den tekst, der følger med, når nogen deler linket.",
      validation: (r) => r.required().max(200),
    }),
    defineField({
      name: "langBeskrivelse",
      title: "Lang beskrivelse",
      type: "text",
      rows: 6,
      group: "tekst",
      description:
        "Selve casen. Hvad kunden ville opnå, hvad vi gjorde, og hvad der kom ud af det.",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "ydelser",
      title: "Ydelser",
      type: "array",
      group: "tal",
      description: "Hvad samarbejdet omfattede.",
      of: [defineArrayMember({ type: "string" })],
      options: { list: [...YDELSER], layout: "grid" },
      validation: (r) => r.required().min(1),
    }),
    defineField({
      name: "fakta",
      title: "Tal",
      type: "array",
      group: "tal",
      description:
        "Resultaterne. Skriv tallet, som det skal stå — «300.000+», ikke 300000. Fire tal er det, layoutet er tegnet til; færre er fint, flere bryder rytmen.",
      of: [
        defineArrayMember({
          type: "object",
          name: "faktum",
          fields: [
            defineField({
              name: "tal",
              title: "Tal",
              type: "string",
              validation: (r) => r.required(),
            }),
            defineField({
              name: "label",
              title: "Hvad tallet er",
              type: "string",
              description: "Med små bogstaver: «visninger», «leads».",
              validation: (r) => r.required(),
            }),
          ],
          preview: {
            select: { title: "tal", subtitle: "label" },
          },
        }),
      ],
      validation: (r) => r.max(4),
    }),
    defineField({
      name: "orden",
      title: "Rækkefølge",
      type: "number",
      group: "tal",
      // Uden det her felt står casene efter oprettelsestidspunkt. Ved en
      // samlet import er de tidspunkter nærmest ens, og rækkefølgen bliver
      // reelt tilfældig — og den betyder noget: den øverste case er den, de
      // fleste ser.
      description:
        "Lavest står øverst. Skriv 1 på den, der skal vises først, 2 på den næste og så videre.",
      validation: (r) => r.required().integer().min(1),
    }),
    defineField({
      name: "visPaaForsiden",
      title: "Vis på forsiden",
      type: "boolean",
      group: "tal",
      description:
        "Forsiden viser de to første cases, der er slået til her. Er flere slået til, vises de to øverste i listen.",
      initialValue: false,
    }),
    defineField({
      name: "cover",
      title: "Coverbillede",
      type: "image",
      group: "billeder",
      // Hotspot er hele grunden til, at billederne kan ligge i et CMS.
      // Sitet viser det samme billede i flere formater, og uden et fokuspunkt
      // beskærer den automatiske beskæring midt i billedet — typisk lige
      // igennem et hoved.
      options: { hotspot: true },
      description:
        "Vises stående i 4:5. Sæt fokuspunktet på det, der skal blive i billedet, når det beskæres.",
      fields: [
        defineField({
          name: "alt",
          title: "Billedbeskrivelse",
          type: "string",
          description:
            "Hvad man ser. Læses højt for blinde og vises, hvis billedet ikke kan hentes.",
          validation: (r) => r.required(),
        }),
      ],
      validation: (r) => r.required(),
    }),
    defineField({
      name: "bred",
      title: "Bredt topbillede",
      type: "image",
      group: "billeder",
      options: { hotspot: true },
      description: "Vises liggende i 16:9 øverst på case-siden.",
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
    defineField({
      name: "galleri",
      title: "Galleri",
      type: "array",
      group: "billeder",
      description:
        "Fire billeder står pænest — de vises to og to. Andre antal virker, men efterlader et hul i den sidste række.",
      of: [
        defineArrayMember({
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
        }),
      ],
    }),
    defineField({
      name: "udtalelse",
      title: "Udtalelse",
      type: "object",
      group: "tekst",
      description: "Valgfri. Udelad den hellere end at finde på en.",
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({
          name: "citat",
          title: "Citat",
          type: "text",
          rows: 4,
          description: "Uden anførselstegn — dem sætter sitet selv.",
        }),
        defineField({ name: "navn", title: "Navn", type: "string" }),
        defineField({
          name: "titel",
          title: "Titel",
          type: "string",
          description: "Fx «Indehaver, RS Tømrer».",
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: "kunde",
      undertekst: "kortBeskrivelse",
      media: "cover",
      slug: "slug.current",
      kort: "kortBeskrivelse",
      lang: "langBeskrivelse",
      cover: "cover.asset",
      bred: "bred.asset",
    },
    /**
     * Listen siger, om casen er på sitet — og hvis ikke, hvad der mangler.
     *
     * Sitet viser kun cases, der har alt (se src/sanity/hent.ts). Uden den
     * her besked trykker man Publish, der sker ingenting på sitet, og der er
     * ingen måde at se hvorfor. Det er sket, og det så ud som om CMS'et var
     * i stykker.
     */
    prepare({ title, undertekst, media, slug, kort, lang, cover, bred }) {
      const mangler = [
        !title && "kunde",
        !slug && "adresse",
        !kort && "kort beskrivelse",
        !lang && "lang beskrivelse",
        !cover && "coverbillede",
        !bred && "bredt topbillede",
      ].filter(Boolean);

      return {
        title: title || "Uden navn",
        media,
        subtitle:
          mangler.length > 0
            ? `Ikke på sitet — mangler ${mangler.join(", ")}`
            : undertekst,
      };
    },
  },
});

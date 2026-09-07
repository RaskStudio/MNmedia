import { defineArrayMember, defineField, defineType } from "sanity";

/**
 * Siderne.
 *
 * Fem faste dokumenter, ét per side — ikke én «side»-type, man kan lave flere
 * af. Forskellen er ikke teknisk pedanteri:
 *
 *  1. Hver side må kun tilbyde de sektioner, der giver mening dér. En hero
 *     hører til på forsiden og ingen andre steder, og en case-oversigt kun
 *     på /cases. Med én fælles type ville studiet tilbyde alle fjorten
 *     sektioner overalt, og så er det et spørgsmål om tid, før en af dem
 *     lander et sted, den ikke er tegnet til.
 *
 *  2. Sitet har fem ruter, som er skrevet i koden. Kunne Markus oprette en
 *     sjette side i studiet, ville den ikke få en adresse — han ville lave
 *     indhold, der aldrig kom nogen steder, uden at nogen sagde det.
 *
 * Skal der en side mere til, er den billigere at bygge end at bygge et system,
 * der kan bygge den.
 */

const seoFelter = [
  defineField({
    name: "sidetitel",
    title: "Sidetitel",
    type: "string",
    group: "seo",
    description:
      "Står i browserfanen og som overskrift i Google. Sitets navn sættes automatisk bagefter, så skriv kun sidens eget navn — «Ydelser», ikke «Ydelser — MNmedia».",
    validation: (r) => r.required().max(60),
  }),
  defineField({
    name: "sidebeskrivelse",
    title: "Beskrivelse til Google",
    type: "text",
    rows: 3,
    group: "seo",
    description:
      "De to linjer under titlen i et søgeresultat. Omkring 150 tegn — længere bliver klippet af.",
    validation: (r) => r.required().max(200),
  }),
];

/**
 * Bygger et side-dokument.
 *
 * `sektioner` er de typenavne, siden må bruge, i den rækkefølge de tilbydes.
 * Rækkefølgen på selve siden er den, Markus trækker dem i.
 */
function sideType({
  name,
  title,
  beskrivelse,
  sektioner,
}: {
  name: string;
  title: string;
  beskrivelse: string;
  sektioner: string[];
}) {
  return defineType({
    name,
    title,
    type: "document",
    groups: [
      { name: "indhold", title: "Indhold", default: true },
      { name: "seo", title: "Google og deling" },
    ],
    fields: [
      defineField({
        name: "sektioner",
        title: "Sektioner",
        type: "array",
        group: "indhold",
        description: `${beskrivelse} Træk i håndtaget til venstre for at bytte om på rækkefølgen. Skal en sektion væk et stykke tid, så slå «Skjul sektionen» til frem for at slette den — så skal teksten ikke skrives igen.`,
        of: sektioner.map((type) => defineArrayMember({ type })),
        validation: (r) => r.required().min(1),
      }),
      ...seoFelter,
    ],
    preview: {
      select: { sektioner: "sektioner" },
      prepare({ sektioner }: { sektioner?: { skjul?: boolean }[] }) {
        const antal = sektioner?.length ?? 0;
        const skjulte = sektioner?.filter((s) => s?.skjul).length ?? 0;
        return {
          title,
          subtitle:
            antal === 0
              ? "Ingen sektioner"
              : `${antal} sektioner${skjulte ? `, ${skjulte} skjult` : ""}`,
        };
      },
    },
  });
}

export const forsideType = sideType({
  name: "forside",
  title: "Forside",
  beskrivelse: "Forsidens sektioner, oppefra og ned.",
  sektioner: [
    "heroSektion",
    "kundelogoerSektion",
    "ydelseskortSektion",
    "caseudvalgSektion",
    "omblokSektion",
    "ctaSektion",
  ],
});

export const ydelserSideType = sideType({
  name: "ydelserSide",
  title: "Ydelser",
  beskrivelse: "Ydelsessidens sektioner, oppefra og ned.",
  sektioner: [
    "sidehovedSektion",
    "toSpalterSektion",
    "servicesSektion",
    "punktlisteSektion",
    "ctaSektion",
  ],
});

export const omSideType = sideType({
  name: "omSide",
  title: "Om MNmedia",
  beskrivelse: "Om-sidens sektioner, oppefra og ned.",
  sektioner: [
    "sidehovedSektion",
    "toSpalterSektion",
    "punktlisteSektion",
    "personenBagSektion",
    "ctaSektion",
  ],
});

export const casesSideType = sideType({
  name: "casesSide",
  title: "Cases",
  beskrivelse:
    "Case-sidens sektioner. Selve casene ligger som egne dokumenter — her sættes rammen om dem.",
  sektioner: [
    "sidehovedSektion",
    "caselisteSektion",
    "udtalelserSektion",
    "ctaSektion",
  ],
});

export const kontaktSideType = sideType({
  name: "kontaktSide",
  title: "Kontakt",
  beskrivelse:
    "Kontaktsidens tekst. Selve formularen ligger i koden — felterne og afsendelsen er ikke indhold.",
  sektioner: ["kontaktSektion"],
});

export const sideTyper = [
  forsideType,
  ydelserSideType,
  omSideType,
  casesSideType,
  kontaktSideType,
];

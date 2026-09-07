import { defineArrayMember, defineField } from "sanity";

/**
 * Felter, der går igen på tværs af sektionerne.
 *
 * De findes for at reglen kun skal skrives ét sted. `description` på et felt
 * er ikke hjælpetekst for en udvikler — det er stedet, hvor reglen står, så
 * Markus ikke skal huske den eller ringe efter den. Står den samme regel
 * tolv steder, bliver den elleve steder forkert med tiden.
 */

/** Ikonerne, komponenterne kan tegne. Se src/components/shared/Icon.tsx. */
export const IKONER = [
  { title: "Deling", value: "share" },
  { title: "Kamera", value: "camera" },
  { title: "Skydeskive", value: "target" },
  { title: "Gnist", value: "spark" },
  { title: "Forstørrelsesglas", value: "search" },
  { title: "Kompas", value: "compass" },
  { title: "Kurve", value: "trend" },
] as const;

/**
 * Den store overskrift.
 *
 * Det er et tekstfelt og ikke en enkelt linje, og det er med vilje: et
 * linjeskift er et designværktøj her. Sitet regner et loft på skriftgraden ud
 * af overskriftens bredde (se src/lib/tekstbredde.ts), og reglen er, at
 * skrives den i ét stykke, ombryder browseren den frit — sætter man selv
 * bruddet, holder det hele vejen ned til den smalleste telefon.
 */
export const overskriftFelt = (
  beskrivelse = "Sektionens overskrift. Sætter du selv et linjeskift, holder bruddet på alle skærme — ellers ombryder den frit.",
) =>
  defineField({
    name: "overskrift",
    title: "Overskrift",
    type: "text",
    rows: 2,
    description: beskrivelse,
    validation: (r) => r.required(),
  });

/** Den lille versaltekst over overskriften. */
export const eyebrowFelt = (paakraevet = false) =>
  defineField({
    name: "eyebrow",
    title: "Overlinje",
    type: "string",
    description:
      "Den lille spærrede tekst over overskriften. Et eller to ord — den er en markering, ikke en sætning.",
    validation: paakraevet ? (r) => r.required() : undefined,
  });

/** Brødtekst som afsnit. Ét felt per afsnit frem for ét felt med linjeskift:
 *  afsnittene sættes med luft imellem, og det skal være synligt i studiet
 *  hvor de deles. */
export const afsnitFelt = (titel = "Afsnit", beskrivelse?: string) =>
  defineField({
    name: "afsnit",
    title: titel,
    type: "array",
    description:
      beskrivelse ??
      "Ét felt per afsnit. Tryk Add item for et nyt — de sættes med luft imellem.",
    of: [defineArrayMember({ type: "text", rows: 4 })],
    validation: (r) => r.required().min(1),
  });

/** En knap: hvad der står på den, og hvor den fører hen. */
export const knapFelt = (navn: string, titel: string, beskrivelse?: string) =>
  defineField({
    name: navn,
    title: titel,
    type: "object",
    description: beskrivelse,
    options: { collapsible: true, collapsed: false },
    fields: [
      defineField({
        name: "label",
        title: "Tekst på knappen",
        type: "string",
        validation: (r) => r.required(),
      }),
      defineField({
        name: "href",
        title: "Adresse",
        type: "string",
        description:
          "En sti på sitet, fx /kontakt eller /cases. Eller en hel adresse, hvis den peger ud af sitet.",
        validation: (r) => r.required(),
      }),
    ],
  });

/**
 * Skjul sektionen uden at slette den.
 *
 * Forskellen på at slette og at skjule er, om teksten skal skrives igen. En
 * sektion, der kun skal væk et halvt år, skal ikke koste et genskrivningsjob
 * — og en sektion, man har slettet for at prøve noget, kan man ikke fortryde.
 */
export const skjulFelt = () =>
  defineField({
    name: "skjul",
    title: "Skjul sektionen",
    type: "boolean",
    description:
      "Sektionen bliver stående her med sit indhold, men vises ikke på sitet.",
    initialValue: false,
  });

/** Fælles preview, så listen i studiet siger hvad sektionen ER og om den vises. */
export const sektionPreview = (etiket: string) => ({
  select: { overskrift: "overskrift", eyebrow: "eyebrow", skjul: "skjul" },
  prepare({
    overskrift,
    eyebrow,
    skjul,
  }: {
    overskrift?: string;
    eyebrow?: string;
    skjul?: boolean;
  }) {
    const titel = (overskrift ?? eyebrow ?? "").split("\n").join(" ");
    return {
      title: titel || etiket,
      subtitle: skjul ? `${etiket} — skjult` : etiket,
    };
  },
});

/**
 * Engangsscript: flyttede sidernes indhold fra koden til Sanity.
 *
 * Kørt én gang, 7. september 2026. Det ligger her som kvittering for HVAD der
 * blev flyttet og hvordan — ikke fordi det skal køres igen. Efter flytningen
 * er Sanity kilden, og kører man det en gang til, overskriver man Markus'
 * rettelser med den tekst, der stod i koden dengang.
 *
 * Det læste fra /tmp/indhold, hvor src/content var oversat til JavaScript med
 * tsc. Skal noget lægges ind på ny, er vejen en backup — se SANITY.md.
 *
 * Bygger de fem side-dokumenter ud fra det, sitet sagde den dag.
 *
 * Teksten læses fra de kompilerede indholdsmoduler frem for at blive skrevet
 * af i hånden — en afskrift på 52 strenge er 52 chancer for en tastefejl, og
 * fejlen ville se ud som en redaktionel beslutning bagefter.
 *
 * Kun de strenge, der står direkte i JSX'en, er skrevet ind her. De er
 * markeret, og de bliver kontrolleret ved at sammenligne de gengivne sider
 * før og efter.
 */
import { writeFileSync } from "node:fs";

const om = await import("/tmp/indhold/om.js");
const yd = await import("/tmp/indhold/ydelser.js");

const ROD = "/Users/andersrask/Development/MNMedia/web";
const billede = (sti, alt) => ({
  _type: "image",
  _sanityAsset: `image@file://${ROD}/public${sti}`,
  alt,
});

let n = 0;
const key = () => `k${(n++).toString(36)}`;
const s = (o) => ({ _key: key(), ...o });

const KNAP_BOOK = { label: "Book en uforpligtende snak", href: "/kontakt" };
const KNAP_SNAK = { label: "Book en snak", href: "/kontakt" };
const KNAP_CASES = { label: "Se cases", href: "/cases" };

const dokumenter = [
  {
    _id: "forside",
    _type: "forside",
    sidetitel: "Forside",
    sidebeskrivelse:
      "MNmedia hjælper virksomheder med at bygge et stærkt brand gennem content, sociale medier og annoncering. Baseret i Aarhus.",
    sektioner: [
      s({
        _type: "heroSektion",
        // Fra Hero: linjerne var sat i hånden i en liste
        overskrift: "Vi bygger brands\nfor virksomheder\nder leverer",
        undertekst:
          "Branding, sociale medier og annoncering — samlet ét sted. Vi står for hele processen, fra idé til færdigt resultat.",
        primaer: KNAP_BOOK,
        sekundaer: KNAP_CASES,
      }),
      s({
        _type: "kundelogoerSektion",
        label: "Virksomheder vi arbejder med",
      }),
      s({
        _type: "ydelseskortSektion",
        eyebrow: "Ydelser",
        overskrift: "Hvad hjælper vi med?",
        kort: yd.serviceHighlights.map((k) =>
          s({ titel: k.title, beskrivelse: k.description, ikon: k.icon }),
        ),
      }),
      s({
        _type: "caseudvalgSektion",
        eyebrow: "Resultater",
        overskrift: "Udvalgte cases",
        linkLabel: "Se alle cases",
      }),
      s({
        _type: "omblokSektion",
        eyebrow: "Om MNmedia",
        overskrift: om.omForside.overskrift,
        afsnit: om.omForside.tekst,
        punchlines: om.omForside.punchlines,
        knap: { label: "Læs mere om MNmedia", href: "/om" },
      }),
      s({
        _type: "ctaSektion",
        overskrift: "Klar til at styrke jeres brand online?",
        undertekst:
          "Lad os tage en uforpligtende snak om, hvordan vi kan hjælpe jer videre.",
        primaer: KNAP_SNAK,
        sekundaer: KNAP_CASES,
      }),
    ],
  },

  {
    _id: "ydelserSide",
    _type: "ydelserSide",
    sidetitel: "Ydelser",
    sidebeskrivelse:
      "Fra branding og content til sociale medier og annoncering. Vi hjælper virksomheder med at opbygge et stærkt brand, skabe synlighed og tiltrække flere kunder.",
    sektioner: [
      s({
        _type: "sidehovedSektion",
        eyebrow: "Ydelser",
        overskrift: "Vi tager hånd om jeres online tilstedeværelse",
        undertekst:
          "Fra branding og content til sociale medier og annoncering. Vi hjælper virksomheder med at opbygge et stærkt brand, skabe synlighed og tiltrække flere kunder.",
        cta: KNAP_BOOK,
        billede: billede(
          "/sider/ydelser-hero.webp",
          "Håndværkere på en byggeplads under en optagelse",
        ),
      }),
      s({
        _type: "toSpalterSektion",
        overskrift: "Vi producerer ikke bare content",
        afsnit: [
          "Mange virksomheder tror, at sociale medier handler om at poste billeder og videoer.",
          "Virkeligheden er, at content kun virker, når det understøtter et stærkt brand og en klar strategi.",
          "Derfor arbejder vi med hele processen – fra idéudvikling og branding til produktion, annoncering og optimering.",
        ],
      }),
      s({
        _type: "servicesSektion",
        eyebrow: "Vores services",
        overskrift: "Tre områder, ét samlet forløb",
        services: yd.services.map((t) =>
          s({
            titel: t.title,
            beskrivelse: t.description,
            punkter: t.items,
            ikon: t.icon,
            billede: billede(
              t.billede,
              `${t.title} — content produceret af MNmedia`,
            ),
          }),
        ),
      }),
      s({
        _type: "punktlisteSektion",
        eyebrow: "Processen",
        overskrift: "En struktureret proces skaber resultater",
        undertekst:
          "Sådan fungerer et samarbejde – fra første møde til den løbende udvikling.",
        visning: "trin",
        punkter: yd.process.map((t) =>
          s({ titel: t.title, beskrivelse: t.description, ikon: t.icon }),
        ),
      }),
      s({
        _type: "ctaSektion",
        eyebrow: "Lad os skabe næste kapitel i jeres vækst",
        overskrift: "Klar til at rykke jeres virksomhed?",
        undertekst:
          "Vi tager gerne en uforpligtende snak om, hvordan vi kan hjælpe jer med at opnå jeres mål.",
        primaer: KNAP_SNAK,
        sekundaer: KNAP_CASES,
      }),
    ],
  },

  {
    _id: "casesSide",
    _type: "casesSide",
    sidetitel: "Cases",
    sidebeskrivelse:
      "Vi hjælper virksomheder med at styrke deres brand, skabe synlighed og tiltrække flere kunder gennem strategisk content og målrettet annoncering.",
    sektioner: [
      s({
        _type: "sidehovedSektion",
        eyebrow: "Cases",
        overskrift: "Resultater skabt gennem stærke samarbejder",
        undertekst:
          "Vi hjælper virksomheder med at styrke deres brand, skabe synlighed og tiltrække flere kunder gennem strategisk content og målrettet annoncering.",
        cta: KNAP_BOOK,
      }),
      s({
        _type: "caselisteSektion",
        eyebrow: "Udvalgte samarbejder",
        overskrift: "Cases",
      }),
      s({
        _type: "udtalelserSektion",
        eyebrow: "Udtalelser",
        overskrift: "Hvad vores kunder siger",
      }),
      s({
        _type: "ctaSektion",
        overskrift: "Klar til at skabe resultater?",
        undertekst:
          "Vi hjælper virksomheder med at bygge et stærkere brand gennem strategi, content og annoncering.",
        primaer: KNAP_BOOK,
      }),
    ],
  },

  {
    _id: "omSide",
    _type: "omSide",
    sidetitel: "Om MNmedia",
    sidebeskrivelse: om.omHero.undertekst,
    sektioner: [
      s({
        _type: "sidehovedSektion",
        eyebrow: "Om MNmedia",
        overskrift: om.omHero.overskrift,
        undertekst: om.omHero.undertekst,
      }),
      s({
        _type: "toSpalterSektion",
        overskrift: "Hvorfor MNmedia?",
        afsnit: om.hvorforMNmedia,
      }),
      s({
        _type: "punktlisteSektion",
        eyebrow: "Tilgang",
        overskrift: "Sådan arbejder vi",
        visning: "bokse",
        punkter: om.saadanArbejderVi.map((t) =>
          s({ titel: t.title, beskrivelse: t.description }),
        ),
      }),
      s({
        _type: "personenBagSektion",
        eyebrow: "Personen bag",
        overskrift: "Mød personen bag MNmedia",
        afsnit: om.personenBag,
        // Intet portræt: billedet findes ikke endnu. Feltet står tomt med
        // vilje — se noten i scripts/build-assets.mjs.
      }),
      s({
        _type: "ctaSektion",
        overskrift: "Klar til at skabe næste kapitel?",
        undertekst:
          "Lad os tage en uforpligtende snak om, hvordan vi kan styrke jeres brand og skabe resultater sammen.",
        primaer: KNAP_SNAK,
        sekundaer: KNAP_CASES,
      }),
    ],
  },

  {
    _id: "kontaktSide",
    _type: "kontaktSide",
    sidetitel: "Kontakt",
    sidebeskrivelse:
      "Lad os tage en uforpligtende snak om, hvordan vi kan styrke jeres brand online.",
    sektioner: [
      s({
        _type: "kontaktSektion",
        eyebrow: "Kontakt",
        overskrift: "Lad os tage en uforpligtende snak",
        undertekst:
          "Fortæl kort hvad I har brug for, så vender jeg tilbage med et bud på, hvordan vi kommer i gang.",
        formularTitel: "Skriv til os",
      }),
    ],
  },
];

const ud = dokumenter.map((d) => JSON.stringify(d)).join("\n") + "\n";
writeFileSync(new URL("./sider.ndjson", import.meta.url), ud);

for (const d of dokumenter) {
  console.log(`  ${d._id.padEnd(14)} ${d.sektioner.length} sektioner`);
}

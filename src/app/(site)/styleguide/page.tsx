import type { Metadata } from "next";
import {
  Blok,
  Under,
  Proeve,
  Spec,
  Regler,
  Farve,
  Soeger,
} from "@/components/styleguide/Dele";
import { Konstruktion } from "@/components/styleguide/Konstruktion";
import { Indhold, type Afsnit } from "@/components/styleguide/Indhold";
import { Maerke } from "@/components/layout/Logo";
import { Button, ButtonElement, ArrowRight } from "@/components/shared/Button";
import { Eyebrow } from "@/components/shared/Section";
import { Icon, type IconName } from "@/components/shared/Icon";
import { Testimonial } from "@/components/shared/Testimonial";
import { StatBlock, ServiceTags } from "@/components/shared/StatBlock";
import { Billede } from "@/components/shared/Billede";
import { FadeIn } from "@/components/shared/FadeIn";
import { site } from "@/content/site";
import { serviceHighlights } from "@/content/ydelser";

export const metadata: Metadata = {
  title: "Styleguide",
  description:
    "MNmedias visuelle system: mærket, farver, skrifter, komponenter og reglerne bag dem.",
  // Guiden er et arbejdsredskab, ikke en salgsside. Den skal kunne findes fra
  // sidefoden, men ikke konkurrere med ydelser og cases i en søgning.
  robots: { index: false, follow: false },
};

/** Filerne ligger i public/brand — kopieret fra brand/ af `npm run brand`. */
const FILER = [
  {
    stam: "mnmedia-laas-hvid",
    navn: "Låsen, hvid",
    om: "Gennemsigtig bund. Til mørke flader.",
    lys: false,
  },
  {
    stam: "mnmedia-laas-sort",
    navn: "Låsen, sort",
    om: "Gennemsigtig bund. Til lyse flader.",
    lys: true,
  },
  {
    stam: "mnmedia-laas-hvid-paa-sort",
    navn: "Låsen på sort",
    om: "Firkant og luft følger med i filen.",
    lys: true,
  },
  {
    stam: "mnmedia-maerke-hvid",
    navn: "Mærket, hvid",
    om: "Monogrammet alene, mørke flader.",
    lys: false,
  },
  {
    stam: "mnmedia-maerke-sort",
    navn: "Mærket, sort",
    om: "Monogrammet alene, lyse flader.",
    lys: true,
  },
  {
    stam: "mnmedia-maerke-hvid-paa-sort",
    navn: "Mærket på sort",
    om: "Kvadratisk. Profilbillede og faneikon.",
    lys: true,
  },
] as const;

/** Oversigtens punkter. Rækkefølgen her ER rækkefølgen på siden. */
const AFSNIT: Afsnit[] = [
  { id: "maerket", nr: "01", titel: "Mærket" },
  { id: "farver", nr: "02", titel: "Farver" },
  { id: "skrifter", nr: "03", titel: "Skrifter" },
  { id: "soegeren", nr: "04", titel: "Søgeren" },
  { id: "knapper", nr: "05", titel: "Knapper" },
  { id: "komponenter", nr: "06", titel: "Komponenter" },
  { id: "rytme", nr: "07", titel: "Rytme og luft" },
  { id: "bevaegelse", nr: "08", titel: "Bevægelse" },
  { id: "social", nr: "09", titel: "Sociale profiler" },
];

const IKONER: { navn: IconName; brug: string }[] = [
  { navn: "share", brug: "SoMe-administration" },
  { navn: "camera", brug: "Video og content" },
  { navn: "target", brug: "Annoncering" },
  { navn: "spark", brug: "Branding" },
  { navn: "search", brug: "Forstå virksomheden" },
  { navn: "compass", brug: "Udvikle strategi" },
  { navn: "trend", brug: "Udvikling" },
];

const MAAL: [string, string, string][] = [
  [
    "Mærkets tegning",
    "191 × 100",
    "Bredde mod versalhøjde. Alle andre mål er afledt af de to tal.",
  ],
  ["Stregmål", "17", "17 % af versalhøjden. Samme streg hele vejen rundt."],
  ["Delt streg", "x = 106", "Hvor M slutter og N begynder."],
  ["Mærket i låsen", "0,72 em", "Højden, målt fra ordets grundlinje."],
  [
    "Afstand til ordet",
    "0,50 em",
    "Skalerer med skriftgraden, så låsen holder sit forhold.",
  ],
  [
    "Hele låsen",
    "5,1652 em",
    "Bredden som helhed. Brug den, hvis du skal regne plads ud.",
  ],
  [
    "Ordet MEDIA",
    "Archivo · wdth 80 · 500",
    "Spærring 0,15 em. I filerne er ordet lagt ud i konturer.",
  ],
];

/** Bannere. Målene er platformenes egne; zonen er dét, der overlever
 *  beskæring og de profilbilleder, platformene lægger oven i hjørnet. */
const BANNERE: {
  fil: string;
  navn: string;
  maal: string;
  zone: string;
  om: string;
}[] = [
  {
    fil: "facebook-cover-1640x664",
    navn: "Facebook-cover",
    maal: "1640 × 664",
    zone: "1090 × 500",
    om: "Telefonen beskærer til et smallere udsnit end computeren. Zonen er fællesmængden.",
  },
  {
    fil: "linkedin-firmacover-1128x376",
    navn: "LinkedIn, firmaside",
    maal: "1128 × 376",
    zone: "720 × 300",
    om: "Firmalogoet dækker cirka 160 px inde fra venstre kant — zonen er sat smallere, så den går fri.",
  },
  {
    fil: "linkedin-banner-1584x396",
    navn: "LinkedIn, personlig",
    maal: "1584 × 396",
    zone: "1100 × 320",
    om: "Profilbilledet lægger sig oven i venstre hjørne.",
  },
  {
    fil: "youtube-kanalbanner-2560x1440",
    navn: "YouTube-kanalbanner",
    maal: "2560 × 1440",
    zone: "1546 × 423",
    om: "Fjernsyn viser hele fladen, telefonen kun midterfeltet.",
  },
];

const HIGHLIGHTS = ["some", "video", "annoncer", "branding", "cases", "om-os"];

const SKALA = [
  {
    k: "text-display",
    n: "clamp(2,25rem → 3,5rem), med loft bundet til spaltebredden",
    e: <p className="headline text-display">Display</p>,
  },
  {
    k: "text-h1",
    n: "clamp(1,5rem → 3rem)",
    e: <p className="headline text-h1">Overskrift 1</p>,
  },
  {
    k: "text-h2",
    n: "clamp(1,375rem → 2rem)",
    e: <p className="headline text-h2">Overskrift 2</p>,
  },
  {
    k: "text-h3",
    n: "clamp(1,25rem → 1,5rem)",
    e: <p className="headline text-h3">Overskrift 3</p>,
  },
  {
    k: "text-lead",
    n: "clamp(1,0625rem → 1,25rem)",
    e: <p className="text-lead text-grey-400">Manchet og indledninger</p>,
  },
];

export default function StyleguidePage() {
  return (
    <>
      {/* Én ydre spalte for hele siden. Indholdsoversigten og afsnittene
          ligger i et grid indeni, så oversigten kan stå stille i venstre
          side, mens man ruller. */}
      <div className="mx-auto w-full max-w-320 px-6 md:px-10">
        {/* ---------------- Toppen ---------------- */}
        <header className="pt-36 pb-section md:pt-44">
          <p className="label-mono text-grey-400">MNmedia · Styleguide</p>
          <div className="mt-12 mb-10 flex h-14 md:h-20">
            <Maerke />
          </div>
          <h1 className="max-w-4xl headline text-display text-balance">
            Alt det visuelle, ét sted
          </h1>
          <p className="mt-8 max-w-2xl text-lead text-grey-400">
            Mærket, farverne, skrifterne og de byggesten sitet er sat sammen af
            — med reglerne, der hører til. Alt herinde er sitets egne
            komponenter, ikke kopier af dem: ændrer en knap sig i koden, ændrer
            den sig også på denne side.
          </p>
        </header>

        <div className="lg:grid lg:grid-cols-[12rem_minmax(0,1fr)] lg:gap-14 xl:gap-20">
          <Indhold afsnit={AFSNIT} />

          <div>
            {/* ---------------- 01 Mærket ---------------- */}
            <Blok
              id="maerket"
              nr="01"
              titel="Mærket"
              intro="MN findes ikke i nogen skrift. Det er tre streger sat op efter faste mål, og derfor kan det skaleres fra et broderi til en gavl uden at falde fra hinanden."
            >
              <Proeve className="py-14 md:py-20">
                <div className="w-full max-w-2xl">
                  <Konstruktion />
                </div>
              </Proeve>

              <div className="mt-14">
                <Regler
                  poster={[
                    {
                      titel: "Ét stregmål",
                      tekst:
                        "Stregen er 17 mod en versalhøjde på 100 — 17 %. Én værdi styrer hele mærkets vægt.",
                    },
                    {
                      titel: "Delt streg",
                      tekst:
                        "M og N mødes om den lodrette streg. Det gør de to bogstaver til ét mærke frem for to ved siden af hinanden.",
                    },
                    {
                      titel: "Flade snit",
                      tekst:
                        "Spidserne er skåret af for- og foroven. Uden snittet ville geringen løbe ud i en spids, der aldrig kan sættes af rent.",
                    },
                    {
                      titel: "Ordet er smallere",
                      tekst:
                        "MEDIA er sat smallere end sitets overskrifter — det skal stå ved siden af monogrammet, ikke konkurrere med det.",
                    },
                  ]}
                />
              </div>

              <Under>Mål</Under>
              <div className="overflow-x-auto">
                <table className="w-full min-w-136 border-collapse text-sm">
                  <thead>
                    <tr>
                      {["Mål", "Værdi", "Hvorfor det står her"].map((h) => (
                        <th
                          key={h}
                          className="label-mono border-b border-grey-800 py-3 pr-6 text-left font-normal text-grey-400"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {MAAL.map(([maal, vaerdi, hvorfor]) => (
                      <tr key={maal}>
                        <td className="border-b border-grey-800 py-3 pr-6 align-top whitespace-nowrap">
                          {maal}
                        </td>
                        <td className="border-b border-grey-800 py-3 pr-6 align-top font-mono tabular-nums whitespace-nowrap">
                          {vaerdi}
                        </td>
                        <td className="border-b border-grey-800 py-3 align-top text-grey-400">
                          {hvorfor}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <Under>Luft og mindstemål</Under>
              <Regler
                poster={[
                  {
                    titel: "Luft",
                    tekst:
                      "Mindst en halv mærkehøjde frit hele vejen rundt. Står mærket 40 px højt, skal der være 20 px til nærmeste tekst, kant eller motiv.",
                  },
                  {
                    titel: "Mindste størrelse",
                    tekst:
                      "Låsen: 90 px eller 24 mm bred. Mærket alene: 16 px eller 6 mm. Under det lukker stregerne sig om hinanden.",
                  },
                  {
                    titel: "Farve",
                    tekst:
                      "Sort eller hvid. Den lilla hører til knapper — aldrig til mærket.",
                  },
                  {
                    titel: "Bund",
                    tekst:
                      "Den hvide udgave skal have ro bag sig. På et lyst eller uroligt billede skal billedet dæmpes først.",
                  },
                ]}
              />

              <Under>Filer</Under>
              <ul className="grid gap-px border border-grey-800 bg-grey-800 sm:grid-cols-2 lg:grid-cols-3">
                {FILER.map((f) => (
                  <li key={f.stam} className="flex flex-col gap-5 bg-ink p-6">
                    <div
                      className={
                        "flex min-h-26 items-center justify-center p-6 " +
                        (f.lys ? "bg-paper" : "bg-ink-soft")
                      }
                    >
                      {/* Rent img frem for next/image: filerne er vektorer, og der er
                    intet at optimere — Image ville kun lægge et lag ovenpå. */}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={`/brand/${f.stam}.svg`}
                        alt={f.navn}
                        className="max-h-16 w-auto max-w-full"
                      />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">{f.navn}</h4>
                      <p className="mt-1 text-sm text-grey-400">{f.om}</p>
                    </div>
                    <p className="mt-auto flex flex-wrap gap-2">
                      {(["svg", "pdf", "png"] as const).map((fmt) => (
                        <a
                          key={fmt}
                          href={`/brand/${f.stam}.${fmt}`}
                          download
                          className="label-mono border border-grey-800 px-3 py-2 text-grey-400 transition-colors hover:border-accent hover:bg-accent hover:text-paper"
                        >
                          {fmt}
                        </a>
                      ))}
                    </p>
                  </li>
                ))}
              </ul>
              <p className="mt-6 max-w-2xl text-sm leading-relaxed text-grey-400">
                SVG er originalen og skalerer i det uendelige — den er den, en
                foliemand eller en broderiskærer beder om. PDF er samme vektor
                pakket til tryk. PNG er 2400 px bred med gennemsigtig bund, til
                alt hvor der ikke kan lægges en vektor ind: sociale medier,
                PowerPoint, Word.
              </p>
            </Blok>

            {/* ---------------- 02 Farver ---------------- */}
            <Blok
              id="farver"
              nr="02"
              titel="Farver"
              intro="Sort og hvid med tre gråtoner imellem. Den lilla er forbeholdt dét, folk skal trykke på — bruges den til pynt, holder den op med at betyde “tryk her”."
            >
              <Under>Fundamentet</Under>
              <div className="grid gap-6 sm:grid-cols-3 lg:grid-cols-6">
                <Farve
                  token="--color-ink"
                  navn="Ink"
                  hex="#0A0A0A"
                  brug="Bunden. Alt står på den."
                />
                <Farve
                  token="--color-ink-soft"
                  navn="Ink soft"
                  hex="#16161A"
                  brug="Løftede felter og prøveflader."
                />
                <Farve
                  token="--color-grey-800"
                  navn="Hårstreg"
                  hex="#232328"
                  brug="Skillelinjer og kanter. Aldrig tekst."
                />
                <Farve
                  token="--color-grey-600"
                  navn="Dyb grå"
                  hex="#4A4A52"
                  brug="Søgerens vinkler og tekniske tegninger. Aldrig tekst — 2,25:1."
                />
                <Farve
                  token="--color-grey-400"
                  navn="Grå"
                  hex="#8A8A92"
                  brug="Brødtekst, labels og tællere. Den lyseste grå, der bærer tekst."
                />
                <Farve
                  token="--color-paper"
                  navn="Paper"
                  hex="#FFFFFF"
                  brug="Overskrifter og mærket."
                />
              </div>

              <Under>Accenten</Under>
              <div className="grid gap-8 md:grid-cols-[10rem_minmax(0,1fr)]">
                <div
                  className="h-28 border border-grey-800"
                  style={{ background: "var(--color-accent)" }}
                />
                <div>
                  <p className="headline text-h3">#6E3BFF</p>
                  <p className="mt-4 max-w-2xl leading-relaxed text-grey-400">
                    Den bruges ét sted: på dét, folk skal trykke på. På sitet er
                    det den primære knap — og den tynde linje i toppen, der
                    viser, hvor langt man er nået ned ad siden. Den er sidens
                    eneste undtagelse, og den er funktionel. Sætter du accenten
                    på overskrifter, streger eller flader, holder den op med at
                    betyde “tryk her”, og så er der ikke noget tilbage til at
                    sige det.
                  </p>
                  <p className="label-mono mt-5 text-grey-400">
                    Hover: #5A2EE0 · var(--color-accent-hover)
                  </p>
                </div>
              </div>
            </Blok>

            {/* ---------------- 03 Skrifter ---------------- */}
            <Blok
              id="skrifter"
              nr="03"
              titel="Skrifter"
              intro="Tre roller, tre snit. Archivo har en bredde-akse, og det er hele pointen: den brede variant giver den plakat-agtige vægt, en almindelig grotesk ikke har."
            >
              <div className="grid gap-10">
                <Spec
                  midt={false}
                  note="Overskrifter · Archivo · wdth 112 · vægt 600 · versaler · sporing −0,015 em · utility .headline"
                >
                  <p className="headline text-display">Vi bygger brands</p>
                </Spec>
                <Spec
                  midt={false}
                  note="Brødtekst · Geist · vægt 350 · linjeafstand 1,65 · omkring 65 tegn pr. linje"
                >
                  <p className="max-w-2xl text-lead text-grey-400">
                    Branding, sociale medier og annoncering — samlet ét sted. Vi
                    står for hele processen, fra idé til færdigt resultat.
                  </p>
                </Spec>
                <Spec
                  midt={false}
                  note="Labels og tal · Geist Mono · vægt 400 · sporing 0,22 em · altid versaler · utility .label-mono"
                >
                  <p className="label-mono text-grey-400">
                    Ydelser · Cases · 02 / 03
                  </p>
                </Spec>
                <Spec
                  midt={false}
                  note="Ordet i mærket · Archivo · wdth 80 · vægt 500 · sporing 0,15 em — smallere end overskrifterne, med vilje"
                >
                  <p
                    className="text-2xl uppercase"
                    style={{
                      fontFamily: "var(--font-headline)",
                      fontVariationSettings: '"wdth" 80',
                      fontWeight: 500,
                      letterSpacing: "0.15em",
                    }}
                  >
                    media
                  </p>
                </Spec>
              </div>

              <Under>Skalaen</Under>
              <div className="border-t border-grey-800">
                {SKALA.map((r) => (
                  <div
                    key={r.k}
                    className="grid items-baseline gap-3 border-b border-grey-800 py-8 md:grid-cols-[minmax(0,1fr)_18rem]"
                  >
                    <div>{r.e}</div>
                    <p className="label-mono text-grey-400">
                      {r.k}
                      <span className="mt-2 block normal-case tracking-normal">
                        {r.n}
                      </span>
                    </p>
                  </div>
                ))}
              </div>
              <p className="mt-8 max-w-2xl text-sm leading-relaxed text-grey-400">
                Display har et loft, der er bundet til spaltebredden. Forsidens
                overskrift er brudt i linjer i hånden og kan derfor ikke ombryde
                sig ud af en for smal spalte — uden loftet bliver den klippet af
                på hver eneste telefon.
              </p>
            </Blok>

            {/* ---------------- 04 Søgeren ---------------- */}
            <Blok
              id="soegeren"
              nr="04"
              titel="Søgeren"
              intro="Fire vinkler, der markerer et felt uden at lukke en kasse om det. Betydningen er hentet fra kameraets søger: sådan afgrænser den dét, der er i billedet. Derfor er der én regel — de markerer noget, man ser på."
            >
              <Proeve className="py-16">
                <Soeger className="px-8 py-5">
                  <p className="label-mono text-grey-400">Noget man ser på</p>
                </Soeger>
              </Proeve>

              <div className="mt-14">
                <Regler
                  poster={[
                    {
                      ja: true,
                      titel: "Om materiale",
                      tekst:
                        "Optagne klip, stillbilleder og billedplader. Det er dér, søgeren betyder noget.",
                    },
                    {
                      ja: true,
                      titel: "Om mødet",
                      tekst:
                        "Det ene sted per side, hvor vi beder om mødet — den afsluttende CTA.",
                    },
                    {
                      ja: false,
                      titel: "Om mærket",
                      tekst:
                        "Lå de også om afsenderen, holdt de op med at betyde noget. De sad i det midlertidige logo og er taget ud.",
                    },
                    {
                      ja: false,
                      titel: "Om hvert felt",
                      tekst:
                        "Sættes de på alle kort og bokse, bliver de til mønstertapet.",
                    },
                  ]}
                />
              </div>

              <Under>Placering</Under>
              <p className="max-w-2xl leading-relaxed text-grey-400">
                På billeder skal vinklerne ligge{" "}
                <strong className="font-medium text-paper">uden for</strong>{" "}
                motivet, med negativ afstand. Hvide hårstreger oven på et foto
                forsvinder mod himmel og lyst træ, og så er rammen kun halvt
                synlig. Uden for står de på sitets sorte bund og kan ses hele
                vejen rundt.
              </p>
            </Blok>

            {/* ---------------- 05 Knapper ---------------- */}
            <Blok
              id="knapper"
              nr="05"
              titel="Knapper"
              intro="Tre varianter. Rundingen er forbeholdt knapper — alt andet på sitet er skarpt med hårstreger, og det er dét, der får knappen til at læses som noget, man kan trykke på."
            >
              <div className="grid gap-8 lg:grid-cols-3">
                <Spec
                  className="min-h-36"
                  note="primary · den eneste lilla flade · én per skærmbillede"
                >
                  <Button href="/kontakt">Book en uforpligtende snak</Button>
                </Spec>
                <Spec
                  className="min-h-36"
                  note="secondary · hårstregskant, lyser op ved hover"
                >
                  <Button href="/cases" variant="secondary">
                    Se cases <ArrowRight />
                  </Button>
                </Spec>
                <Spec
                  className="min-h-36"
                  note="ghost · til det tredje valg, uden flade"
                >
                  <ButtonElement variant="ghost">Læs mere</ButtonElement>
                </Spec>
              </div>
              <p className="mt-8 max-w-2xl text-sm leading-relaxed text-grey-400">
                Primary bærer sidens ene handling. To lilla knapper ved siden af
                hinanden ophæver hinanden — skal der være et alternativ, er det
                secondary.
              </p>
            </Blok>

            {/* ---------------- 06 Komponenter ---------------- */}
            <Blok
              id="komponenter"
              nr="06"
              titel="Komponenter"
              intro="Byggestenene siderne er sat sammen af — vist som de rigtige komponenter, ikke som billeder af dem."
            >
              <Under>Sektionsmarkør</Under>
              <Spec
                midt={false}
                note="Eyebrow · mono-label og en hårstreg ud til kolonnens kant — samme markering som et klip på en tidslinje"
              >
                <div className="w-full">
                  <Eyebrow>Ydelser</Eyebrow>
                  <h4 className="headline text-h2">Hvad hjælper vi med?</h4>
                </div>
              </Spec>

              <Under>Ikoner</Under>
              <Proeve className="gap-y-10">
                {IKONER.map((i) => (
                  <div
                    key={i.navn}
                    className="flex w-32 flex-col items-center gap-3 text-center"
                  >
                    <Icon name={i.navn} className="size-7 text-accent" />
                    <span className="label-mono text-grey-400">{i.brug}</span>
                  </div>
                ))}
              </Proeve>
              <p className="mt-6 max-w-2xl text-sm leading-relaxed text-grey-400">
                Håndtegnede og bevidst uden ikonbibliotek — vi bruger syv
                stykker, og en pakke på 300 kB for det ville koste mere end det
                smager. Alle deler stregvægt 1,4 og runde hjørner, så de læses
                som ét sæt.
              </p>

              <Under>Kort</Under>
              {/* Forsidens rigtige kort med rigtigt indhold. En attrap med gentaget
            fyldtekst ville vise gitteret, men ikke hvordan et kort opfører sig,
            når teksterne er forskellig længde. */}
              <ul className="grid gap-px overflow-hidden bg-grey-800 sm:grid-cols-2 lg:grid-cols-4">
                {serviceHighlights.map((s) => (
                  <li key={s.title} className="flex h-full flex-col bg-ink p-8">
                    <Icon name={s.icon} className="size-7 text-accent" />
                    <h4 className="mt-8 text-h3 font-medium">{s.title}</h4>
                    <p className="mt-3 text-sm leading-relaxed text-grey-400">
                      {s.description}
                    </p>
                  </li>
                ))}
              </ul>
              <p className="mt-6 max-w-2xl text-sm leading-relaxed text-grey-400">
                Kortene ligger på et gitter af hårstreger:{" "}
                <code className="font-mono text-paper">gap-px</code> på grå
                bund, så stregen mellem dem er selve mellemrummet — ikke en
                kant, der skal flugte med naboens. Kortene er lige høje, fordi
                de er flex-kolonner i et grid, ikke fordi teksterne er lige
                lange.
              </p>

              <Under>Tal og tags</Under>
              <div className="grid gap-8 lg:grid-cols-2">
                <Spec
                  midt={false}
                  note="StatBlock · tal i Archivo, label i mono under — bruges på case-kort og case-sider"
                >
                  <StatBlock
                    fakta={[
                      { tal: "300.000+", label: "visninger" },
                      { tal: "10 mio.+", label: "kr. i opgaver" },
                      { tal: "100+", label: "leads" },
                    ]}
                  />
                </Spec>
                <Spec
                  midt={false}
                  note="ServiceTags · hårstregskant, mono, ingen flade"
                >
                  <ServiceTags
                    ydelser={["Branding", "Sociale medier", "Video og foto"]}
                  />
                </Spec>
              </div>

              <Under>Udtalelse</Under>
              <div className="max-w-2xl">
                <Testimonial
                  citat="De forstod hurtigt, hvad vi laver, og fik det til at se ud som noget, folk gider se på."
                  navn="Rasmus Sørensen"
                  titel="RS Tømrer"
                />
              </div>

              <Under>Billeder</Under>
              <div className="grid gap-10 md:grid-cols-[18rem_minmax(0,1fr)]">
                <Spec
                  midt={false}
                  note="4:5 · stillbillede · hjørnerne uden for motivet"
                >
                  <Billede
                    /* Styleguidens eget eksempelbillede, ikke en case.
                       Cases bor i Sanity nu, og en styleguide, der henter sit
                       eksempel derfra, går i stykker den dag Markus sletter
                       casen. */
                    src="/styleguide/eksempel-4-5.webp"
                    alt="Eksempel på stillbillede i 4:5"
                    sizes="(min-width: 768px) 18rem, 100vw"
                    className="w-full"
                  />
                </Spec>
                <div className="text-sm leading-relaxed text-grey-400">
                  <p>
                    Tre formater, og de er ikke tilfældige.{" "}
                    <strong className="font-medium text-paper">9:16</strong> til
                    heroens klip, fordi det er formatet, der optages i.{" "}
                    <strong className="font-medium text-paper">4:5</strong> til
                    stillbilleder af samme grund.{" "}
                    <strong className="font-medium text-paper">16:9</strong> til
                    toppen af en case.
                  </p>
                  <p className="mt-4">
                    Hjørnerne slås fra, hvor billedet støder op til andet
                    indhold — kort med kant, gallerier med fire op. Dér ville
                    vinklerne lægge sig oven i naboen eller blive til støj i
                    mængde.
                  </p>
                  <p className="mt-4">
                    Billeder ligger altid på{" "}
                    <code className="font-mono text-paper">ink-soft</code>, mens
                    de indlæses, så der aldrig blinker en hvid flade frem på en
                    sort side.
                  </p>
                </div>
              </div>
            </Blok>

            {/* ---------------- 07 Rytme ---------------- */}
            <Blok
              id="rytme"
              nr="07"
              titel="Rytme og luft"
              intro="Luften mellem sektionerne er det vigtigste enkeltelement i det minimalistiske look. Den styres ét sted, så rytmen aldrig driver fra hinanden på tværs af siderne."
            >
              <div className="grid gap-10 md:grid-cols-2">
                <Spec
                  midt={false}
                  note="--spacing-section · clamp(5rem → 10rem) · utility py-section"
                >
                  <div className="w-full">
                    <div className="h-px bg-grey-800" />
                    <div className="py-section">
                      <p className="label-mono text-grey-400">
                        Sektionens indhold
                      </p>
                    </div>
                    <div className="h-px bg-grey-800" />
                  </div>
                </Spec>
                <div className="text-sm leading-relaxed text-grey-400">
                  <p>
                    Alle sektioner bruger samme primitiv,{" "}
                    <code className="font-mono text-paper">Section</code>, og
                    alle sider har samme yderramme:{" "}
                    <code className="font-mono text-paper">max-w-320</code> med{" "}
                    <code className="font-mono text-paper">px-6</code>, der
                    bliver til{" "}
                    <code className="font-mono text-paper">px-10</code> fra md.
                  </p>
                  <p className="mt-4">
                    Sektioner adskilles af en enkelt hårstreg i{" "}
                    <code className="font-mono text-paper">grey-800</code> —
                    ikke af en baggrundsfarve. Det er dét, der holder sitet
                    fladt og lader luften gøre arbejdet.
                  </p>
                  <p className="mt-4">
                    Brødtekst holdes omkring 65 tegn bred. Længere linjer bliver
                    trættende at læse, uanset hvor meget luft der er omkring
                    dem.
                  </p>
                </div>
              </div>
            </Blok>

            {/* ---------------- 08 Bevægelse ---------------- */}
            <Blok
              id="bevaegelse"
              nr="08"
              titel="Bevægelse"
              intro="Ét bevægelsesniveau på hele sitet. Animation spredt ud over hver enkelt komponent bliver til uro; ét orkestreret moment ved sideindlæsning og en rolig indtoning ved scroll er nok."
            >
              <div className="grid gap-8 lg:grid-cols-2">
                <Spec note="FadeIn · fade og 16 px op, når elementet kommer i syne · 700 ms">
                  <FadeIn className="label-mono text-grey-400">
                    Toner ind ved scroll
                  </FadeIn>
                </Spec>
                <Spec note="animate-rise · overskrifter kører op bag en maske · 1,1 s · kun ved sideindlæsning">
                  <span className="block overflow-hidden">
                    <span className="animate-rise block headline text-h2">
                      Kører op
                    </span>
                  </span>
                </Spec>
              </div>

              <div className="mt-10">
                <Regler
                  poster={[
                    {
                      titel: "Kurven",
                      tekst:
                        "cubic-bezier(0.16, 1, 0.3, 1) — hurtigt ud, blødt i mål. Samme kurve overalt, så bevægelsen føles som ét system.",
                    },
                    {
                      titel: "Sideindlæsning",
                      tekst:
                        "Overskrifter kører op bag en maske, brødtekst og knapper løfter sig frem. Ét moment, ikke en kæde af effekter.",
                    },
                    {
                      titel: "Ved scroll",
                      tekst:
                        "Kun FadeIn. Bygget på IntersectionObserver frem for et bibliotek — 15 linjer i stedet for 50 kB på hver side.",
                    },
                    {
                      titel: "Reduceret bevægelse",
                      tekst:
                        "prefers-reduced-motion slår alt fra. Indholdet skal stå — ikke animere hurtigt forbi.",
                    },
                  ]}
                />
              </div>
            </Blok>

            {/* ---------------- 09 Sociale profiler ---------------- */}
            <Blok
              id="social"
              nr="09"
              titel="Sociale profiler"
              intro="Profilbillede, bannere og highlight-omslag, skåret til hver platforms egne mål. Alt er bygget af de samme filer som resten — det er det samme mærke, ikke en variant til lejligheden."
            >
              <Under>Profilbillede</Under>
              <div className="grid gap-10 md:grid-cols-[auto_minmax(0,1fr)]">
                <div className="flex flex-wrap gap-8">
                  {[
                    { fil: "profil-sort-1080", navn: "Sort", brug: "Standard" },
                    {
                      fil: "profil-hvid-1080",
                      navn: "Hvid",
                      brug: "Kun hvor lys bund kræves",
                    },
                  ].map((p) => (
                    <div
                      key={p.fil}
                      className="flex flex-col items-center gap-4"
                    >
                      {/* Vist som cirkel, fordi det er sådan hver eneste platform
                    viser det. En firkantet prøve ville skjule spørgsmålet om,
                    hvorvidt mærket overlever beskæringen. */}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={`/brand/social/profil/${p.fil}.png`}
                        alt={`Profilbillede, ${p.navn.toLowerCase()}`}
                        className="size-32 rounded-full border border-grey-800"
                      />
                      <div className="text-center">
                        <p className="text-sm font-medium">{p.navn}</p>
                        <p className="label-mono mt-1 text-grey-400">
                          {p.brug}
                        </p>
                      </div>
                      <a
                        href={`/brand/social/profil/${p.fil}.png`}
                        download
                        className="label-mono border border-grey-800 px-3 py-2 text-grey-400 transition-colors hover:border-accent hover:bg-accent hover:text-paper"
                      >
                        Hent
                      </a>
                    </div>
                  ))}
                </div>
                <div className="text-sm leading-relaxed text-grey-400">
                  <p>
                    Ét billede på 1080 × 1080 rækker til Instagram, Facebook,
                    LinkedIn, TikTok og YouTube. Platformene skalerer selv ned.
                  </p>
                  <p className="mt-4">
                    Alle beskærer til en cirkel, og mærket overlever det: dets
                    hjørner ligger 0,418 gange sidelængden fra midten, cirklen
                    0,5. Derfor er der ingen særskilt rund udgave — den
                    firkantede <em className="text-paper not-italic">er</em> den
                    runde.
                  </p>
                  <p className="mt-4">
                    Den sorte er standarden. Den hvide er til de få steder, hvor
                    en lys bund er påkrævet — brandet står på sort.
                  </p>
                </div>
              </div>

              <Under>Bannere</Under>
              <ul className="grid gap-px border border-grey-800 bg-grey-800">
                {BANNERE.map((b) => (
                  <li
                    key={b.fil}
                    className="grid gap-6 bg-ink p-6 md:grid-cols-[16rem_minmax(0,1fr)_auto] md:items-center"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`/brand/social/cover/${b.fil}.png`}
                      alt={b.navn}
                      className="w-full border border-grey-800"
                    />
                    <div>
                      <h4 className="text-sm font-medium">{b.navn}</h4>
                      <p className="label-mono mt-2 text-grey-400">
                        {b.maal} · sikker zone {b.zone}
                      </p>
                      <p className="mt-2 text-sm leading-relaxed text-grey-400">
                        {b.om}
                      </p>
                    </div>
                    <a
                      href={`/brand/social/cover/${b.fil}.png`}
                      download
                      className="label-mono justify-self-start border border-grey-800 px-3 py-2 text-grey-400 transition-colors hover:border-accent hover:bg-accent hover:text-paper"
                    >
                      Hent
                    </a>
                  </li>
                ))}
              </ul>
              <p className="mt-6 max-w-2xl text-sm leading-relaxed text-grey-400">
                Låsen står midt i dem alle. Det er ikke en æstetisk beslutning:
                midten er det eneste sted, der overlever både telefonens
                beskæring og det profilbillede, platformene lægger oven i
                venstre hjørne. Vinklerne markerer den sikre zone og sidder 28
                px inde i den — lå de på kanten, ville beskæringen skære lige
                igennem dem.
              </p>

              <Under>Instagram-highlights</Under>
              <Proeve className="gap-8">
                {HIGHLIGHTS.map((h) => (
                  <a
                    key={h}
                    href={`/brand/social/highlights/highlight-${h}-1080.png`}
                    download
                    className="group flex flex-col items-center gap-3"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`/brand/social/highlights/highlight-${h}-1080.png`}
                      alt={`Highlight-omslag: ${h}`}
                      className="size-24 rounded-full border border-grey-800 transition-colors group-hover:border-accent"
                    />
                    <span className="label-mono text-grey-400 transition-colors group-hover:text-paper">
                      Hent
                    </span>
                  </a>
                ))}
              </Proeve>
              <p className="mt-6 max-w-2xl text-sm leading-relaxed text-grey-400">
                Ord frem for ikoner: et omslag vises som en cirkel på 161 px, og
                dér lander en stregvægt på 1,4 px under én pixel — under mærkets
                egen mindstestørrelse. Derfor er søgeren heller ikke med her.
                Alle seks er sat i samme skriftgrad, ikke i samme bredde: fælles
                versalhøjde er dét, der får dem til at læses som ét sæt.
              </p>
            </Blok>

            {/* ---------------- Foden ---------------- */}
            <section className="border-t border-grey-800 py-section">
              <p className="label-mono text-grey-400">Originalen</p>
              <p className="mt-6 max-w-2xl leading-relaxed text-grey-400">
                Mærkets tegning findes ét sted:{" "}
                <code className="font-mono text-paper">
                  src/components/layout/Logo.tsx
                </code>
                . Filerne herover er genereret ud fra den med{" "}
                <code className="font-mono text-paper">
                  python3 brand/byg.py
                </code>{" "}
                — ændrer geometrien sig, køres scriptet, og ikoner, delebillede
                og trykfiler følger med.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Button href="/kontakt">Book en snak</Button>
                <Button href="/" variant="secondary">
                  Til forsiden <ArrowRight />
                </Button>
              </div>
              <p className="label-mono mt-16 border-t border-grey-800 pt-8 text-grey-400">
                {site.name} · Aarhus
              </p>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}

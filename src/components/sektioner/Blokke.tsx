import { Section, Eyebrow } from "@/components/shared/Section";
import { Overskrift } from "@/components/shared/Overskrift";
import { FadeIn } from "@/components/shared/FadeIn";
import { Icon } from "@/components/shared/Icon";
import { Billede } from "@/components/shared/Billede";
import { BilledePlads } from "@/components/shared/PageHero";
import { cn } from "@/lib/cn";
import { smalleKort, type Sektion } from "@/sanity/sider";

/**
 * De sektioner, der før stod som JSX inde i siderne.
 *
 * De er trukket ud, fordi en sektion, der bor i en side, ikke kan flyttes til
 * en anden — og hele pointen med det her arbejde er, at Markus kan rykke om
 * på rækkefølgen og slå sektioner fra. Layoutet er uændret; det er kun
 * flyttet et sted hen, hvor det kan kaldes.
 */

type Af<T extends Sektion["_type"]> = Extract<Sektion, { _type: T }>;

/** Overskrift til venstre, brødtekst til højre. Til at folde et synspunkt ud. */
export function ToSpalter({ s }: { s: Af<"toSpalterSektion"> }) {
  return (
    <Section className="border-t border-grey-800">
      <div className="grid gap-14 lg:grid-cols-[1fr_1.2fr] lg:gap-24">
        <Overskrift tekst={s.overskrift} className="text-h1" />
        <FadeIn className="space-y-6 text-lead text-grey-400">
          {s.afsnit.map((a) => (
            <p key={a}>{a}</p>
          ))}
        </FadeIn>
      </div>
    </Section>
  );
}

/**
 * Nummererede punkter i to udseender.
 *
 * «Bokse» er et gitter med hårstreg imellem — det bærer tre punkter.
 * «Trin» er en række med ikoner, hvor prikker over hvert trin viser, hvor
 * langt i forløbet det ligger — en proces læst fra venstre. Den bærer fem. Det er samme indhold og to
 * forskellige aflæsninger, og derfor ét felt frem for to sektionstyper.
 */
export function Punktliste({ s }: { s: Af<"punktlisteSektion"> }) {
  const bokse = s.visning === "bokse";
  return (
    <Section className="border-t border-grey-800">
      {s.eyebrow && <Eyebrow>{s.eyebrow}</Eyebrow>}
      <Overskrift tekst={s.overskrift} className="max-w-2xl text-h1" />
      {s.undertekst && (
        <p className="mt-7 max-w-xl text-lead text-grey-400">{s.undertekst}</p>
      )}

      {bokse ? (
        <ul className="mt-14 grid gap-px overflow-hidden bg-grey-800 md:grid-cols-3">
          {s.punkter.map((p, i) => (
            <FadeIn as="li" key={p.titel} delay={i * 90}>
              <div className="flex h-full flex-col bg-ink p-8 md:p-10">
                <span className="text-xs tracking-[0.2em] text-accent">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-6 text-h3 font-medium">{p.titel}</h3>
                <p className="mt-3 text-sm leading-relaxed text-grey-400">
                  {p.beskrivelse}
                </p>
              </div>
            </FadeIn>
          ))}
        </ul>
      ) : (
        <ol className="mt-16 grid gap-y-12 sm:grid-cols-2 lg:grid-cols-5 lg:gap-x-6">
          {s.punkter.map((p, i) => (
            <FadeIn as="li" key={p.titel} delay={i * 80}>
              <div className="relative border-t border-grey-800 pt-6 lg:pr-6">
                {/* Hvor langt i forløbet trinet ligger: én prik pr. trin,
                    udfyldt op til og med dette. Før stod her en kort lilla
                    streg, lige lang over alle fem — den læste som fem
                    loadingbarer, der hang på 10 %. Prikkerne sidder på
                    linjen, og ring-ink skærer linjen fri omkring dem. */}
                <span
                  aria-hidden
                  className="absolute -top-[3px] left-0 flex gap-1.5"
                >
                  {s.punkter.map((_, j) => (
                    <span
                      key={j}
                      className={cn(
                        "size-1.5 rounded-full ring-4 ring-ink",
                        j <= i ? "bg-accent" : "bg-grey-800",
                      )}
                    />
                  ))}
                </span>
                <div className="flex items-center gap-3">
                  {p.ikon && (
                    <Icon name={p.ikon} className="size-5 text-accent" />
                  )}
                  <span className="text-xs tracking-[0.2em] text-grey-400">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="mt-5 text-h3 font-medium">{p.titel}</h3>
                <p className="mt-3 text-sm leading-relaxed text-grey-400">
                  {p.beskrivelse}
                </p>
              </div>
            </FadeIn>
          ))}
        </ol>
      )}
    </Section>
  );
}

/**
 * Services-gitteret følger antallet af kort, så det sidste aldrig står alene
 * på en ny linje. Markus lagde et fjerde kort ind og fik 3 + 1; går han
 * tilbage til tre, skal de stå som før, uden at nogen rører koden.
 *
 * Fire står først på én række fra xl. Containeren er 1200 px indvendigt, og
 * fire kort med 24 px mellemrum giver 282 px hver — nok til en punktliste
 * som «Kommunikationsretning» på én linje. Ved lg ville de få 218 px, og
 * dér står de i stedet to og to.
 *
 * `sizes` følger med, fordi den skal passe til kolonnerne: et kort, der er
 * en fjerdedel bredt, skal ikke hente et billede til en tredjedel.
 */
const SERVICES_GITTER: Record<number, { kolonner: string; sizes: string }> = {
  2: {
    kolonner: "md:grid-cols-2",
    sizes: "(min-width: 768px) 50vw, 100vw",
  },
  3: {
    kolonner: "lg:grid-cols-3",
    sizes: "(min-width: 1024px) 33vw, 100vw",
  },
  4: {
    kolonner: "md:grid-cols-2 xl:grid-cols-4",
    sizes: "(min-width: 1280px) 25vw, (min-width: 768px) 50vw, 100vw",
  },
};

/** De store kort med billede, beskrivelse og en liste under. Tre eller fire. */
export function Services({ s }: { s: Af<"servicesSektion"> }) {
  const gitter = SERVICES_GITTER[s.services.length] ?? SERVICES_GITTER[3];
  // Fire kort er smallere på én række, og kortet skaleres ned med dem.
  // Luft, ikon og titel først fra xl — to og to på en tablet har pladsen til
  // det store kort. Billedet er derimod 4:3 på ALLE bredder: det er beskåret
  // sådan i URL'en (sider.ts), og ratioen skal følge beskæringen.
  const smal = smalleKort(s.services.length);

  return (
    <Section className="border-t border-grey-800">
      {s.eyebrow && <Eyebrow>{s.eyebrow}</Eyebrow>}
      <Overskrift tekst={s.overskrift} className="max-w-2xl text-h1" />

      {/* Kortene deler rækker med subgrid: billede, ikon, titel, beskrivelse
          og liste er fem rækker, som alle kort i samme række står på. Så
          bliver beskrivelsesfeltet lige højt i alle kort, og stregen over
          listen står i samme højde — også når én beskrivelse er en linje
          længere end de andre. Uden det fulgte stregen hver sin tekst.
          gap-y-0 på subgrid'ene: ellers arver de gitterets 24 px mellem
          hver af de fem rækker. */}
      <ul className={cn("mt-14 grid gap-6", gitter.kolonner)}>
        {s.services.map((t, i) => (
          <FadeIn
            as="li"
            key={t.titel}
            delay={i * 100}
            className="row-span-5 grid grid-rows-subgrid gap-y-0"
          >
            <article className="row-span-5 grid grid-rows-subgrid gap-y-0 overflow-hidden border border-grey-800">
              <Billede
                src={t.billede.url}
                alt={t.billede.alt}
                ratio={smal ? "aspect-4/3" : "aspect-16/10"}
                sizes={gitter.sizes}
                // Billedet flugter med kortets kant, så der er intet
                // "uden for" at sætte vinklerne i — de er slået fra her.
                corners={false}
                billedeClassName="border-b border-grey-800"
              />
              <div
                className={cn(
                  "row-span-4 grid grid-rows-subgrid gap-y-0 p-8",
                  smal && "xl:p-6",
                )}
              >
                <Icon
                  name={t.ikon}
                  className={cn("size-7 text-accent", smal && "xl:size-6")}
                />
                {/* h3-skalaens bund (1,25 rem) i det smalle kort: den fulde
                    grad er 24 px ved xl og fylder for meget af 234 px. */}
                <h3
                  className={cn(
                    "mt-6 text-h3 font-medium",
                    smal && "xl:mt-5 xl:text-[1.25rem]",
                  )}
                >
                  {t.titel}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-grey-400">
                  {t.beskrivelse}
                </p>
                <ul
                  className={cn(
                    "mt-8 space-y-3 border-t border-grey-800 pt-6 text-sm",
                    smal && "xl:mt-6 xl:space-y-2.5 xl:pt-5",
                  )}
                >
                  {t.punkter.map((punkt) => (
                    <li key={punkt} className="flex items-center gap-3">
                      <span
                        aria-hidden
                        className="size-1 shrink-0 rounded-full bg-accent"
                      />
                      {punkt}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          </FadeIn>
        ))}
      </ul>
    </Section>
  );
}

/** Portræt til venstre, tekst til højre. */
export function PersonenBag({ s }: { s: Af<"personenBagSektion"> }) {
  return (
    <Section className="border-t border-grey-800">
      <div className="grid gap-14 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
        <FadeIn>
          {s.portraet ? (
            <Billede
              src={s.portraet.url}
              alt={s.portraet.alt}
              ratio="aspect-3/4"
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="lg:sticky lg:top-28"
            />
          ) : (
            // Uden billede står feltet tomt og siger hvad der mangler. Det er
            // med vilje: et lånt billede af en anden er værre end et tomt felt,
            // og det stod der engang — en håndværker fra en kundes mappe, sat
            // ind som «personen bag».
            <BilledePlads
              label="Portræt af Markus"
              ratio="aspect-3/4"
              className="lg:sticky lg:top-28"
            />
          )}
        </FadeIn>

        <div>
          {s.eyebrow && <Eyebrow>{s.eyebrow}</Eyebrow>}
          <Overskrift tekst={s.overskrift} className="text-h1" />
          <div className="mt-8 space-y-6 text-lead text-grey-400">
            {s.afsnit.map((a) => (
              <p key={a}>{a}</p>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}

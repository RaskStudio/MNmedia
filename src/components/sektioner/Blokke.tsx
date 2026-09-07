import { Section, Eyebrow } from "@/components/shared/Section";
import { Overskrift } from "@/components/shared/Overskrift";
import { FadeIn } from "@/components/shared/FadeIn";
import { Icon } from "@/components/shared/Icon";
import { Billede } from "@/components/shared/Billede";
import { BilledePlads } from "@/components/shared/PageHero";
import type { Sektion } from "@/sanity/sider";

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
 * «Trin» er en række med ikoner og en streg, der binder dem sammen, som en
 * proces læst fra venstre — den bærer fem. Det er samme indhold og to
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
              {/* Linjen ovenover binder trinene sammen visuelt på desktop */}
              <div className="relative border-t border-grey-800 pt-6 lg:pr-6">
                <span
                  aria-hidden
                  className="absolute -top-px left-0 h-px w-8 bg-accent"
                />
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

/** De tre store kort med billede, beskrivelse og en liste under. */
export function Services({ s }: { s: Af<"servicesSektion"> }) {
  return (
    <Section className="border-t border-grey-800">
      {s.eyebrow && <Eyebrow>{s.eyebrow}</Eyebrow>}
      <Overskrift tekst={s.overskrift} className="max-w-2xl text-h1" />

      <ul className="mt-14 grid gap-6 lg:grid-cols-3">
        {s.services.map((t, i) => (
          <FadeIn as="li" key={t.titel} delay={i * 100}>
            <article className="flex h-full flex-col overflow-hidden border border-grey-800">
              <Billede
                src={t.billede.url}
                alt={t.billede.alt}
                ratio="aspect-16/10"
                sizes="(min-width: 1024px) 33vw, 100vw"
                // Billedet flugter med kortets kant, så der er intet
                // "uden for" at sætte vinklerne i — de er slået fra her.
                corners={false}
                billedeClassName="border-b border-grey-800"
              />
              <div className="flex flex-1 flex-col p-8">
                <Icon name={t.ikon} className="size-7 text-accent" />
                <h3 className="mt-6 text-h3 font-medium">{t.titel}</h3>
                <p className="mt-3 text-sm leading-relaxed text-grey-400">
                  {t.beskrivelse}
                </p>
                <ul className="mt-8 space-y-3 border-t border-grey-800 pt-6 text-sm">
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

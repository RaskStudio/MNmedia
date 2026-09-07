import Link from "next/link";

import { Section, Eyebrow } from "@/components/shared/Section";
import { Overskrift } from "@/components/shared/Overskrift";
import { FadeIn } from "@/components/shared/FadeIn";
import { Billede } from "@/components/shared/Billede";
import { ArrowRight } from "@/components/shared/Button";
import { StatBlock, ServiceTags } from "@/components/shared/StatBlock";
import { Testimonial } from "@/components/shared/Testimonial";
import { KontaktForm } from "@/components/kontakt/KontaktForm";
import { hentCases } from "@/sanity/hent";
import { site } from "@/content/site";
import type { Sektion } from "@/sanity/sider";

/**
 * Sektioner, hvis indhold kommer fra casene frem for fra sektionen selv.
 *
 * Her sætter Markus kun rammen — overskriften og overlinjen. Casene og deres
 * udtalelser bor på case-dokumenterne, hvor de hører hjemme: skulle en
 * udtalelse skrives ind her, ville den samme tekst stå to steder, og det er
 * kun et spørgsmål om tid, før de to er uenige.
 */

type Af<T extends Sektion["_type"]> = Extract<Sektion, { _type: T }>;

/** Alle cases, skiftevis med billedet til venstre og højre. */
export async function Caseliste({ s }: { s: Af<"caselisteSektion"> }) {
  const cases = await hentCases();

  return (
    <Section className="border-t border-grey-800">
      {s.eyebrow && <Eyebrow>{s.eyebrow}</Eyebrow>}

      <ul className="mt-14 space-y-20 md:space-y-28">
        {cases.map((c, i) => (
          <FadeIn as="li" key={c.slug}>
            <article className="grid gap-10 lg:grid-cols-2 lg:gap-20">
              <Billede
                src={c.cover.url}
                alt={c.cover.alt}
                ratio="aspect-4/5"
                sizes="(min-width: 1024px) 50vw, 100vw"
                // Skiftevis venstre/højre giver rytme uden ekstra dekoration.
                className={i % 2 === 1 ? "lg:order-2" : undefined}
              />

              <div className="flex flex-col justify-center">
                <Overskrift
                  tekst={c.kunde}
                  className="text-h2"
                  sporing={-0.01}
                  grad="var(--text-h2)"
                />
                <p className="mt-5 text-lead text-grey-400">
                  {c.langBeskrivelse}
                </p>

                <div className="mt-8">
                  <ServiceTags ydelser={c.ydelser} />
                </div>

                <StatBlock fakta={c.fakta} className="mt-10" />

                <Link
                  href={`/cases/${c.slug}`}
                  className="mt-10 inline-flex items-center gap-2 self-start text-sm text-grey-400 transition-colors hover:text-paper"
                >
                  Se hele casen <ArrowRight />
                </Link>
              </div>
            </article>
          </FadeIn>
        ))}
      </ul>
    </Section>
  );
}

/**
 * Udtalelserne fra de cases, der har en.
 *
 * Sektionen forsvinder af sig selv, hvis ingen case har en udtalelse — en
 * overskrift over et tomt felt er værre end ingen sektion.
 */
export async function Udtalelser({ s }: { s: Af<"udtalelserSektion"> }) {
  const cases = await hentCases();
  const udtalelser = cases
    .map((c) => c.udtalelse)
    .filter((u): u is NonNullable<typeof u> => Boolean(u?.citat));

  if (udtalelser.length === 0) return null;

  return (
    <Section className="border-t border-grey-800">
      {s.eyebrow && <Eyebrow>{s.eyebrow}</Eyebrow>}
      <Overskrift tekst={s.overskrift} className="max-w-2xl text-h1" />

      <ul className="mt-14 grid gap-6 lg:grid-cols-2">
        {udtalelser.map((u, i) => (
          <FadeIn as="li" key={u.navn} delay={i * 100}>
            <Testimonial {...u} />
          </FadeIn>
        ))}
      </ul>
    </Section>
  );
}

/**
 * Kontaktoplysninger og formular.
 *
 * Adressen, telefonnummeret og mailen bliver i koden. De ændrer sig én gang om
 * året, de står også i sidefoden og i strukturdataene til Google, og tre
 * steder, der skal rettes samtidig, er tre steder at glemme det ene.
 */
export function Kontakt({ s }: { s: Af<"kontaktSektion"> }) {
  return (
    <Section className="pt-36 md:pt-44">
      <div className="grid gap-16 lg:grid-cols-[1fr_1.1fr] lg:gap-24">
        <div>
          {s.eyebrow && <Eyebrow>{s.eyebrow}</Eyebrow>}
          <Overskrift tekst={s.overskrift} som="h1" className="text-h1" />
          {s.undertekst && (
            <p className="mt-7 max-w-md text-lead text-grey-400">
              {s.undertekst}
            </p>
          )}

          <dl className="mt-14 space-y-8 text-sm">
            <div>
              <dt className="text-xs tracking-[0.2em] text-grey-400 uppercase">
                E-mail
              </dt>
              <dd className="mt-2">
                <a
                  href={`mailto:${site.email}`}
                  className="transition-colors hover:text-grey-400"
                >
                  {site.email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-xs tracking-[0.2em] text-grey-400 uppercase">
                Telefon
              </dt>
              <dd className="mt-2">
                <a
                  href={`tel:${site.phoneHref}`}
                  className="transition-colors hover:text-grey-400"
                >
                  {site.phone}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-xs tracking-[0.2em] text-grey-400 uppercase">
                Adresse
              </dt>
              <dd className="mt-2 leading-relaxed text-grey-400">
                {site.address.street}
                <br />
                {site.address.postal} {site.address.city}
              </dd>
            </div>
          </dl>
        </div>

        <div className="border border-grey-800 p-8 md:p-10">
          <KontaktForm />
        </div>
      </div>
    </Section>
  );
}

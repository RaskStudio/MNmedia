import type { Metadata } from "next";
import Link from "next/link";
import { Section, Eyebrow } from "@/components/shared/Section";
import { PageHero } from "@/components/shared/PageHero";
import { Billede } from "@/components/shared/Billede";
import { FadeIn } from "@/components/shared/FadeIn";
import { ArrowRight } from "@/components/shared/Button";
import { StatBlock, ServiceTags } from "@/components/shared/StatBlock";
import { Testimonial } from "@/components/shared/Testimonial";
import { ClosingCta } from "@/components/shared/ClosingCta";
import { hentCases } from "@/sanity/hent";

export const metadata: Metadata = {
  title: "Cases",
  description:
    "Vi hjælper virksomheder med at styrke deres brand, skabe synlighed og tiltrække flere kunder gennem strategisk content og målrettet annoncering.",
};

export default async function CasesPage() {
  const cases = await hentCases();
  const udtalelser = cases.flatMap((c) => (c.udtalelse ? [c.udtalelse] : []));

  return (
    <>
      <PageHero
        eyebrow="Cases"
        overskrift="Resultater skabt gennem stærke samarbejder"
        undertekst="Vi hjælper virksomheder med at styrke deres brand, skabe synlighed og tiltrække flere kunder gennem strategisk content og målrettet annoncering."
        cta={{ label: "Book en uforpligtende snak", href: "/kontakt" }}
      />

      {/* Sektion 2 — Udvalgte samarbejder.
          Skiftevis venstre/højre billede giver rytme uden ekstra dekoration. */}
      <Section className="border-t border-grey-800">
        <Eyebrow>Udvalgte samarbejder</Eyebrow>

        <ul className="mt-14 space-y-20 md:space-y-28">
          {cases.map((c, i) => (
            <FadeIn as="li" key={c.slug}>
              <article className="grid gap-10 lg:grid-cols-2 lg:gap-20">
                <Billede
                  src={c.cover.url}
                  alt={c.cover.alt}
                  ratio="aspect-4/5"
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className={i % 2 === 1 ? "lg:order-2" : undefined}
                />

                <div className="flex flex-col justify-center">
                  <h2 className="headline text-h2">{c.kunde}</h2>
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

      {/* Sektion 3 — Hvad vores kunder siger */}
      {udtalelser.length > 0 && (
        <Section className="border-t border-grey-800">
          <Eyebrow>Udtalelser</Eyebrow>
          <h2 className="max-w-2xl headline text-h1 text-balance">
            Hvad vores kunder siger
          </h2>

          <ul className="mt-14 grid gap-6 lg:grid-cols-2">
            {udtalelser.map((u, i) => (
              <FadeIn as="li" key={u.navn} delay={i * 100}>
                <Testimonial {...u} />
              </FadeIn>
            ))}
          </ul>
        </Section>
      )}

      <ClosingCta
        overskrift="Klar til at skabe resultater?"
        undertekst="Vi hjælper virksomheder med at bygge et stærkere brand gennem strategi, content og annoncering."
        primaer={{ label: "Book en uforpligtende snak", href: "/kontakt" }}
      />
    </>
  );
}

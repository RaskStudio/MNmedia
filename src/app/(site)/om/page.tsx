import type { Metadata } from "next";
import { Section, Eyebrow } from "@/components/shared/Section";
import { PageHero, BilledePlads } from "@/components/shared/PageHero";
import { FadeIn } from "@/components/shared/FadeIn";
import { ClosingCta } from "@/components/shared/ClosingCta";
import {
  omHero,
  hvorforMNmedia,
  saadanArbejderVi,
  personenBag,
} from "@/content/om";

export const metadata: Metadata = {
  title: "Om MNmedia",
  description: omHero.undertekst,
};

export default function OmPage() {
  return (
    <>
      <PageHero
        eyebrow="Om MNmedia"
        overskrift={omHero.overskrift}
        undertekst={omHero.undertekst}
      />

      {/* Sektion 2 — Hvorfor MNmedia? */}
      <Section className="border-t border-grey-800">
        <div className="grid gap-14 lg:grid-cols-[1fr_1.2fr] lg:gap-24">
          <h2 className="headline text-h1 text-balance">Hvorfor MNmedia?</h2>
          <FadeIn className="space-y-6 text-lead text-grey-400">
            {hvorforMNmedia.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </FadeIn>
        </div>
      </Section>

      {/* Sektion 3 — Sådan arbejder vi */}
      <Section className="border-t border-grey-800">
        <Eyebrow>Tilgang</Eyebrow>
        <h2 className="max-w-2xl headline text-h1 text-balance">
          Sådan arbejder vi
        </h2>

        <ul className="mt-14 grid gap-px overflow-hidden bg-grey-800 md:grid-cols-3">
          {saadanArbejderVi.map((item, i) => (
            <FadeIn as="li" key={item.title} delay={i * 90}>
              <div className="flex h-full flex-col bg-ink p-8 md:p-10">
                <span className="text-xs tracking-[0.2em] text-accent">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-6 text-h3 font-medium">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-grey-400">
                  {item.description}
                </p>
              </div>
            </FadeIn>
          ))}
        </ul>
      </Section>

      {/* Sektion 4 — Mød personen bag */}
      <Section className="border-t border-grey-800">
        <div className="grid gap-14 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
          <FadeIn>
            <BilledePlads
              label="Portræt af Markus"
              ratio="aspect-3/4"
              className="lg:sticky lg:top-28"
            />
          </FadeIn>

          <div>
            <Eyebrow>Personen bag</Eyebrow>
            <h2 className="headline text-h1 text-balance">
              Mød personen bag MNmedia
            </h2>
            <div className="mt-8 space-y-6 text-lead text-grey-400">
              {personenBag.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <ClosingCta
        overskrift="Klar til at skabe næste kapitel?"
        undertekst="Lad os tage en uforpligtende snak om, hvordan vi kan styrke jeres brand og skabe resultater sammen."
        primaer={{ label: "Book en snak", href: "/kontakt" }}
        sekundaer={{ label: "Se cases", href: "/cases" }}
      />
    </>
  );
}

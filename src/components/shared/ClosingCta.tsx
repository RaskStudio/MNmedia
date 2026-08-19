import { Section } from "@/components/shared/Section";
import { Hjoerner } from "@/components/shared/Frame";
import { FadeIn } from "@/components/shared/FadeIn";
import { Button, ArrowRight } from "@/components/shared/Button";

/**
 * Afsluttende CTA. Genbruges på forside, ydelser, cases og om — kun teksten
 * skifter, så rytmen mod bunden af hver side føles ens.
 */
export function ClosingCta({
  eyebrow,
  overskrift,
  undertekst,
  primaer = { label: "Book en snak", href: "/kontakt" },
  sekundaer,
}: {
  eyebrow?: string;
  overskrift: string;
  undertekst?: string;
  primaer?: { label: string; href: string };
  sekundaer?: { label: string; href: string };
}) {
  return (
    <Section className="border-t border-grey-800">
      {/* Hjørnerne indrammer det ene sted på siden hvor vi beder om mødet.
          Sektionen er ellers bare centreret tekst på sort og manglede en
          afgrænsning — nu er den stillet op som et billede der komponeres. */}
      <FadeIn className="relative mx-auto max-w-3xl px-8 py-14 text-center sm:px-14 sm:py-16">
        <Hjoerner size="size-6" className="text-grey-600" />

        {eyebrow && <p className="label-mono mb-6 text-accent">{eyebrow}</p>}
        <h2 className="headline text-h1 text-balance">{overskrift}</h2>
        {undertekst && (
          <p className="mx-auto mt-6 max-w-xl text-lead text-grey-400">
            {undertekst}
          </p>
        )}
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Button href={primaer.href}>{primaer.label}</Button>
          {sekundaer && (
            <Button href={sekundaer.href} variant="secondary">
              {sekundaer.label} <ArrowRight />
            </Button>
          )}
        </div>
      </FadeIn>
    </Section>
  );
}

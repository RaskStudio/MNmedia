import { Section, Eyebrow } from "@/components/shared/Section";
import { FadeIn } from "@/components/shared/FadeIn";
import { Button, ArrowRight } from "@/components/shared/Button";
import { Overskrift } from "@/components/shared/Overskrift";
import type { Sektion } from "@/sanity/sider";

export function AboutBlock({
  s,
}: {
  s: Extract<Sektion, { _type: "omblokSektion" }>;
}) {
  return (
    <Section className="border-t border-grey-800">
      {s.eyebrow && <Eyebrow>{s.eyebrow}</Eyebrow>}

      {/* Overskriften får hele containerens bredde frem for en halv kolonne.
          "En samarbejdspartner" fylder 719 px ved den her skriftstørrelse, og
          i den tidligere kolonne på 653 px kunne ordet ikke være — så blev
          "En" efterladt alene på første linje. Med fuld bredde er der plads
          til de to linjer omkring tankestregen.

          Loftet på skriftgraden sættes af Overskrift-komponenten, som regner
          det ud af tekstens egne bogstavbredder. Bruddet mellem linjerne er
          det, Markus sætter i studiet — se noten i Overskrift.tsx. */}
      <Overskrift tekst={s.overskrift} className="text-h1" />

      <FadeIn className="mt-14 grid gap-14 lg:mt-20 lg:grid-cols-2 lg:gap-20">
        <div className="space-y-6 text-lead text-grey-400">
          {s.afsnit.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>

        <div className="flex flex-col items-start">
          <ul className="flex flex-wrap gap-x-8 gap-y-4">
            {s.punchlines.map((p) => (
              <li key={p} className="flex items-center gap-3 text-sm">
                <span aria-hidden className="size-1.5 rounded-full bg-accent" />
                {p}
              </li>
            ))}
          </ul>

          <Button href={s.knap.href} variant="ghost" className="mt-12">
            {s.knap.label} <ArrowRight />
          </Button>
        </div>
      </FadeIn>
    </Section>
  );
}

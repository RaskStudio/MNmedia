import { Section, Eyebrow } from "@/components/shared/Section";
import { FadeIn } from "@/components/shared/FadeIn";
import { Button, ArrowRight } from "@/components/shared/Button";
import { omForside } from "@/content/om";

export function AboutBlock() {
  return (
    <Section className="border-t border-grey-800">
      <Eyebrow>Om MNmedia</Eyebrow>

      {/* Overskriften får hele containerens bredde frem for en halv kolonne.
          "En samarbejdspartner" fylder 719 px ved den her skriftstørrelse, og
          i den tidligere kolonne på 653 px kunne ordet ikke være — så blev
          "En" efterladt alene på første linje. Med fuld bredde deler
          text-balance den i to hele linjer omkring tankestregen.

          Under sm er to ting slået fra, begge på grund af det ene lange ord:
          balanceringen, som bryder midt i "samarbejdspartner" for at gøre
          linjerne lige lange, og den globale break-word, som bryder ordet dér
          hvor det står frem for at flytte det ned på egen linje. Med dem fra
          og en lidt mindre grad kan ordet være på en telefonskærm i ét stykke.
          Det er den eneste overskrift på sitet der har brug for det. */}
      <h2 className="headline text-h1 sm:text-balance">
        {omForside.overskrift}
      </h2>

      <FadeIn className="mt-14 grid gap-14 lg:mt-20 lg:grid-cols-2 lg:gap-20">
        <div className="space-y-6 text-lead text-grey-400">
          {omForside.tekst.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>

        <div className="flex flex-col items-start">
          <ul className="flex flex-wrap gap-x-8 gap-y-4">
            {omForside.punchlines.map((p) => (
              <li key={p} className="flex items-center gap-3 text-sm">
                <span aria-hidden className="size-1.5 rounded-full bg-accent" />
                {p}
              </li>
            ))}
          </ul>

          <Button href="/om" variant="ghost" className="mt-12">
            Læs mere om MNmedia <ArrowRight />
          </Button>
        </div>
      </FadeIn>
    </Section>
  );
}

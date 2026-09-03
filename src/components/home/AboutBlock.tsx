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

          Loftet på skriftgraden er den eneste af sin slags uden for heroen,
          og det er sat efter måling, ikke skøn: "En samarbejdspartner" fylder
          14.98 em i Archivo wdth 112 med sitets sporing. Spalten på en telefon
          er 100vw minus px-6 i begge sider; de 4.5rem er de 3rem polstring
          plus 1.5rem luft, så versalerne ikke lander på kanten.

          Uden loftet brydes linjen, og fordi hele sitets orddeling nu er slået
          fra (se .headline i globals.css), er det break-word der overtager —
          altså et ord hakket midt over. Med loftet står de to linjer hele
          vejen ned til 320 px. Det bider kun under ~431 px; derover er det
          clamp'en i --text-h1, der bestemmer.

          Ændrer teksten sig, skal de 14.98 måles om — det er den længste af de
          to tiltænkte linjers bredde i em, målt i browseren. */}
      <h2
        className="headline text-h1 sm:text-balance"
        style={{ fontSize: "min(var(--text-h1), (100vw - 4.5rem) / 14.98)" }}
      >
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

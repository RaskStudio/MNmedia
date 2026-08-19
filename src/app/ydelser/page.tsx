import type { Metadata } from "next";
import { Section, Eyebrow } from "@/components/shared/Section";
import { PageHero } from "@/components/shared/PageHero";
import { Billede } from "@/components/shared/Billede";
import { FadeIn } from "@/components/shared/FadeIn";
import { Icon } from "@/components/shared/Icon";
import { ClosingCta } from "@/components/shared/ClosingCta";
import { services, process } from "@/content/ydelser";

export const metadata: Metadata = {
  title: "Ydelser",
  description:
    "Fra branding og content til sociale medier og annoncering. Vi hjælper virksomheder med at opbygge et stærkt brand, skabe synlighed og tiltrække flere kunder.",
};

export default function YdelserPage() {
  return (
    <>
      <PageHero
        eyebrow="Ydelser"
        overskrift="Vi tager hånd om jeres online tilstedeværelse"
        undertekst="Fra branding og content til sociale medier og annoncering. Vi hjælper virksomheder med at opbygge et stærkt brand, skabe synlighed og tiltrække flere kunder."
        cta={{ label: "Book en uforpligtende snak", href: "/kontakt" }}
        visuelt={
          <Billede
            src="/sider/ydelser-hero.webp"
            alt="Håndværkere på en byggeplads under en optagelse"
            ratio="aspect-4/3"
            sizes="(min-width: 1024px) 45vw, 100vw"
            priority
          />
        }
      />

      {/* Sektion 2 — Mere end bare content */}
      <Section className="border-t border-grey-800">
        <div className="grid gap-14 lg:grid-cols-[1fr_1.2fr] lg:gap-24">
          <h2 className="headline text-h1 text-balance">
            Vi producerer ikke bare content
          </h2>
          <FadeIn className="space-y-6 text-lead text-grey-400">
            <p>
              Mange virksomheder tror, at sociale medier handler om at poste
              billeder og videoer.
            </p>
            <p>
              Virkeligheden er, at content kun virker, når det understøtter et
              stærkt brand og en klar strategi.
            </p>
            <p>
              Derfor arbejder vi med hele processen – fra idéudvikling og
              branding til produktion, annoncering og optimering.
            </p>
          </FadeIn>
        </div>
      </Section>

      {/* Sektion 3 — Vores services */}
      <Section className="border-t border-grey-800">
        <Eyebrow>Vores services</Eyebrow>
        <h2 className="max-w-2xl headline text-h1 text-balance">
          Tre områder, ét samlet forløb
        </h2>

        <ul className="mt-14 grid gap-6 lg:grid-cols-3">
          {services.map((service, i) => (
            <FadeIn as="li" key={service.title} delay={i * 100}>
              <article className="flex h-full flex-col overflow-hidden border border-grey-800">
                <Billede
                  src={service.billede}
                  alt={`${service.title} — content produceret af MNmedia`}
                  ratio="aspect-16/10"
                  sizes="(min-width: 1024px) 33vw, 100vw"
                  // Billedet flugter med kortets kant, så der er intet
                  // "uden for" at sætte vinklerne i — de er slået fra her.
                  corners={false}
                  billedeClassName="border-b border-grey-800"
                />
                <div className="flex flex-1 flex-col p-8">
                  <Icon name={service.icon} className="size-7 text-accent" />
                  <h3 className="mt-6 text-h3 font-medium">{service.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-grey-400">
                    {service.description}
                  </p>
                  <ul className="mt-8 space-y-3 border-t border-grey-800 pt-6 text-sm">
                    {service.items.map((item) => (
                      <li key={item} className="flex items-center gap-3">
                        <span
                          aria-hidden
                          className="size-1 shrink-0 rounded-full bg-accent"
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            </FadeIn>
          ))}
        </ul>
      </Section>

      {/* Sektion 4 — Vores proces */}
      <Section className="border-t border-grey-800">
        <Eyebrow>Processen</Eyebrow>
        <h2 className="max-w-2xl headline text-h1 text-balance">
          En struktureret proces skaber resultater
        </h2>
        <p className="mt-7 max-w-xl text-lead text-grey-400">
          Sådan fungerer et samarbejde – fra første møde til den løbende
          udvikling.
        </p>

        <ol className="mt-16 grid gap-y-12 sm:grid-cols-2 lg:grid-cols-5 lg:gap-x-6">
          {process.map((step, i) => (
            <FadeIn as="li" key={step.title} delay={i * 80}>
              {/* Linjen ovenover binder trinene sammen visuelt på desktop */}
              <div className="relative border-t border-grey-800 pt-6 lg:pr-6">
                <span
                  aria-hidden
                  className="absolute -top-px left-0 h-px w-8 bg-accent"
                />
                <div className="flex items-center gap-3">
                  <Icon name={step.icon} className="size-5 text-accent" />
                  <span className="text-xs tracking-[0.2em] text-grey-600">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="mt-5 text-h3 font-medium">{step.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-grey-400">
                  {step.description}
                </p>
              </div>
            </FadeIn>
          ))}
        </ol>
      </Section>

      <ClosingCta
        eyebrow="Lad os skabe næste kapitel i jeres vækst"
        overskrift="Klar til at rykke jeres virksomhed?"
        undertekst="Vi tager gerne en uforpligtende snak om, hvordan vi kan hjælpe jer med at opnå jeres mål."
        primaer={{ label: "Book en snak", href: "/kontakt" }}
        sekundaer={{ label: "Se cases", href: "/cases" }}
      />
    </>
  );
}

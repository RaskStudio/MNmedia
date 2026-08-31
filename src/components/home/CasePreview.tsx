import Link from "next/link";
import { Section, Eyebrow } from "@/components/shared/Section";
import { FadeIn } from "@/components/shared/FadeIn";
import { ArrowRight } from "@/components/shared/Button";
import { StatBlock, ServiceTags } from "@/components/shared/StatBlock";
import { Billede } from "@/components/shared/Billede";
import { hentForsideCases } from "@/sanity/hent";

export async function CasePreview() {
  const forsideCases = await hentForsideCases();

  return (
    <Section className="border-t border-grey-800">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <Eyebrow>Resultater</Eyebrow>
          <h2 className="headline text-h1">Udvalgte cases</h2>
        </div>
        <Link
          href="/cases"
          className="inline-flex items-center gap-2 text-sm text-grey-400 transition-colors hover:text-paper"
        >
          Se alle cases <ArrowRight />
        </Link>
      </div>

      <ul className="mt-14 grid gap-14 md:grid-cols-2 md:gap-16">
        {forsideCases.map((c, i) => (
          <FadeIn as="li" key={c.slug} delay={i * 100}>
            <Link
              href={`/cases/${c.slug}`}
              // Ingen kant om kortet: hjørnerne om billedet rammer casen ind, og en
              // kasse udenom ville være to rammer om det samme. overflow-hidden
              // er væk af samme grund — den klippede de øverste hjørner af.
              className="group flex h-full flex-col"
            >
              <div className="relative">
                <Billede
                  src={c.cover.url}
                  alt={c.cover.alt}
                  // 4:5 er formatet billederne er skudt i — vi beskærer ikke
                  // hans komposition væk for at ramme et bredt felt.
                  ratio="aspect-4/5"
                  sizes="(min-width: 768px) 50vw, 100vw"
                />
                {/* Bemærk: hjørnemarkører ved hover blev prøvet her og pillet
                    ud igen. Hårstreger i hvidt forsvinder mod de lyse partier i
                    fotoet — himmel, lyst træ — så rammen blev kun halvt synlig.
                    Playhead-stregen nedenfor er kvitteringen ved hover i stedet. */}
                {/* Stregen kører hen over billedet som et playhead når man
                    peger på kortet — en lille kvittering for at det er et klip. */}
                <span
                  aria-hidden
                  className="absolute bottom-0 left-0 z-10 h-px w-full origin-left scale-x-0 bg-accent transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100"
                />
              </div>

              <div className="flex flex-1 flex-col pt-9">
                <h3 className="headline text-h2">{c.kunde}</h3>
                <p className="mt-3 text-sm leading-relaxed text-grey-400">
                  {c.kortBeskrivelse}
                </p>
                <StatBlock fakta={c.fakta.slice(0, 3)} className="mt-8" />
                <div className="mt-8 pt-2">
                  <ServiceTags ydelser={c.ydelser} />
                </div>
              </div>
            </Link>
          </FadeIn>
        ))}
      </ul>
    </Section>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Section, Eyebrow } from "@/components/shared/Section";
import { Billede } from "@/components/shared/Billede";
import { FadeIn } from "@/components/shared/FadeIn";
import { ArrowRight } from "@/components/shared/Button";
import { StatBlock, ServiceTags } from "@/components/shared/StatBlock";
import { Testimonial } from "@/components/shared/Testimonial";
import { ClosingCta } from "@/components/shared/ClosingCta";
import { hentCase, hentCases } from "@/sanity/hent";

export async function generateStaticParams() {
  const cases = await hentCases();
  return cases.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/cases/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const c = await hentCase(slug);
  if (!c) return {};

  return {
    title: `${c.kunde} — case`,
    description: c.kortBeskrivelse,
  };
}

export default async function CasePage({ params }: PageProps<"/cases/[slug]">) {
  const { slug } = await params;
  const c = await hentCase(slug);
  if (!c) notFound();

  const andre = (await hentCases()).filter((x) => x.slug !== c.slug);

  return (
    <>
      <section className="px-6 pt-36 pb-14 md:px-10 md:pt-44">
        <div className="mx-auto w-full max-w-320">
          <Link
            href="/cases"
            className="inline-flex items-center gap-2 text-sm text-grey-400 transition-colors hover:text-paper"
          >
            <ArrowRight className="size-4 rotate-180" /> Alle cases
          </Link>

          <h1 className="mt-8 max-w-3xl headline text-h1 text-balance">
            {c.kunde}
          </h1>
          <p className="mt-6 max-w-2xl text-lead text-grey-400">
            {c.kortBeskrivelse}
          </p>
          <div className="mt-8">
            <ServiceTags ydelser={c.ydelser} />
          </div>
        </div>
      </section>

      <div className="px-6 md:px-10">
        <div className="mx-auto w-full max-w-320">
          <Billede
            src={c.bred.url}
            alt={c.bred.alt}
            ratio="aspect-16/9"
            sizes="(min-width: 1280px) 1280px, 100vw"
            priority
            className="w-full"
          />
        </div>
      </div>

      <Section>
        <div className="grid gap-14 lg:grid-cols-[1.2fr_1fr] lg:gap-24">
          <div>
            <Eyebrow>Samarbejdet</Eyebrow>
            <p className="text-lead text-grey-400">{c.langBeskrivelse}</p>
          </div>

          {c.fakta.length > 0 && (
            <FadeIn>
              <Eyebrow>Resultater</Eyebrow>
              <StatBlock fakta={c.fakta} className="gap-x-14" />
            </FadeIn>
          )}
        </div>

        {c.udtalelse && (
          <FadeIn className="mt-20 max-w-3xl">
            <Testimonial {...c.udtalelse} />
          </FadeIn>
        )}
      </Section>

      {/* Galleri. Fire billeder i 4:5 — samme format de er skudt i.
          Første række er stor på desktop, så siden får et tyngdepunkt
          i stedet for fire lige store felter i en pæn, kedelig række. */}
      {c.galleri.length > 0 && (
        <Section className="border-t border-grey-800">
          <Eyebrow>Fra optagelserne</Eyebrow>
          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {c.galleri.map((billede, i) => (
              <FadeIn as="li" key={billede.url} delay={i * 90}>
                <Billede
                  src={billede.url}
                  alt={billede.alt}
                  ratio="aspect-4/5"
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                  corners={false}
                />
              </FadeIn>
            ))}
          </ul>
        </Section>
      )}

      {andre.length > 0 && (
        <Section className="border-t border-grey-800">
          <Eyebrow>Flere cases</Eyebrow>
          <ul className="mt-10 grid gap-6 md:grid-cols-2">
            {andre.map((a) => (
              <li key={a.slug}>
                <Link
                  href={`/cases/${a.slug}`}
                  className="group flex items-center justify-between gap-6 border border-grey-800 p-8 transition-colors hover:border-grey-400"
                >
                  <span>
                    <span className="block text-h3 font-medium">{a.kunde}</span>
                    <span className="mt-2 block text-sm text-grey-400">
                      {a.kortBeskrivelse}
                    </span>
                  </span>
                  <ArrowRight className="size-5 shrink-0 text-grey-400 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      )}

      <ClosingCta
        overskrift="Skal vi skabe det samme for jer?"
        undertekst="Lad os tage en uforpligtende snak om, hvordan vi kan styrke jeres brand."
        primaer={{ label: "Book en snak", href: "/kontakt" }}
      />
    </>
  );
}

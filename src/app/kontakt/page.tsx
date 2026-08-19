import type { Metadata } from "next";
import { Section, Eyebrow } from "@/components/shared/Section";
import { KontaktForm } from "@/components/kontakt/KontaktForm";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Kontakt",
  description:
    "Lad os tage en uforpligtende snak om, hvordan vi kan styrke jeres brand online.",
};

export default function KontaktPage() {
  return (
    <Section className="pt-36 md:pt-44">
      <div className="grid gap-16 lg:grid-cols-[1fr_1.1fr] lg:gap-24">
        <div>
          <Eyebrow>Kontakt</Eyebrow>
          <h1 className="headline text-h1 text-balance">
            Lad os tage en uforpligtende snak
          </h1>
          <p className="mt-7 max-w-md text-lead text-grey-400">
            Fortæl kort hvad I har brug for, så vender jeg tilbage med et bud
            på, hvordan vi kommer i gang.
          </p>

          <dl className="mt-14 space-y-8 text-sm">
            <div>
              <dt className="text-xs tracking-[0.2em] text-grey-600 uppercase">
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
              <dt className="text-xs tracking-[0.2em] text-grey-600 uppercase">
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
              <dt className="text-xs tracking-[0.2em] text-grey-600 uppercase">
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

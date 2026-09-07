import Link from "next/link";
import { Section, Eyebrow } from "@/components/shared/Section";
import { FadeIn } from "@/components/shared/FadeIn";
import { Icon } from "@/components/shared/Icon";
import { ArrowRight } from "@/components/shared/Button";
import { Overskrift } from "@/components/shared/Overskrift";
import type { Sektion } from "@/sanity/sider";

export function ServiceCards({
  s,
}: {
  s: Extract<Sektion, { _type: "ydelseskortSektion" }>;
}) {
  return (
    <Section>
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          {s.eyebrow && <Eyebrow>{s.eyebrow}</Eyebrow>}
          <Overskrift tekst={s.overskrift} className="max-w-2xl text-h1" />
        </div>
        <Link
          href="/ydelser"
          className="inline-flex items-center gap-2 text-sm text-grey-400 transition-colors hover:text-paper"
        >
          Se alle ydelser <ArrowRight />
        </Link>
      </div>

      <ul className="mt-14 grid gap-px overflow-hidden bg-grey-800 sm:grid-cols-2 lg:grid-cols-4">
        {s.kort.map((service, i) => (
          <FadeIn as="li" key={service.titel} delay={i * 80}>
            <Link
              href="/ydelser"
              className="group flex h-full flex-col bg-ink p-8 transition-colors duration-300 hover:bg-ink-soft"
            >
              <Icon
                name={service.ikon}
                className="size-7 text-accent transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-0.5"
              />
              <h3 className="mt-8 text-h3 font-medium">{service.titel}</h3>
              <p className="mt-3 text-sm leading-relaxed text-grey-400">
                {service.beskrivelse}
              </p>
            </Link>
          </FadeIn>
        ))}
      </ul>
    </Section>
  );
}

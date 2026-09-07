import { Eyebrow } from "@/components/shared/Section";
import { Hjoerner } from "@/components/shared/Frame";
import { Button } from "@/components/shared/Button";
import { cn } from "@/lib/cn";
import { Overskrift } from "@/components/shared/Overskrift";
import { Billede } from "@/components/shared/Billede";
import type { Sektion } from "@/sanity/sider";

/**
 * Hero til undersiderne. Ikke fullscreen som forsiden — undersider skal vise
 * indhold over folden, ikke stemning.
 */
export function PageHero({
  s,
}: {
  s: Extract<Sektion, { _type: "sidehovedSektion" }>;
}) {
  const { eyebrow, overskrift, undertekst, cta, billede } = s;
  const visuelt = billede ? (
    <Billede
      src={billede.url}
      alt={billede.alt}
      ratio="aspect-4/3"
      sizes="(min-width: 1024px) 45vw, 100vw"
      priority
    />
  ) : null;

  return (
    <section className="px-6 pt-36 pb-section md:px-10 md:pt-44">
      <div
        className={cn(
          "mx-auto grid w-full max-w-320 items-center gap-14",
          visuelt && "lg:grid-cols-[1.1fr_1fr] lg:gap-20",
        )}
      >
        <div>
          <Eyebrow>{eyebrow}</Eyebrow>
          <Overskrift
            tekst={overskrift}
            som="h1"
            className="max-w-3xl text-h1"
          />
          {undertekst && (
            <p className="mt-7 max-w-xl text-lead text-grey-400">
              {undertekst}
            </p>
          )}
          {cta && (
            <Button href={cta.href} className="mt-10">
              {cta.label}
            </Button>
          )}
        </div>
        {visuelt}
      </div>
    </section>
  );
}

/**
 * Midlertidig billedplads. Erstattes af rigtige billeder fra Dropbox —
 * behold aspect-ratio, så layoutet ikke hopper når de kommer ind.
 */
export function BilledePlads({
  label,
  className,
  ratio = "aspect-4/3",
}: {
  label: string;
  className?: string;
  ratio?: string;
}) {
  return (
    // Hjørnerne skal ligge uden for feltet, så de kan ikke sidde inde i et
    // element med overflow-hidden — derfor den ydre wrapper.
    <div className={cn("relative", className)}>
      <div
        className={cn(
          "flex items-center justify-center overflow-hidden border border-grey-800 bg-ink-soft",
          ratio,
        )}
      >
        <span className="label-mono text-grey-400">{label}</span>
      </div>
      <Hjoerner inset="-inset-2 md:-inset-3" className="text-grey-600" />
    </div>
  );
}

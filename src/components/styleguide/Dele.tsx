import { Hjoerner } from "@/components/shared/Frame";
import { cn } from "@/lib/cn";

/**
 * Byggesten til styleguiden.
 *
 * Siden viser sitets egne komponenter frem — den bygger dem ikke om. Alt
 * herinde er ramme og forklaring omkring dem: prøveflader, specifikationer og
 * de få tegninger, der forklarer noget, en prøve ikke kan vise.
 *
 * Konsekvensen er dét, en styleguide skal have: ændrer nogen en knap i
 * Button.tsx, ændrer knappen sig også her. Guiden kan ikke drive fra sitet,
 * fordi den ikke har sin egen kopi at drive med.
 */

/** Sektion med mono-nummer, overskrift og valgfri indledning. */
export function Blok({
  nr,
  titel,
  children,
  intro,
  id,
}: {
  nr: string;
  titel: string;
  intro?: React.ReactNode;
  children: React.ReactNode;
  id: string;
}) {
  return (
    <section id={id} className="border-t border-grey-800 py-section">
      <div className="mx-auto w-full max-w-320 px-6 md:px-10">
        <p className="label-mono mb-5 flex items-center gap-4 text-grey-600">
          <span>{nr}</span>
          <span>{titel}</span>
          <span aria-hidden className="h-px flex-1 bg-grey-800" />
        </p>
        {intro && (
          <p className="mb-14 max-w-2xl text-lead text-grey-400">{intro}</p>
        )}
        {children}
      </div>
    </section>
  );
}

/** Mindre overskrift inde i en blok. */
export function Under({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="label-mono mt-16 mb-6 border-t border-grey-800 pt-6 text-grey-600 first:mt-0 first:border-0 first:pt-0">
      {children}
    </h3>
  );
}

/**
 * Prøveflade. Alt, der demonstreres, står på ink-soft med en hårstreg om —
 * så er der aldrig tvivl om, hvor sitet holder op, og prøven begynder.
 */
export function Proeve({
  children,
  className,
  midt = true,
}: {
  children: React.ReactNode;
  className?: string;
  midt?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex flex-wrap gap-6 border border-grey-800 bg-ink-soft p-8 md:p-10",
        midt && "items-center justify-center",
        className,
      )}
    >
      {children}
    </div>
  );
}

/** Prøve med teknisk billedtekst under. */
export function Spec({
  children,
  note,
  className,
  midt,
}: {
  children: React.ReactNode;
  note: React.ReactNode;
  className?: string;
  midt?: boolean;
}) {
  return (
    <div className="flex flex-col gap-4">
      <Proeve className={className} midt={midt}>
        {children}
      </Proeve>
      <p className="label-mono text-grey-600">{note}</p>
    </div>
  );
}

/** Reglerne: hvad man gør, og hvad man ikke gør. */
export function Regler({
  poster,
}: {
  poster: { ja?: boolean; titel: string; tekst: string }[];
}) {
  return (
    <div className="grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
      {poster.map((p) => (
        <div key={p.titel} className="border-t border-grey-800 pt-5">
          {p.ja !== undefined && (
            <p
              className={cn(
                "label-mono mb-3",
                p.ja ? "text-paper" : "text-grey-600",
              )}
            >
              {p.ja ? "Ja" : "Nej"}
            </p>
          )}
          <h4 className="headline text-h3">{p.titel}</h4>
          <p className="mt-2 text-sm leading-relaxed text-grey-400">{p.tekst}</p>
        </div>
      ))}
    </div>
  );
}

/**
 * Farveprøve. Baggrunden sættes med CSS-variablen frem for en utility-klasse:
 * variablen ER token'et fra globals.css, så prøven kan ikke vise en anden
 * farve end den, sitet bruger.
 */
export function Farve({
  token,
  navn,
  hex,
  brug,
}: {
  token: string;
  navn: string;
  hex: string;
  brug: string;
}) {
  return (
    <div>
      <div
        className="h-24 border border-grey-800"
        style={{ background: `var(${token})` }}
      />
      <p className="mt-4 text-sm font-medium">{navn}</p>
      <p className="label-mono mt-1 text-grey-600">{hex}</p>
      <p className="mt-2 text-sm leading-relaxed text-grey-400">{brug}</p>
    </div>
  );
}

/** Feltet med søgeren om — bruges til at vise selve grebet. */
export function Soeger({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("relative", className)}>
      {children}
      <Hjoerner inset="-inset-3" size="size-5" className="text-grey-600" />
    </div>
  );
}

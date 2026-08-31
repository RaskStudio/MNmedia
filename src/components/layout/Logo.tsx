import Link from "next/link";
import { cn } from "@/lib/cn";

/**
 * MNmedias mærke — forslag 01 "Smal", godkendt af Markus.
 *
 * Monogrammet er tegnet, ikke sat i en skrift: tre midterlinjer der streges op
 * med ét stregmål, så gerings-samlingerne selv giver de spidse vinkler. M og N
 * deler den lodrette streg ved x=106 — det er dét, der binder de to bogstaver
 * sammen til ét mærke frem for to bogstaver ved siden af hinanden.
 *
 * Punkterne ligger med vilje uden for versalbåndet (y=-24 og y=120) og klippes
 * ved 0 og 100. Det giver de flade snit foroven og forneden; havde vi tegnet
 * til kanten, ville geringen løbe ud i en spids der aldrig kan sættes af.
 *
 * Stregmålet er 17 på en versalhøjde på 100 — 17 %, samme optiske vægt som de
 * øvrige tre forslag har ved 22 % på et bredere bogstav. Ændrer du det ene,
 * skal du gentegne resten.
 *
 * Hjørnemarkørerne sidder IKKE i mærket. De er sitets søger og hører til på
 * det, man ser på (se Frame.tsx) — lå de også her, ville mærket læse som
 * "endnu et felt" i stedet for som afsender.
 */

/** Versalhøjde 100, bredde 191 — mål fra tegningen, ikke fra en skrift. */
const BREDDE = 191;

/** Midterlinjerne. Rækkefølge: M, N's diagonal, N's højre stamme. */
const STREGER = [
  "M11 120V-24L62 88L106 -9V120",
  "M106 -9L182 101",
  "M182 -20V120",
];

/**
 * Klipbanen. Fast id frem for useId: banen er den samme for hver eneste
 * forekomst, så flere mærker på siden må gerne pege på den første — og et
 * genereret id ville risikere at falde forskelligt ud på server og klient.
 *
 * Klippet kan ikke undværes ved at stole på at <svg> selv skjuler overløb:
 * står mærket i en firkantet ikonboks, får viewporten et andet forhold end
 * viewBoxen, og så bliver de afskårne spidser synlige i luften omkring.
 */
const KLIP_ID = "mn-versalbaand";

/**
 * Monogrammet alene. Bruges hvor der ikke er plads til ordet: faneikon,
 * profilbillede, delebillede. Arver farve via currentColor.
 */
export function Maerke({ className }: { className?: string }) {
  return (
    <svg
      viewBox={`0 0 ${BREDDE} 100`}
      role="img"
      aria-label="MN"
      className={cn("block h-full w-auto", className)}
    >
      <defs>
        <clipPath id={KLIP_ID}>
          <rect x="0" y="0" width={BREDDE} height="100" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${KLIP_ID})`}>
        {STREGER.map((d) => (
          <path
            key={d}
            d={d}
            fill="none"
            stroke="currentColor"
            strokeWidth="17"
            strokeLinecap="butt"
            strokeLinejoin="miter"
            strokeMiterlimit="8"
          />
        ))}
      </g>
    </svg>
  );
}

/**
 * Ordet ved siden af mærket. Archivo i smalt snit (wdth 80) frem for sitets
 * sædvanlige 112: ordet skal underordne sig monogrammet, ikke konkurrere med
 * det. Spærringen trækkes fra igen til højre, så det sidste bogstavs luft
 * ikke tæller med i mærkets bredde.
 *
 * Alt er målt i em, så mærke og ord skalerer sammen med font-size.
 */
function Laas({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-baseline gap-[0.5em] leading-none whitespace-nowrap",
        className,
      )}
    >
      <span className="inline-flex h-[0.72em]">
        <Maerke />
      </span>
      <span
        className="uppercase"
        style={{
          fontFamily: "var(--font-headline)",
          fontVariationSettings: '"wdth" 80',
          fontWeight: 500,
          letterSpacing: "0.15em",
          marginRight: "-0.15em",
        }}
      >
        media
      </span>
    </span>
  );
}

/** Mærket som link til forsiden — headeren og sidefoden. */
export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="MNmedia — til forsiden"
      className={cn(
        "inline-flex text-lg text-paper transition-opacity duration-300 hover:opacity-70",
        className,
      )}
    >
      <Laas />
    </Link>
  );
}

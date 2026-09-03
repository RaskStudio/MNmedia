"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

/**
 * Indholdsoversigt til styleguiden.
 *
 * Siden er 16.500 px lang med ni afsnit. Uden en oversigt er den kun
 * brugbar, hvis man læser den forfra — og det gør ingen. Man kommer for at
 * finde ét tal eller én fil.
 *
 * Fra lg står den som en stillestående liste i venstre spalte. Derunder er
 * der ikke plads til en spalte, så den bliver til en vandret række, der
 * klæber under headeren. Begge steder markerer den, hvor man er.
 *
 * Aktivt afsnit findes ved at læse afsnittenes position frem for med en
 * IntersectionObserver. Med en observer skal båndet, der udløser skiftet,
 * rammes — og ved bunden af siden når det sidste afsnit aldrig op i båndet,
 * så markeringen hænger fast på det næstsidste. En direkte måling har ikke
 * det problem og kan sige "er du i bund, er du i det sidste afsnit".
 */

export type Afsnit = { id: string; nr: string; titel: string };

/** Hvor på skærmen linjen går, som afgør hvilket afsnit man "er i". */
const LINJE = 160;

export function Indhold({ afsnit }: { afsnit: Afsnit[] }) {
  const [aktiv, setAktiv] = useState(afsnit[0]?.id ?? "");

  useEffect(() => {
    const opdater = () => {
      // Nederst på siden kan det sidste afsnit være for kort til at nå op
      // over linjen. Er man i bund, er man i det sidste — uanset hvad
      // målingen siger.
      const bund =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 2;
      if (bund) {
        setAktiv(afsnit[afsnit.length - 1].id);
        return;
      }

      let fundet = afsnit[0]?.id ?? "";
      for (const a of afsnit) {
        const el = document.getElementById(a.id);
        if (el && el.getBoundingClientRect().top <= LINJE) fundet = a.id;
      }
      setAktiv(fundet);
    };

    // Målingen kører direkte på hændelsen, uden at blive samlet i en
    // requestAnimationFrame. Det er dét, man normalt gør for at undgå at
    // læse layout flere gange pr. frame — men her læses ni rects, og der
    // skrives ikke til DOM'en imellem dem. Uden en skrivning er der ingen
    // layout at genberegne, og så er der ingen thrash at batche væk.
    opdater();
    window.addEventListener("scroll", opdater, { passive: true });
    window.addEventListener("resize", opdater);
    return () => {
      window.removeEventListener("scroll", opdater);
      window.removeEventListener("resize", opdater);
    };
  }, [afsnit]);

  const hop = (e: React.MouseEvent, id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    e.preventDefault();
    el.scrollIntoView({
      // Blød rulning er rart på en lang side, men den er stadig bevægelse:
      // har man slået den fra i systemet, skal den også være slået fra her.
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
      block: "start",
    });
    // Adressen skal følge med, så et afsnit kan deles med et link — men uden
    // det spring, en almindelig hash-navigation ville lave oven i rulningen.
    history.replaceState(null, "", `#${id}`);
  };

  return (
    // To lag, og det er ikke overflødigt: fra lg er <nav> selve grid-cellen,
    // som skal STRÆKKE sig over hele indholdets højde — ellers har det
    // klæbende lag ikke noget at klæbe indenfor, og oversigten ruller væk
    // sammen med resten. Derfor ligger sticky på det indre lag deroppe, og
    // på <nav> selv under lg, hvor den er en vandret bjælke.
    <nav
      aria-label="Indhold"
      className={cn(
        "sticky top-20 z-30 -mx-6 border-b border-grey-800 bg-ink/80 px-6 py-4 backdrop-blur-xl",
        "md:-mx-10 md:px-10",
        "lg:static lg:mx-0 lg:border-0 lg:bg-transparent lg:p-0 lg:backdrop-blur-none",
      )}
    >
      <div className="lg:sticky lg:top-32">
        <p className="label-mono mb-4 hidden text-grey-400 lg:block">Indhold</p>

        <ul
          className={cn(
            "flex gap-6 overflow-x-auto lg:flex-col lg:gap-0 lg:overflow-visible",
            // Rækken skal kunne rulles med fingeren uden at vise en scrollbar
            // hen over indholdet nedenunder.
            "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          )}
        >
          {afsnit.map((a) => {
            const her = a.id === aktiv;
            return (
              <li key={a.id} className="lg:border-l lg:border-grey-800">
                <a
                  href={`#${a.id}`}
                  onClick={(e) => hop(e, a.id)}
                  aria-current={her ? "true" : undefined}
                  className={cn(
                    "label-mono block whitespace-nowrap transition-colors duration-200",
                    "lg:-ml-px lg:border-l lg:py-2.5 lg:pl-4",
                    her
                      ? "text-paper lg:border-paper"
                      : "text-grey-400 hover:text-paper lg:border-transparent",
                  )}
                >
                  <span className="lg:hidden">{a.titel}</span>
                  <span className="hidden lg:inline">
                    {/* Nummeret holder sig dæmpet, også når titlen lyser op
                        ved hover — det er en markering, ikke en overskrift. */}
                    <span className="text-grey-400">{a.nr}</span> {a.titel}
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}

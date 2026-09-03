"use client";

import { useEffect, useRef, useState } from "react";
import { Button, ArrowRight } from "@/components/shared/Button";
import { Hjoerner } from "@/components/shared/Frame";
import { cn } from "@/lib/cn";

export type HeroSlide = {
  /** Komprimeret 9:16-MP4, ~1-2 MB, uden lyd. Se scripts/build-assets.mjs */
  src: string;
  /** Stillbillede vist med det samme, så der aldrig er sort skærm. */
  poster: string;
  alt: string;
  /** Kunden klippet er lavet for. Udelad hvis du ikke er sikker. */
  kunde?: string;
};

const SLIDE_MS = 6000;

/** Overskriften er sat i linjer i hånden: i brede versaler afgør ombrydningen
 *  rytmen, og den vil vi ikke overlade til viewportbredden. */
const linjer = ["Vi bygger brands", "for virksomheder", "der leverer"];

export function Hero({ slides }: { slides: HeroSlide[] }) {
  const [index, setIndex] = useState(0);
  const [erDesktop, setErDesktop] = useState(false);
  const [maaHente, setMaaHente] = useState(false);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  // Bemærk at den starter på false, altså mobil. Det er ikke ligegyldigt:
  // serveren render det, der står i første gennemløb, og står der true, ligger
  // ALLE tre klip i den udsendte HTML. Browseren henter så alle tre
  // posterbilleder — 313 KiB — og hydreringen smider de to af dem væk igen.
  // På en telefon er de to plakater 123 KiB, der aldrig kommer på skærmen.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setErDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Klippene henter først, når resten af siden står. Se noten ved <video>.
  useEffect(() => {
    const luk = () => setMaaHente(true);
    if (document.readyState === "complete") {
      // Siden var allerede hentet færdig, da heroen blev monteret — så falder
      // load aldrig. rAF frem for et kald her i effekten: sat direkte tvinger
      // det en ekstra synkron gengivelse, før browseren har tegnet heroen.
      const id = requestAnimationFrame(luk);
      return () => cancelAnimationFrame(id);
    }
    window.addEventListener("load", luk, { once: true });
    return () => window.removeEventListener("load", luk);
  }, []);

  useEffect(() => {
    if (!erDesktop || slides.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timer = setInterval(
      () => setIndex((i) => (i + 1) % slides.length),
      SLIDE_MS,
    );
    return () => clearInterval(timer);
  }, [erDesktop, slides.length]);

  // Spol det aktive klip tilbage, så hvert slide starter forfra
  useEffect(() => {
    if (!maaHente) return;
    const video = videoRefs.current[index];
    if (!video) return;
    video.currentTime = 0;
    void video.play().catch(() => {
      /* autoplay afvist — posterbilledet står tilbage, hvilket er fint */
    });
  }, [index, maaHente]);

  const visible = erDesktop ? slides : slides.slice(0, 1);

  return (
    <section className="relative min-h-[100svh] overflow-hidden">
      {/* Posterbilledet er det første, man ser — på mobil fylder det hele
          skærmen. Uden det her opdager browseren det først inde i <video>
          og henter det med samme prioritet som JavaScript-chunksene.
          React løfter selv link-tagget op i <head>. */}
      <link
        rel="preload"
        as="image"
        href={slides[0].poster}
        fetchPriority="high"
      />

      {/* På desktop er heroen et grid: tekst til venstre, klippet indrammet
          til højre. På mobil falder klippet ud af flowet og fylder skærmen,
          fordi viewporten dér selv er 9:16 — samme proportioner som klippet.
          minmax(0,1fr) på tekstkolonnen er ikke pynt: uden den kan en lang
          overskrift presse kolonnen bredere end sin andel. */}
      <div className="relative mx-auto flex min-h-[100svh] w-full max-w-320 flex-col justify-end px-6 pb-20 md:px-10 lg:grid lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-16 lg:pb-0">
        <div
          className={cn(
            "absolute inset-0",
            "lg:relative lg:inset-auto lg:order-2",
            // Bredden bindes af BÅDE skærmhøjden og viewportbredden. Uden vw-loftet
            // bliver klippet for bredt på en høj, smal skærm, og så er der ikke
            // plads tilbage til at overskriften kan stå på tre linjer.
            "lg:aspect-[9/16] lg:h-auto lg:w-[min(calc(60svh*9/16),26vw)]",
          )}
        >
          {/* Klippene ligger i en indre ramme med overflow-hidden. Hjørnerne
              skal uden for den — ellers klipper netop den ramme dem væk. */}
          <div className="absolute inset-0 overflow-hidden lg:border lg:border-grey-800">
            {visible.map((slide, i) => (
              <video
                key={slide.src}
                ref={(el) => {
                  videoRefs.current[i] = el;
                }}
                // Ingen autoPlay og ingen preload. Med preload="auto" gik de
                // 1,7 MB klip på ledningen SAMTIDIG med skrifter, CSS og
                // JavaScript — 88 % af sidens vægt, hentet før noget af det,
                // nogen skal læse. Målt på mobil kostede det 0,8 s af Largest
                // Contentful Paint.
                //
                // Nu bærer posterbilledet det første indtryk, og klippet
                // hentes af effekten ovenfor, når window.load er faldet — det
                // vil sige når resten står. Kontrolmålt: blokerer man .mp4
                // helt, flytter LCP sig ikke længere. Klippet er ude af den
                // kritiske vej, ikke bare skubbet.
                preload="none"
                poster={slide.poster}
                muted
                playsInline
                loop
                aria-label={slide.alt}
                className={cn(
                  "absolute inset-0 size-full object-cover transition-opacity duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]",
                  i === index ? "opacity-100" : "opacity-0",
                )}
              >
                <source src={slide.src} type="video/mp4" />
              </video>
            ))}

            {/* Kun på mobil ligger teksten oven på klippet og skal have kontrast */}
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-ink/20 lg:hidden"
            />

            {/* Og headeren gør det samme. Mærket og burgeren er hvide
                hårstreger, og klippet er ofte himmel i toppen — dér forsvinder
                de. Gradienten ovenfor kan ikke løse det: den skal være lys
                foroven, for ellers dæmper den motivet væk. Så toppen får sin
                egen. Højden dækker headerens 80 px plus en blød udtoning, så
                kanten ikke tegner en streg tværs over billedet. */}
            <div
              aria-hidden
              className="absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-ink/85 via-ink/45 to-transparent lg:hidden"
            />
          </div>

          {/* På desktop står vinklerne uden for videorammen på sitets sorte
              bund. På mobil fylder klippet hele skærmen, så der er intet
              "uden for" — dér ville de ligge oven på billedet og forsvinde,
              og derfor er de slået fra. */}
          <Hjoerner
            inset="-inset-3"
            className="hidden text-grey-600 lg:block"
          />
        </div>

        <div className="relative lg:order-1">
          <h1 className="headline text-display">
            {linjer.map((linje, i) => (
              // Masken klipper linjen af, mens indholdet kører op bagved.
              <span key={linje} className="block overflow-hidden pb-[0.06em]">
                <span
                  className="animate-rise block"
                  style={{ animationDelay: `${i * 110}ms` }}
                >
                  {linje}
                </span>
              </span>
            ))}
          </h1>

          <div
            className="animate-lift mt-8 max-w-xl"
            style={{ animationDelay: "440ms" }}
          >
            <p className="text-lead text-grey-400">
              Branding, sociale medier og annoncering — samlet ét sted. Vi står
              for hele processen, fra idé til færdigt resultat.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Button href="/kontakt">Book en uforpligtende snak</Button>
              <Button href="/cases" variant="secondary">
                Se cases <ArrowRight />
              </Button>
            </div>
          </div>

          {/* Klip-tidslinje. Hvert klip er et spor, det aktive fyldes op mens
              det spiller — samme aflæsning som i et klipprogram. */}
          {slides.length > 1 && (
            <div className="mt-12 hidden items-center gap-5 lg:flex">
              <span className="label-mono text-grey-400 tabular-nums">
                {String(index + 1).padStart(2, "0")} /{" "}
                {String(slides.length).padStart(2, "0")}
              </span>
              <div className="flex gap-2">
                {slides.map((slide, i) => (
                  <button
                    key={slide.src}
                    type="button"
                    onClick={() => setIndex(i)}
                    aria-label={`Vis klip ${i + 1}${slide.kunde ? ` — ${slide.kunde}` : ""}`}
                    aria-current={i === index}
                    className="group py-2"
                  >
                    <span className="block h-px w-14 overflow-hidden bg-grey-800 transition-colors duration-300 group-hover:bg-grey-600">
                      <span
                        // key genstarter animationen når klippet skifter
                        key={i === index ? `aktiv-${index}` : "hvile"}
                        className={cn(
                          "block h-px bg-paper",
                          i === index ? "animate-scrub w-full" : "w-0",
                        )}
                        style={{
                          ["--scrub-duration" as string]: `${SLIDE_MS}ms`,
                        }}
                      />
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

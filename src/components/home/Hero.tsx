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
  const [isMobile, setIsMobile] = useState(false);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  // Under lg viser vi kun det første klip — resten er spildt data på 4G.
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1023px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (isMobile || slides.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timer = setInterval(
      () => setIndex((i) => (i + 1) % slides.length),
      SLIDE_MS,
    );
    return () => clearInterval(timer);
  }, [isMobile, slides.length]);

  // Spol det aktive klip tilbage, så hvert slide starter forfra
  useEffect(() => {
    const video = videoRefs.current[index];
    if (!video) return;
    video.currentTime = 0;
    void video.play().catch(() => {
      /* autoplay afvist — posterbilledet står tilbage, hvilket er fint */
    });
  }, [index]);

  const visible = isMobile ? slides.slice(0, 1) : slides;

  return (
    <section className="relative min-h-[100svh] overflow-hidden">
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
                // Kun første klip hentes ved sideindlæsning; resten når de skal bruges
                preload={i === 0 ? "auto" : "none"}
                poster={slide.poster}
                muted
                playsInline
                loop
                autoPlay={i === 0}
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
          </div>

          {/* På desktop står vinklerne uden for videorammen på sitets sorte
              bund. På mobil fylder klippet hele skærmen, så der er intet
              "uden for" — dér ville de ligge oven på billedet og forsvinde,
              og derfor er de slået fra. */}
          {!isMobile && <Hjoerner inset="-inset-3" className="text-grey-600" />}
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
              <span className="label-mono text-grey-600 tabular-nums">
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

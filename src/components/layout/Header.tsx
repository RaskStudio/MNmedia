"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Logo } from "./Logo";
import { Hjoerner } from "@/components/shared/Frame";
import { Button } from "@/components/shared/Button";
import { nav } from "@/content/site";
import { cn } from "@/lib/cn";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const burger = useRef<HTMLButtonElement>(null);

  // Luk menuen, når adressen skifter — også når det ikke sker via et tryk i
  // menuen, fx iPhonens swipe tilbage. Sat under render frem for i en effect:
  // så når den gamle side aldrig at blive tegnet med menuen åben over sig.
  const [menuSti, setMenuSti] = useState(pathname);
  if (pathname !== menuSti) {
    setMenuSti(pathname);
    setOpen(false);
  }

  // Et tryk i menuen lukker den altid. Peger linket på den side, man står på,
  // er der ingen navigation: Next bevarer scroll-positionen, menuen lukker
  // over præcis det sted, man var, og det ligner at intet skete. Det var
  // fejlen Markus mødte på «Om» — han stod på om-siden. Derfor hopper vi selv
  // til toppen, efter at scroll-låsen er sluppet.
  const vaelg = (href: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    setOpen(false);
    if (href !== pathname || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)
      return;
    e.preventDefault();
    requestAnimationFrame(() => window.scrollTo({ top: 0 }));
  };

  // Ét scroll-lyt til begge formål: baggrunden der falder på plads, og
  // afspilningslinjen. To separate lyttere ville læse layout to gange pr. frame.
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const rest = document.documentElement.scrollHeight - window.innerHeight;
      setScrolled(y > 24);
      setProgress(rest > 0 ? Math.min(y / rest, 1) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // Mens fullscreen-menuen er åben, er siden bag den ude af spil: ingen
  // scroll, og main og sidefod er inert, så Tab ikke fører fokus ind i
  // indhold, der ligger usynligt under overlayet.
  useEffect(() => {
    const bag = document.querySelectorAll("main, footer");
    document.body.style.overflow = open ? "hidden" : "";
    bag.forEach((el) => el.toggleAttribute("inert", open));
    return () => {
      document.body.style.overflow = "";
      bag.forEach((el) => el.removeAttribute("inert"));
    };
  }, [open]);

  // Menuen findes kun under md. Drejes en iPad til landskab med menuen åben,
  // forsvinder både overlay og burger — men open blev stående, og dermed
  // scroll-låsen. Siden kunne ikke scrolles, og der var intet at lukke med.
  useEffect(() => {
    if (!open) return;
    const mq = window.matchMedia("(min-width: 768px)");
    const luk = () => mq.matches && setOpen(false);
    luk();
    mq.addEventListener("change", luk);
    return () => mq.removeEventListener("change", luk);
  }, [open]);

  // Escape lukker og sender fokus tilbage til burgeren. Ellers ligger fokus
  // på et link, der lige er blevet skjult, og falder til body.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      burger.current?.focus();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        scrolled && !open
          ? "border-b border-grey-800/70 bg-ink/70 backdrop-blur-xl"
          : "border-b border-transparent",
      )}
    >
      {/* Afspilningslinjen: siden er én lang tidslinje, og det her er hovedet
          der løber hen over den. Eneste sted lilla optræder uden for en CTA. */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px origin-left bg-accent"
        style={{ transform: `scaleX(${progress})` }}
      />

      <div className="mx-auto flex h-20 w-full max-w-320 items-center justify-between px-6 md:px-10">
        <Logo className="relative z-10" />

        <nav aria-label="Hovedmenu" className="hidden md:block">
          <ul className="flex items-center gap-8">
            {nav.map((item) => {
              const active = pathname.startsWith(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "label-mono transition-colors duration-200",
                      active ? "text-paper" : "text-grey-400 hover:text-paper",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Skjulningen ligger på en wrapper, ikke på knappen: knappens base
            sætter selv display, og to display-utilities på samme element
            afgøres af rækkefølgen i det genererede stylesheet — ikke af den
            rækkefølge vi skriver dem i. */}
        <div className="hidden md:block">
          <Button href="/kontakt">Kontakt os</Button>
        </div>

        <button
          ref={burger}
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobilmenu"
          className="relative z-10 -mr-2 flex size-10 items-center justify-center md:hidden"
        >
          <span className="sr-only">{open ? "Luk menu" : "Åbn menu"}</span>
          <span aria-hidden className="flex w-6 flex-col gap-1.5">
            <span
              className={cn(
                "h-px w-full bg-paper transition-transform duration-300",
                open && "translate-y-[3.5px] rotate-45",
              )}
            />
            <span
              className={cn(
                "h-px w-full bg-paper transition-transform duration-300",
                open && "-translate-y-[3.5px] -rotate-45",
              )}
            />
          </span>
        </button>
      </div>

      {/* Fullscreen mobil-overlay */}
      <div
        id="mobilmenu"
        hidden={!open}
        className="fixed inset-0 top-0 bg-ink px-6 pt-28 md:hidden"
      >
        {/* Menuen fylder hele skærmen, og så er skærmen selve feltet.
            Hjørnerne står på ensfarvet sort her, så hårstregerne kan ses —
            i modsætning til oven på et foto. */}
        <Hjoerner inset="inset-5" className="text-grey-800" size="size-6" />

        <nav aria-label="Hovedmenu, mobil">
          <ul className="flex flex-col gap-2">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={vaelg(item.href)}
                  aria-current={
                    pathname.startsWith(item.href) ? "page" : undefined
                  }
                  className="headline block border-b border-grey-800 py-5 text-3xl"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <Button
          href="/kontakt"
          onClick={vaelg("/kontakt")}
          className="mt-10 w-full"
        >
          Kontakt os
        </Button>
      </div>
    </header>
  );
}

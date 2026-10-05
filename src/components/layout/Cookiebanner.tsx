"use client";

import Link from "next/link";
import { useEffect, useState, useSyncExternalStore } from "react";
import { ButtonElement } from "@/components/shared/Button";
import {
  aabnIndstillinger,
  abonner,
  gem,
  laesRaa,
  tolk,
  vedAabn,
} from "@/lib/samtykke";

/** Serveren kender ikke valget. Mærket holder banneret ude af HTML'en derfra. */
const SERVER = "server";

/**
 * Cookiebanneret. Vises, indtil den besøgende har valgt, og igen når nogen
 * beder om at ændre valget.
 *
 * To ting er bevidste og må ikke «forbedres»:
 *  - «Kun nødvendige» og «Acceptér alle» er ens knapper. Det skal være lige
 *    så let at sige nej som ja, så ingen af dem får den lilla farve.
 *  - Banneret spærrer ikke for siden. Man kan læse og klikke rundt uden at
 *    vælge; så længe der ikke er valgt, er alt afvist.
 */
export function Cookiebanner() {
  const raa = useSyncExternalStore(abonner, laesRaa, () => SERVER);
  const [genaabnet, setGenaabnet] = useState(false);
  const [tilpas, setTilpas] = useState(false);

  useEffect(
    () =>
      vedAabn(() => {
        setGenaabnet(true);
        setTilpas(true);
      }),
    [],
  );

  if (raa === SERVER) return null;
  const valg = tolk(raa);
  if (valg && !genaabnet) return null;

  function vaelg(statistik: boolean, marketing: boolean) {
    gem({ statistik, marketing });
    setGenaabnet(false);
    setTilpas(false);
  }

  return (
    <section
      aria-label="Cookies"
      // Under kornlaget (z-100), over headeren (z-50).
      className="fixed inset-x-3 bottom-3 z-60 border border-grey-800 bg-ink-soft p-6 md:inset-x-auto md:bottom-6 md:left-6 md:max-w-md md:p-7"
    >
      <h2 className="label-mono text-grey-400">Cookies</h2>
      <p className="mt-4 text-sm leading-relaxed">
        Vi vil gerne bruge cookies til statistik og markedsføring. De sættes
        kun, hvis du siger ja.{" "}
        <Link
          href="/cookies"
          className="text-grey-400 underline underline-offset-4 transition-colors hover:text-paper"
        >
          Læs mere
        </Link>
      </p>

      {tilpas ? (
        <form
          className="mt-6"
          onSubmit={(e) => {
            e.preventDefault();
            const data = new FormData(e.currentTarget);
            vaelg(data.has("statistik"), data.has("marketing"));
          }}
        >
          <ul className="space-y-4 text-sm">
            <Kategori
              titel="Nødvendige"
              tekst="Husker dit valg her. Kan ikke slås fra."
              laast
            />
            <Kategori
              navn="statistik"
              titel="Statistik"
              tekst="Viser os, hvilke sider der bliver brugt."
              valgt={valg?.statistik}
            />
            <Kategori
              navn="marketing"
              titel="Markedsføring"
              tekst="Bruges til at måle og målrette annoncer."
              valgt={valg?.marketing}
            />
          </ul>
          <ButtonElement type="submit" variant="secondary" className="mt-6">
            Gem valg
          </ButtonElement>
        </form>
      ) : (
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <ButtonElement
            variant="secondary"
            className="px-5! py-3!"
            onClick={() => vaelg(false, false)}
          >
            Kun nødvendige
          </ButtonElement>
          <ButtonElement
            variant="secondary"
            className="px-5! py-3!"
            onClick={() => vaelg(true, true)}
          >
            Acceptér alle
          </ButtonElement>
          <ButtonElement variant="ghost" onClick={() => setTilpas(true)}>
            Vælg selv
          </ButtonElement>
        </div>
      )}
    </section>
  );
}

function Kategori({
  navn,
  titel,
  tekst,
  valgt,
  laast,
}: {
  navn?: string;
  titel: string;
  tekst: string;
  valgt?: boolean;
  laast?: boolean;
}) {
  return (
    <li>
      <label className="flex items-start gap-3">
        <input
          type="checkbox"
          name={navn}
          defaultChecked={laast || valgt}
          disabled={laast}
          className="mt-0.5 size-4 shrink-0 accent-accent"
        />
        <span>
          {titel}
          <span className="block text-grey-400">{tekst}</span>
        </span>
      </label>
    </li>
  );
}

/** Åbner banneret igen. Står i sidefoden og på cookiesiden. */
export function Cookieindstillinger({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button type="button" className={className} onClick={aabnIndstillinger}>
      {children}
    </button>
  );
}

import type { Metadata, Viewport } from "next";

import { konfigureret } from "@/sanity/env";
import { Studio } from "./Studio";

/**
 * Sanity Studio på /studio.
 *
 * Ruten er bevidst ikke i menuen og ikke i sidefoden — den er et
 * arbejdsredskab. Adgangen styres af Sanity selv: uden et login på projektet
 * ser man en login-skærm, ikke indholdet.
 */
export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Studio",
  robots: { index: false, follow: false },
};

/** Studio har brug for hele skærmen og sin egen zoom-opførsel. */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  interactiveWidget: "resizes-content",
};

export default function StudioSide() {
  // Uden et projekt ville Studio kaste en fejl, der ikke fortæller nogen
  // noget. Så hellere sige, hvad der mangler.
  if (!konfigureret) {
    return (
      <main className="mx-auto w-full max-w-2xl px-6 py-40">
        <p className="label-mono text-grey-600">Sanity</p>
        <h1 className="mt-6 headline text-h1">Studiet er ikke sat op endnu</h1>
        <p className="mt-6 leading-relaxed text-grey-400">
          Der mangler et projekt at forbinde til.{" "}
          <code className="font-mono text-paper">NEXT_PUBLIC_SANITY_PROJECT_ID</code>{" "}
          er ikke sat i miljøet, så sitet viser i stedet de cases, der ligger i
          koden.
        </p>
        <p className="mt-4 leading-relaxed text-grey-400">
          Fremgangsmåden står i{" "}
          <code className="font-mono text-paper">SANITY.md</code> i repoet.
        </p>
      </main>
    );
  }

  return <Studio />;
}

import { revalidateTag } from "next/cache";
import type { NextRequest } from "next/server";
import { parseBody } from "next-sanity/webhook";

import { CASE_MAERKE } from "@/sanity/hent";

/**
 * Webhook fra Sanity.
 *
 * Uden den ville sitet være statisk på en ubrugelig måde: Markus udgiver en
 * case, og der sker ingenting, før nogen deployer. Den her fortæller Next,
 * at de sider, der bruger cases, er blevet gamle.
 *
 * Signaturen tjekkes med `parseBody` fra next-sanity — den bekræfter, at
 * kaldet kommer fra Sanity og ikke fra en tilfældig, der har gættet
 * adressen. Uden hemmeligheden i miljøet afvises alt, frem for at lade
 * ruten stå åben.
 */
export async function POST(request: NextRequest) {
  const hemmelighed = process.env.SANITY_WEBHOOK_SECRET;

  if (!hemmelighed) {
    console.error("SANITY_WEBHOOK_SECRET mangler — webhooken er afvist.");
    return new Response("Webhooken er ikke sat op.", { status: 500 });
  }

  const { isValidSignature, body } = await parseBody<{ _type?: string }>(
    request,
    hemmelighed,
  );

  if (!isValidSignature) {
    return new Response("Ugyldig signatur.", { status: 401 });
  }

  if (body?._type !== "case") {
    // Ikke en fejl — Sanity kan sende andet. Vi svarer pænt og laver intet.
    return Response.json({ genopfrisket: false, grund: "ikke en case" });
  }

  // "max" giver stale-while-revalidate: den gamle side vises videre, mens den
  // nye hentes i baggrunden. Den besøgende venter altså aldrig på Sanity.
  revalidateTag(CASE_MAERKE, "max");

  return Response.json({ genopfrisket: true, maerke: CASE_MAERKE });
}

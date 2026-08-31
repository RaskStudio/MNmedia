import { createClient, type SanityClient } from "next-sanity";

import { apiVersion, datasaet, konfigureret, projektId } from "./env";

/**
 * Læseklienten — lavet først, når den skal bruges.
 *
 * `createClient` kaster med det samme, hvis der ikke er et projekt-id. Blev
 * den lavet på modulniveau, ville selve dét at importere filen vælte
 * byggeriet, så længe Sanity ikke er sat op — og hele pointen med fallbacken
 * er, at sitet skal kunne bygge og deploye før projektet findes.
 *
 * `useCdn: false` frem for true, selvom CDN'et er hurtigere og billigere:
 * siderne bygges statisk og genopfriskes kun, når Sanity siger til via
 * webhooken. Der er altså ganske få kald, og de skal til gengæld levere det
 * nyeste — henter vi fra CDN'et, kan Markus have udgivet en case, som
 * genopfriskningen så ikke opdager.
 */
let klient: SanityClient | undefined;

export function sanity(): SanityClient {
  if (!konfigureret) {
    throw new Error(
      "Sanity er ikke konfigureret — sanity() må kun kaldes bag `konfigureret`.",
    );
  }
  klient ??= createClient({
    projectId: projektId,
    dataset: datasaet,
    apiVersion,
    useCdn: false,
  });
  return klient;
}

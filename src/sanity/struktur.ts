import type { StructureResolver } from "sanity/structure";

/**
 * Menuen i studiet.
 *
 * Uden den her viser Sanity én liste per dokumenttype, med en «opret ny»-knap
 * øverst. Det er rigtigt for cases — der kommer flere med hver kunde — men
 * forkert for siderne: der er præcis én forside, og en knap, der tilbyder at
 * lave forside nummer to, er et løfte, sitet ikke kan indfri.
 *
 * Siderne præsenteres derfor som ét dokument hver, man går direkte ind i.
 * `documentId` binder hver side til ét fast id, så der ikke kan opstå to.
 *
 * Rækkefølgen er den, sitet har i menuen. Cases står nederst og for sig, fordi
 * det er den eneste liste, der vokser.
 */

const SIDER = [
  { id: "forside", type: "forside", titel: "Forside" },
  { id: "ydelserSide", type: "ydelserSide", titel: "Ydelser" },
  { id: "casesSide", type: "casesSide", titel: "Cases" },
  { id: "omSide", type: "omSide", titel: "Om MNmedia" },
  { id: "kontaktSide", type: "kontaktSide", titel: "Kontakt" },
] as const;

export const struktur: StructureResolver = (S) =>
  S.list()
    .title("Indhold")
    .items([
      ...SIDER.map(({ id, type, titel }) =>
        S.listItem()
          .title(titel)
          .id(id)
          .child(S.document().schemaType(type).documentId(id).title(titel)),
      ),
      S.divider(),
      S.documentTypeListItem("case").title("Cases"),
    ]);

/** Dokumenttyper, der ikke må kunne oprettes eller slettes fra studiet. */
export const SIDE_TYPER = SIDER.map((s) => s.type) as readonly string[];

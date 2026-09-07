import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";

import { apiVersion, datasaet, projektId } from "@/sanity/env";
import { caseType } from "@/sanity/skema/case";
import { sektionTyper } from "@/sanity/skema/sektioner";
import { sideTyper } from "@/sanity/skema/side";
import { SIDE_TYPER, struktur } from "@/sanity/struktur";

/**
 * Sanity Studio.
 *
 * Studiet ligger på /studio i selve sitet frem for på et andet domæne: ét
 * sted at logge ind, ingen ekstra hosting og ingen ekstra deploy. Ruten er
 * ikke i menuen — den er et arbejdsredskab, ikke en side.
 */
export default defineConfig({
  name: "mnmedia",
  title: "MNmedia",
  basePath: "/studio",
  projectId: projektId,
  dataset: datasaet,
  apiVersion,
  plugins: [structureTool({ structure: struktur })],
  schema: { types: [caseType, ...sideTyper, ...sektionTyper] },

  document: {
    /**
     * Siderne kan hverken oprettes eller slettes.
     *
     * Der er fem sider, og de svarer til fem ruter i koden. En sjette ville
     * være indhold uden en adresse, og en slettet forside ville tage sitet ned
     * — begge dele uden at nogen sagde det. Strukturen skjuler knapperne;
     * det her fjerner handlingerne, så de heller ikke kan nås ad omveje.
     */
    actions: (forrige, { schemaType }) =>
      SIDE_TYPER.includes(schemaType)
        ? forrige.filter(
            (h) =>
              !["duplicate", "delete", "unpublish"].includes(h.action ?? ""),
          )
        : forrige,

    newDocumentOptions: (forrige) =>
      forrige.filter((h) => !SIDE_TYPER.includes(h.templateId)),
  },
});

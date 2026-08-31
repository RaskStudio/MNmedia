import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";

import { apiVersion, datasaet, projektId } from "@/sanity/env";
import { caseType } from "@/sanity/skema/case";

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
  plugins: [structureTool()],
  schema: { types: [caseType] },
});

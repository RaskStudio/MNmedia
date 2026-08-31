"use client";

import { NextStudio } from "next-sanity/studio";

import config from "../../../../sanity.config";

/** Selve studiet. Klientkomponent, fordi Studio kører i browseren. */
export function Studio() {
  return <NextStudio config={config} />;
}

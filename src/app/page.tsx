import { Hero, type HeroSlide } from "@/components/home/Hero";
import { Kundelogoer } from "@/components/home/Kundelogoer";
import { ServiceCards } from "@/components/home/ServiceCards";
import { CasePreview } from "@/components/home/CasePreview";
import { AboutBlock } from "@/components/home/AboutBlock";
import { ClosingCta } from "@/components/shared/ClosingCta";

/**
 * Hero-klippene. Filerne bygges af scripts/build-assets.mjs ud fra
 * originalerne i ../raw-assets — rediger manifestet der, ikke filerne her.
 *
 * `kunde` er bevidst udeladt: klippene kan ikke med sikkerhed henføres til
 * en bestemt kunde ud fra materialet alene, og et forkert kundenavn i
 * heroen er værre end intet kundenavn. Markus kan udfylde dem.
 */
const heroSlides: HeroSlide[] = [
  {
    src: "/hero/01-tagudskiftning.mp4",
    poster: "/hero/01-tagudskiftning-poster.webp",
    alt: "Droneoptagelse af en tagudskiftning under arbejde",
  },
  {
    src: "/hero/02-tilbygning.mp4",
    poster: "/hero/02-tilbygning-poster.webp",
    alt: "Tilbygning under opførelse",
  },
  {
    src: "/hero/03-tagarbejde.mp4",
    poster: "/hero/03-tagarbejde-poster.webp",
    alt: "Tømrer i gang med tagarbejde",
  },
];

export default function Home() {
  return (
    <>
      <Hero slides={heroSlides} />
      <Kundelogoer />
      <ServiceCards />
      <CasePreview />
      <AboutBlock />
      <ClosingCta
        overskrift="Klar til at styrke jeres brand online?"
        undertekst="Lad os tage en uforpligtende snak om, hvordan vi kan hjælpe jer videre."
        primaer={{ label: "Book en snak", href: "/kontakt" }}
        sekundaer={{ label: "Se cases", href: "/cases" }}
      />
    </>
  );
}

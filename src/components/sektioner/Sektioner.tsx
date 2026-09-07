import { Hero } from "@/components/home/Hero";
import { Kundelogoer } from "@/components/home/Kundelogoer";
import { ServiceCards } from "@/components/home/ServiceCards";
import { CasePreview } from "@/components/home/CasePreview";
import { AboutBlock } from "@/components/home/AboutBlock";
import { ClosingCta } from "@/components/shared/ClosingCta";
import { PageHero } from "@/components/shared/PageHero";
import { ToSpalter, Punktliste, Services, PersonenBag } from "./Blokke";
import { Caseliste, Udtalelser, Kontakt } from "./Lister";
import { graderLoft } from "@/lib/tekstbredde";
import type { Sektion } from "@/sanity/sider";

/**
 * Oversættelsen fra en liste af sektioner til komponenter.
 *
 * Det er det ene sted, hvor et `_type` fra Sanity bliver til noget på skærmen.
 * Kontrakten går begge veje og er lige stram i begge retninger: en
 * sektionstype uden en gren her er et løfte, sitet ikke kan indfri, og en
 * komponent uden en type er indhold, Markus ikke kan røre.
 *
 * `switch` uden en `default`-gren er med vilje. Kommer der en sektionstype
 * til i skemaet, og glemmer nogen at koble den her, fanger TypeScript det:
 * `sektion` er så ikke længere `never` i bunden, og typetjekket fejler. Det
 * er billigere end at opdage det på en side, der mangler en sektion.
 */
export function Sektioner({ sektioner }: { sektioner: Sektion[] }) {
  return (
    <>
      {sektioner.map((s) => (
        <EnSektion key={s._key} s={s} />
      ))}
    </>
  );
}

function EnSektion({ s }: { s: Sektion }) {
  switch (s._type) {
    case "heroSektion": {
      const linjer = s.overskrift.split("\n");
      return (
        <Hero
          linjer={linjer}
          undertekst={s.undertekst}
          primaer={s.primaer}
          sekundaer={s.sekundaer}
          // Loftet regnes her og ikke i Hero: Hero er en klientkomponent, og
          // udregningen slæber en tabel over skriftens bogstavbredder med sig.
          overskriftGrad={graderLoft(linjer, {
            sporing: -0.015,
            grad: "var(--text-display)",
          })}
        />
      );
    }
    case "kundelogoerSektion":
      return <Kundelogoer label={s.label} />;
    case "ydelseskortSektion":
      return <ServiceCards s={s} />;
    case "caseudvalgSektion":
      return <CasePreview s={s} />;
    case "omblokSektion":
      return <AboutBlock s={s} />;
    case "sidehovedSektion":
      return <PageHero s={s} />;
    case "toSpalterSektion":
      return <ToSpalter s={s} />;
    case "punktlisteSektion":
      return <Punktliste s={s} />;
    case "servicesSektion":
      return <Services s={s} />;
    case "personenBagSektion":
      return <PersonenBag s={s} />;
    case "caselisteSektion":
      return <Caseliste s={s} />;
    case "udtalelserSektion":
      return <Udtalelser s={s} />;
    case "ctaSektion":
      return <ClosingCta {...s} />;
    case "kontaktSektion":
      return <Kontakt s={s} />;
  }
}

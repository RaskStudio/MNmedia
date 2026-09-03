import Image from "next/image";
import { kundeLogoer } from "@/content/cases";

/**
 * Kunderækken.
 *
 * Var tidligere en uendelig karrusel. Den blev droppet af to grunde: med fire
 * logoer løb sporet tør i højre kant på brede skærme, og vigtigere — en
 * evighedsrulle lover flere kunder end der er, og afslører så selv løftet
 * efter to omgange. Fire mærker vist i fuld størrelse med luft omkring er et
 * stærkere bevis end fire mærker der kører i ring.
 *
 * Kommer der flere kunder til, holder rækken fint op til seks-syv. Derefter
 * er en karrusel igen det rigtige.
 */
const BASISHOEJDE = 58;

export function Kundelogoer() {
  return (
    <section
      aria-label="Virksomheder vi har arbejdet med"
      className="border-y border-grey-800"
    >
      <div className="mx-auto w-full max-w-320 px-6 py-14 md:px-10 md:py-16">
        <p className="label-mono mb-12 text-center text-grey-400">
          Virksomheder vi arbejder med
        </p>

        <ul className="grid grid-cols-2 items-center gap-x-10 gap-y-12 sm:grid-cols-4 sm:gap-x-14">
          {kundeLogoer.map((logo) => (
            <li key={logo.navn}>
              {/* Boks med styret højde + object-contain frem for faste
                  width/height på billedet: logoerne har vidt forskellige
                  proportioner, og ét fælles sidefohold ville strække de
                  smalle mærker ud i hele cellens bredde. Skalaen på boksen
                  retter så den optiske vægt op mærke for mærke. */}
              <div
                className="relative w-full"
                style={{ height: BASISHOEJDE * logo.skala }}
              >
                <Image
                  src={logo.fil}
                  alt={logo.navn}
                  fill
                  // Cellebredden, ikke viewportbredden: rækken har
                  // sidepolstring og mellemrum, så 25vw/50vw overvurderer
                  // hver celle med 40-60 px og får browseren til at hente et
                  // trin større logo end den skal bruge.
                  sizes="(min-width: 1280px) 258px, (min-width: 768px) calc(25vw - 62px), (min-width: 640px) calc(25vw - 54px), calc(50vw - 44px)"
                  className="object-contain opacity-60 transition-opacity duration-300 hover:opacity-100"
                />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

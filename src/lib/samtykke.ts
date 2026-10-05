/**
 * Den besøgendes cookievalg — ét sted, så banneret, Tag Manager og
 * cookiesiden ikke kan blive uenige om, hvad der er sagt ja til.
 *
 * Valget ligger i localStorage og ikke i en cookie: det skal kun læses i
 * browseren, og så er der ingen grund til at sende det med hver forespørgsel.
 * At huske selve valget kræver ikke samtykke — det er nødvendigt for at
 * kunne respektere det.
 */

export type Valg = { statistik: boolean; marketing: boolean };

const NOEGLE = "mn-samtykke";
const AENDRET = "mn-samtykke-aendret";
const AABN = "mn-samtykke-aabn";

/** Et år. Derefter spørger vi igen, som Datatilsynets vejledning lægger op til. */
const LEVETID = 365 * 24 * 60 * 60 * 1000;

/** Sådan oversættes de to kategorier til Googles Consent Mode v2. */
function tilGoogle({ statistik, marketing }: Valg) {
  const svar = (ja: boolean) => (ja ? "granted" : "denied");
  return {
    analytics_storage: svar(statistik),
    ad_storage: svar(marketing),
    ad_user_data: svar(marketing),
    ad_personalization: svar(marketing),
  };
}

/**
 * Scriptet, der står FØR Tag Manager. Alt er afvist, medmindre den besøgende
 * allerede har valgt — så sættes valget med det samme, og en genganger
 * tælles fra første sidevisning frem for først, når React er vågnet.
 *
 * Det er skrevet som en streng, fordi det skal køre, før sitets egen kode er
 * hentet. Nøglen og levetiden flettes ind herfra, så de kun står ét sted.
 */
export const standardScript = `window.dataLayer=window.dataLayer||[];
function gtag(){dataLayer.push(arguments);}
gtag('consent','default',${JSON.stringify({ ...tilGoogle({ statistik: false, marketing: false }), wait_for_update: 500 })});
try{var v=JSON.parse(localStorage.getItem('${NOEGLE}'));
if(v&&Date.now()-v.tid<${LEVETID}){var s=v.statistik?'granted':'denied',m=v.marketing?'granted':'denied';
gtag('consent','update',{analytics_storage:s,ad_storage:m,ad_user_data:m,ad_personalization:m});}}catch(e){}`;

/**
 * Det gemte valg som rå tekst, eller null hvis der intet er, eller det er
 * udløbet. Rå tekst, fordi useSyncExternalStore sammenligner med ===: et nyt
 * objekt ved hvert kald ville få banneret til at tegne sig selv i ring.
 */
export function laesRaa(): string | null {
  try {
    const raa = localStorage.getItem(NOEGLE);
    if (!raa) return null;
    const { tid } = JSON.parse(raa) as { tid?: number };
    return typeof tid === "number" && Date.now() - tid < LEVETID ? raa : null;
  } catch {
    // Privat vindue eller blokeret lager: så spørger vi bare igen.
    return null;
  }
}

export function tolk(raa: string | null): Valg | null {
  if (!raa) return null;
  const { statistik, marketing } = JSON.parse(raa) as Partial<Valg>;
  return { statistik: statistik === true, marketing: marketing === true };
}

export function gem(valg: Valg) {
  try {
    localStorage.setItem(NOEGLE, JSON.stringify({ ...valg, tid: Date.now() }));
  } catch {
    // Kan valget ikke gemmes, gælder det stadig for resten af besøget.
  }

  // Googles tags lytter på 'consent'-kommandoen, og den skal ligge i
  // dataLayer som et arguments-objekt — en almindelig liste bliver ignoreret.
  window.dataLayer = window.dataLayer || [];
  const gtag = function () {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer!.push(arguments);
  } as (...kommando: unknown[]) => void;
  gtag("consent", "update", tilGoogle(valg));

  // En almindelig hændelse oveni, så tags uden for Googles samtykkemodel
  // (fx en Meta-pixel) kan få en udløser i Tag Manager.
  window.dataLayer.push({
    event: "samtykke_opdateret",
    samtykke_statistik: valg.statistik,
    samtykke_marketing: valg.marketing,
  });

  window.dispatchEvent(new Event(AENDRET));
}

export function abonner(kald: () => void) {
  window.addEventListener(AENDRET, kald);
  // 'storage' fyrer i de ANDRE faner, så et valg i én fane lukker banneret i alle.
  window.addEventListener("storage", kald);
  return () => {
    window.removeEventListener(AENDRET, kald);
    window.removeEventListener("storage", kald);
  };
}

/** Åbner banneret igen, så valget kan ændres — fra sidefoden og cookiesiden. */
export function aabnIndstillinger() {
  window.dispatchEvent(new Event(AABN));
}

export function vedAabn(kald: () => void) {
  window.addEventListener(AABN, kald);
  return () => window.removeEventListener(AABN, kald);
}

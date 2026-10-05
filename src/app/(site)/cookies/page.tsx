import type { Metadata } from "next";
import { Eyebrow } from "@/components/shared/Section";
import { Cookieindstillinger } from "@/components/layout/Cookiebanner";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Cookies og privatliv",
  description:
    "Hvilke cookies mn-media.dk bruger, hvad der sker med oplysninger fra kontaktformularen, og hvordan du ændrer dit valg.",
};

/**
 * Cookie- og privatlivssiden. Teksten står i koden og ikke i CMS'et: den
 * beskriver, hvad sitet teknisk gør, og skal rettes sammen med koden — ikke
 * ved siden af den.
 *
 * Listen over tjenester under «Statistik» og «Markedsføring» skal passe med
 * det, der faktisk ligger i Tag Manager-containeren. Lægger Markus et nyt
 * tag ind, skal det med her.
 */
export default function CookiesSide() {
  return (
    <section className="pt-36 pb-section md:pt-44">
      <div className="mx-auto w-full max-w-320 px-6 md:px-10">
        <Eyebrow>Cookies og privatliv</Eyebrow>
        <h1 className="headline max-w-3xl text-h1">
          Hvad vi gemmer, og hvorfor
        </h1>
        <p className="mt-7 max-w-xl text-lead text-grey-400">
          Kort fortalt: sitet sætter ingen cookies til statistik eller
          markedsføring, før du har sagt ja. Du kan altid ændre dit valg.
        </p>
        <Cookieindstillinger className="mt-10 inline-flex items-center justify-center rounded-full border border-grey-800 px-7 py-3.5 text-sm font-medium transition-colors duration-200 hover:border-grey-400">
          Ændr dit cookievalg
        </Cookieindstillinger>

        <div className="mt-20 max-w-2xl space-y-14">
          <Afsnit titel="Cookies">
            <p>
              Sitet bruger Google Tag Manager til at styre de tjenester, der
              måler besøg og annoncer. Tag Manager sætter ikke selv cookies.
              Det gør tjenesterne nedenfor, og kun i de kategorier, du har
              sagt ja til.
            </p>
            <dl className="space-y-6">
              <Kategori titel="Nødvendige">
                Dit cookievalg gemmes i din browser (localStorage,{" "}
                <code className="font-mono text-paper">mn-samtykke</code>) i
                12 måneder, så vi ikke spørger ved hvert besøg. Det sendes
                ikke til os eller andre.
              </Kategori>
              <Kategori titel="Statistik">
                Viser os, hvor mange der besøger sitet, og hvilke sider der
                bliver brugt, fx med Google Analytics. Bruges kun, hvis du har
                sagt ja til statistik.
              </Kategori>
              <Kategori titel="Markedsføring">
                Bruges til at måle, om vores annoncer virker, og til at vise
                annoncer til folk, der har besøgt sitet, fx hos Meta og
                Google. Bruges kun, hvis du har sagt ja til markedsføring.
              </Kategori>
            </dl>
            <p>
              Siger du nej, kan Google stadig modtage anonyme signaler uden
              cookies om, at en side er blevet vist. De kan ikke knyttes til
              dig.
            </p>
          </Afsnit>

          <Afsnit titel="Kontaktformularen">
            <p>
              Når du skriver til os gennem formularen, modtager vi dit navn,
              din e-mailadresse, eventuelt virksomhedens navn og din besked.
              Oplysningerne sendes til os som en e-mail gennem tjenesten
              Resend og bruges kun til at svare dig og til et eventuelt
              samarbejde. Vi beholder dem ikke længere, end det er
              nødvendigt til det.
            </p>
          </Afsnit>

          <Afsnit titel="Drift">
            <p>
              Sitet ligger hos Vercel, som behandler tekniske oplysninger som
              IP-adresse og browsertype for at kunne levere siderne og holde
              dem sikre.
            </p>
          </Afsnit>

          <Afsnit titel="Dine rettigheder">
            <p>
              Du kan bede om at få at vide, hvilke oplysninger vi har om dig,
              og få dem rettet eller slettet. Skriv til{" "}
              <a
                href={`mailto:${site.email}`}
                className="text-paper underline underline-offset-4"
              >
                {site.email}
              </a>
              . Er du utilfreds med svaret, kan du klage til Datatilsynet på{" "}
              <a
                href="https://www.datatilsynet.dk"
                target="_blank"
                rel="noreferrer noopener"
                className="text-paper underline underline-offset-4"
              >
                datatilsynet.dk
              </a>
              .
            </p>
          </Afsnit>

          <Afsnit titel="Dataansvarlig">
            <p>
              {site.name}
              <br />
              CVR {site.cvr}
              <br />
              {site.address.street}, {site.address.postal} {site.address.city}
              <br />
              {site.email} · {site.phone}
            </p>
          </Afsnit>
        </div>
      </div>
    </section>
  );
}

function Afsnit({
  titel,
  children,
}: {
  titel: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="headline text-h3">{titel}</h2>
      <div className="mt-5 space-y-6 leading-relaxed text-grey-400">
        {children}
      </div>
    </section>
  );
}

function Kategori({
  titel,
  children,
}: {
  titel: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-l border-grey-800 pl-5">
      <dt className="label-mono text-paper">{titel}</dt>
      <dd className="mt-2">{children}</dd>
    </div>
  );
}

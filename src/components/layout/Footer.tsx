import Link from "next/link";
import { Logo } from "./Logo";
import { nav, site } from "@/content/site";

export function Footer() {
  return (
    <footer className="border-t border-grey-800">
      <div className="mx-auto w-full max-w-320 px-6 py-16 md:px-10 md:py-20">
        <div className="grid gap-12 md:grid-cols-[1fr_auto_auto] md:gap-20">
          <div className="max-w-sm">
            <Logo />
            <p className="mt-4 text-sm leading-relaxed text-grey-400">
              {site.tagline}
            </p>
          </div>

          <nav aria-label="Sidefod">
            <h2 className="label-mono mb-5 text-grey-600">Menu</h2>
            <ul className="space-y-3 text-sm">
              {[...nav, { label: "Kontakt", href: "/kontakt" }].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-grey-400 transition-colors hover:text-paper"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="label-mono mb-5 text-grey-600">Kontakt</h2>
            <ul className="space-y-3 text-sm text-grey-400">
              <li>
                <a
                  href={`mailto:${site.email}`}
                  className="transition-colors hover:text-paper"
                >
                  {site.email}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${site.phoneHref}`}
                  className="transition-colors hover:text-paper"
                >
                  {site.phone}
                </a>
              </li>
              <li className="pt-1 leading-relaxed">
                {site.address.street}
                <br />
                {site.address.postal} {site.address.city}
              </li>
            </ul>

            <ul className="mt-6 flex gap-4 text-sm">
              {site.socials.map((s) => (
                <li key={s.name}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="text-grey-400 transition-colors hover:text-paper"
                  >
                    {s.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Styleguiden hører til hernede, ikke i hovedmenuen: den er et
            arbejdsredskab for os og for Markus, ikke et sted en kunde skal
            ledes hen. Den er sat med noindex af samme grund. */}
        <div className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-grey-800 pt-8">
          <p className="label-mono text-grey-600">
            © {new Date().getFullYear()} {site.name} — Aarhus
          </p>
          <Link
            href="/styleguide"
            className="label-mono text-grey-600 transition-colors hover:text-paper"
          >
            Styleguide
          </Link>
        </div>
      </div>
    </footer>
  );
}

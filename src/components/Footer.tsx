import Link from "next/link";

const exploreLinks = [
  { href: "/map", label: "Map explorer" },
  { href: "/blog", label: "Blog" },
  { href: "/use-case-template", label: "PoC template" },
  { href: "/domains/digital-identity-and-credentials", label: "Domains" },
];

const contactLinks = [{ href: "/contact", label: "Contact" }];

export function Footer() {
  return (
    <footer className="epic-divider bg-white">
      <div className="epic-section-wide">
        <div className="grid gap-10 py-12 sm:grid-cols-3">
          <div>
            <h3 className="font-serif text-sm font-semibold uppercase tracking-wider text-epic-muted">
              Explore
            </h3>
            <ul className="mt-4 space-y-2">
              {exploreLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-slate-600 hover:text-epic-ink transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-serif text-sm font-semibold uppercase tracking-wider text-epic-muted">
              Contact
            </h3>
            <ul className="mt-4 space-y-2">
              {contactLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-slate-600 hover:text-epic-ink transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-serif text-sm font-semibold uppercase tracking-wider text-epic-muted">
              About
            </h3>
            <p className="mt-4 text-sm text-slate-600 leading-relaxed">
              EPIC is a team within the Ethereum Foundation publishing open research on public infrastructure and user self-sovereignty. Content here is not official EF policy.
            </p>
          </div>
        </div>
        <div className="epic-divider py-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between text-sm text-slate-500">
          <span>Ethereum Public Infrastructure and Commons</span>
          <a
            href="https://ethereum.org"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-slate-700 transition-colors"
          >
            Ethereum Foundation
          </a>
        </div>
      </div>
    </footer>
  );
}

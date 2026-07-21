import Link from "next/link";

const exploreLinks = [
  { href: "/map", label: "Map explorer" },
  { href: "/domains/digital-identity-and-credentials", label: "Domains" },
  { href: "/contact", label: "Contact" },
];

const sourceLinks = [
  {
    href: "https://blog.ethereum.org/2026/03/13/ef-mandate",
    label: "Ethereum Foundation Mandate (March 2026)",
  },
  {
    href: "https://blog.ethereum.org/2026/07/01/ethereum-for-institutions",
    label: "Ethereum for Governments and Institutions (July 2026)",
  },
  {
    href: "https://openzeppelin.com/hubfs/OpenZeppelin%20%7C%20Technical%20Risk%20Assessment%20on%20Blockchain%20Networks.pdf",
    label: "OpenZeppelin technical risk assessment",
  },
];

export function Footer() {
  return (
    <footer className="bg-epic-navy bg-epic-grid-dark bg-grid text-epic-slate-subtle">
      <div className="epic-section-wide">
        <div className="grid gap-10 py-12 sm:grid-cols-3">
          <div>
            <h3 className="font-mono text-xs font-medium uppercase tracking-[0.12em] text-epic-yellow">
              real-world ethereum
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-slate-400">
              Prepared for institutional audiences — governments, public agencies, international
              organizations, NGOs, and regulated enterprises — by the Ethereum Foundation
              institutional team. Figures are drawn from cited public sources and dated where shown;
              readers should verify current data before relying on it for decisions.
            </p>
          </div>
          <div>
            <h3 className="font-mono text-xs font-medium uppercase tracking-[0.12em] text-epic-yellow">
              explore
            </h3>
            <ul className="mt-4 space-y-2">
              {exploreLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-slate-300 transition-colors hover:text-epic-yellow">
                    {label}
                  </Link>
                </li>
              ))}
              <li>
                <a
                  href="/docs/ethereum-basics-for-governments-and-institutions.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-slate-300 transition-colors hover:text-epic-yellow"
                >
                  Ethereum Basics (PDF)
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-mono text-xs font-medium uppercase tracking-[0.12em] text-epic-yellow">
              sources
            </h3>
            <ul className="mt-4 space-y-2">
              {sourceLinks.map(({ href, label }) => (
                <li key={href}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-slate-300 transition-colors hover:text-epic-yellow"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="flex flex-col gap-2 border-t border-epic-navy-muted/40 py-6 font-mono text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <span>
            informational material · not investment, legal, or procurement advice · views are those of
            the institutional team, not official ethereum foundation policy
          </span>
          <a
            href="https://ethereum.foundation"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 transition-colors hover:text-epic-yellow"
          >
            ethereum.foundation
          </a>
        </div>
      </div>
    </footer>
  );
}

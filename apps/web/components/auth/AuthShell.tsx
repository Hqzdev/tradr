import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import { stockCatalog, type StockTicker } from "@/lib/stocks";

const ORBS: { ticker: StockTicker; className: string }[] = [
  { ticker: "AAPL", className: "tradr-auth-orb--1" },
  { ticker: "NVDA", className: "tradr-auth-orb--2" },
  { ticker: "TSLA", className: "tradr-auth-orb--3" },
  { ticker: "MSFT", className: "tradr-auth-orb--4" },
  { ticker: "META", className: "tradr-auth-orb--5" },
  { ticker: "V", className: "tradr-auth-orb--6" },
  { ticker: "KO", className: "tradr-auth-orb--7" },
  { ticker: "AMD", className: "tradr-auth-orb--8" },
];

export default function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div className="tradr-auth-shell">
      <div className="tradr-auth-orbits" aria-hidden="true">
        {ORBS.map(({ ticker, className }, index) => {
          const stock = stockCatalog[ticker];
          return (
            <span
              key={`${ticker}-${index}`}
              className={`tradr-auth-orb ${className}`}
              style={{ "--auth-orb-color": stock.color, "--auth-orb-delay": `${index * -0.73}s` } as CSSProperties}
            >
              <span>
                <Image src={stock.logoSrc} alt="" width={88} height={88} priority={index < 4} />
              </span>
            </span>
          );
        })}
      </div>
      <main className="tradr-auth-stage">{children}</main>
    </div>
  );
}

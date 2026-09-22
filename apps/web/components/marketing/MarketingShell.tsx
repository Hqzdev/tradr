import Link from "next/link";
import type { ReactNode } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  DiscordIcon,
  GithubIcon,
  Menu01Icon,
  NewTwitterIcon,
} from "@hugeicons/core-free-icons";
import { IconLogo } from "@/components/icons";
import { footerGroups, marketingNavigation } from "./marketing-data";
import styles from "./marketing.module.css";

interface MarketingShellProps {
  readonly children: ReactNode;
  readonly label: string;
  readonly theme?: "light" | "dark" | "support";
}

export function MarketingHeader({ label, theme = "light" }: Pick<MarketingShellProps, "label" | "theme">) {
  return (
    <header className={styles.header} data-theme={theme}>
      <div className={styles.headerInner}>
        <Link className={styles.brand} href="/" aria-label="TRADR — главная">
          <IconLogo aria-hidden="true" />
          <span>{label}</span>
        </Link>
        <nav className={styles.desktopNav} aria-label="Маркетинговые страницы TRADR">
          {marketingNavigation.map((item) => <Link href={item.href} key={item.href}>{item.label}</Link>)}
        </nav>
        <Link className={styles.headerCta} href="/dashboard">Открыть TRADR</Link>
        <details className={styles.mobileMenu}>
          <summary aria-label="Открыть меню"><HugeiconsIcon icon={Menu01Icon} strokeWidth={1.8} /></summary>
          <nav aria-label="Мобильные маркетинговые страницы TRADR">
            {marketingNavigation.map((item) => <Link href={item.href} key={item.href}>{item.label}</Link>)}
            <Link href="/dashboard">Открыть обзор</Link>
          </nav>
        </details>
      </div>
    </header>
  );
}

export function MarketingFooter({ theme = "light" }: Pick<MarketingShellProps, "theme">) {
  return (
    <footer className={styles.footer} data-theme={theme}>
      <div className={styles.footerInner}>
        <Link className={styles.footerBrand} href="/" aria-label="TRADR — главная"><IconLogo aria-hidden="true" /><span>TRADR</span></Link>
        <div className={styles.footerGroups}>
          {footerGroups.map((group) => (
            <div key={group.title}>
              <strong>{group.title}</strong>
              {group.links.map((item) => <Link href={item.href} key={item.href}>{item.label}</Link>)}
            </div>
          ))}
        </div>
        <div className={styles.footerBottom}>
          <span>© 2026 TRADR · Учебная платформа</span>
          <span>Не является инвестиционной рекомендацией</span>
          <div className={styles.socials}>
            <a href="https://github.com/Hqzdev/tradr" aria-label="GitHub: репозиторий TRADR" rel="noreferrer" target="_blank"><HugeiconsIcon icon={GithubIcon} strokeWidth={1.8} /></a>
            <a href="https://x.com" aria-label="X"><HugeiconsIcon icon={NewTwitterIcon} strokeWidth={1.8} /></a>
            <a href="https://discord.com" aria-label="Discord"><HugeiconsIcon icon={DiscordIcon} strokeWidth={1.8} /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function MarketingShell({ children, label, theme = "light" }: MarketingShellProps) {
  return (
    <div className={styles.shell} data-theme={theme}>
      <MarketingHeader label={label} theme={theme} />
      <main>{children}</main>
      <MarketingFooter theme={theme} />
    </div>
  );
}

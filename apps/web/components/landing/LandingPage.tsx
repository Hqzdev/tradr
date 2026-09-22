"use client";

import Link from "next/link";
import Image from "next/image";
import { useCallback, useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowDown01Icon,
  ArrowRight01Icon,
  BookOpen01Icon,
  BubbleChatIcon,
  Cancel01Icon,
  ChartLineData01Icon,
  DiscordIcon,
  GithubIcon,
  GraduationScrollIcon,
  Menu01Icon,
  NewTwitterIcon,
} from "@hugeicons/core-free-icons";
import {
  IconAgents,
  IconArrowUpRight,
  IconCheck,
  IconHistory,
  IconLogo,
  IconMarket,
  IconPortfolio,
  IconShield,
  IconShuffle,
  IconTerminal,
  IconTrendUp,
} from "@/components/icons";
import { AnimatedMetric, IntroReveal, MotionPresence } from "@/components/landing/MotionPrimitives";
import HeroSimulator from "@/components/landing/HeroSimulator";
import { getOrbMotionConfig, landingMotionPreset, type MetricRollerModel } from "@/lib/landingMotion";
import { formatDemoPercent, heroOrbPlacements, stockCatalog, type HeroOrbPlacement } from "@/lib/stocks";

const landingNavigation = [
  { href: "#hero", label: "Главная" },
  { href: "#about", label: "О платформе" },
  { href: "#products", label: "Возможности" },
  { href: "#resources", label: "Ресурсы" },
] as const;

const metrics: MetricRollerModel[] = [
  { label: "Активных агентов", value: "3 агента", active: false },
  { label: "Источник данных", value: "1 общий рынок", active: false },
  { label: "Финансовый риск", value: "0 ₽", active: false },
  { label: "Режим обучения", value: "24/7", active: true },
];

function ArrowLink({ href, children }: { href: string; children: ReactNode }) {
  return <Link className="tradr-arrow-link" href={href}>{children}<IconArrowUpRight aria-hidden="true" /></Link>;
}

function StockOrb({ placement }: { placement: HeroOrbPlacement }) {
  const stock = stockCatalog[placement.ticker];
  const positive = stock.demoChangePercent >= 0;
  const motion = getOrbMotionConfig(placement.id);

  return (
    <Link
      className={`tradr-stock-orb tradr-stock-orb--${placement.id} tradr-stock-orb--label-${placement.labelSide}`}
      href={`/market/${stock.ticker}`}
      aria-label={`${stock.name}, ${stock.ticker}, ${positive ? "рост" : "снижение"} ${formatDemoPercent(stock.demoChangePercent)}. Открыть акцию`}
      style={{
        "--stock-color": stock.color,
        "--float-duration": `${motion.floatDurationMs}ms`,
        "--rotate-duration": `${motion.rotateDurationMs}ms`,
      } as CSSProperties}
    >
      <span className="tradr-stock-enter">
        <span className="tradr-stock-float">
          <span className="tradr-stock-label" aria-hidden="true">
            <strong>{stock.ticker}</strong>
            <em className={positive ? "positive" : "negative"}>{positive ? "▲" : "▼"} {formatDemoPercent(stock.demoChangePercent)}</em>
          </span>
          <span className="tradr-stock-rotate" aria-hidden="true">
            <span className="tradr-stock-core">
              <Image src={stock.logoSrc} alt="" width={72} height={72} unoptimized className={stock.logoTone === "dark" ? "tradr-stock-logo--dark" : ""} />
            </span>
            <span className="tradr-stock-rings"><i /><i /></span>
          </span>
        </span>
      </span>
    </Link>
  );
}

function MarketPreview() {
  const quotes = [
    ["AAPL", "Apple", "$192,45", "+1,84%"],
    ["NVDA", "Nvidia", "$138,12", "+2,31%"],
    ["TSLA", "Tesla", "$247,77", "−0,42%"],
    ["MSFT", "Microsoft", "$425,31", "+0,76%"],
  ];
  return <div className="tradr-market-preview">{quotes.map(([ticker, name, price, change], index) => <div key={ticker} style={{ "--preview-index": index } as CSSProperties}><span className="tradr-asset-dot">{ticker[0]}</span><p><strong>{name}</strong><small>{ticker}</small></p><b className="tradr-live-quote">{price}</b><em className={`tradr-live-quote ${change.startsWith("−") ? "negative" : ""}`}>{change}</em></div>)}</div>;
}

function TerminalPreview() {
  return (
    <div className="tradr-terminal-preview">
      <div><span className="tradr-mini-logo"><IconLogo aria-hidden="true" /></span><p><strong>Учебный счёт</strong><small>Баланс портфеля</small></p></div>
      <h4>$109 820<span>.00</span></h4><small className="tradr-terminal-profit">▲ $9 820 · 9,82%</small>
      <div className="tradr-terminal-actions"><span><IconPortfolio /></span><span><IconTrendUp /></span><span><IconHistory /></span><span><IconMarket /></span></div>
      <div className="tradr-terminal-tabs"><b>Позиции</b><span>Заявки</span><span>История</span></div>
      <div className="tradr-terminal-row"><span className="tradr-asset-dot">A</span><i /><i /></div>
      <div className="tradr-terminal-row"><span className="tradr-asset-dot">N</span><i /><i /></div>
    </div>
  );
}

function PortfolioPreview() {
  return (
    <div className="tradr-portfolio-preview" aria-hidden="true">
      <span><IconShield />Риск под контролем</span>
      <div><IconCheck /><b>Лимиты соблюдены</b></div>
      <div><IconTrendUp /><b>Результат +9,82%</b></div>
    </div>
  );
}

function AgentsPreview() {
  return (
    <div className="tradr-agents-preview" aria-hidden="true">
      <span className="agent-bubble agent-bubble--one"><IconTrendUp /></span>
      <span className="agent-bubble agent-bubble--two"><IconShield /></span>
      <span className="agent-bubble agent-bubble--three"><IconShuffle /></span>
      <span className="agent-bubble agent-bubble--four"><IconAgents /></span>
    </div>
  );
}

function JournalPreview() {
  return (
    <div className="tradr-journal-preview" aria-hidden="true">
      <div><span /><i /></div><div><span /><i /></div><div><span /><i /></div><div><span /><i /></div>
    </div>
  );
}

function SafetyPreview() {
  return (
    <div className="tradr-safety-preview" aria-hidden="true">
      <span><IconLogo /></span><div><IconShield /></div>
    </div>
  );
}

function MobileMenu({ open, activeSection, onClose }: { open: boolean; activeSection: string; onClose: () => void }) {
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose, open]);

  return (
    <div className={`tradr-mobile-menu-layer ${open ? "tradr-mobile-menu-layer--open" : ""}`} aria-hidden={!open}>
      <button className="tradr-mobile-menu-backdrop" type="button" aria-label="Закрыть меню" tabIndex={open ? 0 : -1} onClick={onClose} />
      <div className="tradr-mobile-menu" id="tradr-mobile-menu" role="dialog" aria-label="Навигация по странице">
        {landingNavigation.map((item) => (
          <a
            className={activeSection === item.href.slice(1) ? "tradr-mobile-menu-link--active" : ""}
            href={item.href}
            key={item.href}
            tabIndex={open ? 0 : -1}
            onClick={onClose}
          >
            {item.label}
          </a>
        ))}
        <Link className="tradr-mobile-menu-docs" href="/docs" tabIndex={open ? 0 : -1} onClick={onClose}>
          Документация
        </Link>
      </div>
    </div>
  );
}

const productCards = [
  { id: "market", eyebrow: "Рынок", title: "Смотрите. Сравнивайте. Решайте.", body: "Котировки и контекст рынка собраны в одном месте — без перегруженных экранов.", action: "Открыть рынок", href: "/market", tone: "blue", icon: <IconMarket />, visual: <MarketPreview /> },
  { id: "terminal", eyebrow: "Автономные агенты", title: "Запустите. Наблюдайте. Улучшайте.", body: "Агенты сами анализируют рынок, покупают и продают в рамках заданного бюджета.", action: "Открыть обзор", href: "/dashboard", tone: "pink", icon: <IconTerminal />, visual: <TerminalPreview /> },
  { id: "portfolio", eyebrow: "Рост капитала", title: "Каждое решение видно в результате.", body: "Следите за прибылью, позициями и прогрессом к своей финансовой цели.", action: "Смотреть результат", href: "/dashboard", tone: "violet", icon: <IconPortfolio />, visual: <PortfolioPreview /> },
  { id: "agents", eyebrow: "Сравнение агентов", title: "Один рынок. Три характера.", body: "Агрессивный, осторожный и случайный агенты работают на одинаковых данных.", action: "Сравнить агентов", href: "/agents", tone: "mint", icon: <IconAgents />, visual: <AgentsPreview /> },
  { id: "journal", eyebrow: "Журнал решений", title: "Возвращайтесь к логике сделки.", body: "Сигнал, действие и итог сохраняются для спокойного разбора каждого шага.", action: "Открыть журнал", href: "/journal", tone: "orange", icon: <IconHistory />, visual: <JournalPreview /> },
  { id: "safety", eyebrow: "Безопасная симуляция", title: "Ошибайтесь без финансового риска.", body: "Учебная среда помогает проверять гипотезы и постепенно видеть рынок увереннее.", action: "Начать обучение", href: "/register", tone: "magenta", icon: <IconShield />, visual: <SafetyPreview /> },
] as const;

const resources = [
  { title: "Центр помощи", body: "Ответы на вопросы о платформе и учебной торговле", href: "/settings", icon: GraduationScrollIcon },
  { title: "Журнал", body: "Разбирайте решения агентов и собственные сделки", href: "/journal", icon: ChartLineData01Icon },
  { title: "Материалы", body: "Короткие объяснения терминов, сигналов и механики рынка", href: "/catalog", icon: BookOpen01Icon },
  { title: "Сообщество", body: "Следите за развитием TRADR и делитесь наблюдениями", href: "/teams", icon: BubbleChatIcon },
];

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const [scrolled, setScrolled] = useState(false);
  const [pageActive, setPageActive] = useState(true);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  useEffect(() => {
    const sections = landingNavigation
      .map(({ href }) => document.getElementById(href.slice(1)))
      .filter((section): section is HTMLElement => section !== null);

    const updateNavigation = () => {
      const marker = window.innerHeight * 0.34;
      const current = [...sections].reverse().find((section) => section.getBoundingClientRect().top <= marker);
      setActiveSection(current?.id ?? "hero");
      setScrolled(window.scrollY > 18);
    };

    updateNavigation();
    window.addEventListener("scroll", updateNavigation, { passive: true });
    window.addEventListener("resize", updateNavigation);
    return () => {
      window.removeEventListener("scroll", updateNavigation);
      window.removeEventListener("resize", updateNavigation);
    };
  }, []);

  useEffect(() => {
    const updateVisibility = () => setPageActive(!document.hidden);
    updateVisibility();
    document.addEventListener("visibilitychange", updateVisibility);
    return () => document.removeEventListener("visibilitychange", updateVisibility);
  }, []);

  return (
    <main className={`tradr-landing ${pageActive ? "" : "tradr-landing--paused"}`}>
      <nav className={`tradr-nav ${scrolled ? "tradr-nav--scrolled" : ""}`} aria-label="Основная навигация">
        <Link className="tradr-brand" href="#hero" aria-label="TRADR — главная"><IconLogo aria-hidden="true" /></Link>
        <div className="tradr-nav-links">
          {landingNavigation.map((item) => {
            const active = activeSection === item.href.slice(1);
            return <a className={active ? "tradr-nav-link tradr-nav-link--active" : "tradr-nav-link"} href={item.href} key={item.href} aria-current={active ? "location" : undefined}>{item.label}</a>;
          })}
        </div>
        <div className="tradr-nav-actions"><Link className="tradr-nav-docs" href="/docs">Документация</Link><Link className="tradr-nav-login" href="/login">Войти</Link><Link className="tradr-nav-cta" href="/register">Начать обучение</Link></div>
      </nav>

      <nav className={`tradr-mobile-nav ${scrolled ? "tradr-mobile-nav--scrolled" : ""}`} aria-label="Основная навигация">
        <Link className="tradr-brand" href="#hero" aria-label="TRADR — главная"><IconLogo aria-hidden="true" /></Link>
        <div className="tradr-mobile-nav-actions"><Link href="/login">Войти</Link><Link className="tradr-mobile-header-cta" href="/register">Начать обучение</Link>
        <button className="tradr-menu-toggle" type="button" aria-expanded={menuOpen} aria-controls="tradr-mobile-menu" aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"} onClick={() => setMenuOpen((open) => !open)}><HugeiconsIcon icon={menuOpen ? Cancel01Icon : Menu01Icon} strokeWidth={1.8} /></button>
        </div>
      </nav>
      <MobileMenu open={menuOpen} activeSection={activeSection} onClose={closeMenu} />

      <div className="tradr-landing-content">
      <MotionPresence className="tradr-hero-presence">
      {(heroVisible) => <section id="hero" className="tradr-hero" aria-labelledby="hero-title">
        <div className="tradr-orbit-field">
          {heroOrbPlacements.map((placement) => <StockOrb key={placement.id} placement={placement} />)}
        </div>
        <div className="tradr-hero-content">
          <h1 id="hero-title">
            {landingMotionPreset.heroIntro.map((step, index) => (
              <span key={step.id}>
                <IntroReveal delayMs={step.delayMs}>{step.text}</IntroReveal>
                {step.mobileBreakAfter && <br className="mobile-break" />}
                {index < landingMotionPreset.heroIntro.length - 1 && !step.mobileBreakAfter ? " " : null}
                {step.mobileBreakAfter ? " " : null}
              </span>
            ))}
          </h1>
          <HeroSimulator />
          <p style={{ "--intro-delay": `${landingMotionPreset.heroBodyDelayMs}ms` } as CSSProperties}>TRADR — безопасная учебная среда, где можно наблюдать за рынком<br className="desktop-only" /> и сравнивать решения агентов на одинаковых данных.</p>
        </div>
        <a className="tradr-scroll-cue" href="#about" style={{ "--intro-delay": `${landingMotionPreset.scrollCueDelayMs}ms` } as CSSProperties}>Листайте, чтобы узнать больше<HugeiconsIcon icon={ArrowDown01Icon} strokeWidth={1.8} aria-hidden="true" /></a>
      </section>}
      </MotionPresence>

      <section id="about" className="tradr-about">
        <div className="tradr-about-grid">
          <div className="tradr-about-copy">
            <h2>Учебный рынок.<br />Настоящая логика.</h2>
            <div className="tradr-about-description"><p>TRADR собирает рынок, терминал, агентов и журнал решений в одной понятной среде.</p><p>Наблюдайте за стратегиями, проверяйте гипотезы и учитесь без реальных денег.</p><ArrowLink href="/register">Начать без риска</ArrowLink></div>
          </div>
          <MotionPresence className="tradr-stats" once>
            {(visible) => <><div className="tradr-stats-title"><i />TRADR в цифрах</div><div className="tradr-stats-grid">{metrics.map((metric) => <div className={metric.active ? "tradr-stat tradr-stat--active" : "tradr-stat"} key={metric.label}><span>{metric.label}</span><AnimatedMetric value={metric.value} visible={visible} /></div>)}</div></>}
          </MotionPresence>
        </div>
      </section>

      <section id="products" className="tradr-products">
        <h2>Всё, чтобы научиться видеть рынок</h2>
        <div className="tradr-product-grid">{productCards.map((card) => <MotionPresence className={`tradr-product-card tradr-product-card--${card.tone}`} key={card.id}>{() => <><div className="tradr-product-copy"><div className="tradr-card-eyebrow">{card.icon}<span>{card.eyebrow}</span></div><h3>{card.title}</h3><p>{card.body}</p><ArrowLink href={card.href}>{card.action}</ArrowLink></div>{card.visual}</>}</MotionPresence>)}</div>
      </section>

      <section id="resources" className="tradr-resources" aria-labelledby="resources-title">
        <h2 id="resources-title">Изучайте TRADR</h2>
        <div className="tradr-resource-list">{resources.map((resource) => <Link href={resource.href} key={resource.title}><HugeiconsIcon icon={resource.icon} strokeWidth={1.8} aria-hidden="true" /><strong>{resource.title}</strong><span>{resource.body}</span><HugeiconsIcon className="tradr-resource-arrow" icon={ArrowRight01Icon} strokeWidth={2} aria-hidden="true" /></Link>)}</div>
      </section>

      <footer className="tradr-footer">
        <div className="tradr-footer-socials"><a href="https://github.com/Hqzdev/tradr" aria-label="GitHub: репозиторий TRADR" rel="noreferrer" target="_blank"><HugeiconsIcon icon={GithubIcon} strokeWidth={1.8} /></a><a href="https://x.com" aria-label="X"><HugeiconsIcon icon={NewTwitterIcon} strokeWidth={1.8} /></a><a href="https://discord.com" aria-label="Discord"><HugeiconsIcon icon={DiscordIcon} strokeWidth={1.8} /></a></div>
        <div className="tradr-footer-links">
          <div><strong>Платформа</strong><Link href="/dashboard">Обзор</Link><Link href="/agents">Агенты</Link><Link href="/history">Активность</Link><Link href="/market">Рынок</Link></div>
          <div><strong>Обучение</strong><Link href="/docs">Документация</Link><Link href="/catalog">Материалы</Link><Link href="/journal">Журнал</Link><Link href="/history">История</Link></div>
          <div><strong>Компания</strong><Link href="/about">О TRADR</Link><Link href="/careers">Карьера</Link><Link href="/governance">Управление</Link></div>
          <div><strong>Помощь</strong><Link href="/developers">Разработчикам</Link><Link href="/help">Центр помощи</Link><Link href="/contact">Связаться с нами</Link><Link href="/privacy">Конфиденциальность</Link></div>
        </div>
        <div className="tradr-footer-bottom"><span>© {new Date().getFullYear()} TRADR</span><div><span>Учебная платформа</span><span>Не является инвестиционной рекомендацией</span></div></div>
      </footer>
      </div>
    </main>
  );
}

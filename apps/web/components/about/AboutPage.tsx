"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useCallback,
  useEffect,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowRight01Icon,
  BookOpen01Icon,
  DiscordIcon,
  GithubIcon,
  GraduationScrollIcon,
  NewTwitterIcon,
} from "@hugeicons/core-free-icons";
import { IconLogo } from "@/components/icons";
import { usePrefersReducedMotion } from "@/components/landing/MotionPrimitives";
import styles from "./about.module.css";

interface AboutNavItem {
  readonly href: `#${string}`;
  readonly label: string;
}

interface FeatureCardModel {
  readonly title: string;
  readonly body: string;
  readonly href: string;
  readonly imageSrc: string;
  readonly imageAlt: string;
  readonly meta: string;
}

interface StockBubbleModel {
  readonly ticker: string;
  readonly name: string;
  readonly logoSrc: string;
}

const navigation: readonly AboutNavItem[] = [
  { href: "#history", label: "Наша история" },
  { href: "#why", label: "Почему это важно" },
  { href: "#features", label: "Возможности" },
  { href: "#materials", label: "Материалы" },
  { href: "#start", label: "Начать обучение" },
] as const;

const features: readonly FeatureCardModel[] = [
  {
    title: "Рынок в одном окне",
    body: "Котировки, индексы и контекст рынка собраны в одном спокойном рабочем пространстве.",
    href: "/market",
    imageSrc: "/about/market.png",
    imageAlt: "Обзор рынка TRADR с котировками и торговыми агентами",
    meta: "Рынок · Наблюдение",
  },
  {
    title: "Сделки без реальных денег",
    body: "Размещайте учебные заявки и проверяйте идеи в терминале без давления и финансового риска.",
    href: "/terminal",
    imageSrc: "/about/terminal.png",
    imageAlt: "Учебный терминал TRADR с графиком и формой заявки",
    meta: "Терминал · Практика",
  },
  {
    title: "Один рынок. Три характера.",
    body: "Сравнивайте агрессивного, осторожного и случайного агентов на одинаковых рыночных данных.",
    href: "/agents",
    imageSrc: "/about/portfolio.png",
    imageAlt: "Портфель TRADR со сравнением результатов торговых агентов",
    meta: "Агенты · Сравнение",
  },
  {
    title: "Логика каждого решения",
    body: "Возвращайтесь к сигналу, действию и результату, чтобы понимать не только итог, но и путь к нему.",
    href: "/journal",
    imageSrc: "/about/journal.png",
    imageAlt: "Компоненты журнала решений и состояний TRADR",
    meta: "Журнал · Разбор",
  },
] as const;

const stockGroups: readonly (readonly StockBubbleModel[])[] = [
  [
    { ticker: "AAPL", name: "Apple", logoSrc: "/stocks/apple.png" },
    { ticker: "NVDA", name: "Nvidia", logoSrc: "/stocks/nvidia.png" },
    { ticker: "TSLA", name: "Tesla", logoSrc: "/stocks/tesla.png" },
    { ticker: "MSFT", name: "Microsoft", logoSrc: "/stocks/microsoft.png" },
  ],
  [
    { ticker: "AMZN", name: "Amazon", logoSrc: "/stocks/amazon.png" },
    { ticker: "GOOGL", name: "Alphabet", logoSrc: "/stocks/google.png" },
    { ticker: "META", name: "Meta", logoSrc: "/stocks/meta.svg" },
    { ticker: "AMD", name: "AMD", logoSrc: "/stocks/amd.svg" },
  ],
  [
    { ticker: "NFLX", name: "Netflix", logoSrc: "/stocks/netflix.svg" },
    { ticker: "JPM", name: "JPMorgan", logoSrc: "/stocks/jpmorgan.svg" },
    { ticker: "KO", name: "Coca-Cola", logoSrc: "/stocks/coca-cola.svg" },
    { ticker: "V", name: "Visa", logoSrc: "/stocks/visa.svg" },
  ],
] as const;

function Reveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`${styles.reveal} ${className}`} data-about-reveal>
      {children}
    </div>
  );
}

function ArrowLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link className={styles.arrowLink} href={href}>
      <span>{children}</span>
      <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={1.8} aria-hidden="true" />
    </Link>
  );
}

function FeatureCard({ feature }: { feature: FeatureCardModel }) {
  return (
    <Link className={styles.featureCard} href={feature.href}>
      <span className={styles.featureImage}>
        <Image
          src={feature.imageSrc}
          alt={feature.imageAlt}
          fill
          sizes="(max-width: 680px) 280px, (max-width: 1100px) 44vw, 23vw"
        />
      </span>
      <span className={styles.featureCopy}>
        <strong>{feature.title}</strong>
        <span>{feature.body}</span>
        <small>{feature.meta}</small>
      </span>
    </Link>
  );
}

function StockCluster({ active, reducedMotion }: { active: boolean; reducedMotion: boolean }) {
  const [groupIndex, setGroupIndex] = useState(0);

  useEffect(() => {
    if (!active || reducedMotion) return;
    const timer = window.setInterval(
      () => setGroupIndex((index) => (index + 1) % stockGroups.length),
      4200,
    );
    return () => window.clearInterval(timer);
  }, [active, reducedMotion]);

  return (
    <div className={styles.stockCluster} aria-label="Акции, доступные в учебной среде TRADR">
      {stockGroups[groupIndex].map((stock, index) => (
        <div
          className={`${styles.stockBubble} ${styles[`stockBubble${index + 1}`]}`}
          key={`${groupIndex}-${stock.ticker}`}
          style={{ "--bubble-delay": `${index * 85}ms` } as CSSProperties}
        >
          <span className={styles.stockLogo}>
            <Image src={stock.logoSrc} alt="" width={72} height={72} unoptimized />
          </span>
          <span className={styles.stockLabel}>
            <strong>{stock.ticker}</strong>
            <small>{stock.name}</small>
          </span>
        </div>
      ))}
    </div>
  );
}

function AboutHeader({ scrolled }: { scrolled: boolean }) {
  return (
    <header className={`${styles.header} ${scrolled ? styles.headerScrolled : ""}`}>
      <div className={styles.headerInner}>
        <Link className={styles.brand} href="/" aria-label="TRADR — главная">
          <IconLogo aria-hidden="true" />
          <span>TRADR · О проекте</span>
        </Link>
        <Link className={styles.headerCta} href="/terminal">
          Открыть терминал
        </Link>
      </div>
    </header>
  );
}

export default function AboutPage() {
  const reducedMotion = usePrefersReducedMotion();
  const [scrolled, setScrolled] = useState(false);
  const [pageActive, setPageActive] = useState(true);

  useEffect(() => {
    const updateVisibility = () => setPageActive(!document.hidden);
    updateVisibility();
    document.addEventListener("visibilitychange", updateVisibility);
    return () => document.removeEventListener("visibilitychange", updateVisibility);
  }, []);

  useEffect(() => {
    const previousMargin = document.body.style.margin;
    const previousBackground = document.body.style.background;
    document.body.style.margin = "0";
    document.body.style.background = "#fff";
    return () => {
      document.body.style.margin = previousMargin;
      document.body.style.background = previousBackground;
    };
  }, []);

  useEffect(() => {
    const revealNodes = Array.from(document.querySelectorAll<HTMLElement>("[data-about-reveal]"));
    const updateReveals = () => {
      const revealLine = window.innerHeight * 0.93;
      revealNodes.forEach((node) => {
        if (node.dataset.visible === "true") return;
        const bounds = node.getBoundingClientRect();
        if (reducedMotion || (bounds.top < revealLine && bounds.bottom > 0)) {
          node.dataset.visible = "true";
        }
      });
    };
    const updatePageScroll = () => {
      setScrolled(window.scrollY > 20);
      updateReveals();
    };

    updatePageScroll();
    const frame = window.requestAnimationFrame(updatePageScroll);
    window.addEventListener("scroll", updatePageScroll, { passive: true });
    window.addEventListener("resize", updateReveals);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", updatePageScroll);
      window.removeEventListener("resize", updateReveals);
    };
  }, [reducedMotion]);

  const scrollToSection = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>, href: AboutNavItem["href"]) => {
      if (reducedMotion) return;
      const target = document.querySelector(href);
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      window.history.replaceState(null, "", href);
    },
    [reducedMotion],
  );

  return (
    <main className={`${styles.aboutPage} ${pageActive ? "" : styles.pagePaused}`}>
      <AboutHeader scrolled={scrolled} />

      <section className={styles.hero} aria-labelledby="about-title">
        <div className={styles.heroGrid}>
          <nav className={styles.heroNav} aria-label="Разделы страницы">
            {navigation.map((item) => (
              <a key={item.href} href={item.href} onClick={(event) => scrollToSection(event, item.href)}>
                {item.label}
              </a>
            ))}
          </nav>
          <h1 id="about-title" className={styles.heroTitle}>
            {["О", "TRADR"].map((word, index) => (
              <span className={styles.heroWord} key={word} style={{ "--word-delay": `${index * 110}ms` } as CSSProperties}>
                {word}
              </span>
            ))}
          </h1>
        </div>
      </section>

      <section className={styles.editorialSection} id="history">
        <Reveal className={styles.editorialGrid}>
          <div className={styles.sectionHeading}>
            <span>Кто мы</span>
            <h2>Наша история</h2>
          </div>
          <div className={styles.prose}>
            <p>
              TRADR — учебная торговая платформа, где рынок, терминал и торговые агенты собраны в одной понятной среде. Здесь можно наблюдать за котировками, размещать демо-заявки и видеть, как каждое решение меняет результат портфеля.
            </p>
            <h3><em>Будущее</em> финансового обучения уже здесь</h3>
            <p>
              Мы создали TRADR, чтобы сложные рыночные процессы можно было изучать на практике — без реальных денег и давления. Агрессивный, осторожный и случайный агенты работают на одних данных, поэтому различия между стратегиями становятся видимыми и понятными.
            </p>
            <p>
              Сигнал, действие и итог сохраняются в журнале. Это помогает возвращаться к решениям, замечать закономерности и постепенно формировать собственное понимание рынка.
            </p>
          </div>
        </Reveal>
      </section>

      <section className={`${styles.editorialSection} ${styles.whySection}`} id="why">
        <Reveal className={styles.editorialGrid}>
          <div className={styles.sectionHeading}>
            <span>Почему это важно</span>
            <h2>Финансовая грамотность</h2>
          </div>
          <div className={styles.prose}>
            <p>
              Уверенность на рынке начинается не с точного прогноза, а с понимания связи между сигналом, действием и риском.
            </p>
            <h3>
              Когда все решения видны, ошибки превращаются в опыт <em>без финансового риска</em>.
            </h3>
            <p>
              TRADR помогает сравнивать подходы, наблюдать последствия сделок и разбирать результат в собственном темпе. Учебный счёт остаётся безопасным пространством для вопросов, гипотез и повторных попыток.
            </p>
            <p>
              Платформа не даёт инвестиционных рекомендаций и не обещает доходность — она показывает механику рынка и цену каждого решения.
            </p>
            <ArrowLink href="/docs">Узнать, как работает платформа</ArrowLink>
          </div>
        </Reveal>
      </section>

      <section className={styles.featuresSection} id="features" aria-labelledby="features-title">
        <Reveal>
          <h2 id="features-title">Что можно изучить в TRADR</h2>
          <div className={styles.featureRail}>
            {features.map((feature) => <FeatureCard feature={feature} key={feature.title} />)}
          </div>
        </Reveal>
      </section>

      <section className={styles.materialsSection} id="materials" aria-labelledby="materials-title">
        <Reveal>
          <div className={styles.materialsIntro}>
            <h2 id="materials-title">Материалы</h2>
            <p>Короткие объяснения, документация и практические сценарии помогут быстрее освоиться в TRADR.</p>
          </div>
          <div className={styles.materialGrid}>
            <Link className={styles.materialCard} href="/docs">
              <span className={styles.materialIcon}><IconLogo aria-hidden="true" /></span>
              <span className={styles.materialCopy}>
                <strong>Документация TRADR</strong>
                <span>Архитектура платформы, сценарии работы и описание учебной симуляции.</span>
                <small><HugeiconsIcon icon={BookOpen01Icon} strokeWidth={1.8} aria-hidden="true" />Открыть документацию</small>
              </span>
            </Link>
            <Link className={`${styles.materialCard} ${styles.materialCardTint}`} href="/catalog">
              <span className={styles.materialIcon}><HugeiconsIcon icon={GraduationScrollIcon} strokeWidth={1.55} aria-hidden="true" /></span>
              <span className={styles.materialCopy}>
                <strong>Учебные материалы</strong>
                <span>Термины, сигналы и рыночная механика — простым языком и без лишнего шума.</span>
                <small><HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={1.8} aria-hidden="true" />Перейти к материалам</small>
              </span>
            </Link>
          </div>
        </Reveal>
      </section>

      <section className={styles.startSection} id="start" aria-labelledby="start-title">
        <div className={styles.startInner}>
          <Reveal className={styles.startCopy}>
            <h2 id="start-title">Начните видеть рынок увереннее</h2>
            <Link className={styles.startCta} href="/register">Начать обучение</Link>
          </Reveal>
          <StockCluster active={pageActive} reducedMotion={reducedMotion} />
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div className={styles.footerBrand}>
            <IconLogo aria-label="TRADR" />
          </div>
          <div className={styles.footerLinks}>
            <div><strong>Платформа</strong><Link href="/market">Рынок</Link><Link href="/terminal">Терминал</Link><Link href="/portfolio">Портфель</Link><Link href="/agents">Агенты</Link></div>
            <div><strong>Обучение</strong><Link href="/catalog">Материалы</Link><Link href="/journal">Журнал</Link><Link href="/history">История</Link></div>
            <div><strong>Компания</strong><Link href="/about">О TRADR</Link><Link href="/careers">Карьера</Link><Link href="/governance">Управление</Link></div>
            <div><strong>Помощь</strong><Link href="/developers">Разработчикам</Link><Link href="/help">Центр помощи</Link><Link href="/contact">Связаться с нами</Link><Link href="/privacy">Конфиденциальность</Link></div>
          </div>
          <div className={styles.footerBottom}>
            <span>© 2026 TRADR</span>
            <span>Учебная платформа · Не является инвестиционной рекомендацией</span>
            <div className={styles.socials}>
              <a href="https://github.com" aria-label="GitHub"><HugeiconsIcon icon={GithubIcon} strokeWidth={1.8} /></a>
              <a href="https://x.com" aria-label="X"><HugeiconsIcon icon={NewTwitterIcon} strokeWidth={1.8} /></a>
              <a href="https://discord.com" aria-label="Discord"><HugeiconsIcon icon={DiscordIcon} strokeWidth={1.8} /></a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}

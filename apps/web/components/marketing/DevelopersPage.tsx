import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowRight01Icon,
  BookOpen01Icon,
  CodeIcon,
  Database01Icon,
  HelpCircleIcon,
  Search01Icon,
} from "@hugeicons/core-free-icons";
import MarketingShell from "./MarketingShell";
import DeveloperCopy from "./DeveloperCopy";
import { developerGuides } from "./marketing-data";
import styles from "./pages.module.css";

const sideGroups = [
  { title: "Начало", links: ["Обзор", "Быстрый старт", "Концепции"] },
  { title: "Рынок", links: ["Котировки", "Инструменты", "Сигналы"] },
  { title: "Торговля", links: ["Заявки", "Комиссии", "Портфель"] },
  { title: "Агенты", links: ["Характеры", "Решения", "Сравнение"] },
] as const;

const useCases = [
  { title: "Для разработчиков интерфейсов", description: "Добавляйте рыночные данные и учебные сделки в собственные экраны.", icon: CodeIcon },
  { title: "Для авторов курсов", description: "Собирайте сценарии с повторяемыми условиями и понятным результатом.", icon: BookOpen01Icon },
  { title: "Для исследователей", description: "Сравнивайте поведение агентов на едином наборе данных.", icon: Database01Icon },
] as const;

export default function DevelopersPage() {
  return (
    <MarketingShell label="TRADR · Developers" theme="dark">
      <div className={styles.developerLayout}>
        <aside className={styles.developerSidebar} aria-label="Разделы документации">
          <Link className={styles.sidebarSearch} href="/docs"><HugeiconsIcon icon={Search01Icon} strokeWidth={1.7} />Поиск по документации</Link>
          {sideGroups.map((group) => (
            <div key={group.title}><strong>{group.title}</strong>{group.links.map((label) => <Link href="/docs" key={label}>{label}</Link>)}</div>
          ))}
        </aside>

        <div className={styles.developerMain}>
          <section className={styles.developerHero}>
            <div>
              <span className={styles.eyebrow}>TRADR для разработчиков</span>
              <h1>Документация<br />TRADR</h1>
              <p>Подключайте учебные котировки, создавайте торговых агентов и исследуйте решения в понятной среде.</p>
              <div className={styles.heroActions}><Link className={styles.pinkButton} href="/docs">Быстрый старт</Link><Link className={styles.ghostButton} href="/docs/backend-agents">Агенты</Link></div>
            </div>
            <DeveloperCopy />
          </section>

          <section className={styles.developerSection} aria-labelledby="guides-title">
            <h2 id="guides-title">Руководства</h2>
            <div className={styles.guideGrid}>
              {developerGuides.map((guide) => (
                <Link data-tone={guide.tone} href={guide.href} key={guide.title}>
                  <HugeiconsIcon icon={CodeIcon} strokeWidth={1.8} />
                  <span><strong>{guide.title}</strong><small>{guide.description}</small></span>
                </Link>
              ))}
            </div>
          </section>

          <section className={styles.developerSection} aria-labelledby="use-cases-title">
            <h2 id="use-cases-title">Сценарии использования</h2>
            <div className={styles.useCaseGrid}>
              {useCases.map((item) => (
                <article key={item.title}>
                  <HugeiconsIcon icon={item.icon} strokeWidth={1.7} />
                  <h3>{item.title}</h3><p>{item.description}</p>
                  <Link href="/docs">Изучить возможности <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={1.8} /></Link>
                </article>
              ))}
            </div>
          </section>

          <section className={styles.apiCta}>
            <div><span>Открытая документация</span><h2>Начните с рабочего сценария</h2><p>Документация проекта уже содержит архитектуру, маршруты и описание учебной симуляции.</p></div>
            <Link className={styles.pinkButton} href="/docs">Открыть документацию</Link>
          </section>

          <Link className={styles.developerHelp} href="/help"><HugeiconsIcon icon={HelpCircleIcon} strokeWidth={1.8} />Нужна помощь?</Link>
        </div>
      </div>
    </MarketingShell>
  );
}

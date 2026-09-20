import Link from "next/link";
import MarketingShell from "./MarketingShell";
import { privacySections } from "./marketing-data";
import styles from "./pages.module.css";

export default function PrivacyPage() {
  return (
    <MarketingShell label="TRADR · Конфиденциальность" theme="support">
      <div className={styles.legalLayout}>
        <aside className={styles.legalSidebar}>
          <span>На этой странице</span>
          {privacySections.map((section) => <a href={`#${section.id}`} key={section.id}>{section.title}</a>)}
        </aside>
        <article className={styles.legalArticle}>
          <nav aria-label="Хлебные крошки"><Link href="/">Главная</Link><span>/</span><Link href="/help">Помощь</Link><span>/</span><span>Конфиденциальность</span></nav>
          <h1>Политика конфиденциальности TRADR</h1>
          <p className={styles.legalDate}><em>Редакция от 20 сентября 2026 года</em></p>
          <p className={styles.legalLead}>TRADR — учебная торговая платформа. Этот документ описывает обработку данных на маркетинговых страницах и внутри учебного продукта.</p>
          {privacySections.map((section) => (
            <section id={section.id} key={section.id}>
              <h2>{section.title}</h2>
              {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              {section.bullets ? <ul>{section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul> : null}
            </section>
          ))}
          <aside className={styles.legalNotice}>Этот текст описывает продуктовую практику TRADR и не является юридической консультацией. Перед публикацией политики для реального сервиса её следует проверить с профильным специалистом.</aside>
          <Link className={styles.legalContact} href="/contact?topic=privacy">Задать вопрос о данных</Link>
        </article>
      </div>
    </MarketingShell>
  );
}

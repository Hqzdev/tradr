import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { BookOpen01Icon, GraduationScrollIcon, HelpCircleIcon, TradeDownIcon } from "@hugeicons/core-free-icons";
import MarketingShell from "./MarketingShell";
import SupportSearch from "./SupportSearch";
import { helpTopics } from "./marketing-data";
import styles from "./pages.module.css";

const topicIcons = [GraduationScrollIcon, TradeDownIcon, BookOpen01Icon, HelpCircleIcon] as const;

export default function HelpPage() {
  return (
    <MarketingShell label="TRADR · Помощь" theme="support">
      <div className={styles.supportLayout}>
        <aside className={styles.supportSidebar} aria-label="Темы помощи">
          <strong>Все темы</strong>
          {helpTopics.map((topic) => <Link href={topic.href} key={topic.title}>{topic.title}</Link>)}
          <Link href="/privacy">Конфиденциальность</Link>
        </aside>
        <div className={styles.supportMain}>
          <section className={styles.supportHero}>
            <span>Центр помощи TRADR</span>
            <h1>Есть вопросы?<br />Мы поможем разобраться.</h1>
            <p>Найдите короткий ответ или перейдите к подробной документации.</p>
          </section>
          <div className={styles.topicCards}>
            {helpTopics.map((topic, index) => (
              <Link href={topic.href} key={topic.title}>
                <HugeiconsIcon icon={topicIcons[index]} strokeWidth={1.8} />
                <strong>{topic.title}</strong><span>{topic.description}</span>
              </Link>
            ))}
          </div>
          <SupportSearch />
          <section className={styles.supportCta}><div><span>Ответа нет?</span><h2>Расскажите, что произошло</h2></div><Link href="/contact">Связаться с командой</Link></section>
        </div>
      </div>
    </MarketingShell>
  );
}

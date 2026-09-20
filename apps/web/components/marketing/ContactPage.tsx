import Link from "next/link";
import MarketingShell from "./MarketingShell";
import ContactForm from "./ContactForm";
import styles from "./pages.module.css";

export default function ContactPage() {
  return (
    <MarketingShell label="TRADR · Связаться" theme="support">
      <section className={styles.contactPage}>
        <div className={styles.contactIntro}>
          <span>Поддержка TRADR</span>
          <h1>Расскажите,<br />чем помочь</h1>
          <p>Добавьте контекст, шаги и ожидаемый результат. Чем точнее описание, тем легче найти решение.</p>
          <Link href="/help">Сначала посмотреть частые вопросы</Link>
        </div>
        <ContactForm />
      </section>
    </MarketingShell>
  );
}

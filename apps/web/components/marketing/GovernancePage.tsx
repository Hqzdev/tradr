import Image from "next/image";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import MarketingShell from "./MarketingShell";
import { governancePhases, governanceResources } from "./marketing-data";
import styles from "./pages.module.css";

const governanceMarks = ["/stocks/apple.png", "/stocks/nvidia.png", "/stocks/microsoft.png", "/stocks/google.png", "/stocks/amazon.png"] as const;

export default function GovernancePage() {
  return (
    <MarketingShell label="TRADR · Управление">
      <section className={styles.governanceHero}>
        <div className={styles.governanceMarks} aria-hidden="true">
          {governanceMarks.map((src, index) => <span key={src} style={{ "--mark": index } as React.CSSProperties}><Image src={src} alt="" width={40} height={40} unoptimized /></span>)}
        </div>
        <h1><span>TRADR</span><span>управление</span></h1>
        <div className={styles.governanceIntro}>
          <p>Открытый процесс, который помогает команде и учебному сообществу вместе улучшать платформу.</p>
          <Link className={styles.darkButton} href="/contact?topic=proposal">Предложить идею <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={1.8} /></Link>
        </div>
      </section>

      <section className={styles.governanceSection} aria-labelledby="resources-title">
        <div className={styles.sectionShell}>
          <h2 id="resources-title">Ресурсы управления</h2>
          <div className={styles.governanceResources}>
            {governanceResources.map((resource, index) => (
              <Link href={resource.href} key={resource.title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{resource.title}</strong>
                <p>{resource.description}</p>
                <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={1.8} />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.processSection} aria-labelledby="process-title">
        <div className={styles.sectionShell}>
          <div className={styles.processIntro}>
            <span>Как принимаются решения</span>
            <h2 id="process-title">От наблюдения до измеримого изменения</h2>
          </div>
          <div className={styles.phaseList}>
            {governancePhases.map((phase) => (
              <article key={phase.number}>
                <span>{phase.number}</span>
                <div><h3>{phase.title}</h3><p>{phase.description}</p></div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.governanceCta}>
        <div className={styles.sectionShell}>
          <h2>Хорошие решения начинаются с ясного контекста.</h2>
          <Link className={styles.darkButton} href="/history">История изменений <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={1.8} /></Link>
        </div>
      </section>
    </MarketingShell>
  );
}

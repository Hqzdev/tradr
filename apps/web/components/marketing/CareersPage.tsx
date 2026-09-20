import Image from "next/image";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowDown01Icon, ArrowRight01Icon, Briefcase01Icon } from "@hugeicons/core-free-icons";
import MarketingShell from "./MarketingShell";
import { benefitGroups, jobDepartments } from "./marketing-data";
import styles from "./pages.module.css";

const teamMarks = [
  { src: "/stocks/apple.png", label: "Продукт" },
  { src: "/stocks/nvidia.png", label: "Данные" },
  { src: "/stocks/microsoft.png", label: "Разработка" },
  { src: "/stocks/google.png", label: "Обучение" },
  { src: "/stocks/amazon.png", label: "Дизайн" },
] as const;

export default function CareersPage() {
  return (
    <MarketingShell label="TRADR · Карьера">
      <section className={styles.careersHero}>
        <h1 aria-label="Будущее финансового обучения создаётся здесь">
          {"Будущее финансового обучения".split(" ").map((word, index) => <span key={word} style={{ "--word": index } as React.CSSProperties}>{word}</span>)}
        </h1>
        <p>Создавайте среду, в которой сложные рыночные решения становятся понятными.</p>
        <a className={styles.pinkButton} href="#open-roles">Открытые вакансии</a>
      </section>

      <section className={styles.teamCanvas} aria-label="Направления команды TRADR">
        {teamMarks.map((mark, index) => (
          <div className={styles.teamMark} key={mark.label} style={{ "--mark": index } as React.CSSProperties}>
            <span><Image src={mark.src} alt="" width={76} height={76} unoptimized /></span>
            <strong>{mark.label}</strong>
          </div>
        ))}
      </section>

      <section className={styles.rolesSection} id="open-roles" aria-labelledby="roles-title">
        <div className={styles.sectionShell}>
          <div className={styles.sectionTitleRow}><HugeiconsIcon icon={Briefcase01Icon} strokeWidth={1.7} /><h2 id="roles-title">Открытые вакансии</h2></div>
          <div className={styles.rolesList}>
            {jobDepartments.map((department, index) => (
              <details key={department.title} open={index === 0}>
                <summary>
                  <span>{department.title}</span><small>{department.roles.length}</small><HugeiconsIcon icon={ArrowDown01Icon} strokeWidth={1.8} />
                </summary>
                <div className={styles.roleRows}>
                  {department.roles.map((role) => (
                    <Link href={role.href} key={role.title}>
                      <span><strong>{role.title}</strong><small>{role.location}</small></span>
                      <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={1.8} />
                    </Link>
                  ))}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.benefitsSection} id="benefits" aria-labelledby="benefits-title">
        <div className={styles.sectionShell}>
          <div className={styles.benefitsIntro}>
            <h2 id="benefits-title">Условия для сильной работы</h2>
            <p>Поддержка здоровья, роста и самостоятельности — чтобы команда могла думать глубоко и создавать полезный продукт.</p>
          </div>
          <div className={styles.benefitGrid}>
            {benefitGroups.map((group, index) => (
              <article key={group.title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{group.title}</h3>
                <ul>{group.items.map((item) => <li key={item}>{item}</li>)}</ul>
              </article>
            ))}
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}

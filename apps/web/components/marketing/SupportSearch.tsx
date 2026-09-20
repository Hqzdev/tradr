"use client";

import { useDeferredValue, useMemo, useState } from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon, Search01Icon } from "@hugeicons/core-free-icons";
import { helpArticles } from "./marketing-data";
import styles from "./pages.module.css";

export default function SupportSearch() {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query.trim().toLocaleLowerCase("ru"));
  const results = useMemo(() => {
    if (!deferredQuery) return helpArticles;
    return helpArticles.filter((article) => `${article.title} ${article.description} ${article.tags.join(" ")}`.toLocaleLowerCase("ru").includes(deferredQuery));
  }, [deferredQuery]);

  return (
    <section className={styles.supportArticles} aria-labelledby="faq-title">
      <div className={styles.supportSearch}>
        <HugeiconsIcon icon={Search01Icon} strokeWidth={1.8} aria-hidden="true" />
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Найти ответ" aria-label="Поиск по центру помощи" />
        {query ? <button type="button" onClick={() => setQuery("")}>Очистить</button> : null}
      </div>
      <div className={styles.supportHeadingRow}><h2 id="faq-title">Частые вопросы</h2><span>{results.length}</span></div>
      {results.length ? (
        <div className={styles.articleGrid}>
          {results.map((article) => (
            <article key={article.title}>
              <div><h3>{article.title}</h3><p>{article.description}</p></div>
              <Link href="/docs">Подробнее <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={1.8} /></Link>
            </article>
          ))}
        </div>
      ) : <p className={styles.noResults}>По вашему запросу ничего не найдено. Попробуйте сформулировать вопрос иначе или напишите команде.</p>}
    </section>
  );
}

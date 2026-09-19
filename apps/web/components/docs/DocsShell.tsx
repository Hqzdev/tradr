"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { DocPage, docsGroups, docsPages, getAdjacentPages } from "@/lib/docs/content";
import {
  IconArrowUpRight,
  IconChevronLeft,
  IconChevronRight,
  IconFile,
  IconLogo,
  IconSearch,
  IconX,
} from "@/components/icons";
import DocArticle from "@/components/docs/DocArticle";

interface DocsShellProps {
  page: DocPage;
}

interface SearchResult {
  page: DocPage;
  detail: string;
}

function normalize(value: string) {
  return value.toLocaleLowerCase("ru-RU").trim();
}

function searchDocumentation(query: string): SearchResult[] {
  const needle = normalize(query);
  if (needle.length < 2) return [];

  const results: SearchResult[] = [];
  for (const page of docsPages) {
    if (normalize(`${page.title} ${page.description} ${page.eyebrow}`).includes(needle)) {
      results.push({ page, detail: page.description });
      continue;
    }

    for (const section of page.sections) {
      const entry = section.entries?.find((candidate) =>
        normalize(`${candidate.path} ${candidate.description}`).includes(needle)
      );
      const bullet = section.bullets?.find((candidate) => normalize(candidate).includes(needle));
      if (entry || bullet || normalize(section.title).includes(needle)) {
        results.push({
          page,
          detail: entry ? `${entry.path} — ${entry.description}` : bullet ?? section.title,
        });
        break;
      }
    }
  }

  return results.slice(0, 7);
}

export default function DocsShell({ page }: DocsShellProps) {
  const pathname = usePathname();
  const [query, setQuery] = useState("");
  const [mobileNavigationOpen, setMobileNavigationOpen] = useState(false);
  const results = useMemo(() => searchDocumentation(query), [query]);
  const adjacent = getAdjacentPages(page);

  return (
    <div className="tradr-docs">
      <header className="docs-header">
        <div className="docs-brand">
          <Link href="/" aria-label="На главную TRADR"><IconLogo /></Link>
          <div>
            <strong>Документация</strong>
            <span>TRADR · версия 1.0</span>
          </div>
        </div>

        <nav className="docs-header-nav" aria-label="Основные разделы документации">
          <Link className={page.group === "Начало" ? "active" : ""} href="/docs">Обзор</Link>
          <Link className={page.slug === "backend-architecture" ? "active" : ""} href="/docs/backend-architecture">Архитектура</Link>
          <Link className={page.slug === "web-data" ? "active" : ""} href="/docs/web-data">API</Link>
          <Link className={page.group === "Процессы" ? "active" : ""} href="/docs/team-workflow">Команда</Link>
        </nav>

        <div className="docs-header-actions">
          <div className="docs-search-wrap">
            <IconSearch aria-hidden="true" />
            <input
              aria-label="Поиск по документации"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Поиск по документации"
              value={query}
            />
            {query ? (
              <button aria-label="Очистить поиск" onClick={() => setQuery("")} type="button"><IconX /></button>
            ) : <kbd>⌘ K</kbd>}
            {query.length >= 2 ? (
              <div className="docs-search-results">
                {results.length ? results.map((result) => (
                  <Link href={`/docs/${result.page.slug}`} key={result.page.slug} onClick={() => setQuery("")}>
                    <IconFile aria-hidden="true" />
                    <span>
                      <strong>{result.page.title}</strong>
                      <small>{result.detail}</small>
                    </span>
                    <IconChevronRight aria-hidden="true" />
                  </Link>
                )) : <p>Ничего не найдено. Попробуйте имя файла или модуля.</p>}
              </div>
            ) : null}
          </div>
          <Link className="docs-home-link" href="/">На главную</Link>
          <Link className="docs-open-app" href="/market">Открыть TRADR <IconArrowUpRight /></Link>
        </div>

        <button
          aria-expanded={mobileNavigationOpen}
          aria-label={mobileNavigationOpen ? "Закрыть содержание" : "Открыть содержание"}
          className="docs-mobile-toggle"
          onClick={() => setMobileNavigationOpen((value) => !value)}
          type="button"
        >
          {mobileNavigationOpen ? <IconX /> : <IconFile />}
        </button>
      </header>

      <div className="docs-layout">
        <aside className={`docs-sidebar${mobileNavigationOpen ? " open" : ""}`}>
          <div className="docs-sidebar-intro">
            <strong>Содержание</strong>
            <span>12 разделов · простой русский</span>
          </div>
          {docsGroups.map((group) => (
            <div className="docs-nav-group" key={group}>
              <h2>{group}</h2>
              {docsPages.filter((candidate) => candidate.group === group).map((candidate) => {
                const href = candidate.slug === "overview" ? "/docs" : `/docs/${candidate.slug}`;
                const active = pathname === href || (pathname === "/docs/overview" && candidate.slug === "overview");
                return (
                  <Link
                    className={active ? "active" : ""}
                    href={href}
                    key={candidate.slug}
                    onClick={() => setMobileNavigationOpen(false)}
                  >
                    <span>{String(candidate.order).padStart(2, "0")}</span>
                    {candidate.title}
                  </Link>
                );
              })}
            </div>
          ))}
          <div className="docs-sidebar-help">
            <span>Не нашли ответ?</span>
            <strong>Спросите команду</strong>
            <small>#tradr-dev →</small>
          </div>
        </aside>

        <main className="docs-main">
          <DocArticle page={page} />
          <nav className="docs-pagination" aria-label="Соседние разделы">
            {adjacent.previous ? (
              <Link href={adjacent.previous.slug === "overview" ? "/docs" : `/docs/${adjacent.previous.slug}`}>
                <IconChevronLeft />
                <span><small>Предыдущий раздел</small><strong>{adjacent.previous.title}</strong></span>
              </Link>
            ) : <span />}
            {adjacent.next ? (
              <Link className="next" href={`/docs/${adjacent.next.slug}`}>
                <span><small>Следующий раздел</small><strong>{adjacent.next.title}</strong></span>
                <IconChevronRight />
              </Link>
            ) : <span />}
          </nav>
        </main>

        <aside className="docs-toc">
          <strong>На этой странице</strong>
          <nav>
            {page.sections.map((section, index) => (
              <a className={index === 0 ? "active" : ""} href={`#${section.id}`} key={section.id}>{section.title}</a>
            ))}
          </nav>
          <div className="docs-toc-rule" />
          <Link href="/docs/team-workflow">Правила изменений <IconArrowUpRight /></Link>
        </aside>
      </div>
    </div>
  );
}

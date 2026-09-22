"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import { usePathname } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import { BubbleChatIcon } from "@hugeicons/core-free-icons";
import { DocPage, docsGroups, docsPages, getAdjacentPages, getCopyableDocText } from "@/lib/docs/content";
import { currentRelease } from "@/lib/changelog";
import {
  IconArrowUpRight,
  IconChevronLeft,
  IconChevronRight,
  IconCopy,
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

interface DocumentationSearchProps {
  className?: string;
  inputRef: RefObject<HTMLInputElement>;
  onChange: (value: string) => void;
  onSelect: () => void;
  query: string;
  results: SearchResult[];
}

const globalNavigation = [
  { href: "/", label: "Главная" },
  { href: "/docs", label: "Документация" },
  { href: "/dashboard", label: "Обзор" },
  { href: "/agents", label: "Агенты" },
  { href: "/history", label: "Активность" },
  { href: "/market", label: "Рынок" },
] as const;

const sidebarScrollStorageKey = "tradr.docs.sidebar-scroll-top";

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

function DocumentationSearch({ className = "", inputRef, onChange, onSelect, query, results }: DocumentationSearchProps) {
  return (
    <div className={`docs-search-wrap${className ? ` ${className}` : ""}`}>
      <IconSearch aria-hidden="true" />
      <input
        aria-label="Поиск по документации"
        onChange={(event) => onChange(event.target.value)}
        placeholder="Поиск по документации"
        ref={inputRef}
        value={query}
      />
      {query ? (
        <button aria-label="Очистить поиск" onClick={() => onChange("")} type="button"><IconX /></button>
      ) : <kbd>⌘ K</kbd>}
      {query.length >= 2 ? (
        <div className="docs-search-results">
          {results.length ? results.map((result) => {
            const href = result.page.slug === "overview" ? "/docs" : `/docs/${result.page.slug}`;
            return (
              <Link href={href} key={result.page.slug} onClick={onSelect}>
                <IconFile aria-hidden="true" />
                <span>
                  <strong>{result.page.title}</strong>
                  <small>{result.detail}</small>
                </span>
                <IconChevronRight aria-hidden="true" />
              </Link>
            );
          }) : <p>Ничего не найдено. Попробуйте имя файла или модуля.</p>}
        </div>
      ) : null}
    </div>
  );
}

export default function DocsShell({ page }: DocsShellProps) {
  const pathname = usePathname();
  const [query, setQuery] = useState("");
  const [mobileNavigationOpen, setMobileNavigationOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(page.sections[0]?.id ?? "");
  const [pageCopied, setPageCopied] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [channelCopied, setChannelCopied] = useState(false);
  const desktopSearchRef = useRef<HTMLInputElement>(null);
  const mobileSearchRef = useRef<HTMLInputElement>(null);
  const sidebarRef = useRef<HTMLElement>(null);
  const results = useMemo(() => searchDocumentation(query), [query]);
  const adjacent = getAdjacentPages(page);

  const saveSidebarPosition = () => {
    try {
      window.sessionStorage.setItem(sidebarScrollStorageKey, String(sidebarRef.current?.scrollTop ?? 0));
    } catch {
      // Документация остаётся доступной, если браузер запретил sessionStorage.
    }
  };

  useEffect(() => {
    try {
      const savedPosition = Number(window.sessionStorage.getItem(sidebarScrollStorageKey));
      if (!Number.isFinite(savedPosition) || savedPosition <= 0) return;

      const frame = window.requestAnimationFrame(() => {
        if (sidebarRef.current) sidebarRef.current.scrollTop = savedPosition;
      });
      return () => window.cancelAnimationFrame(frame);
    } catch {
      return undefined;
    }
  }, [pathname]);

  useEffect(() => {
    setActiveSection(page.sections[0]?.id ?? "");
    const sections = page.sections
      .map((section) => document.getElementById(section.id))
      .filter((section): section is HTMLElement => Boolean(section));
    if (!sections.length) return;

    const updateActiveSection = () => {
      const marker = 120;
      const active = sections.reduce<HTMLElement>((current, section) => (
        section.getBoundingClientRect().top <= marker ? section : current
      ), sections[0]);
      setActiveSection(active?.id ?? "");
    };

    const frame = window.requestAnimationFrame(updateActiveSection);
    window.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("hashchange", updateActiveSection);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("hashchange", updateActiveSection);
    };
  }, [page]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        if (window.matchMedia("(max-width: 760px)").matches) {
          setMobileSearchOpen(true);
          window.setTimeout(() => mobileSearchRef.current?.focus(), 0);
        } else {
          desktopSearchRef.current?.focus();
        }
      }
      if (event.key === "Escape") {
        setQuery("");
        setMobileNavigationOpen(false);
        setMobileSearchOpen(false);
        setHelpOpen(false);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  const closeSearch = () => {
    setQuery("");
    setMobileSearchOpen(false);
  };

  const openSearch = () => {
    setHelpOpen(false);
    if (window.matchMedia("(max-width: 760px)").matches) {
      setMobileSearchOpen(true);
      window.setTimeout(() => mobileSearchRef.current?.focus(), 0);
      return;
    }
    desktopSearchRef.current?.focus();
  };

  const copyPage = async () => {
    try {
      await navigator.clipboard.writeText(page.kind === "task" ? getCopyableDocText(page) : window.location.href);
      setPageCopied(true);
      window.setTimeout(() => setPageCopied(false), 1800);
    } catch {
      setPageCopied(false);
    }
  };

  const copyTeamChannel = async () => {
    try {
      await navigator.clipboard.writeText("#tradr-dev");
      setChannelCopied(true);
      window.setTimeout(() => setChannelCopied(false), 1800);
    } catch {
      setChannelCopied(false);
    }
  };

  return (
    <div className="tradr-docs">
      <header className="docs-header">
        <div className="docs-primary-bar">
          <div className="docs-brand">
            <Link href="/" aria-label="На главную TRADR"><IconLogo /></Link>
            <div>
              <strong>TRADR Документация</strong>
              <span>Версия {currentRelease.version}</span>
            </div>
          </div>

          <nav className="docs-global-nav" aria-label="Навигация TRADR">
            {globalNavigation.map((item) => (
              <Link className={item.href === "/docs" ? "active" : ""} href={item.href} key={item.href}>{item.label}</Link>
            ))}
          </nav>

          <div className="docs-header-actions">
            <DocumentationSearch inputRef={desktopSearchRef} onChange={setQuery} onSelect={closeSearch} query={query} results={results} />
            <a className="docs-repository-link" href="https://github.com/Hqzdev/tradr" rel="noreferrer" target="_blank">GitHub <IconArrowUpRight /></a>
            <Link className="docs-open-app" href="/market">Открыть TRADR <IconArrowUpRight /></Link>
          </div>

          <div className="docs-mobile-actions">
            <button aria-expanded={mobileSearchOpen} aria-label="Открыть поиск" className="docs-mobile-search-toggle" onClick={() => { setMobileSearchOpen((value) => !value); setMobileNavigationOpen(false); }} type="button"><IconSearch /></button>
            <button
              aria-expanded={mobileNavigationOpen}
              aria-label={mobileNavigationOpen ? "Закрыть содержание" : "Открыть содержание"}
              className="docs-mobile-toggle"
              onClick={() => { setMobileNavigationOpen((value) => !value); setMobileSearchOpen(false); }}
              type="button"
            >
              {mobileNavigationOpen ? <IconX /> : <IconFile />}
            </button>
          </div>
        </div>

        {mobileSearchOpen ? (
          <div className="docs-mobile-search-panel">
            <DocumentationSearch inputRef={mobileSearchRef} onChange={setQuery} onSelect={closeSearch} query={query} results={results} />
          </div>
        ) : null}
      </header>

      <div className="docs-layout">
        <aside
          aria-label="Содержание документации"
          className={`docs-sidebar${mobileNavigationOpen ? " open" : ""}`}
          onScroll={saveSidebarPosition}
          ref={sidebarRef}
        >
          <div className="docs-sidebar-intro">
            <strong>Содержание</strong>
            <span>{docsPages.length} статей · простой язык</span>
          </div>
          {docsGroups.map((group) => (
            <div className={group === "Задачи" ? "docs-nav-group docs-nav-group--tasks" : "docs-nav-group"} key={group}>
              <h2>{group}<span>{docsPages.filter((candidate) => candidate.group === group).length}</span></h2>
              {docsPages.filter((candidate) => candidate.group === group).map((candidate) => {
                const href = candidate.slug === "overview" ? "/docs" : `/docs/${candidate.slug}`;
                const active = pathname === href || (pathname === "/docs/overview" && candidate.slug === "overview");
                return (
                  <Link
                    className={active ? "active" : ""}
                    href={href}
                    key={candidate.slug}
                    onClick={() => { saveSidebarPosition(); setMobileNavigationOpen(false); }}
                  >
                    <span>{String(candidate.order).padStart(2, "0")}</span>
                    {candidate.title}
                  </Link>
                );
              })}
            </div>
          ))}
        </aside>

        {mobileNavigationOpen ? <button aria-label="Закрыть содержание" className="docs-sidebar-scrim" onClick={() => setMobileNavigationOpen(false)} type="button" /> : null}

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

        <aside aria-label="На этой странице" className="docs-toc">
          <strong>На этой странице</strong>
          <nav>
            {page.sections.map((section) => (
              <a
                aria-current={activeSection === section.id ? "location" : undefined}
                className={activeSection === section.id ? "active" : ""}
                href={`#${section.id}`}
                key={section.id}
                onClick={() => setActiveSection(section.id)}
              >
                {section.title}
              </a>
            ))}
          </nav>
          <button className="docs-copy-page" onClick={copyPage} type="button"><IconCopy />{pageCopied ? "Скопировано" : page.kind === "task" ? "Копировать задачу" : "Копировать ссылку"}</button>
        </aside>
      </div>

      <div className={`docs-help${helpOpen ? " open" : ""}`}>
        {helpOpen ? (
          <div className="docs-help-panel" role="dialog" aria-label="Помощь по документации">
            <button aria-label="Закрыть помощь" className="docs-help-close" onClick={() => setHelpOpen(false)} type="button"><IconX /></button>
            <strong>Нужна помощь?</strong>
            <p>Найдите ответ в документации или передайте команде название канала.</p>
            <button onClick={openSearch} type="button"><IconSearch />Найти ответ</button>
            <button className="secondary" onClick={copyTeamChannel} type="button"><IconCopy />{channelCopied ? "Канал скопирован" : "Скопировать #tradr-dev"}</button>
          </div>
        ) : null}
        <button aria-expanded={helpOpen} className="docs-help-trigger" onClick={() => setHelpOpen((value) => !value)} type="button">
          <HugeiconsIcon icon={BubbleChatIcon} strokeWidth={1.8} />Помощь
        </button>
      </div>
    </div>
  );
}

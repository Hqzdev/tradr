"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment } from "react";
import { IconBell, IconHome, IconPlus, IconSearch } from "@/components/icons";
import { getStockProfile } from "@/lib/stocks";

const SETTINGS_LABELS: Record<string, string> = {
  notifications: "Уведомления",
  security: "Безопасность",
  trading: "Торговля",
  data: "Данные",
  display: "Отображение",
  metrics: "Метрики",
};

type Crumb = { label: string; href?: string };

// Purely presentational: the path segments are mapped to readable labels.
function crumbsFor(pathname: string): Crumb[] {
  const parts = pathname.split("/").filter(Boolean);
  const [root, second] = parts;
  switch (root) {
    case "dashboard":
      return [{ label: "Обзор" }];
    case "market":
      return second
        ? [{ label: "Рынок", href: "/market" }, { label: getStockProfile(second)?.ticker ?? second.toUpperCase() }]
        : [{ label: "Рынок" }];
    case "agents":
      if (!second) return [{ label: "Агенты" }];
      if (second === "new") return [{ label: "Агенты", href: "/agents" }, { label: "Новый агент" }];
      if (second === "pro") return [{ label: "Агенты", href: "/agents" }, { label: "Pro-агенты" }];
      return [{ label: "Агенты", href: "/agents" }, { label: "Агент" }];
    case "history":
      return [{ label: "Активность" }];
    case "settings":
      return second
        ? [{ label: "Настройки", href: "/settings" }, { label: SETTINGS_LABELS[second] ?? second }]
        : [{ label: "Настройки" }, { label: "Профиль" }];
    default:
      return [{ label: "TRADR" }];
  }
}

export default function AppHeader() {
  const pathname = usePathname() ?? "/dashboard";
  const crumbs = crumbsFor(pathname);
  const showCreate = !pathname.startsWith("/agents/new") && pathname !== "/agents";

  return (
    <header className="sticky top-0 z-30 border-b border-white/[0.06] bg-[#0a0a0c]/75 backdrop-blur-xl">
      <div className="flex h-[68px] items-center justify-between gap-4 px-4 sm:px-6 lg:h-[76px] lg:px-8">
        <nav aria-label="Навигационная цепочка" className="flex min-w-0 items-center gap-2.5 text-[15px] lg:text-[16px]">
          <Link href="/dashboard" aria-label="Обзор" className="focus-ring grid h-9 w-9 shrink-0 place-items-center rounded-[11px] text-steel transition-colors duration-200 hover:bg-white/[0.05] hover:text-ink">
            <IconHome className="h-[20px] w-[20px]" />
          </Link>
          {crumbs.map((crumb, index) => {
            const last = index === crumbs.length - 1;
            return (
              <Fragment key={`${crumb.label}-${index}`}>
                {index > 0 && <span className="text-fog">/</span>}
                {crumb.href && !last ? (
                  <Link href={crumb.href} className="focus-ring truncate rounded-md text-steel transition-colors duration-200 hover:text-ink">
                    {crumb.label}
                  </Link>
                ) : (
                  <span key={pathname} className={last ? "truncate font-medium text-ink animate-fade-in" : "truncate text-steel"}>
                    {crumb.label}
                  </span>
                )}
              </Fragment>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-2.5">
          <label className="group hidden h-11 w-[280px] items-center gap-2.5 rounded-[12px] border border-white/[0.09] bg-white/[0.025] px-3.5 transition-[border-color,background-color,box-shadow] duration-200 focus-within:border-magenta/60 focus-within:bg-white/[0.04] focus-within:shadow-[0_0_0_4px_rgba(108,92,255,0.12)] hover:border-white/[0.14] md:flex">
            <IconSearch className="h-4 w-4 shrink-0 text-steel transition-colors group-focus-within:text-magenta-deep" />
            <input placeholder="Поиск тикера…" aria-label="Поиск тикера" className="w-full bg-transparent text-[14px] text-ink outline-none placeholder:text-fog" />
            <kbd className="rounded-md border border-white/[0.08] bg-white/[0.04] px-1.5 py-0.5 text-[11px] font-medium text-steel">⌘K</kbd>
          </label>
          <button type="button" aria-label="Уведомления" className="press-98 focus-ring relative grid h-11 w-11 place-items-center rounded-[12px] border border-white/[0.09] bg-white/[0.025] text-steel transition-colors duration-200 hover:border-white/[0.15] hover:text-ink">
            <IconBell className="h-[18px] w-[18px]" />
            <span className="absolute right-[11px] top-[10px] h-[7px] w-[7px] rounded-full bg-magenta ring-2 ring-[#0a0a0c]" />
          </button>
          {showCreate && (
            <Link href="/agents/new" className="q-shine press-98 focus-ring hidden h-11 items-center gap-2 rounded-[12px] bg-magenta px-4 text-[14px] font-semibold text-white shadow-[0_10px_30px_-12px_rgba(108,92,255,0.8)] transition-[background-color,box-shadow] duration-200 hover:bg-[#7a6bff] hover:shadow-[0_14px_34px_-12px_rgba(108,92,255,0.95)] sm:flex">
              <IconPlus className="h-4 w-4" />
              Создать агента
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

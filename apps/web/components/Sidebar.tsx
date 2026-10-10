"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Fragment, useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  ChartLineData01Icon,
  ChevronDownIcon,
  Database01Icon,
  Logout03Icon,
  Notification01Icon,
  PaintBrush01Icon,
  PanelLeftOpenIcon,
  PlusSignIcon,
  Shield01Icon,
  TradeUpIcon,
  UserIcon,
} from "@hugeicons/core-free-icons";
import clsx from "@/lib/clsx";
import { currentRelease } from "@/lib/changelog";
import { currentUser, logout, savedUser, type AuthUser } from "@/lib/api/auth";
import { listAgents, type ApiAgent } from "@/lib/api/agents";
import { stockCatalog, type StockTicker } from "@/lib/stocks";
import NavIcon, { type NavIconName } from "@/components/shell/NavIcon";

// Main nav glyphs are bespoke animated SVGs (components/shell/NavIcon.tsx);
// everything else here is Hugeicons — do not reintroduce lucide-react,
// see CLAUDE.md ("Icon library" section).

type NavItem = { href: string; label: string; icon: NavIconName; tag?: string };

const navGroups: { title: string; items: NavItem[] }[] = [
  {
    title: "Обзор",
    items: [
      { href: "/dashboard", label: "Обзор", icon: "dashboard" },
      { href: "/market", label: "Рынок", icon: "market" },
    ],
  },
  {
    title: "Автоматизация",
    items: [
      { href: "/agents", label: "Агенты", icon: "agents" },
      { href: "/agents/pro", label: "Pro-агенты", icon: "pro", tag: "Beta" },
    ],
  },
  {
    title: "Активность",
    items: [{ href: "/history", label: "Активность", icon: "history" }],
  },
];

// Команды / Журнал / Каталог / Симуляция live outside the /agents URL
// prefix, but they're switcher tabs of the same "agents" area (see
// AgentsSectionNav) — so the sidebar should keep "Агенты" highlighted
// there too, instead of dropping the active state entirely.
const AGENTS_HUB_PREFIXES = ["/agents", "/teams", "/journal", "/catalog"];

// Visual-only for now: there is no favourites model yet, so the block shows a
// fixed set of tickers that link to their market pages.
const FAVORITES: StockTicker[] = ["AAPL", "NVDA", "TSLA", "MSFT"];

const settingsNav = [
  { href: "/settings", label: "Профиль", icon: UserIcon },
  { href: "/settings/notifications", label: "Уведомления", icon: Notification01Icon },
  { href: "/settings/security", label: "Безопасность", icon: Shield01Icon },
  { href: "/settings/trading", label: "Торговля", icon: TradeUpIcon },
  { href: "/settings/data", label: "Данные", icon: Database01Icon },
  { href: "/settings/display", label: "Отображение", icon: PaintBrush01Icon },
  { href: "/settings/metrics", label: "Метрики", icon: ChartLineData01Icon },
];

function isActive(href: string, pathname: string | null): boolean {
  if (!pathname) return false;
  if (href === "/agents") return AGENTS_HUB_PREFIXES.some((prefix) => pathname.startsWith(prefix)) && !pathname.startsWith("/agents/pro");
  return pathname.startsWith(href);
}

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [settingsOpen, setSettingsOpen] = useState(pathname?.startsWith("/settings") ?? false);
  const [collapsed, setCollapsed] = useState(false);
  const [changelogOpen, setChangelogOpen] = useState(false);
  const [favoritesOpen, setFavoritesOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const changelogRef = useRef<HTMLDivElement>(null);
  const [user, setUser] = useState<AuthUser | null>(savedUser());
  const [agents, setAgents] = useState<ApiAgent[]>([]);

  // Sidebar lives in the shared layout, so it never remounts while you move
  // between pages — leaving Settings open plays the same collapse animation
  // as clicking the toggle, instead of just disappearing.
  useEffect(() => {
    const onSettings = pathname?.startsWith("/settings") ?? false;
    setSettingsOpen(onSettings);
    // Make room for the settings sub-menu so it isn't pushed below the fold.
    if (onSettings) setFavoritesOpen(false);
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    currentUser().then(setUser).catch(() => setUser(null));
  }, []);

  useEffect(() => {
    listAgents().then(setAgents).catch(() => setAgents([]));
  }, [pathname]);

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  useEffect(() => {
    if (!changelogOpen) return;
    const onPointerDown = (event: MouseEvent) => {
      if (changelogRef.current && !changelogRef.current.contains(event.target as Node)) {
        setChangelogOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setChangelogOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [changelogOpen]);

  // One persistent highlight that glides to the active item (same rule as
  // segmented controls in CLAUDE.md) instead of each item lighting up alone.
  const navRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const [indicator, setIndicator] = useState<{ top: number; height: number } | null>(null);
  const activeHref = navGroups.flatMap((group) => group.items).find((item) => isActive(item.href, pathname))?.href ?? null;

  const measure = useCallback(() => {
    const el = activeHref ? itemRefs.current[activeHref] : null;
    const root = navRef.current;
    if (!el || !root) return setIndicator(null);
    const a = el.getBoundingClientRect();
    const b = root.getBoundingClientRect();
    setIndicator({ top: a.top - b.top + root.scrollTop, height: a.height });
  }, [activeHref]);

  useLayoutEffect(() => {
    measure();
  }, [measure, collapsed, agents.length, settingsOpen, favoritesOpen]);

  useEffect(() => {
    const root = navRef.current;
    if (!root || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(() => measure());
    observer.observe(root);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [measure]);

  const firstName = user?.displayName?.split(" ")[0];
  const settingsActive = pathname?.startsWith("/settings") ?? false;
  const settingsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!settingsOpen) return;
    const id = window.setTimeout(() => settingsRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" }), 320);
    return () => window.clearTimeout(id);
  }, [settingsOpen]);

  return (
    <aside
      className={clsx(
        "relative z-20 flex w-full shrink-0 flex-col border-b border-white/[0.06] lg:sticky lg:top-0 lg:h-screen lg:border-b-0 lg:border-r",
        "transition-[width] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
        collapsed ? "lg:w-[84px]" : "lg:w-[280px]"
      )}
      style={{
        background:
          "radial-gradient(120% 50% at 0% 0%, rgba(108,92,255,0.16) 0%, rgba(108,92,255,0) 60%), linear-gradient(180deg, #0d0d11 0%, #0a0a0c 100%)",
      }}
    >
      <div className={clsx("flex items-center px-5 pb-4 pt-4 lg:pb-0 lg:pt-6", collapsed ? "flex-col gap-3 px-0" : "gap-3")}>
        <Link href="/dashboard" className="focus-ring flex min-w-0 items-center gap-3 rounded-xl">
          <Image src="/logo.png" alt="TRADR" width={40} height={40} className="h-10 w-10 shrink-0 object-contain transition-transform duration-500 ease-out hover:rotate-[-8deg] hover:scale-105" priority />
          {!collapsed && (
            <span className="min-w-0 animate-fade-in">
              <span className="block text-[16px] font-semibold tracking-[-0.3px] text-ink">TRADR</span>
              <span className="block truncate text-[12px] text-steel">Симулятор торговли</span>
            </span>
          )}
        </Link>
        {!collapsed && <span className="flex-1" />}
        <button
          type="button"
          onClick={() => setMobileOpen((open) => !open)}
          aria-expanded={mobileOpen}
          aria-label={mobileOpen ? "Закрыть меню" : "Открыть меню"}
          className="press-98 focus-ring grid h-10 w-10 shrink-0 place-items-center rounded-[11px] border border-white/[0.1] bg-white/[0.03] text-ink lg:hidden"
        >
          <span className="relative block h-3 w-4">
            <span className={clsx("absolute left-0 h-[1.5px] w-4 rounded bg-current transition-transform duration-300", mobileOpen ? "top-[5px] rotate-45" : "top-0")} />
            <span className={clsx("absolute left-0 top-[5px] h-[1.5px] w-4 rounded bg-current transition-opacity duration-200", mobileOpen && "opacity-0")} />
            <span className={clsx("absolute left-0 h-[1.5px] w-4 rounded bg-current transition-transform duration-300", mobileOpen ? "top-[5px] -rotate-45" : "top-[10px]")} />
          </span>
        </button>
        <button
          type="button"
          onClick={() => setCollapsed((c) => !c)}
          aria-label={collapsed ? "Развернуть сайдбар" : "Свернуть сайдбар"}
          className="press-98 focus-ring hidden h-9 w-9 shrink-0 place-items-center rounded-[11px] border border-white/[0.1] bg-white/[0.03] text-steel transition-colors duration-200 hover:border-white/[0.18] hover:text-ink lg:grid"
        >
          <HugeiconsIcon icon={collapsed ? PanelLeftOpenIcon : ArrowLeft01Icon} className="h-4 w-4" strokeWidth={2} />
        </button>
      </div>

      <div className={clsx("flex-1 flex-col overflow-hidden lg:flex", mobileOpen ? "flex animate-slide-down-fade pb-2" : "hidden")}>
      {!collapsed && (
        <div className="mx-5 mt-5 animate-fade-in border-y border-white/[0.06] py-4">
          <p className="truncate text-[18px] font-semibold tracking-[-0.3px] text-ink">
            С возвращением{firstName ? `, ${firstName}` : ""}
          </p>
          <p className="mt-1 truncate text-[12.5px] text-steel">{user?.email ?? "Учебный счёт · демо-деньги"}</p>
        </div>
      )}

      <div ref={navRef} className={clsx("relative mt-2 flex-1 overflow-y-auto overflow-x-hidden pb-3", collapsed ? "px-3" : "px-5")}>
        <span
          aria-hidden
          className="q-nav-indicator pointer-events-none absolute left-0 right-0 rounded-[12px] border border-white/[0.1]"
          style={{
            marginInline: collapsed ? 12 : 20,
            transform: `translateY(${indicator?.top ?? 0}px)`,
            height: indicator?.height ?? 0,
            opacity: indicator ? 1 : 0,
            background: "linear-gradient(90deg, rgba(255,255,255,0.075) 0%, rgba(255,255,255,0.015) 100%)",
          }}
        >
          {!collapsed && <span className="absolute right-3 top-1/2 h-4 w-[2px] -translate-y-1/2 rounded-full bg-ink" />}
        </span>

        {navGroups.map((group) => (
          <div key={group.title} className="relative">
            {!collapsed ? (
              <p className="px-1 pb-1.5 pt-4 text-[12.5px] text-steel">{group.title}</p>
            ) : (
              <div className="mx-auto my-3 h-px w-6 bg-white/[0.08]" />
            )}
            <div className="flex flex-col gap-0.5">
              {group.items.map(({ href, label, icon, tag }) => {
                const active = href === activeHref;
                return (
                  <Fragment key={href}>
                    <Link
                      href={href}
                      ref={(el) => {
                        itemRefs.current[href] = el;
                      }}
                      title={collapsed ? label : undefined}
                      aria-current={active ? "page" : undefined}
                      className={clsx(
                        "press-98 focus-ring group relative flex h-[44px] items-center gap-3.5 rounded-[12px] text-[15px] transition-colors duration-200",
                        collapsed ? "justify-center" : "px-3.5",
                        active ? "font-medium text-ink" : "text-[#c9c9d1] hover:bg-white/[0.035] hover:text-ink"
                      )}
                    >
                      <NavIcon
                        name={icon}
                        active={active}
                        className={clsx("h-[22px] w-[22px] shrink-0 transition-colors duration-200", active ? "text-ink" : "text-steel group-hover:text-ink")}
                      />
                      {!collapsed && <span className="flex-1 truncate">{label}</span>}
                      {!collapsed && tag && (
                        <span className="rounded-md bg-magenta/20 px-2 py-[3px] text-[11.5px] font-medium text-magenta-deep">{tag}</span>
                      )}
                      {!collapsed && href === "/agents" && agents.length > 0 && (
                        <span className={clsx("flex h-[22px] min-w-[22px] items-center justify-center rounded-md bg-white/[0.07] px-1.5 text-[12px] font-medium text-ink", active && "mr-4")}>
                          {agents.length}
                        </span>
                      )}
                    </Link>
                    {href === "/agents" && !collapsed && agents.length > 0 && (
                      <div className="mb-1 ml-[25px] mt-1 flex flex-col gap-0.5 border-l border-white/[0.08] pl-4">
                        {agents.map((agent) => (
                          <Link
                            key={agent.id}
                            href={`/agents/${agent.id}`}
                            className={clsx(
                              "flex items-center gap-2 truncate py-1.5 text-[12.5px] transition-colors duration-200",
                              pathname === `/agents/${agent.id}` ? "font-medium text-ink" : "text-steel hover:text-ink"
                            )}
                          >
                            <span className={clsx("h-1.5 w-1.5 shrink-0 rounded-full", agent.status === "active" ? "bg-positive" : "bg-fog")} />
                            <span className="truncate">{agent.name}</span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </Fragment>
                );
              })}
            </div>
          </div>
        ))}

        {!collapsed && (
          <div className="relative mt-3">
            <div className="flex h-9 items-center gap-2 px-1">
              <button
                type="button"
                onClick={() => setFavoritesOpen((open) => !open)}
                aria-expanded={favoritesOpen}
                className="focus-ring flex flex-1 items-center gap-2.5 rounded-lg text-[14.5px] text-[#c9c9d1] transition-colors hover:text-ink"
              >
                <HugeiconsIcon icon={ChevronDownIcon} className={clsx("h-4 w-4 text-steel transition-transform duration-300", !favoritesOpen && "-rotate-90")} strokeWidth={2} />
                Избранное
              </button>
              <Link href="/market" aria-label="Добавить в избранное" className="focus-ring grid h-7 w-7 place-items-center rounded-lg text-fog transition-colors hover:bg-white/[0.05] hover:text-ink">
                <HugeiconsIcon icon={PlusSignIcon} className="h-4 w-4" strokeWidth={2} />
              </Link>
            </div>
            <div className={clsx("grid transition-[grid-template-rows,opacity] duration-300 ease-out", favoritesOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")}>
              <div className="min-h-0 overflow-hidden">
                {FAVORITES.map((ticker, index) => {
                  const stock = stockCatalog[ticker];
                  return (
                    <Link
                      key={ticker}
                      href={`/market/${ticker}`}
                      className={clsx(
                        "group flex h-9 items-center gap-3 rounded-[10px] px-2.5 transition-colors duration-200 hover:bg-white/[0.035]",
                        pathname === `/market/${ticker}` && "bg-white/[0.04]"
                      )}
                      style={{ transitionDelay: favoritesOpen ? `${index * 30}ms` : "0ms" }}
                    >
                      <span className="grid h-5 w-5 shrink-0 place-items-center overflow-hidden rounded-[6px]" style={{ background: stock.color }}>
                        <Image src={stock.logoSrc} alt="" width={20} height={20} unoptimized className="h-[62%] w-[62%] object-contain" />
                      </span>
                      <span className="truncate text-[14px] text-[#c9c9d1] transition-colors group-hover:text-ink">{stock.name.split(/[ ,]/)[0]}</span>
                      <span className="flex-1 truncate text-[12px] text-fog">{ticker}</span>
                      <svg viewBox="0 0 24 24" className="q-star h-[15px] w-[15px] shrink-0" aria-hidden>
                        <path d="M12 2.5l2.83 5.73 6.32.92-4.57 4.46 1.08 6.3L12 16.93l-5.66 2.98 1.08-6.3L2.85 9.15l6.32-.92z" fill="#F5A524" stroke="#F5A524" strokeWidth="2" strokeLinejoin="round" />
                      </svg>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        <div ref={settingsRef} className="mt-3 border-t border-white/[0.06] pt-3">
          <button
            type="button"
            aria-expanded={settingsOpen}
            onClick={() => setSettingsOpen((open) => !open)}
            title={collapsed ? "Настройки" : undefined}
            className={clsx(
              "press-98 focus-ring group flex h-[44px] w-full items-center gap-3.5 rounded-[12px] text-[15px] transition-colors duration-200",
              collapsed ? "justify-center" : "px-3.5",
              settingsActive || settingsOpen ? "bg-white/[0.05] font-medium text-ink" : "text-[#c9c9d1] hover:bg-white/[0.035] hover:text-ink"
            )}
          >
            <NavIcon name="settings" active={settingsActive} open={settingsOpen} className={clsx("h-[22px] w-[22px] shrink-0 transition-colors duration-200", settingsOpen ? "text-ink" : "text-steel group-hover:text-ink")} />
            {!collapsed && <span className="flex-1 text-left">Настройки</span>}
            {!collapsed && <HugeiconsIcon icon={ChevronDownIcon} className={clsx("h-4 w-4 text-steel transition-transform duration-300", settingsOpen && "rotate-180")} strokeWidth={2} />}
          </button>

          {!collapsed && (
            <div
              className={clsx(
                "grid overflow-hidden transition-[grid-template-rows,opacity,margin] duration-300 ease-out",
                settingsOpen ? "mt-1 grid-rows-[1fr] opacity-100" : "mt-0 grid-rows-[0fr] opacity-0 pointer-events-none"
              )}
            >
              <nav className="min-h-0 space-y-0.5 pl-3" aria-label="Разделы настроек">
                {settingsNav.map(({ href, label, icon }) => {
                  const active = href === "/settings" ? pathname === "/settings" : pathname?.startsWith(href);
                  return (
                    <Link
                      key={href}
                      href={href}
                      className={clsx(
                        "press-98 focus-ring flex h-9 items-center gap-2.5 rounded-[10px] px-3 text-[13px] transition-colors duration-200",
                        active ? "bg-magenta/15 font-medium text-magenta-deep" : "text-steel hover:bg-white/[0.035] hover:text-ink"
                      )}
                    >
                      <HugeiconsIcon icon={icon} className="h-4 w-4 shrink-0" strokeWidth={1.8} />
                      <span>{label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          )}
        </div>
      </div>

      <div className={clsx("space-y-3 pb-5 pt-3", collapsed ? "px-3" : "px-5")}>
        {!collapsed && (
          <div ref={changelogRef} className="relative">
            <button
              type="button"
              onClick={() => setChangelogOpen((o) => !o)}
              aria-expanded={changelogOpen}
              className="press-98 focus-ring flex w-full items-center justify-between gap-2 rounded-[12px] border border-white/[0.07] bg-white/[0.02] px-3 py-2 text-[12px] text-steel transition-colors duration-200 hover:border-white/[0.14]"
            >
              <span className="flex items-center gap-2">
                <span className="font-medium text-ink">TRADR {currentRelease.version}</span>
                <span className="rounded-md bg-magenta/20 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-magenta-deep">Beta</span>
              </span>
              <HugeiconsIcon icon={ChevronDownIcon} className={clsx("h-3.5 w-3.5 shrink-0 transition-transform duration-200", changelogOpen && "rotate-180")} strokeWidth={2} />
            </button>

            {changelogOpen && (
              <div role="dialog" aria-label="Что нового" className="animate-scale-in absolute bottom-full left-0 z-30 mb-2 w-[300px] origin-bottom-left rounded-[18px] border border-white/[0.1] bg-[#16161b] p-4 shadow-elevated">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-[13px] font-semibold text-ink">Что нового · {currentRelease.label}</p>
                  <span className="shrink-0 text-[11px] text-steel">{currentRelease.date}</span>
                </div>
                <ul className="mt-3 space-y-2">
                  {currentRelease.changes.map((change) => (
                    <li key={change} className="flex items-start gap-2 text-[12px] leading-snug text-steel">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-magenta" />
                      <span>{change}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        <AccountCard collapsed={collapsed} user={user} onLogout={handleLogout} />
      </div>
      </div>
    </aside>
  );
}

function AccountCard({ collapsed, user, onLogout }: { collapsed: boolean; user: AuthUser | null; onLogout: () => void }): ReactNode {
  const initial = user?.displayName.slice(0, 1).toUpperCase() ?? "?";
  if (collapsed) {
    return (
      <button type="button" onClick={onLogout} title="Выйти" className="press-98 focus-ring mx-auto grid h-11 w-11 place-items-center rounded-full border border-white/[0.12] bg-[#18181d] text-[14px] font-semibold text-ink transition-colors hover:border-negative/50">
        {initial}
      </button>
    );
  }
  return (
    <div className="flex items-center gap-3 rounded-[14px] border border-white/[0.07] bg-white/[0.03] p-3">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/[0.12] bg-[#18181d] text-[13px] font-semibold text-ink">{initial}</span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[14px] font-medium text-ink">{user?.displayName ?? "Аккаунт"}</span>
        <span className="block truncate text-[12px] text-steel">{user?.email ?? ""}</span>
      </span>
      <button type="button" onClick={onLogout} aria-label="Выйти" title="Выйти" className="press-98 focus-ring grid h-8 w-8 shrink-0 place-items-center rounded-lg text-steel transition-colors hover:bg-negative/10 hover:text-negative">
        <HugeiconsIcon icon={Logout03Icon} className="h-4 w-4" strokeWidth={1.8} />
      </button>
    </div>
  );
}

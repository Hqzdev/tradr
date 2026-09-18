"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ChartCandlestickIcon,
  ChartLineData01Icon,
  ChevronDownIcon,
  Database01Icon,
  LayoutDashboardIcon,
  Notification01Icon,
  PanelLeftCloseIcon,
  PanelLeftOpenIcon,
  PaintBrush01Icon,
  Robot01Icon,
  Settings02Icon,
  Shield01Icon,
  TradeUpIcon,
  UserIcon,
  Wallet01Icon,
} from "@hugeicons/core-free-icons";
import clsx from "@/lib/clsx";
import { currentRelease } from "@/lib/changelog";

// Sidebar icons come from Hugeicons (@hugeicons/react +
// @hugeicons/core-free-icons) — do not reintroduce lucide-react here,
// see CLAUDE.md ("Icon library" section).

const NAV_ITEM_BASE =
  "press-98 focus-ring relative flex h-[42px] w-full items-center gap-3 rounded-[14px] px-3 text-[14px] tracking-[-0.28px] transition-[background-color,color,transform] duration-150 ease-out active:duration-80 active:scale-[0.98]";

const primaryNav = [
  { href: "/market", label: "Рынок", icon: LayoutDashboardIcon },
  { href: "/terminal", label: "Терминал", icon: ChartCandlestickIcon },
  { href: "/portfolio", label: "Портфель", icon: Wallet01Icon },
  { href: "/agents", label: "Агенты", icon: Robot01Icon, badge: "3" },
];

// Команды / Журнал / Каталог / Симуляция live outside the /agents URL
// prefix, but they're switcher tabs of the same "agents" area (see
// AgentsSectionNav) — so the sidebar should keep "Агенты" highlighted
// there too, instead of dropping the active state entirely.
const AGENTS_HUB_PREFIXES = ["/agents", "/teams", "/journal", "/catalog", "/simulation"];

const settingsNav = [
  { href: "/settings", label: "Профиль", icon: UserIcon },
  { href: "/settings/notifications", label: "Уведомления", icon: Notification01Icon },
  { href: "/settings/security", label: "Безопасность", icon: Shield01Icon },
  { href: "/settings/trading", label: "Торговля", icon: TradeUpIcon },
  { href: "/settings/data", label: "Данные", icon: Database01Icon },
  { href: "/settings/display", label: "Отображение", icon: PaintBrush01Icon },
  { href: "/settings/metrics", label: "Метрики", icon: ChartLineData01Icon },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [settingsOpen, setSettingsOpen] = useState(pathname?.startsWith("/settings") ?? false);
  const [collapsed, setCollapsed] = useState(false);
  const [changelogOpen, setChangelogOpen] = useState(false);
  const changelogRef = useRef<HTMLDivElement>(null);

  // Sidebar lives in the shared layout, so it never remounts while you move
  // between pages — that's exactly why leaving Settings open used to look
  // like it "snapped shut" the moment you clicked Market/Terminal/etc: this
  // is a live state change on an already-mounted panel, so it can actually
  // play the same collapse animation as clicking the toggle button, instead
  // of just disappearing. Landing on /settings from anywhere else now opens
  // it the same way.
  useEffect(() => {
    setSettingsOpen(pathname?.startsWith("/settings") ?? false);
  }, [pathname]);

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

  return (
    <aside
      className={clsx(
        "flex shrink-0 flex-col gap-4 rounded-[28px] border border-[#EDE8EF] bg-white p-3 transition-[width] duration-200 ease-out",
        collapsed ? "w-[76px]" : "w-48",
        settingsOpen ? "animate-sidebar-expand" : "animate-sidebar-collapse"
      )}
      style={{ boxShadow: "0px 4px 20px rgba(37,17,41,0.04)" }}
    >
      <div className={clsx("flex items-center", collapsed ? "flex-col gap-2 py-1" : "h-11 gap-2.5 px-2.5")}>
        <Image src="/logo.png" alt="TRADR" width={40} height={40} className="shrink-0" />
        {!collapsed && (
          <>
            <span className="text-[15px] font-semibold tracking-[-0.3px] text-ink">TRADR</span>
            <span className="flex-1" />
          </>
        )}
        <button
          type="button"
          onClick={() => setCollapsed((c) => !c)}
          aria-label={collapsed ? "Развернуть сайдбар" : "Свернуть сайдбар"}
          className="press-98 focus-ring flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] text-[#9C929F] transition-colors duration-150 hover:bg-[#F6F6F9] hover:text-ink"
        >
          <HugeiconsIcon
            icon={collapsed ? PanelLeftOpenIcon : PanelLeftCloseIcon}
            className="h-[18px] w-[18px]"
            strokeWidth={2}
          />
        </button>
      </div>

      <nav className="flex flex-col gap-1.5">
        {primaryNav.map(({ href, label, icon, badge }) => {
          const active =
            href === "/agents"
              ? AGENTS_HUB_PREFIXES.some((prefix) => pathname?.startsWith(prefix))
              : pathname?.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              title={collapsed ? label : undefined}
              className={clsx(
                NAV_ITEM_BASE,
                collapsed && "justify-center px-0",
                active
                  ? "bg-[#FCE7F6] font-medium text-[#B51686]"
                  : "font-normal text-[#57535D] hover:bg-[#F6F6F9]"
              )}
            >
              <HugeiconsIcon
                icon={icon}
                className="h-[18px] w-[18px] shrink-0"
                strokeWidth={2}
                color={active ? "#B51686" : "#727078"}
              />
              {!collapsed && <span className="flex-1">{label}</span>}
              {!collapsed && badge && (
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-[#FCE7F6] text-[11px] font-medium tracking-[-0.22px] text-[#B51686]">
                  {badge}
                </span>
              )}
              {collapsed && badge && (
                <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-magenta" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="h-px w-full bg-[#F0ECF1]" />

      <button
        type="button"
        aria-expanded={settingsOpen}
        onClick={() => setSettingsOpen((open) => !open)}
        title={collapsed ? "Настройки" : undefined}
        className={clsx(
          NAV_ITEM_BASE,
          collapsed && "justify-center px-0",
          pathname?.startsWith("/settings") || settingsOpen
            ? "bg-[#FCE7F6] font-medium text-[#B51686]"
            : clsx(!collapsed && "h-10", "font-normal text-[#57535D] hover:bg-[#F6F6F9]")
        )}
      >
        <HugeiconsIcon
          icon={Settings02Icon}
          className="h-[18px] w-[18px] shrink-0"
          strokeWidth={2}
          color={pathname?.startsWith("/settings") || settingsOpen ? "#B51686" : "#727078"}
        />
        {!collapsed && <span className="flex-1">Настройки</span>}
      </button>

      {!collapsed && (
        <div
          className={clsx(
            "grid overflow-hidden transition-[grid-template-rows,opacity,margin] duration-300 ease-out",
            settingsOpen ? "my-0 grid-rows-[1fr] opacity-100" : "-my-2 grid-rows-[0fr] opacity-0 pointer-events-none"
          )}
        >
          <nav className="min-h-0 space-y-1 px-1" aria-label="Разделы настроек">
            {settingsNav.map(({ href, label, icon }) => {
              const active = href === "/settings" ? pathname === "/settings" : pathname?.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={clsx(
                    "press-98 focus-ring flex h-9 items-center gap-2 rounded-[11px] px-2 text-[12px] transition-colors duration-150",
                    active ? "bg-[#FFF0FA] font-medium text-[#C42B98]" : "text-[#77717B] hover:bg-[#F6F6F9] hover:text-ink"
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

      {!collapsed && (
        <div ref={changelogRef} className="relative">
          <button
            type="button"
            onClick={() => setChangelogOpen((o) => !o)}
            aria-expanded={changelogOpen}
            className="press-98 focus-ring flex w-full items-center justify-between gap-2 rounded-xl border border-bone bg-[#FAFAFA] px-2.5 py-2 text-[11px] text-steel transition-colors duration-150 hover:border-fog/60"
          >
            <span className="flex items-center gap-1.5">
              <span className="font-medium text-ink">TRADR {currentRelease.version}</span>
              <span className="rounded-full bg-magenta-tint px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-magenta-deep">
                Beta
              </span>
            </span>
            <HugeiconsIcon
              icon={ChevronDownIcon}
              className={clsx("h-3 w-3 shrink-0 transition-transform duration-150", changelogOpen && "rotate-180")}
              strokeWidth={2}
            />
          </button>

          {changelogOpen && (
            <div
              role="dialog"
              aria-label="Что нового"
              className="animate-scale-in absolute left-0 top-full z-30 mt-2 w-72 rounded-card border border-bone bg-white p-3 shadow-elevated"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-[12px] font-[535] text-ink">Что нового · {currentRelease.label}</p>
                <span className="shrink-0 text-[10px] text-steel">{currentRelease.date}</span>
              </div>
              <ul className="mt-2.5 space-y-2">
                {currentRelease.changes.map((change) => (
                  <li key={change} className="flex items-start gap-2 text-[11px] leading-snug text-steel">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-magenta" />
                    <span>{change}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      <div
        className={clsx(
          "flex h-[52px] items-center gap-2.5 rounded-2xl bg-[#F7F5F8] p-2",
          collapsed && "justify-center",
          settingsOpen ? "animate-profile-drop" : "animate-profile-lift"
        )}
      >
        <div className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full bg-[#EBE5EF] text-[13px] font-medium text-[#6E5C76]">
          Я
        </div>
        {!collapsed && (
          <div className="flex min-w-0 flex-col gap-0.5">
            <p className="truncate text-[12px] text-ink">Ярослав</p>
            <p className="truncate text-[10px] text-[#817A87]">Демо-счёт</p>
          </div>
        )}
      </div>
    </aside>
  );
}

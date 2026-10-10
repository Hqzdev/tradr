"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ComponentType, type SVGProps } from "react";
import {
  IconActivity,
  IconAgents,
  IconArrowUpRight,
  IconBell,
  IconCandles,
  IconCrown,
  IconHome,
  IconLogo,
  IconLogout,
  IconSettings,
  IconSparkles,
  IconX,
} from "@/components/icons";
import { logout, savedUser } from "@/lib/api/auth";
import clsx from "@/lib/clsx";

type Icon = ComponentType<SVGProps<SVGSVGElement>>;

const TABS: { href: string; label: string; icon: Icon; match: (path: string) => boolean }[] = [
  { href: "/dashboard", label: "Обзор", icon: IconHome, match: (p) => p.startsWith("/dashboard") },
  { href: "/market", label: "Рынок", icon: IconCandles, match: (p) => p.startsWith("/market") },
  { href: "/agents", label: "Агенты", icon: IconAgents, match: (p) => p.startsWith("/agents") && !p.startsWith("/agents/new") },
  { href: "/history", label: "История", icon: IconActivity, match: (p) => p.startsWith("/history") },
];

const MENU: { href: string; label: string; icon: Icon; badge?: string }[] = [
  { href: "/dashboard", label: "Обзор", icon: IconHome },
  { href: "/market", label: "Рынок", icon: IconCandles },
  { href: "/agents", label: "Агенты", icon: IconAgents },
  { href: "/agents/new", label: "Новый агент", icon: IconSparkles, badge: "ИИ" },
  { href: "/agents/pro", label: "Pro-агенты", icon: IconCrown, badge: "Beta" },
  { href: "/history", label: "История", icon: IconActivity },
  { href: "/settings", label: "Настройки", icon: IconSettings },
];

// Top bar + menu sheet for screens below `lg`. The desktop sidebar, header and
// ticker strip are hidden there (see app/(app)/layout.tsx).
export function MobileTopBar() {
  const pathname = usePathname() ?? "";
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <header className="m-ui sticky top-0 z-40 border-b border-white/[0.07] bg-[#0A0A0D]/90 backdrop-blur-xl lg:hidden">
        <div className="flex h-[60px] items-center justify-between px-5">
          <Link href="/dashboard" className="focus-ring flex items-center gap-2 rounded-lg" aria-label="TRADR — обзор">
            <IconLogo className="h-7 w-7" />
            <span className="text-[20px] font-extrabold tracking-[-0.03em] text-[#F4F4F6]">tradr</span>
          </Link>
          <div className="flex items-center gap-2">
            <button type="button" aria-label="Уведомления" className="press-98 focus-ring relative grid h-9 w-9 place-items-center rounded-full bg-[#212128] text-[#F4F4F6]">
              <IconBell className="h-[18px] w-[18px]" />
              <span className="absolute right-[8px] top-[7px] h-[7px] w-[7px] rounded-full bg-[#6C5CFF] ring-2 ring-[#212128]" />
            </button>
            <button
              type="button"
              aria-label={open ? "Закрыть меню" : "Открыть меню"}
              aria-expanded={open}
              onClick={() => setOpen((value) => !value)}
              className="press-98 focus-ring grid h-9 w-9 place-items-center rounded-full bg-[#212128] text-[#F4F4F6]"
            >
              {open ? (
                <IconX className="h-[18px] w-[18px]" />
              ) : (
                <span className="relative block h-[10px] w-4" aria-hidden>
                  <span className="absolute left-0 top-0 h-[1.75px] w-4 rounded bg-current" />
                  <span className="absolute bottom-0 left-0 h-[1.75px] w-4 rounded bg-current" />
                </span>
              )}
            </button>
          </div>
        </div>
      </header>
      {open && <MobileMenu pathname={pathname} />}
    </>
  );
}

function MobileMenu({ pathname }: { pathname: string }) {
  const router = useRouter();
  const user = savedUser();
  const name = user?.displayName || "Профиль";

  const signOut = async () => {
    await logout().catch(() => undefined);
    router.replace("/login");
  };

  return (
    <div className="m-ui fixed inset-x-0 bottom-0 top-[60px] z-40 animate-fade-in overflow-y-auto bg-[#0A0A0D] lg:hidden" style={{ background: "radial-gradient(120% 60% at 100% 100%, rgba(108,92,255,0.25) 0%, rgba(108,92,255,0) 70%), #0A0A0D" }}>
      <nav aria-label="Разделы" className="px-5 pb-10 pt-5">
        <ul>
          {MENU.map(({ href, label, icon: Icon, badge }) => {
            const active = href === "/agents" ? pathname === "/agents" || /^\/agents\/(?!new|pro)/.test(pathname) : pathname.startsWith(href);
            return (
              <li key={href}>
                <Link href={href} className="focus-ring flex items-center gap-3.5 border-b border-white/[0.07] py-3.5">
                  <Icon className={clsx("h-[22px] w-[22px]", active ? "text-[#B3A9FF]" : "text-[#8C8C97]")} />
                  <span className={clsx("flex-1 text-[22px] font-bold tracking-[-0.02em]", active ? "text-[#F4F4F6]" : "text-[#D0D0D6]")}>{label}</span>
                  {badge ? (
                    <span className="rounded-full bg-[#6C5CFF] px-2.5 py-1 text-[11px] font-extrabold text-white">{badge}</span>
                  ) : (
                    <IconArrowUpRight className="h-[18px] w-[18px] text-[#5C5C66]" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
        <div className="mt-6 flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-[#6C5CFF] text-[16px] font-extrabold text-white">{name.slice(0, 1).toUpperCase()}</span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[14px] font-bold text-[#F4F4F6]">{name}</p>
            {user?.email && <p className="truncate text-[12px] font-semibold text-[#8C8C97]">{user.email}</p>}
          </div>
          <button type="button" onClick={signOut} aria-label="Выйти" className="press-98 focus-ring grid h-10 w-10 place-items-center rounded-full bg-[#212128] text-[#8C8C97]">
            <IconLogout className="h-[18px] w-[18px]" />
          </button>
        </div>
      </nav>
    </div>
  );
}

export function MobileTabBar() {
  const pathname = usePathname() ?? "";
  const left = TABS.slice(0, 2);
  const right = TABS.slice(2);

  const tab = ({ href, label, icon: Icon, match }: (typeof TABS)[number]) => {
    const active = match(pathname);
    return (
      <Link key={href} href={href} aria-current={active ? "page" : undefined} className="focus-ring flex w-16 flex-col items-center gap-1 rounded-xl py-0.5">
        <Icon className={clsx("h-[22px] w-[22px] transition-colors duration-200", active ? "text-[#F4F4F6]" : "text-[#5C5C66]")} />
        <span className={clsx("text-[10px] font-semibold transition-colors duration-200", active ? "text-[#F4F4F6]" : "text-[#5C5C66]")}>{label}</span>
      </Link>
    );
  };

  return (
    <nav
      aria-label="Основная навигация"
      className="m-ui fixed inset-x-0 bottom-0 z-40 border-t border-white/[0.07] bg-[#111115]/95 px-3.5 pt-2.5 backdrop-blur-xl lg:hidden"
      style={{ paddingBottom: "max(10px, env(safe-area-inset-bottom))" }}
    >
      <div className="mx-auto flex max-w-[480px] items-center justify-between">
        {left.map(tab)}
        <div className="flex w-16 justify-center">
          <Link
            href="/agents/new"
            aria-label="Создать агента"
            className={clsx(
              "press-98 focus-ring grid h-12 w-12 place-items-center rounded-full bg-[#6C5CFF] text-white shadow-[0_6px_20px_rgba(108,92,255,0.45)] transition-transform",
              pathname.startsWith("/agents/new") && "ring-2 ring-white/70"
            )}
          >
            <IconSparkles className="h-[22px] w-[22px]" />
          </Link>
        </div>
        {right.map(tab)}
      </div>
    </nav>
  );
}

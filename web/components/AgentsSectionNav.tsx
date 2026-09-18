"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

const sectionLinks = [
  { href: "/agents", label: "Агенты" },
  { href: "/agents/compare", label: "Сравнение" },
  { href: "/agents/ranking", label: "Рейтинг" },
  { href: "/teams", label: "Команды" },
  { href: "/journal", label: "Журнал" },
  { href: "/catalog", label: "Каталог" },
  { href: "/simulation/new", label: "Симуляция" },
];

// Rendered once from the app-wide layout (not per-screen) so this component
// never unmounts when navigating between its own tabs — that's what lets
// the pill actually glide from one tab to the next instead of resetting.
// It hides itself on any page outside this set of tabs.
export default function AgentsSectionNav() {
  const pathname = usePathname();
  const navRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const activeIndex = sectionLinks.findIndex((link) => pathname === link.href);
  const [pillStyle, setPillStyle] = useState<{ left: number; width: number } | null>(null);
  const [animated, setAnimated] = useState(false);

  useLayoutEffect(() => {
    const measure = () => {
      const el = activeIndex >= 0 ? navRefs.current[activeIndex] : null;
      setPillStyle(el ? { left: el.offsetLeft, width: el.offsetWidth } : null);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [activeIndex]);

  useEffect(() => {
    const id = requestAnimationFrame(() => setAnimated(true));
    return () => cancelAnimationFrame(id);
  }, []);

  if (activeIndex === -1) return null;

  return (
    <div className="relative mb-6 inline-flex items-center gap-1 rounded-pill bg-bone p-1">
      <span
        aria-hidden
        className={`absolute inset-y-1 left-0 z-0 rounded-pill bg-white shadow-soft ${
          animated ? "transition-all duration-300 ease-out" : ""
        }`}
        style={{
          width: pillStyle ? `${pillStyle.width}px` : 0,
          transform: `translateX(${pillStyle ? pillStyle.left : 0}px)`,
          opacity: pillStyle ? 1 : 0,
        }}
      />
      {sectionLinks.map((link, index) => (
        <Link
          key={link.href}
          href={link.href}
          ref={(el) => {
            navRefs.current[index] = el;
          }}
          className={`press-98 focus-ring relative z-10 rounded-pill px-3.5 py-2 text-body-sm transition-colors duration-200 ${
            activeIndex === index ? "text-ink" : "text-steel hover:text-ink"
          }`}
        >
          {link.label}
        </Link>
      ))}
    </div>
  );
}

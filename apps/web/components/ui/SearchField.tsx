"use client";

import { IconSearch } from "@/components/icons";

export default function SearchField({
  placeholder,
  shortcut,
  value,
  onChange,
}: {
  placeholder: string;
  shortcut?: string;
  value?: string;
  onChange?: (value: string) => void;
}) {
  return (
    <label className="flex h-11 w-full max-w-xs items-center gap-2.5 rounded-[12px] border border-white/[0.1] bg-white/[0.03] px-3.5 transition-all duration-200 focus-within:border-magenta/70 focus-within:shadow-[0_0_0_4px_rgba(108,92,255,0.12)]">
      <IconSearch className="h-4 w-4 shrink-0 text-steel" />
      <input
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent text-body-sm text-ink placeholder:text-fog outline-none"
      />
      {shortcut && (
        <kbd className="rounded-md border border-white/[0.08] bg-white/[0.04] px-1.5 py-0.5 text-[11px] text-steel">
          {shortcut}
        </kbd>
      )}
    </label>
  );
}

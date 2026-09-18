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
    <label className="focus-within:ring-2 focus-within:ring-magenta-ring flex h-10 w-full max-w-xs items-center gap-2 rounded-pill border border-bone bg-white px-3.5 transition-all duration-150">
      <IconSearch className="h-4 w-4 shrink-0 text-steel" />
      <input
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent text-body-sm text-ink placeholder:text-fog outline-none"
      />
      {shortcut && (
        <kbd className="rounded-md border border-bone bg-[#fafafa] px-1.5 py-0.5 text-[11px] text-fog">
          {shortcut}
        </kbd>
      )}
    </label>
  );
}

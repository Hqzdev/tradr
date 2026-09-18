type ClassValue = string | number | boolean | null | undefined;

export default function clsx(...values: ClassValue[]): string {
  return values.filter(Boolean).join(" ");
}

const DEFAULT_AUTH_DESTINATION = "/market";

export function safeNextPath(value?: string | string[] | null): string {
  const candidate = Array.isArray(value) ? value[0] : value;
  if (!candidate || !candidate.startsWith("/") || candidate.startsWith("//")) {
    return DEFAULT_AUTH_DESTINATION;
  }

  try {
    const parsed = new URL(candidate, "https://tradr.local");
    return parsed.origin === "https://tradr.local"
      ? `${parsed.pathname}${parsed.search}${parsed.hash}`
      : DEFAULT_AUTH_DESTINATION;
  } catch {
    return DEFAULT_AUTH_DESTINATION;
  }
}

export function authPath(pathname: "/login" | "/register", nextPath: string): string {
  return `${pathname}?next=${encodeURIComponent(safeNextPath(nextPath))}`;
}

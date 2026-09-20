const DEFAULT_AUTH_DESTINATION = "/dashboard";

export function safeNextPathOrNull(value?: string | string[] | null): string | null {
  const candidate = Array.isArray(value) ? value[0] : value;
  if (!candidate || !candidate.startsWith("/") || candidate.startsWith("//")) {
    return null;
  }

  try {
    const parsed = new URL(candidate, "https://tradr.local");
    return parsed.origin === "https://tradr.local"
      ? `${parsed.pathname}${parsed.search}${parsed.hash}`
      : null;
  } catch {
    return null;
  }
}

export function safeNextPath(value?: string | string[] | null): string {
  return safeNextPathOrNull(value) ?? DEFAULT_AUTH_DESTINATION;
}

export function authPath(pathname: "/login" | "/register", nextPath?: string | null): string {
  return nextPath ? `${pathname}?next=${encodeURIComponent(safeNextPath(nextPath))}` : pathname;
}

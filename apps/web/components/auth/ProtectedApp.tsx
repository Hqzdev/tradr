"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { clearSession, currentUser, hasSession } from "@/lib/api/auth";

export default function ProtectedApp({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!hasSession()) {
      router.replace(`/login?next=${encodeURIComponent(pathname ?? "/market")}`);
      return;
    }
    currentUser()
      .then(() => setReady(true))
      .catch(() => {
        clearSession();
        router.replace(`/login?next=${encodeURIComponent(pathname ?? "/market")}`);
      });
  }, [pathname, router]);

  if (!ready) return null;
  return children;
}

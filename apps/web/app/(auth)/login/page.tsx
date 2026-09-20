import type { Metadata } from "next";
import LoginScreen from "@/components/screens/LoginScreen";
import { safeNextPath, safeNextPathOrNull } from "@/lib/authRedirect";

export const metadata: Metadata = { title: "Вход · TRADR" };

export default function LoginPage({ searchParams }: { searchParams?: { next?: string | string[] } }) {
  return <LoginScreen nextPath={safeNextPath(searchParams?.next)} hasExplicitNext={safeNextPathOrNull(searchParams?.next) !== null} />;
}

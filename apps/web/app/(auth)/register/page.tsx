import type { Metadata } from "next";
import RegisterScreen from "@/components/screens/RegisterScreen";
import { safeNextPath, safeNextPathOrNull } from "@/lib/authRedirect";

export const metadata: Metadata = { title: "Регистрация · TRADR" };

export default function RegisterPage({ searchParams }: { searchParams?: { next?: string | string[] } }) {
  return <RegisterScreen nextPath={safeNextPath(searchParams?.next)} hasExplicitNext={safeNextPathOrNull(searchParams?.next) !== null} />;
}

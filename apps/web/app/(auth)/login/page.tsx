import type { Metadata } from "next";
import LoginScreen from "@/components/screens/LoginScreen";

export const metadata: Metadata = { title: "Вход · TRADR" };

export default function LoginPage() {
  return <LoginScreen />;
}

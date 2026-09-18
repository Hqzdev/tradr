import type { Metadata } from "next";
import RegisterScreen from "@/components/screens/RegisterScreen";

export const metadata: Metadata = { title: "Регистрация · TRADR" };

export default function RegisterPage() {
  return <RegisterScreen />;
}

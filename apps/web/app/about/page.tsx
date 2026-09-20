import type { Metadata } from "next";
import AboutPage from "@/components/about/AboutPage";

export const metadata: Metadata = {
  title: "О TRADR — учебная торговая платформа",
  description:
    "Узнайте, как TRADR помогает изучать рынок, сравнивать торговых агентов и проверять решения без финансового риска.",
};

export default function AboutRoute() {
  return <AboutPage />;
}

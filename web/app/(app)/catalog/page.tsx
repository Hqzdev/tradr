import type { Metadata } from "next";
import CatalogScreen from "@/components/screens/CatalogScreen";

export const metadata: Metadata = { title: "Каталог акций · TRADR" };

export default function CatalogPage() {
  return <CatalogScreen />;
}

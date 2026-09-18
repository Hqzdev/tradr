import type { Metadata } from "next";
import OpenOrdersScreen from "@/components/screens/OpenOrdersScreen";

export const metadata: Metadata = { title: "Открытые заявки · TRADR" };

export default function OrdersPage() {
  return <OpenOrdersScreen />;
}

import { IconShield, IconShuffle, IconTrophy } from "@/components/icons";

// Presentation-only mapping for agent strategies (colors/icons/labels).
export const strategyMeta: Record<string, { label: string; color: string; icon: typeof IconTrophy; tagline: string }> = {
  pro_quant: { label: "Квант · Pro", color: "#FFC45C", icon: IconTrophy, tagline: "Легендарный · фильтр просадок и резерв 20%" },
  aggressive: { label: "Агрессивный", color: "#6C5CFF", icon: IconTrophy, tagline: "Импульсная стратегия" },
  careful: { label: "Осторожный", color: "#2EBD85", icon: IconShield, tagline: "Контроль риска" },
  random: { label: "Случайный", color: "#A79CFF", icon: IconShuffle, tagline: "Случайные сделки" },
};

export function getStrategy(strategy: string) {
  return strategyMeta[strategy] ?? { label: strategy, color: "#8A8A93", icon: IconShield, tagline: strategy };
}

export const statusLabel: Record<string, string> = { active: "Работает", paused: "На паузе", error: "Ошибка" };

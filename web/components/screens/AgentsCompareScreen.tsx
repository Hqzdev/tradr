import Link from "next/link";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { AgentStatCard } from "@/components/AgentCard";
import { agents } from "@/lib/fixtures";
import { compareRows } from "@/lib/tradingExtra";

export default function AgentsCompareScreen() {
  return (
    <div>
      <Link
        href="/agents"
        className="press-98 focus-ring text-body-sm text-steel transition-colors duration-150 hover:text-ink"
      >
        Агенты
      </Link>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-caption font-[485] uppercase tracking-[0.02em] text-magenta-deep">
            Агенты / Сравнение стратегий
          </p>
          <h1 className="mt-2 text-heading font-[485] text-ink">Сравнение агентов</h1>
        </div>
        <Button variant="outline">Настроить сравнение</Button>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {agents.map((agent, i) => (
          <AgentStatCard key={agent.id} agent={agent} highlight={i === 0} />
        ))}
      </div>

      <Card className="mt-6 p-6">
        <p className="text-subheading font-[485] text-ink">Метрики по агентам</p>
        <table className="mt-4 w-full border-collapse text-left">
          <thead>
            <tr className="text-caption text-steel">
              <th className="pb-2 font-[485]">Метрика</th>
              <th className="pb-2 font-[485] text-magenta-deep">Агрессивный</th>
              <th className="pb-2 font-[485] text-teal">Осторожный</th>
              <th className="pb-2 font-[485] text-[#8251FB]">Случайный</th>
            </tr>
          </thead>
          <tbody>
            {compareRows.map((r) => (
              <tr key={r.metric} className="border-t border-bone text-body-sm">
                <td className="py-3 text-steel">{r.metric}</td>
                <td className="py-3 tabular-nums text-ink">{r.aggressive}</td>
                <td className="py-3 tabular-nums text-ink">{r.careful}</td>
                <td className="py-3 tabular-nums text-ink">{r.random}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

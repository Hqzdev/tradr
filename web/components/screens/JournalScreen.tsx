"use client";

import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import PageHeader from "@/components/ui/PageHeader";
import { IconDownload } from "@/components/icons";
import EmptyState from "@/components/ui/EmptyState";
import { emptyStates } from "@/lib/emptyStates";
import { journalEntries } from "@/lib/psychologyData";
import clsx from "@/lib/clsx";

const filters = ["Все агенты", "Все акции", "Любой результат", "Все действия"];

const RESULT_TONE: Record<string, string> = {
  positive: "text-positive",
  negative: "text-negative",
  neutral: "text-steel",
};

export default function JournalScreen() {
  return (
    <div>
      <PageHeader
        eyebrow="Сессия #04 · общая история"
        title="Общий журнал агентов"
        lead="Единая лента решений всех агентов для контроля стратегии и результата."
        action={
          <Button variant="primary" icon={<IconDownload className="h-4 w-4" />}>
            Экспорт отчёта
          </Button>
        }
      />

      <Card className="mt-6 flex flex-wrap items-center gap-3 p-4">
        {filters.map((f) => (
          <span
            key={f}
            className="rounded-btn border border-bone bg-white px-4 py-2.5 text-body-sm font-[600] text-ink"
          >
            {f}
          </span>
        ))}
        <span className="ml-auto text-body-sm font-[600] text-steel">63 записи</span>
      </Card>

      <Card className="mt-6 p-6">
        <p className="text-subheading font-[700] text-ink">Все действия</p>

        {journalEntries.length === 0 ? (
          <EmptyState className="mt-5" title={emptyStates.journal.title} description={emptyStates.journal.description} />
        ) : (
          <>
            <table className="mt-5 w-full border-collapse text-left">
              <thead>
                <tr className="text-caption font-[700] uppercase tracking-[0.02em] text-steel">
                  <th className="pb-3 font-[700]">Время</th>
                  <th className="pb-3 font-[700]">Агент</th>
                  <th className="pb-3 font-[700]">Действие</th>
                  <th className="pb-3 font-[700]">Акция</th>
                  <th className="pb-3 font-[700]">Причина</th>
                  <th className="pb-3 font-[700]">Результат</th>
                </tr>
              </thead>
              <tbody>
                {journalEntries.map((r, i) => (
                  <tr key={i} className="border-t border-bone text-body-sm">
                    <td className="py-3.5 text-caption font-[600] text-steel">{r.time}</td>
                    <td className="py-3.5 font-[700] text-ink">{r.agent}</td>
                    <td className="py-3.5 font-[600] text-ink">{r.action}</td>
                    <td className="py-3.5 font-[700] text-ink">{r.asset}</td>
                    <td className="max-w-[240px] py-3.5 text-caption text-steel">{r.reason}</td>
                    <td className={clsx("py-3.5 font-[700] tabular-nums", RESULT_TONE[r.resultTone])}>{r.result}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt-4 flex justify-end">
              <span className="rounded-btn border border-bone bg-[#FBF8FA] px-4 py-2.5 text-caption font-[600] text-ink">
                1–{journalEntries.length} из 63&nbsp;&nbsp;›
              </span>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}

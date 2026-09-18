"use client";

import { useState } from "react";
import Link from "next/link";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { IconChevronLeft, IconChevronRight, IconDownload, IconFile, IconMail } from "@/components/icons";
import { exportContentOptions, exportPreview } from "@/lib/tradingExtra";
import clsx from "@/lib/clsx";

const FORMATS = ["PDF", "CSV", "XLSX"] as const;

export default function ReportExportScreen() {
  const [format, setFormat] = useState<(typeof FORMATS)[number]>("PDF");
  const [options, setOptions] = useState(exportContentOptions);

  return (
    <div>
      <Link
        href="/simulation/results"
        className="press-98 focus-ring flex w-fit items-center gap-1.5 text-body-sm text-steel transition-colors duration-150 hover:text-ink"
      >
        <IconChevronLeft className="h-4 w-4" />
        Результаты симуляции
        <IconChevronRight className="h-3 w-3 text-fog" />
        <span className="text-ink">Экспорт отчёта</span>
      </Link>

      <div className="mt-5">
        <p className="text-caption font-[485] uppercase tracking-[0.02em] text-magenta-deep">
          Сессия #248 / Отчёт
        </p>
        <h1 className="mt-2 text-heading font-[485] text-ink">Экспорт отчёта</h1>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1fr]">
        <div className="flex flex-col gap-6">
          <Card className="p-6">
            <p className="text-subheading font-[485] text-ink">Формат файла</p>
            <div className="mt-4 grid grid-cols-3 gap-3">
              {FORMATS.map((f) => (
                <button
                  key={f}
                  onClick={() => setFormat(f)}
                  className={clsx(
                    "press-98 focus-ring flex flex-col items-center gap-2 rounded-btn border px-4 py-5 transition-colors duration-150",
                    format === f ? "border-magenta/30 bg-[#FFF5FC] text-magenta-deep" : "border-bone text-ink hover:border-fog/60"
                  )}
                >
                  <IconFile className="h-5 w-5" />
                  <span className="text-body-sm font-[485]">{f}</span>
                </button>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <p className="text-subheading font-[485] text-ink">Содержимое отчёта</p>
            <div className="mt-3 flex flex-col">
              {options.map((opt, i) => (
                <label
                  key={opt.label}
                  className={clsx(
                    "flex cursor-pointer items-center gap-3 py-2.5",
                    i > 0 && "border-t border-[#F5F3F6]"
                  )}
                >
                  <input
                    type="checkbox"
                    checked={opt.checked}
                    onChange={() =>
                      setOptions((prev) =>
                        prev.map((o, j) => (j === i ? { ...o, checked: !o.checked } : o))
                      )
                    }
                    className="h-4 w-4 accent-magenta"
                  />
                  <span className="text-body-sm text-ink">{opt.label}</span>
                </label>
              ))}
            </div>
          </Card>
        </div>

        <div className="flex flex-col gap-6">
          <Card className="p-6">
            <p className="text-subheading font-[485] text-ink">Предпросмотр документа</p>
            <div className="mt-4 rounded-btn border border-bone bg-[#FCFAFD] p-5">
              <div className="flex items-center justify-between">
                <p className="text-body-sm font-[535] text-ink">{exportPreview.brand}</p>
                <p className="text-caption text-fog">{exportPreview.date}</p>
              </div>
              <p className="mt-4 text-body font-[485] text-ink">{exportPreview.title}</p>
              <p className="mt-1 text-caption text-steel">{exportPreview.subtitle}</p>
              <div className="mt-4 grid grid-cols-3 gap-3">
                {exportPreview.metrics.map((m) => (
                  <div key={m.label}>
                    <p className="text-caption text-fog">{m.label}</p>
                    <p className="mt-0.5 text-body-sm font-[485] text-ink">{m.value}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex h-24 items-center justify-center rounded-btn bg-[#F1EEF3]">
                <IconFile className="h-6 w-6 text-fog" />
              </div>
              <div className="mt-4 flex flex-col gap-2">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className="h-2 rounded-full bg-[#EDE8EF]" style={{ width: `${100 - i * 12}%` }} />
                ))}
              </div>
            </div>
            <p className="mt-3 text-center text-caption text-fog">{exportPreview.pageLabel}</p>
          </Card>

          <div className="flex items-center gap-3">
            <Button variant="outline" fullWidth icon={<IconMail className="h-4 w-4" />}>
              Отправить на почту
            </Button>
            <Button variant="primary" fullWidth icon={<IconDownload className="h-4 w-4" />}>
              Скачать {format}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

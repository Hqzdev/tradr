"use client";

import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { IconAlertCircle, IconLoading, IconRefresh } from "@/components/icons";

const MAX_ATTEMPTS = 5;

// Next.js App Router error boundary for the (app) segment — rendered
// automatically whenever a Server/Client Component under this segment
// throws during render or data-fetch. Matches design.pen GwG7N
// (29 · Ошибка / Нет соединения) so it needs no extra wiring later.
export default function AppError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const [attempt, setAttempt] = useState(1);

  useEffect(() => {
    if (attempt >= MAX_ATTEMPTS) return;
    const t = setTimeout(() => setAttempt((a) => Math.min(a + 1, MAX_ATTEMPTS)), 2400);
    return () => clearTimeout(t);
  }, [attempt]);

  const exhausted = attempt >= MAX_ATTEMPTS;

  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <Card className="w-full max-w-[420px] p-8 text-center">
        <span
          className="mx-auto flex h-12 w-12 items-center justify-center rounded-full"
          style={{ backgroundColor: "#FFF3F4" }}
        >
          <IconAlertCircle className="h-5 w-5" style={{ color: "#B63449" }} />
        </span>

        <p className="mt-4 text-subheading font-[485] text-ink">Нет соединения с сервером</p>
        <p className="mt-2 text-body-sm text-steel">
          Проверьте подключение к интернету. Котировки и заявки не обновляются, пока связь не
          восстановлена.
        </p>

        <div className="mt-5 flex items-center justify-center gap-2 rounded-btn bg-bone/60 px-3.5 py-2.5 text-caption text-steel">
          {!exhausted ? (
            <IconLoading className="h-3.5 w-3.5 animate-spin800 text-fog" />
          ) : (
            <IconAlertCircle className="h-3.5 w-3.5 text-negative" />
          )}
          <span>
            {exhausted
              ? "Не удалось восстановить соединение"
              : `Попытка переподключения… (${attempt} из ${MAX_ATTEMPTS})`}
          </span>
        </div>

        <Button
          variant="primary"
          fullWidth
          className="mt-5"
          icon={<IconRefresh className="h-4 w-4" />}
          onClick={() => {
            setAttempt(1);
            reset();
          }}
        >
          Повторить попытку
        </Button>
      </Card>
    </div>
  );
}

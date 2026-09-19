import Link from "next/link";

export default function InstrumentNotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center rounded-[28px] border border-[#ece8ee] bg-white px-6 text-center shadow-soft">
      <span className="text-[68px] font-[550] tracking-[-.06em] text-ink">404</span>
      <h1 className="mt-2 text-heading-sm font-[535] text-ink">Такой акции нет в TRADR</h1>
      <p className="mt-2 max-w-md text-body-sm text-steel">Выберите один из доступных учебных инструментов на странице рынка.</p>
      <Link href="/market" className="focus-ring mt-6 rounded-[14px] bg-magenta px-5 py-3 text-body-sm font-[550] text-white transition-colors hover:bg-magenta-deep">Вернуться на рынок</Link>
    </div>
  );
}

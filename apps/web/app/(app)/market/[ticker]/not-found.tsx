import Link from "next/link";

export default function InstrumentNotFound() {
  return (
    <div className="q-card q-pop flex min-h-[70vh] flex-col items-center justify-center px-6 text-center" style={{ background: "radial-gradient(60% 50% at 50% 0%, rgba(108,92,255,0.18) 0%, rgba(108,92,255,0) 70%), linear-gradient(180deg,#131318 0%,#0d0d10 100%)" }}>
      <span className="bg-gradient-to-b from-ink to-fog bg-clip-text text-[88px] font-semibold leading-none tracking-[-.06em] text-transparent">404</span>
      <h1 className="mt-4 text-[24px] font-semibold tracking-[-0.03em] text-ink">Такой акции нет в TRADR</h1>
      <p className="mt-2 max-w-md text-[14.5px] text-steel">Выберите один из доступных учебных инструментов на странице рынка.</p>
      <Link href="/market" className="q-shine press-98 focus-ring mt-7 rounded-[13px] bg-magenta px-5 py-3 text-[14.5px] font-semibold text-white shadow-[0_12px_30px_-12px_rgba(108,92,255,0.9)] transition-colors hover:bg-[#7a6bff]">Вернуться на рынок</Link>
    </div>
  );
}

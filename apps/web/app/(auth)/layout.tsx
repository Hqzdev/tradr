import Image from "next/image";

// Вне (app)-группы — без Sidebar/AgentsSectionNav, чистый экран для
// неавторизованного пользователя. Логотип не кликабельный: до входа
// вести некуда (публичной домашней страницы у продукта нет).
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-6">
      <div className="flex items-center gap-2.5">
        <Image src="/logo.png" alt="TRADR" width={36} height={36} />
        <span className="text-[17px] font-semibold tracking-[-0.3px] text-ink">TRADR</span>
      </div>

      <div className="animate-fade-in w-full max-w-[400px]">{children}</div>

      <p className="max-w-[360px] text-center text-caption text-fog">Вход защищён персональной учётной записью.</p>
    </div>
  );
}

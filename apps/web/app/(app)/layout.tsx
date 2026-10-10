import Sidebar from "@/components/Sidebar";
import AppHeader from "@/components/shell/AppHeader";
import TickerStrip from "@/components/shell/TickerStrip";
import ProtectedApp from "@/components/auth/ProtectedApp";
import { MobileTabBar, MobileTopBar } from "@/components/mobile/MobileShell";

// Signed-in shell. `theme-dark` switches every Tailwind color token to the
// dark palette (see globals.css), so only the app is dark — the public site
// keeps its light theme.
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedApp>
      <div className="theme-dark relative min-h-screen">
        <div className="app-glow" aria-hidden />
        <div className="relative z-10 flex min-h-screen flex-col lg:flex-row">
          {/* Desktop chrome; below `lg` the mobile top bar + tab bar take over. */}
          <div className="hidden lg:contents">
            <Sidebar />
          </div>
          <div className="flex min-w-0 flex-1 flex-col">
            <MobileTopBar />
            <div className="hidden lg:block">
              <AppHeader />
              <TickerStrip />
            </div>
            <main className="min-w-0 flex-1 px-5 pb-[calc(112px+env(safe-area-inset-bottom))] pt-4 sm:px-6 lg:px-8 lg:pb-14 lg:pt-8">
              <div className="mx-auto w-full max-w-[560px] lg:max-w-[1240px]">{children}</div>
            </main>
            <MobileTabBar />
          </div>
        </div>
      </div>
    </ProtectedApp>
  );
}

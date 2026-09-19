import Sidebar from "@/components/Sidebar";
import ProtectedApp from "@/components/auth/ProtectedApp";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedApp><div className="flex min-h-screen w-full flex-col items-start gap-4 p-3 sm:p-4 lg:flex-row lg:gap-6 lg:p-6">
      <div className="relative top-0 w-full shrink-0 lg:sticky lg:top-6 lg:w-auto">
        <Sidebar />
      </div>
      <main className="min-w-0 w-full flex-1 py-2">
        <div className="mx-auto w-full max-w-[1200px] animate-fade-in">
          {children}
        </div>
      </main>
    </div></ProtectedApp>
  );
}

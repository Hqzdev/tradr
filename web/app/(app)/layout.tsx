import Sidebar from "@/components/Sidebar";
import AgentsSectionNav from "@/components/AgentsSectionNav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full items-start gap-6 p-6">
      <div className="sticky top-6 shrink-0">
        <Sidebar />
      </div>
      <main className="min-w-0 flex-1 py-2">
        <div className="mx-auto w-full max-w-[1200px] animate-fade-in">
          <AgentsSectionNav />
          {children}
        </div>
      </main>
    </div>
  );
}

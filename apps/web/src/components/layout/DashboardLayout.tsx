import { getCurrentUser } from "@/app/actions/user-actions";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  const user = await getCurrentUser();

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6]">
      {/* Navbar Superior */}
      <Navbar user={user} />

      <div className="flex flex-1 relative justify-center w-full">
        {/* Sidebar (Desktop) y Bottom Nav (Mobile) */}
        <Sidebar />

        {/* Contenido de la Página */}
        <main className="w-full max-w-2xl px-4 py-6 md:py-8 pb-24 md:pb-8">
          <div className="bg-card md:shadow-[0_8px_30px_0_rgba(133,83,0,0.03)] md:rounded-3xl md:border md:border-border/10 p-4 md:p-8 min-h-[calc(100vh-140px)]">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

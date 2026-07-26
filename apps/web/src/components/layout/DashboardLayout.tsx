import { getCurrentUser } from "@/app/actions/user-actions";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  const user = await getCurrentUser();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar Superior */}
      <Navbar user={user} />

      <div className="flex flex-1 relative justify-center w-full">
        {/* Sidebar (Desktop) y Bottom Nav (Mobile) */}
        <Sidebar />

        {/* Contenido de la Página */}
        <main className="w-full max-w-2xl px-4 py-6 md:py-10 pb-24 md:pb-10">
          <div className="bg-card/90 backdrop-blur-[1px] md:shadow-[0_2px_8px_rgba(133,83,0,0.02),0_8px_32px_rgba(133,83,0,0.04)] md:rounded-2xl md:border md:border-border/15 p-5 md:p-8 min-h-[calc(100vh-130px)] page-enter">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

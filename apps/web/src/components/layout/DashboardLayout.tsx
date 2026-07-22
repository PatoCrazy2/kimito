import { getCurrentUser } from "@/app/actions/user-actions";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  const user = await getCurrentUser();

  return (
    <div className="min-h-screen flex flex-col bg-cream">
      {/* Navbar Superior */}
      <Navbar user={user} />

      <div className="flex flex-1 relative">
        {/* Sidebar (Desktop) y Bottom Nav (Mobile) */}
        <Sidebar />

        {/* Contenido de la Página */}
        <main className="flex-1 overflow-y-auto px-4 md:px-8 py-6 md:py-8 pb-24 md:pb-8 w-full">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

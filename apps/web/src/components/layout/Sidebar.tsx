"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Inicio", href: "/dashboard", icon: "space_dashboard" },
  { name: "Mi Casa", href: "/dashboard/house", icon: "home" },
  { name: "Tareas", href: "/dashboard/tasks", icon: "cleaning_services" },
  { name: "Facturas", href: "/dashboard#bills", icon: "receipt_long" },
  { name: "Calendario", href: "/dashboard#calendar", icon: "calendar_today" },
  { name: "Perfil", href: "/dashboard#profile", icon: "person" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* NAVEGACIÓN DESKTOP: Sidebar lateral izquierdo */}
      <aside className="hidden md:flex flex-col w-64 bg-[#FAF9F6] border-r border-border/40 min-h-[calc(100vh-73px)] p-4 shrink-0 justify-between">
        <div className="flex flex-col gap-1.5">
          <p className="px-4 text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2 select-none">
            Menú Principal
          </p>
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href.split("#")[0] + "/"));
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 cursor-pointer group",
                  isActive
                    ? "bg-amber-primary/10 text-amber-primary shadow-sm"
                    : "text-muted-foreground hover:bg-[#F4EFE6] hover:text-foreground"
                )}
              >
                <span
                  className={cn(
                    "material-symbols-rounded text-xl transition-transform duration-200 group-hover:scale-105 select-none",
                    isActive ? "text-amber-primary" : "text-muted-foreground group-hover:text-foreground"
                  )}
                >
                  {item.icon}
                </span>
                {item.name}
              </Link>
            );
          })}
        </div>

        {/* Footer simple del sidebar */}
        <div className="px-4 py-2 border-t border-border/30 select-none">
          <p className="text-[11px] text-muted-foreground font-medium">Kimito App v1.0</p>
          <p className="text-[9px] text-muted-foreground/60 mt-0.5">© 2026 Hackathon Team</p>
        </div>
      </aside>

      {/* NAVEGACIÓN MÓVIL: Barra inferior (Bottom Navigation) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#FAF9F6]/95 backdrop-blur-md border-t border-border/40 z-40 flex items-center justify-around px-2 pb-safe">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href.split("#")[0] + "/"));
          return (
            <Link
              key={item.name}
              href={item.href}
              className="flex flex-col items-center justify-center flex-1 h-full py-1 text-center select-none"
            >
              <div
                className={cn(
                  "flex items-center justify-center px-5 py-1 rounded-full transition-all duration-200",
                  isActive ? "bg-amber-primary/15 text-amber-primary" : "text-muted-foreground"
                )}
              >
                <span className="material-symbols-rounded text-2xl">
                  {item.icon}
                </span>
              </div>
              <span
                className={cn(
                  "text-[10px] font-bold mt-1.5 transition-colors duration-200",
                  isActive ? "text-amber-primary" : "text-muted-foreground"
                )}
              >
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}

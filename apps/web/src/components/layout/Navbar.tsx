"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/app/actions/auth-actions";
import { UserDto } from "@kimito/shared-types";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Inicio", href: "/dashboard", icon: "space_dashboard" },
  { name: "Mi Casa", href: "/dashboard/house", icon: "home" },
  { name: "Tareas", href: "/dashboard/tasks", icon: "cleaning_services" },
  { name: "Buscar", href: "/dashboard/listings", icon: "search" },
];

interface NavbarProps {
  user: UserDto | null;
}

export default function Navbar({ user }: NavbarProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FAF9F6]/85 backdrop-blur-md border-b border-border/40 px-6 py-4 flex items-center justify-between">
      {/* Logotipo y Nombre */}
      <div className="flex items-center gap-3">
        <span className="material-symbols-rounded text-amber-primary text-3xl font-semibold select-none">
          cleaning_services
        </span>
        <span className="font-sans font-extrabold text-2xl tracking-tight text-foreground flex items-center gap-1.5">
          Kimito <span className="text-[10px] bg-amber-primary/10 text-amber-primary px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">MVP</span>
        </span>
      </div>

      {/* Navegación Desktop */}
      <nav className="hidden md:flex items-center gap-1 bg-white/50 border border-border/20 p-1 rounded-full shadow-[0_4px_20px_0_rgba(133,83,0,0.02)]">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href.split("#")[0] + "/"));
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer",
                isActive
                  ? "bg-amber-primary/10 text-amber-primary"
                  : "text-muted-foreground hover:bg-[#FAF9F6] hover:text-foreground"
              )}
            >
              <span className="material-symbols-rounded text-lg">
                {item.icon}
              </span>
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Perfil de Usuario */}
      <div className="flex items-center gap-4">
        {user ? (
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-3 hover:bg-muted p-1.5 pr-3 rounded-full transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-primary/20"
            >
              {user.avatarUrl ? (
                <Image
                  src={user.avatarUrl}
                  alt={user.name}
                  width={36}
                  height={36}
                  className="rounded-full border-2 border-amber-primary/20 shadow-sm"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-amber-primary text-white flex items-center justify-center font-bold text-sm shadow-sm select-none">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="hidden md:flex flex-col items-start text-left">
                <span className="text-sm font-semibold leading-none text-foreground">{user.name}</span>
                <span className="text-xs text-muted-foreground mt-0.5 max-w-[150px] truncate">{user.email}</span>
              </div>
              <span className="material-symbols-rounded text-muted-foreground text-sm select-none">
                keyboard_arrow_down
              </span>
            </button>

            {dropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setDropdownOpen(false)}
                />
                <div className="absolute right-0 mt-2.5 w-60 bg-card border border-border/80 rounded-2xl shadow-xl p-2 z-20 animate-in fade-in slide-in-from-top-3 duration-200">
                  <div className="px-4 py-3 border-b border-border/50 md:hidden">
                    <p className="text-sm font-bold text-foreground">{user.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      logout();
                    }}
                    className="w-full text-left flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold text-terracota hover:bg-destructive/5 transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-rounded text-lg select-none">logout</span>
                    Cerrar sesión
                  </button>
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="w-9 h-9 rounded-full bg-muted animate-pulse" />
        )}
      </div>
    </header>
  );
}

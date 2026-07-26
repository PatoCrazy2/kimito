"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/app/actions/auth-actions";
import { UserDto } from "@kimito/shared-types";
import { cn } from "@/lib/utils";
import { KimitoLogo } from "@/components/KimitoLogo";

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
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on Escape
  useEffect(() => {
    if (!dropdownOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDropdownOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [dropdownOpen]);

  return (
    <header className="sticky top-0 z-40 w-full bg-background/80 backdrop-blur-xl border-b border-border/30 px-6 py-3.5 flex items-center justify-between">
      {/* Logotipo y Nombre */}
      <Link href="/dashboard" className="flex items-center gap-2.5 group">
        <KimitoLogo size={30} className="transition-transform duration-200 group-hover:scale-105" />
        <span className="font-sans font-bold text-xl tracking-tight text-foreground">
          Kimito
        </span>
        <span className="text-[9px] bg-amber-primary/8 text-amber-primary/80 px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider">
          MVP
        </span>
      </Link>

      {/* Navegación Desktop */}
      <nav className="hidden md:flex items-center gap-0.5 bg-white/60 border border-border/15 p-1 rounded-full shadow-[0_2px_12px_0_rgba(133,83,0,0.03)]">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href.split("#")[0] + "/"));
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "relative flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[11px] font-semibold uppercase tracking-wide cursor-pointer",
                isActive
                  ? "bg-amber-primary/10 text-amber-primary shadow-[inset_0_1px_2px_rgba(133,83,0,0.06)]"
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground active:scale-[0.97]"
              )}
            >
              <span className="material-symbols-rounded text-[18px]">
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
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              aria-expanded={dropdownOpen}
              aria-haspopup="true"
              className="flex items-center gap-2.5 hover:bg-muted/60 p-1.5 pr-3 rounded-full cursor-pointer"
            >
              {user.avatarUrl ? (
                <Image
                  src={user.avatarUrl}
                  alt={user.name}
                  width={34}
                  height={34}
                  className="rounded-full border-2 border-amber-primary/15 shadow-sm"
                />
              ) : (
                <div className="w-[34px] h-[34px] rounded-full bg-amber-primary text-white flex items-center justify-center font-semibold text-sm shadow-sm select-none">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="hidden md:flex flex-col items-start text-left">
                <span className="text-[13px] font-semibold leading-none text-foreground">{user.name}</span>
                <span className="text-[11px] text-muted-foreground mt-0.5 max-w-[140px] truncate">{user.email}</span>
              </div>
              <span className={cn(
                "material-symbols-rounded text-muted-foreground text-[16px] select-none transition-transform duration-200",
                dropdownOpen && "rotate-180"
              )}>
                keyboard_arrow_down
              </span>
            </button>

            {dropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setDropdownOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-56 bg-card border border-border/60 rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.08),0_2px_8px_rgba(133,83,0,0.04)] p-1.5 z-20 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3.5 py-2.5 border-b border-border/40 mb-1 md:hidden">
                    <p className="text-[13px] font-semibold text-foreground">{user.name}</p>
                    <p className="text-[11px] text-muted-foreground truncate">{user.email}</p>
                  </div>
                  <Link
                    href="/dashboard/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-[13px] font-medium text-foreground hover:bg-muted/70 cursor-pointer"
                  >
                    <span className="material-symbols-rounded text-[18px] text-muted-foreground select-none">account_circle</span>
                    Mi Perfil
                  </Link>
                  <Link
                    href="/dashboard/settings"
                    onClick={() => setDropdownOpen(false)}
                    className="w-full text-left flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold text-foreground hover:bg-muted transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-rounded text-lg select-none">settings</span>
                    Configuración
                  </Link>
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-[13px] font-medium text-terracota hover:bg-terracota/5 cursor-pointer"
                  >
                    <span className="material-symbols-rounded text-[18px] select-none">logout</span>
                    Cerrar sesión
                  </button>
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="w-[34px] h-[34px] rounded-full bg-muted animate-pulse" />
        )}
      </div>
    </header>
  );
}

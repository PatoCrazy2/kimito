"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Inicio", href: "/dashboard", icon: "space_dashboard" },
  { name: "Mi Casa", href: "/dashboard/house", icon: "home" },
  { name: "Tareas", href: "/dashboard/tasks", icon: "cleaning_services" },
  { name: "Buscar", href: "/dashboard/listings", icon: "search" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    let lastScroll = 0;
    const handleScroll = () => {
      const currentScroll = window.scrollY || document.documentElement.scrollTop;
      
      if (Math.abs(currentScroll - lastScroll) < 10) {
        return;
      }
      
      if (currentScroll > lastScroll && currentScroll > 50) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      lastScroll = currentScroll;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 w-[90%] max-w-md h-16 bg-[#FAF9F6]/90 backdrop-blur-md border border-border/25 z-50 flex items-center justify-around px-2 shadow-[0_8px_30px_rgba(133,83,0,0.06)] rounded-2xl transition-all duration-300 ease-in-out",
        isVisible 
          ? "translate-y-0 opacity-100 scale-100" 
          : "translate-y-24 opacity-0 scale-95 pointer-events-none"
      )}
    >
      {navItems.map((item) => {
        const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href.split("#")[0] + "/"));
        return (
          <Link
            key={item.name}
            href={item.href}
            className="flex flex-col items-center justify-center flex-1 h-full py-1 text-center select-none cursor-pointer"
          >
            <div
              className={cn(
                "flex items-center justify-center w-12 h-8 rounded-full transition-all duration-200",
                isActive 
                  ? "bg-amber-primary/10 text-amber-primary" 
                  : "text-muted-foreground hover:text-foreground active:scale-95"
              )}
            >
              <span className="material-symbols-rounded text-xl transition-transform duration-200">
                {item.icon}
              </span>
            </div>
            <span
              className={cn(
                "text-[9px] font-extrabold tracking-wider mt-1 uppercase transition-colors duration-200",
                isActive ? "text-amber-primary" : "text-muted-foreground"
              )}
            >
              {item.name}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}

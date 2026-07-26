"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Inicio", href: "/dashboard", icon: "space_dashboard" },
  { name: "Mi Casa", href: "/dashboard/house", icon: "home" },
  { name: "Tareas", href: "/dashboard/tasks", icon: "cleaning_services" },
  { name: "Roomies", href: "/dashboard/listings", icon: "group_add" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    let lastScroll = 0;
    const handleScroll = () => {
      const currentScroll = window.scrollY || document.documentElement.scrollTop;
      
      if (Math.abs(currentScroll - lastScroll) < 8) return;
      
      if (currentScroll > lastScroll && currentScroll > 60) {
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
        "md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 w-[88%] max-w-sm h-[60px] bg-white/85 backdrop-blur-xl border border-border/20 z-50 flex items-center justify-around px-3 rounded-2xl transition-all duration-400 ease-[cubic-bezier(0.4,0,0.2,1)]",
        "shadow-[0_4px_20px_rgba(0,0,0,0.04),0_12px_40px_rgba(133,83,0,0.06)]",
        isVisible 
          ? "translate-y-0 opacity-100" 
          : "translate-y-20 opacity-0 pointer-events-none"
      )}
    >
      {navItems.map((item) => {
        const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href.split("#")[0] + "/"));
        return (
          <Link
            key={item.name}
            href={item.href}
            className="flex flex-col items-center justify-center flex-1 h-full py-1.5 text-center select-none cursor-pointer group"
          >
            <div
              className={cn(
                "flex items-center justify-center w-10 h-8 rounded-xl transition-all duration-200",
                isActive 
                  ? "bg-amber-primary/10 text-amber-primary scale-105" 
                  : "text-muted-foreground group-hover:text-foreground group-active:scale-90"
              )}
            >
              <span className={cn(
                "material-symbols-rounded text-[20px]",
                isActive && "font-variation-settings: 'FILL' 1"
              )}>
                {item.icon}
              </span>
            </div>
            <span
              className={cn(
                "text-[9px] font-bold tracking-wider mt-0.5 uppercase transition-colors duration-200",
                isActive ? "text-amber-primary" : "text-muted-foreground/70 group-hover:text-muted-foreground"
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

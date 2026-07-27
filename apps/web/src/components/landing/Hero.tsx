"use client";

import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Clock,
  Camera,
  Star,
  Bell,
  ShieldCheck,
  Users,
} from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-6 pb-20 lg:pt-12 lg:pb-32 bg-[#FAF9F6]">
      {/* Patrón repetido de logotipos (esencia de login) para dar profundidad */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.03] -z-20"
        style={{
          backgroundImage: "url('/logo.svg')",
          backgroundSize: "80px 80px",
          backgroundRepeat: "repeat",
        }}
        aria-hidden="true"
      />
      {/* Luces radiales de los colores del tema */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,185,91,0.06),transparent_60%)] -z-10 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(128,213,199,0.06),transparent_60%)] -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headline, Subtitle, Dual CTAs & Social Proof */}
          <div className="lg:col-span-7 flex flex-col items-start space-y-8 text-left">
            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#1D1B16] tracking-tight leading-[1.12]">
              La forma{" "}
              <span className="text-[#855300]">
                inteligente y justa
              </span>{" "}
              de compartir casa
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-[#1D1B16]/75 font-normal leading-relaxed max-w-2xl">
              Kimito calcula el peso real de cada labor de limpieza, las reparte
              de forma equitativa, valida las evidencias y construye tu{" "}
              <span className="font-semibold text-[#855300]">
                Pasaporte de Reputación
              </span>{" "}
              como roommate.
            </p>

            {/* Dual CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto pt-2">
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-3 bg-gradient-to-r from-[#855300] to-[#A36600] hover:from-[#6C4300] hover:to-[#855300] text-white text-base font-bold px-7 py-4 rounded-full shadow-lg shadow-[#855300]/25 hover:shadow-xl hover:shadow-[#855300]/35 transition-all duration-300 hover:-translate-y-0.5"
              >
                {/* Google Icon SVG */}
                <svg
                  className="w-5 h-5 bg-white rounded-full p-0.5"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.15C3.26 21.3 7.37 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.61H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.39l3.99-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.37 0 3.26 2.7 1.29 6.61l3.99 3.15c.95-2.85 3.6-4.96 6.72-4.96z"
                  />
                </svg>
                <span>Empieza Gratis con Google</span>
              </Link>

              <a
                href="#marketplace"
                className="inline-flex items-center justify-center gap-2 bg-white hover:bg-[#F4EFE6] text-[#855300] border-2 border-[#855300]/30 text-base font-bold px-7 py-4 rounded-full shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5"
              >
                <Users className="w-5 h-5" />
                <span>Explorar Marketplace</span>
              </a>
            </div>
          </div>

          {/* Right Column: Interactive Marketing Demo Cards Showcase with Drop Entrance Animation */}
          <div className="lg:col-span-5 relative mt-6 lg:mt-0 select-none">
            {/* Ambient decorative glow behind mockup */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#FFB95B]/15 via-[#FFB49C]/5 to-transparent rounded-full blur-2xl pointer-events-none transform -rotate-12" />

            <div className="relative mx-auto max-w-md lg:max-w-none space-y-4">
              {/* Floating Demo Card 1: Live Task Checklist */}
              <div 
                className="bg-white rounded-3xl p-5 border border-[#E8E1D3] shadow-xl shadow-[#855300]/8 transform hover:scale-[1.02] transition-all duration-500 animate-in fade-in slide-in-from-top-12 duration-1000 fill-mode-both"
                style={{ animationDelay: "150ms" }}
              >
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#F4EFE6]">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-[#F59E0B]/15 flex items-center justify-center text-[#855300]">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#1D1B16]">
                        Tareas de la semana
                      </h3>
                      <p className="text-xs text-[#1D1B16]/60">
                        Semana 30 • Distribución justa
                      </p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-[#FFB95B]/15 text-[#855300]">
                    En curso
                  </span>
                </div>

                <div className="space-y-2.5">
                  {/* Task 1 */}
                  <div className="flex items-center justify-between p-2.5 rounded-2xl bg-[#FAF9F6] border border-[#E8E1D3]/60">
                    <div className="flex items-center gap-2.5">
                      <div className="w-5 h-5 rounded-full border-2 border-[#855300] flex items-center justify-center">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#855300]" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#1D1B16]">
                          Limpieza de cocina profunda
                        </p>
                        <p className="text-[11px] text-[#1D1B16]/60">
                          Asignado a Luis • 5 pts
                        </p>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-[#F59E0B]/15 text-[#855300]">
                      <Camera className="w-3 h-3" /> Foto req.
                    </span>
                  </div>

                  {/* Task 2 */}
                  <div className="flex items-center justify-between p-2.5 rounded-2xl bg-[#FFB95B]/5 border border-[#FFB95B]/20">
                    <div className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-5 h-5 text-[#855300] fill-[#FFB95B]/20" />
                      <div>
                        <p className="text-xs font-bold text-[#1D1B16] line-through text-[#1D1B16]/50">
                          Sacar basura y reciclaje
                        </p>
                        <p className="text-[11px] text-[#855300] font-medium">
                          Sofía • 2 pts completados
                        </p>
                      </div>
                    </div>
                    <span className="text-[11px] font-extrabold text-[#855300] px-2 py-0.5 rounded-md bg-[#FFB95B]/15">
                      ✓ Verificado
                    </span>
                  </div>

                  {/* Task 3 */}
                  <div className="flex items-center justify-between p-2.5 rounded-2xl bg-[#FAF9F6] border border-[#E8E1D3]/60">
                    <div className="flex items-center gap-2.5">
                      <div className="w-5 h-5 rounded-full border-2 border-[#E8E1D3]" />
                      <div>
                        <p className="text-xs font-bold text-[#1D1B16]">
                          Aseo de baño principal
                        </p>
                        <p className="text-[11px] text-[#1D1B16]/60">
                          Carlos M. • 4 pts
                        </p>
                      </div>
                    </div>
                    <span className="text-[11px] font-semibold text-[#1D1B16]/60 px-2 py-0.5 bg-[#F4EFE6] rounded-md">
                      Pendiente
                    </span>
                  </div>
                </div>
              </div>

              {/* Floating Demo Card 2: Dark Passport Score Card */}
              <div 
                className="bg-[#1D1B16] text-white rounded-3xl p-5 border border-[#4D4639] shadow-2xl shadow-[#1D1B16]/30 transform lg:-rotate-2 hover:rotate-0 hover:scale-[1.02] transition-all duration-500 animate-in fade-in slide-in-from-top-12 duration-1000 fill-mode-both"
                style={{ animationDelay: "450ms" }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#F59E0B] to-[#855300] p-0.5">
                      <img
                        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                        alt="Roommate Profile"
                        className="w-full h-full object-cover rounded-full"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-sm text-white">
                          Carlos Mendoza
                        </span>
                        <ShieldCheck className="w-4 h-4 text-[#F59E0B]" />
                      </div>
                      <p className="text-xs text-[#CDC5B4]">
                        Pasaporte Roommate Certificado
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="flex items-center gap-1 text-[#F59E0B]">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-base font-black text-white">
                        4.9
                      </span>
                      <span className="text-xs text-[#CDC5B4]">/5</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[#4D4639]/70 text-xs">
                  <div className="bg-[#2A2823] p-2.5 rounded-xl border border-[#4D4639]/40">
                    <p className="text-[#CDC5B4] text-[11px]">
                      Historial de Aseo
                    </p>
                    <p className="font-bold text-white text-sm mt-0.5">
                      28 a tiempo
                    </p>
                  </div>
                  <div className="bg-[#2A2823] p-2.5 rounded-xl border border-[#4D4639]/40">
                    <p className="text-[#CDC5B4] text-[11px]">Cumplimiento</p>
                    <p className="font-bold text-[#F59E0B] text-sm mt-0.5">
                      100% verificado
                    </p>
                  </div>
                </div>
              </div>

              {/* Floating Demo Card 3: Native Web Push Alert Pill */}
              <div 
                className="bg-white/95 backdrop-blur-md rounded-full px-4 py-3 border border-[#E8E1D3] shadow-lg flex items-center gap-3 animate-in fade-in slide-in-from-top-12 duration-1000 fill-mode-both"
                style={{ animationDelay: "750ms" }}
              >
                <div className="w-8 h-8 rounded-full bg-[#AC3400]/15 flex items-center justify-center text-[#AC3400] shrink-0">
                  <Bell className="w-4 h-4" />
                </div>
                <div className="text-xs">
                  <p className="font-bold text-[#1D1B16]">
                    ¡Sofía subió evidencia para &quot;Cocina&quot;! 📸
                  </p>
                  <p className="text-[#1D1B16]/60 text-[11px]">
                    Web Push Alert • Hace 2 min
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

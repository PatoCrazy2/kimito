"use client";

import {
  Scale,
  Camera,
  Award,
  BellRing,
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
  Star,
} from "lucide-react";

export function BentoGrid() {
  return (
    <section
      id="features"
      className="py-24 bg-[#1D1B16] text-white rounded-t-[40px] rounded-b-[40px] md:rounded-t-[60px] md:rounded-b-[60px] relative overflow-hidden"
    >
      {/* Background Subtle Blurs */}
      <div className="absolute top-1/3 left-10 w-96 h-96 bg-[#FFB95B]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#FFB49C]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            Organización clara, justa y transparente para tu hogar
          </h2>
          <p className="text-base sm:text-lg text-[#CDC5B4] leading-relaxed">
            Olvídate de las discusiones sobre quién limpia más. Kimito
            automatiza el reparto, valida con fotos y recompensa la constancia.
          </p>
        </div>

        {/* 12-Column Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Card 1: Tall Left (Fair Chore Algorithm) - 7 cols on medium/large */}
          <div className="md:col-span-7 bg-[#2A2823] rounded-[32px] p-8 border border-[#4D4639] shadow-xl flex flex-col justify-between group hover:border-[#FFB95B]/40 hover:-translate-y-1 transition-all duration-300">
            <div className="space-y-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-[#FFB95B]/10 flex items-center justify-center text-[#FFB95B]">
                <Scale className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-extrabold text-white">
                Algoritmo de Reparto Equitativo
              </h3>
              <p className="text-[#CDC5B4] text-sm leading-relaxed">
                Cada tarea tiene una ponderación basada en esfuerzo real
                (puntos). El algoritmo Greedy Bin-Packing distribuye la carga
                semanal exacta entre todos los roomies.
              </p>
            </div>

            {/* Visual: Live Effort Distribution Chart */}
            <div className="bg-[#1D1B16] rounded-2xl p-5 border border-[#4D4639] space-y-4">
              <div className="flex items-center justify-between text-xs font-bold text-white">
                <span className="flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-[#FFB95B]" />
                  Distribución de Carga Semanal
                </span>
                <span className="text-[#FFB95B] bg-[#FFB95B]/10 px-2.5 py-0.5 rounded-full text-[11px] font-bold">
                  Balance 100% Justo
                </span>
              </div>

              <div className="space-y-3">
                {/* User 1 */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-white">
                    <span>Luis A. (Tú)</span>
                    <span className="text-[#FFB95B]">12 pts (3 tareas)</span>
                  </div>
                  <div className="w-full bg-[#2A2823] h-3 rounded-full overflow-hidden">
                    <div className="bg-[#FFB95B] h-full rounded-full transition-all duration-500 w-[100%]" />
                  </div>
                </div>

                {/* User 2 */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-white">
                    <span>Sofía R.</span>
                    <span className="text-[#FFB49C]">12 pts (2 tareas)</span>
                  </div>
                  <div className="w-full bg-[#2A2823] h-3 rounded-full overflow-hidden">
                    <div className="bg-[#FFB49C] h-full rounded-full transition-all duration-500 w-[100%]" />
                  </div>
                </div>

                {/* User 3 */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-white">
                    <span>Carlos M.</span>
                    <span className="text-[#FFDDA6]">11 pts (3 tareas)</span>
                  </div>
                  <div className="w-full bg-[#2A2823] h-3 rounded-full overflow-hidden">
                    <div className="bg-[#FFDDA6] h-full rounded-full transition-all duration-500 w-[92%]" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Photo Verification - 5 cols */}
          <div className="md:col-span-5 bg-[#2A2823] rounded-[32px] p-8 border border-[#4D4639] shadow-xl flex flex-col justify-between group hover:border-[#FFB95B]/40 hover:-translate-y-1 transition-all duration-300">
            <div className="space-y-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-[#FFB95B]/10 flex items-center justify-center text-[#FFB95B]">
                <Camera className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-extrabold text-white">
                Evidencia Fotográfica
              </h3>
              <p className="text-[#CDC5B4] text-sm leading-relaxed">
                Toma o sube una foto al terminar. La evidencia queda registrada
                con fecha y hora para evitar malos entendidos.
              </p>
            </div>

            {/* Visual: Photo card preview */}
            <div className="relative rounded-2xl overflow-hidden border border-[#4D4639] shadow-sm">
              <img
                src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&auto=format&fit=crop&q=80"
                alt="Verificación foto cocina"
                className="w-full h-44 object-cover"
              />
              <div className="absolute top-3 right-3 bg-[#FFB95B] text-[#472A00] px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-md">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>✓ Verificado</span>
              </div>
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 text-white text-xs">
                <p className="font-bold text-white">Limpieza Profunda de Cocina</p>
                <p className="text-[#CDC5B4] text-[11px]">
                  Subido por Sofía R. • Hoy, 10:15 AM
                </p>
              </div>
            </div>
          </div>

          {/* Card 3: Passport Score - 5 cols */}
          <div className="md:col-span-5 bg-[#2A2823] rounded-[32px] p-8 border border-[#4D4639] shadow-xl flex flex-col justify-between group hover:border-[#FFB95B]/40 hover:-translate-y-1 transition-all duration-300">
            <div className="space-y-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-[#FFB95B]/10 flex items-center justify-center text-[#FFB95B]">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-extrabold text-white">
                Pasaporte de Reputación
              </h3>
              <p className="text-[#CDC5B4] text-sm leading-relaxed">
                Tu historial de aseo se convierte en un score público. Úsalo
                como tu carta de presentación al buscar tu siguiente casa.
              </p>
            </div>

            {/* Visual: Score Passport Badge */}
            <div className="bg-[#1D1B16] rounded-2xl p-5 border border-[#4D4639] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#CDC5B4] font-semibold">
                  Reputación Acumulada
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-[#FFB95B] bg-[#FFB95B]/10 px-2.5 py-0.5 rounded-full">
                  <ShieldCheck className="w-3.5 h-3.5" /> Roommate Nivel Top
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-white">4.9</span>
                <span className="text-[#CDC5B4] font-bold text-sm">
                  / 5.0 Estrellas
                </span>
                <div className="flex text-[#FFB95B] ml-auto">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Card 4: Web Push Notifications - 7 cols */}
          <div className="md:col-span-7 bg-[#2A2823] rounded-[32px] p-8 border border-[#4D4639] shadow-xl flex flex-col justify-between group hover:border-[#FFB95B]/40 hover:-translate-y-1 transition-all duration-300">
            <div className="space-y-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-[#FFB95B]/10 flex items-center justify-center text-[#FFB95B]">
                <BellRing className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-extrabold text-white">
                Notificaciones Web Push Nativas
              </h3>
              <p className="text-[#CDC5B4] text-sm leading-relaxed">
                Recibe alertas en tiempo real con estándar VAPID cuando te
                asignen una tarea o un roommate suba su evidencia.
              </p>
            </div>

            {/* Visual: Stacked Notification Preview */}
            <div className="space-y-2.5">
              <div className="bg-[#1D1B16] p-3.5 rounded-2xl border border-[#4D4639] flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-[#FFB95B]/10 flex items-center justify-center text-[#FFB95B] shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-white">
                      Luis completó &quot;Sacar la basura&quot;
                    </p>
                    <p className="text-[11px] text-[#CDC5B4]">
                      Foto adjunta • Hace 5 min
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-extrabold text-[#FFB95B] bg-[#FFB95B]/10 px-2 py-0.5 rounded-md">
                  Web Push
                </span>
              </div>

              <div className="bg-[#1D1B16] p-3.5 rounded-2xl border border-[#4D4639] flex items-center justify-between text-xs opacity-80">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-[#FFDDA6]/10 flex items-center justify-center text-[#FFDDA6] shrink-0">
                    <Scale className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-white">
                      Nuevas tareas asignadas para el Lunes
                    </p>
                    <p className="text-[11px] text-[#CDC5B4]">
                      Cron Job Automático • Hace 1 hora
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-extrabold text-[#FFDDA6] bg-[#FFDDA6]/10 px-2 py-0.5 rounded-md">
                  Asignado
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import { Home, Sliders, CheckCheck, Award } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Registra o Únete a tu Casa",
      description:
        "Crea tu espacio compartido e invita a tus roomies mediante un enlace seguro o código de invitación.",
      icon: Home,
      accentColor: "text-[#855300]",
      bgColor: "bg-[#855300]/10",
    },
    {
      number: "02",
      title: "Define Pesos y Complejidad",
      description:
        "Asigna puntos de esfuerzo a cada labor. Kimito calcula la repartición semanal perfecta sin favoritismos.",
      icon: Sliders,
      accentColor: "text-[#F59E0B]",
      bgColor: "bg-[#F59E0B]/15",
    },
    {
      number: "03",
      title: "Cumple y Sube tu Foto",
      description:
        "Completa tus tareas asignadas y adjunta la foto evidencia. Tus roomies reciben alertas Web Push al instante.",
      icon: CheckCheck,
      accentColor: "text-[#006B5F]",
      bgColor: "bg-[#006B5F]/10",
    },
    {
      number: "04",
      title: "Construye tu Pasaporte",
      description:
        "Cada tarea a tiempo mejora tu calificación. Usa tu reputación certificada para conseguir excelentes casas o roomies.",
      icon: Award,
      accentColor: "text-[#AC3400]",
      bgColor: "bg-[#AC3400]/10",
    },
  ];

  return (
    <section
      id="how-it-works"
      className="py-24 bg-[#F4EFE6]/60 border-y border-[#E8E1D3]/80 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#1D1B16] tracking-tight">
            ¿Cómo funciona Kimito?
          </h2>
          <p className="text-base sm:text-lg text-[#1D1B16]/75 leading-relaxed">
            Cuatro sencillos pasos para transformar la convivencia y mantener el
            orden sin complicaciones.
          </p>
        </div>

        {/* 4-Step Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="relative bg-white rounded-3xl p-8 border border-[#E8E1D3] shadow-md shadow-[#855300]/5 flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
              >
                {/* Large Ghost Numeral in Background */}
                <span className="absolute top-4 right-6 text-6xl font-black text-[#855300]/10 group-hover:text-[#855300]/20 transition-colors select-none">
                  {step.number}
                </span>

                <div className="space-y-5 relative z-10">
                  {/* Icon */}
                  <div
                    className={`w-14 h-14 rounded-2xl ${step.bgColor} flex items-center justify-center ${step.accentColor} transition-transform duration-300 group-hover:scale-110`}
                  >
                    <Icon className="w-7 h-7" />
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-2">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-[#855300]">
                      Paso {index + 1}
                    </span>
                    <h3 className="text-xl font-extrabold text-[#1D1B16] leading-snug">
                      {step.title}
                    </h3>
                    <p className="text-sm text-[#1D1B16]/70 leading-relaxed pt-1">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

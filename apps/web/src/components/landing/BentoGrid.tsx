"use client";

import { Sparkles } from "lucide-react";

export function BentoGrid() {
  const row1 = [
    {
      id: "r1-1",
      title: "Algoritmo Greedy",
      desc: "Reparto equitativo y justo de tareas domésticas",
      img: "https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?w=600&auto=format&fit=crop&q=80",
      wide: true,
      tag: "Inteligencia",
    },
    {
      id: "r1-2",
      title: "Fotos de cocina",
      desc: "Cocinas ordenadas e impecables",
      img: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&auto=format&fit=crop&q=80",
      wide: false,
      tag: "Evidencia",
    },
    {
      id: "r1-3",
      title: "Push nativas",
      desc: "Alertas VAPID en tiempo real al instante",
      img: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&auto=format&fit=crop&q=80",
      wide: true,
      tag: "Web Push",
    },
    {
      id: "r1-4",
      title: "Convivencia feliz",
      desc: "Paz mental sin discusiones de aseo",
      img: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&auto=format&fit=crop&q=80",
      wide: false,
      tag: "Comunidad",
    },
  ];

  const row2 = [
    {
      id: "r2-1",
      title: "Pasaporte roommate",
      desc: "Reputación pública y verificable",
      img: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&auto=format&fit=crop&q=80",
      wide: false,
      tag: "Reputación",
    },
    {
      id: "r2-2",
      title: "Baño impecable",
      desc: "Turnos y cumplimiento estricto",
      img: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&auto=format&fit=crop&q=80",
      wide: true,
      tag: "Limpieza",
    },
    {
      id: "r2-3",
      title: "Perfil roomie",
      desc: "Presenta tu score al cambiar de casa",
      img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80",
      wide: false,
      tag: "Roommates",
    },
    {
      id: "r2-4",
      title: "Marketplace de cuartos",
      desc: "Busca u ofrece habitaciones seguras",
      img: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&auto=format&fit=crop&q=80",
      wide: true,
      tag: "Marketplace",
    },
  ];

  return (
    <section
      id="features"
      className="py-24 bg-[#15130E] text-white relative overflow-hidden"
    >
      {/* GPU Optimized Marquee Keyframes */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes marquee-l {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
        @keyframes marquee-r {
          0% { transform: translate3d(-50%, 0, 0); }
          100% { transform: translate3d(0, 0, 0); }
        }
        .animate-marquee-l {
          animation: marquee-l 40s linear infinite;
          will-change: transform;
        }
        .animate-marquee-r {
          animation: marquee-r 40s linear infinite;
          will-change: transform;
        }
      `}} />

      {/* Background Subtle Blurs */}
      <div className="absolute top-1/3 left-10 w-96 h-96 bg-[#FFB95B]/5 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#FFB49C]/5 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="w-full mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 px-4 sm:px-6 lg:px-8 space-y-4">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            Diseñado para el día a día en casa
          </h2>
          <p className="text-base sm:text-lg text-[#CDC5B4]/80 leading-relaxed max-w-2xl mx-auto">
            Explora las herramientas visuales que hacen que organizar el aseo de áreas comunes sea una experiencia equitativa y transparente.
          </p>
        </div>

        {/* Marquee Wrapper Container - Constrained to Hero Width & Fully Integrated */}
        <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8 w-full overflow-hidden relative select-none flex flex-col gap-5">
          
          {/* Row 1: Scrolls Left */}
          <div className="flex w-max animate-marquee-l gap-4">
            {/* Main Set */}
            <div className="flex gap-4 shrink-0">
              {row1.map((card) => (
                <div
                  key={card.id}
                  className={`relative h-[320px] sm:h-[440px] rounded-[24px] overflow-hidden border border-[#4D4639]/80 shadow-md group shrink-0 ${
                    card.wide ? "w-[300px] sm:w-[440px]" : "w-[180px] sm:w-[240px]"
                  }`}
                >
                  <img
                    src={card.img}
                    alt={card.title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  {/* Subtle dark gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent z-10" />
                  
                  {/* Content overlay */}
                  <div className="absolute inset-0 p-5 flex flex-col justify-between z-20">
                    <span className="self-start text-[9px] font-extrabold uppercase tracking-widest text-[#FFB95B] bg-[#FFB95B]/10 border border-[#FFB95B]/20 px-2 py-0.5 rounded">
                      {card.tag}
                    </span>
                    <div className="space-y-1 text-left">
                      <h4 className="text-sm sm:text-lg font-bold text-white leading-tight">
                        {card.title}
                      </h4>
                      <p className="text-[10px] sm:text-xs text-[#CDC5B4]/90 line-clamp-2 leading-snug">
                        {card.desc}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* Duplicate Set for Seamless Loop */}
            <div className="flex gap-4 shrink-0" aria-hidden="true">
              {row1.map((card) => (
                <div
                  key={`${card.id}-dup`}
                  className={`relative h-[320px] sm:h-[440px] rounded-[24px] overflow-hidden border border-[#4D4639]/80 shadow-md group shrink-0 ${
                    card.wide ? "w-[300px] sm:w-[440px]" : "w-[180px] sm:w-[240px]"
                  }`}
                >
                  <img
                    src={card.img}
                    alt={card.title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent z-10" />
                  <div className="absolute inset-0 p-5 flex flex-col justify-between z-20">
                    <span className="self-start text-[9px] font-extrabold uppercase tracking-widest text-[#FFB95B] bg-[#FFB95B]/10 border border-[#FFB95B]/20 px-2 py-0.5 rounded">
                      {card.tag}
                    </span>
                    <div className="space-y-1 text-left">
                      <h4 className="text-sm sm:text-lg font-bold text-white leading-tight">
                        {card.title}
                      </h4>
                      <p className="text-[10px] sm:text-xs text-[#CDC5B4]/90 line-clamp-2 leading-snug">
                        {card.desc}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Row 2: Scrolls Right */}
          <div className="flex w-max animate-marquee-r gap-4">
            {/* Main Set */}
            <div className="flex gap-4 shrink-0">
              {row2.map((card) => (
                <div
                  key={card.id}
                  className={`relative h-[320px] sm:h-[440px] rounded-[24px] overflow-hidden border border-[#4D4639]/80 shadow-md group shrink-0 ${
                    card.wide ? "w-[300px] sm:w-[440px]" : "w-[180px] sm:w-[240px]"
                  }`}
                >
                  <img
                    src={card.img}
                    alt={card.title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  {/* Subtle dark gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent z-10" />
                  
                  {/* Content overlay */}
                  <div className="absolute inset-0 p-5 flex flex-col justify-between z-20">
                    <span className="self-start text-[9px] font-extrabold uppercase tracking-widest text-[#FFDDA6] bg-[#FFDDA6]/10 border border-[#FFDDA6]/20 px-2 py-0.5 rounded">
                      {card.tag}
                    </span>
                    <div className="space-y-1 text-left">
                      <h4 className="text-sm sm:text-lg font-bold text-white leading-tight">
                        {card.title}
                      </h4>
                      <p className="text-[10px] sm:text-xs text-[#CDC5B4]/90 line-clamp-2 leading-snug">
                        {card.desc}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* Duplicate Set for Seamless Loop */}
            <div className="flex gap-4 shrink-0" aria-hidden="true">
              {row2.map((card) => (
                <div
                  key={`${card.id}-dup`}
                  className={`relative h-[320px] sm:h-[440px] rounded-[24px] overflow-hidden border border-[#4D4639]/80 shadow-md group shrink-0 ${
                    card.wide ? "w-[300px] sm:w-[440px]" : "w-[180px] sm:w-[240px]"
                  }`}
                >
                  <img
                    src={card.img}
                    alt={card.title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent z-10" />
                  <div className="absolute inset-0 p-5 flex flex-col justify-between z-20">
                    <span className="self-start text-[9px] font-extrabold uppercase tracking-widest text-[#FFDDA6] bg-[#FFDDA6]/10 border border-[#FFDDA6]/20 px-2 py-0.5 rounded">
                      {card.tag}
                    </span>
                    <div className="space-y-1 text-left">
                      <h4 className="text-sm sm:text-lg font-bold text-white leading-tight">
                        {card.title}
                      </h4>
                      <p className="text-[10px] sm:text-xs text-[#CDC5B4]/90 line-clamp-2 leading-snug">
                        {card.desc}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

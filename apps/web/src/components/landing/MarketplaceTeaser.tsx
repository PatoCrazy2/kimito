"use client";

import Link from "next/link";
import { Star, ShieldCheck, MapPin, Sparkles, ArrowRight, Heart } from "lucide-react";

export function MarketplaceTeaser() {
  const listings = [
    {
      id: 1,
      name: "Valentina R.",
      role: "Habitación Disponible",
      location: "Roma Norte, CDMX",
      price: "$8,500 MXN",
      period: "/ mes",
      rating: 4.9,
      reviews: 18,
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80",
      image:
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&auto=format&fit=crop&q=80",
      badges: ["Organizada", "No fumadora", "Pet Friendly", "Home Office"],
      verified: true,
    },
    {
      id: 2,
      name: "Mateo H.",
      role: "Busca Habitación / Roommate",
      location: "Condesa / Juarez",
      price: "Presupuesto $7,500",
      period: "/ mes",
      rating: 5.0,
      reviews: 24,
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80",
      image:
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&auto=format&fit=crop&q=80",
      badges: ["Madrugador", "Cocina rico", "100% Puntual", "Tranquilo"],
      verified: true,
    },
    {
      id: 3,
      name: "Camila & Sofía",
      role: "Habitación Baño Privado",
      location: "Polanco / Anzures",
      price: "$9,200 MXN",
      period: "/ mes",
      rating: 4.8,
      reviews: 12,
      avatar:
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80",
      image:
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&auto=format&fit=crop&q=80",
      badges: ["Limpieza Top", "Silenciosas", "Verificados S3"],
      verified: true,
    },
  ];

  return (
    <section id="marketplace" className="py-24 bg-[#FAF9F6] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="space-y-4 max-w-2xl text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#006B5F]/10 border border-[#006B5F]/20 text-[#006B5F] text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-[#006B5F]" />
              <span>Comunidad Verificada</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#1D1B16] tracking-tight">
              Marketplace de Roommates
            </h2>
            <p className="text-base sm:text-lg text-[#1D1B16]/70 leading-relaxed">
              Encuentra a tu próximo compañero con Pasaporte de Reputación verificado o publica tu habitación disponible.
            </p>
          </div>

          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-base font-bold text-[#855300] hover:text-[#5A3800] group shrink-0"
          >
            <span>Ver todas las publicaciones</span>
            <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>

        {/* 3 Profile Teaser Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {listings.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-[32px] border border-[#E8E1D3] overflow-hidden shadow-md shadow-[#855300]/5 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col group"
            >
              {/* Image Preview Container */}
              <div className="relative h-52 overflow-hidden bg-[#F4EFE6]">
                <img
                  src={item.image}
                  alt={item.role}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <button
                  aria-label="Guardar en favoritos"
                  className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-[#1D1B16]/60 hover:text-[#AC3400] hover:bg-white transition-colors shadow-sm"
                >
                  <Heart className="w-5 h-5" />
                </button>

                <div className="absolute bottom-3 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-black text-[#1D1B16] shadow-sm">
                  {item.price} <span className="font-normal text-[#1D1B16]/70">{item.period}</span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                {/* User Info */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.avatar}
                      alt={item.name}
                      className="w-11 h-11 rounded-full object-cover border-2 border-[#F59E0B]"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-extrabold text-base text-[#1D1B16]">{item.name}</span>
                        {item.verified && (
                          <ShieldCheck className="w-4 h-4 text-[#006B5F]" />
                        )}
                      </div>
                      <p className="text-xs text-[#1D1B16]/60 font-medium">{item.role}</p>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-1 bg-[#F59E0B]/10 px-2.5 py-1 rounded-full text-xs font-bold text-[#855300]">
                    <Star className="w-3.5 h-3.5 fill-[#F59E0B] text-[#F59E0B]" />
                    <span>{item.rating}</span>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-center gap-1.5 text-xs text-[#1D1B16]/70 font-medium">
                  <MapPin className="w-4 h-4 text-[#006B5F]" />
                  <span>{item.location}</span>
                </div>

                {/* Lifestyle Badge Chips */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {item.badges.map((badge, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-[#FAF9F6] border border-[#E8E1D3] text-[11px] font-semibold text-[#1D1B16]/80"
                    >
                      {badge}
                    </span>
                  ))}
                </div>

                {/* Bottom CTA */}
                <div className="pt-2 border-t border-[#F4EFE6]">
                  <Link
                    href="/login"
                    className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-full bg-[#FAF9F6] hover:bg-[#F4EFE6] text-xs font-bold text-[#855300] transition-colors"
                  >
                    <span>Ver Perfil Completo</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

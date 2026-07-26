import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";

export default async function HomePage() {
  const session = await auth();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen bg-[#FAF9F6] text-[#1D1B16] flex flex-col selection:bg-[#F59E0B]/20 selection:text-[#855300]">
      {/* Sticky Navigation */}
      <Navbar />

      {/* Hero Section */}
      <Hero />

      {/* Placeholder sections for smooth navigation preview */}
      <div id="features" className="py-12 text-center text-sm text-[#1D1B16]/40 border-t border-[#E8E1D3]/40">
        [Sección Características - Parte 2]
      </div>
      <div id="how-it-works" className="py-12 text-center text-sm text-[#1D1B16]/40 border-t border-[#E8E1D3]/40">
        [Sección Cómo Funciona - Parte 2]
      </div>
      <div id="marketplace" className="py-12 text-center text-sm text-[#1D1B16]/40 border-t border-[#E8E1D3]/40">
        [Sección Marketplace - Parte 3]
      </div>
      <div id="reputation" className="py-12 text-center text-sm text-[#1D1B16]/40 border-t border-[#E8E1D3]/40">
        [Sección Reputación - Parte 3]
      </div>
    </main>
  );
}

import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { BentoGrid } from "@/components/landing/BentoGrid";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { MarketplaceTeaser } from "@/components/landing/MarketplaceTeaser";
import { CtaBanner } from "@/components/landing/CtaBanner";
import { Footer } from "@/components/landing/Footer";

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

      {/* Bento Grid Feature Highlights */}
      <BentoGrid />

      {/* How It Works Step-by-Step */}
      <HowItWorks />

      {/* Roommate Marketplace Teaser */}
      <MarketplaceTeaser />

      {/* High-Impact CTA Banner */}
      <CtaBanner />

      {/* Footer */}
      <Footer />
    </main>
  );
}

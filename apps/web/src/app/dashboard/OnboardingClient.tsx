"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createHouseAction } from "@/app/actions/house-actions";
import { cn } from "@/lib/utils";

interface OnboardingClientProps {
  userName: string;
}

export default function OnboardingClient({ userName }: OnboardingClientProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
  });
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setIsLoading(true);
    setError("");
    try {
      await createHouseAction({
        name: formData.name,
        description: formData.description || undefined,
        address: formData.address || undefined,
      });
      setIsOpen(false);
      router.refresh();
    } catch (err: any) {
      console.error(err);
      setError("Ocurrió un error al crear la casa. Por favor intenta de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 py-8 animate-in fade-in duration-300">
      <div className="w-20 h-20 bg-amber-primary/10 rounded-full flex items-center justify-center mb-6">
        <span className="material-symbols-rounded text-amber-primary text-4xl">home_work</span>
      </div>
      
      <h1 className="font-sans font-black text-3xl text-foreground tracking-tight mb-3">
        ¡Hola, {userName.split(" ")[0]}! ✨
      </h1>
      
      <p className="font-medium text-muted-foreground max-w-md mb-8 leading-relaxed text-sm">
        Organizar las tareas del hogar nunca fue tan fácil y equitativo. Para comenzar, crea tu propio hogar o busca roommates y casas disponibles.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
        <button
          onClick={() => setIsOpen(true)}
          className="flex-1 bg-amber-primary hover:bg-amber-primary/95 text-white font-bold py-3.5 px-6 rounded-2xl transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
        >
          <span className="material-symbols-rounded text-lg">add_home</span>
          Crear un Hogar
        </button>
        <button
          onClick={() => router.push("/dashboard/listings")}
          className="flex-1 bg-[#006B5F]/10 hover:bg-[#006B5F]/15 text-[#006B5F] font-bold py-3.5 px-6 rounded-2xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
        >
          <span className="material-symbols-rounded text-lg">search</span>
          Buscar Hogar
        </button>
      </div>

      {/* Bottom Sheet Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-xs animate-in fade-in duration-300">
          <div 
            className="fixed inset-0" 
            onClick={() => !isLoading && setIsOpen(false)} 
          />
          <div className="relative bg-card w-full max-w-md rounded-t-3xl p-6 pb-8 shadow-[0_-8px_30px_rgba(0,0,0,0.1)] border-t border-border/20 z-10 animate-in slide-in-from-bottom duration-300">
            {/* Handle bar */}
            <div className="w-12 h-1.5 bg-muted-foreground/20 rounded-full mx-auto mb-6" />

            <div className="text-left mb-6">
              <h2 className="font-sans font-black text-xl text-foreground">Crear un nuevo hogar</h2>
              <p className="text-xs font-medium text-muted-foreground mt-1">
                Completa los datos de tu casa para invitar a tus roommates.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              {error && (
                <div className="p-3 bg-destructive/10 text-destructive text-xs font-bold rounded-xl">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="name" className="block text-xs font-bold text-foreground mb-1.5 uppercase tracking-wider">
                  Nombre del hogar <span className="text-destructive">*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  placeholder="Ej: Depto 402, Casa San Miguel"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  disabled={isLoading}
                  className="w-full bg-[#FAF9F6] border border-border/40 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-primary/20 font-medium"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-xs font-bold text-foreground mb-1.5 uppercase tracking-wider">
                  Descripción
                </label>
                <input
                  id="description"
                  type="text"
                  placeholder="Ej: Casa de estudiantes"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  disabled={isLoading}
                  className="w-full bg-[#FAF9F6] border border-border/40 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-primary/20 font-medium"
                />
              </div>

              <div>
                <label htmlFor="address" className="block text-xs font-bold text-foreground mb-1.5 uppercase tracking-wider">
                  Dirección
                </label>
                <input
                  id="address"
                  type="text"
                  placeholder="Ej: Calle 5 de Mayo #45"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  disabled={isLoading}
                  className="w-full bg-[#FAF9F6] border border-border/40 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-primary/20 font-medium"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  disabled={isLoading}
                  className="flex-1 border border-border/60 hover:bg-muted text-foreground font-bold py-3 px-4 rounded-xl text-xs transition-all duration-200 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isLoading || !formData.name.trim()}
                  className="flex-1 bg-amber-primary hover:bg-amber-primary/95 text-white font-bold py-3 px-4 rounded-xl text-xs transition-all duration-200 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Creando...
                    </>
                  ) : (
                    "Crear Hogar"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

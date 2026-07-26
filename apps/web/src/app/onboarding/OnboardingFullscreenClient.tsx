"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createHouseAction, joinHouseAction } from "@/app/actions/house-actions";
import { KimitoLogo } from "@/components/KimitoLogo";

interface OnboardingFullscreenClientProps {
  userName: string;
}

export default function OnboardingFullscreenClient({ userName }: OnboardingFullscreenClientProps) {
  const router = useRouter();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isJoinOpen, setIsJoinOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
  });
  const [inviteCode, setInviteCode] = useState("");
  const [error, setError] = useState("");

  const handleCreateSubmit = async (e: React.FormEvent) => {
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
      setIsCreateOpen(false);
      router.push("/dashboard");
    } catch (err: any) {
      console.error(err);
      setError("Ocurrió un error al crear la casa. Por favor intenta de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteCode.trim()) return;

    setIsLoading(true);
    setError("");
    try {
      await joinHouseAction(inviteCode.trim());
      setIsJoinOpen(false);
      router.push("/dashboard");
    } catch (err: any) {
      console.error(err);
      setError("Código de invitación inválido o error al unirse.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex flex-col items-center justify-center p-6 animate-in fade-in duration-300">
      <div className="w-full max-w-sm flex flex-col items-center">
        {/* Brand Logo in flow */}
        <div className="flex items-center gap-2 mb-8 select-none justify-center">
          <KimitoLogo size={30} />
          <span className="font-sans font-black text-2xl tracking-tight text-[#1D1B16]">
            Kimito
          </span>
        </div>

        {/* Left-aligned Content */}
        <div className="text-left w-full space-y-2 mb-6">
          <h1 className="font-sans font-black text-3xl text-[#1D1B16] tracking-tight">
            ¡Hola, {userName.split(" ")[0]}!
          </h1>
          <p className="text-sm font-medium text-muted-foreground/80 leading-relaxed">
            Crea tu propio hogar o únete a uno existente para comenzar a organizar las tareas compartidas.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-3.5 w-full">
          <button
            onClick={() => setIsCreateOpen(true)}
            className="w-full bg-amber-primary hover:bg-amber-primary/95 text-white font-bold py-3.5 px-6 rounded-2xl transition-all duration-200 shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
          >
            <span className="material-symbols-rounded text-lg">add_home</span>
            Crear un Hogar
          </button>
          <button
            onClick={() => setIsJoinOpen(true)}
            className="w-full bg-[#006B5F]/10 hover:bg-[#006B5F]/15 text-[#006B5F] font-bold py-3.5 px-6 rounded-2xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
          >
            <span className="material-symbols-rounded text-lg">group_add</span>
            Unirme a casa
          </button>
        </div>

        {/* Skip Link */}
        <Link 
          href="/dashboard?skip=true"
          className="mt-8 text-xs font-bold text-muted-foreground/60 hover:text-muted-foreground transition-colors underline decoration-dotted underline-offset-4 cursor-pointer"
        >
          Omitir por ahora
        </Link>
      </div>

      {/* Modal: Crear Casa */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-xs animate-in fade-in duration-300">
          <div 
            className="fixed inset-0" 
            onClick={() => !isLoading && setIsCreateOpen(false)} 
          />
          <div className="relative bg-card w-full max-w-md rounded-t-3xl p-6 pb-8 shadow-[0_-8px_30px_rgba(0,0,0,0.1)] border-t border-border/20 z-10 animate-in slide-in-from-bottom duration-300">
            <div className="w-12 h-1.5 bg-muted-foreground/20 rounded-full mx-auto mb-6" />

            <div className="text-left mb-6">
              <h2 className="font-sans font-black text-xl text-foreground">Crear un nuevo hogar</h2>
              <p className="text-xs font-medium text-muted-foreground mt-1">
                Completa los datos de tu casa para invitar a tus roommates.
              </p>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-left">
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
                  onClick={() => setIsCreateOpen(false)}
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

      {/* Modal: Unirme a Casa */}
      {isJoinOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-xs animate-in fade-in duration-300">
          <div 
            className="fixed inset-0" 
            onClick={() => !isLoading && setIsJoinOpen(false)} 
          />
          <div className="relative bg-card w-full max-w-md rounded-t-3xl p-6 pb-8 shadow-[0_-8px_30px_rgba(0,0,0,0.1)] border-t border-border/20 z-10 animate-in slide-in-from-bottom duration-300">
            <div className="w-12 h-1.5 bg-muted-foreground/20 rounded-full mx-auto mb-6" />

            <div className="text-left mb-6">
              <h2 className="font-sans font-black text-xl text-foreground">Unirme a un hogar</h2>
              <p className="text-xs font-medium text-muted-foreground mt-1">
                Ingresa el código de invitación proporcionado por tu roommate.
              </p>
            </div>

            <form onSubmit={handleJoinSubmit} className="space-y-4 text-left">
              {error && (
                <div className="p-3 bg-destructive/10 text-destructive text-xs font-bold rounded-xl">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="inviteCode" className="block text-xs font-bold text-foreground mb-1.5 uppercase tracking-wider">
                  Código de invitación <span className="text-destructive">*</span>
                </label>
                <input
                  id="inviteCode"
                  type="text"
                  required
                  placeholder="Ej: KIMITO-1234"
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value)}
                  disabled={isLoading}
                  className="w-full bg-[#FAF9F6] border border-border/40 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-primary/20 font-medium uppercase"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsJoinOpen(false)}
                  disabled={isLoading}
                  className="flex-1 border border-border/60 hover:bg-muted text-foreground font-bold py-3 px-4 rounded-xl text-xs transition-all duration-200 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isLoading || !inviteCode.trim()}
                  className="flex-1 bg-amber-primary hover:bg-amber-primary/95 text-white font-bold py-3 px-4 rounded-xl text-xs transition-all duration-200 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Uniéndose...
                    </>
                  ) : (
                    "Unirme"
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

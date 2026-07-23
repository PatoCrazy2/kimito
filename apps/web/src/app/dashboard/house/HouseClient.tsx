"use client";

import { useState, useEffect } from "react";
import type { HouseResponse, HouseMemberResponse } from "@kimito/shared-types";
import { createHouseAction, joinHouseAction } from "@/app/actions/house-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import Image from "next/image";

interface HouseClientProps {
  initialHouse: HouseResponse | null;
  initialMembers: HouseMemberResponse[];
}

export default function HouseClient({ initialHouse, initialMembers }: HouseClientProps) {
  const [house, setHouse] = useState<HouseResponse | null>(initialHouse);
  const [members, setMembers] = useState<HouseMemberResponse[]>(initialMembers);
  const [origin, setOrigin] = useState("...");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
    }
  }, []);

  // Form states for creating a house
  const [createName, setCreateName] = useState("");
  const [createDescription, setCreateDescription] = useState("");
  const [createAddress, setCreateAddress] = useState("");
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState("");

  // Form states for joining a house
  const [joinCode, setJoinCode] = useState("");
  const [joinLoading, setJoinLoading] = useState(false);
  const [joinError, setJoinError] = useState("");

  // Copy state
  const [copied, setCopied] = useState(false);

  const handleCreateHouse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createName.trim()) return;
    setCreateLoading(true);
    setCreateError("");
    try {
      const newHouse = await createHouseAction({
        name: createName,
        description: createDescription || undefined,
        address: createAddress || undefined,
      });
      setHouse(newHouse);
      // reload members
      window.location.reload();
    } catch (err: any) {
      setCreateError(err.message || "Error al crear la casa");
    } finally {
      setCreateLoading(false);
    }
  };

  const handleJoinHouse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCode.trim()) return;
    setJoinLoading(true);
    setJoinError("");
    try {
      const joinedHouse = await joinHouseAction(joinCode.trim());
      setHouse(joinedHouse);
      window.location.reload();
    } catch (err: any) {
      setJoinError(err.message || "Error al unirse a la casa. Verifica el código.");
    } finally {
      setJoinLoading(false);
    }
  };

  const copyInviteLink = () => {
    if (!house) return;
    const origin = typeof window !== "undefined" ? window.location.origin : "http://localhost:3001";
    const inviteLink = `${origin}/join?code=${house.inviteCode}`;
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!house) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto py-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
        {/* CARD: Crear Casa */}
        <Card className="border-border/50 shadow-md rounded-3xl bg-white/70 backdrop-blur-md overflow-hidden flex flex-col justify-between">
          <div className="h-1.5 bg-gradient-to-r from-amber-primary to-amber-primary/50" />
          <CardHeader className="pt-6">
            <CardTitle className="text-xl font-black text-foreground flex items-center gap-2">
              <span className="material-symbols-rounded text-amber-primary">add_home</span>
              Crear un Hogar
            </CardTitle>
            <CardDescription className="font-medium text-muted-foreground text-xs mt-1">
              Crea un nuevo hogar y comparte el link para invitar a tus roommates.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleCreateHouse}>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Nombre del Hogar *</label>
                <Input
                  required
                  placeholder="Ej: Depto 402, Casa Central..."
                  value={createName}
                  onChange={(e) => setCreateName(e.target.value)}
                  className="rounded-xl border-border/60"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Descripción / Reglas Cortas</label>
                <textarea
                  placeholder="Reglas de convivencia básicas o descripción de la casa..."
                  value={createDescription}
                  onChange={(e) => setCreateDescription(e.target.value)}
                  rows={2}
                  className="w-full text-sm rounded-xl border border-border/60 bg-background px-3 py-2 placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Dirección (Opcional)</label>
                <Input
                  placeholder="Ej: Av. Providencia 1234, Depto 402"
                  value={createAddress}
                  onChange={(e) => setCreateAddress(e.target.value)}
                  className="rounded-xl border-border/60"
                />
              </div>
              {createError && (
                <p className="text-xs font-bold text-destructive flex items-center gap-1.5">
                  <span className="material-symbols-rounded text-sm">warning</span>
                  {createError}
                </p>
              )}
            </CardContent>
            <CardFooter className="pb-6">
              <Button type="submit" disabled={createLoading} className="w-full bg-amber-primary hover:bg-amber-primary/95 text-white font-bold rounded-xl py-5 shadow-sm">
                {createLoading ? "Creando..." : "Crear mi Casa"}
              </Button>
            </CardFooter>
          </form>
        </Card>

        {/* CARD: Unirse a Casa */}
        <Card className="border-border/50 shadow-md rounded-3xl bg-white/70 backdrop-blur-md overflow-hidden flex flex-col justify-between">
          <div className="h-1.5 bg-gradient-to-r from-teal-secondary to-teal-secondary/50" />
          <CardHeader className="pt-6">
            <CardTitle className="text-xl font-black text-foreground flex items-center gap-2">
              <span className="material-symbols-rounded text-teal-secondary">group_add</span>
              Unirse a un Hogar
            </CardTitle>
            <CardDescription className="font-medium text-muted-foreground text-xs mt-1">
              Ingresa el código de invitación que te compartió tu roommate.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleJoinHouse}>
            <CardContent className="space-y-4 flex-grow flex flex-col justify-center">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Código de Invitación</label>
                <Input
                  required
                  placeholder="Ej: A1B2C3D4"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value)}
                  className="rounded-xl border-border/60 font-mono tracking-widest text-center text-lg uppercase"
                />
              </div>
              {joinError && (
                <p className="text-xs font-bold text-destructive flex items-center gap-1.5 mt-2">
                  <span className="material-symbols-rounded text-sm">warning</span>
                  {joinError}
                </p>
              )}
            </CardContent>
            <CardFooter className="pb-6 mt-auto">
              <Button type="submit" disabled={joinLoading} className="w-full bg-teal-secondary hover:bg-teal-secondary/95 text-white font-bold rounded-xl py-5 shadow-sm">
                {joinLoading ? "Uniéndose..." : "Unirme a Casa"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-300">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 select-none">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
            🏡 {house.name}
          </h1>
          <p className="text-muted-foreground text-sm font-medium mt-1">
            Detalles y administración de los miembros y tareas de tu casa compartida.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna Izquierda: Información General */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card Detalle */}
          <Card className="border-border/50 shadow-sm rounded-3xl bg-white/70 backdrop-blur-md p-6">
            <h3 className="font-extrabold text-lg text-foreground flex items-center gap-2 mb-4">
              <span className="material-symbols-rounded text-amber-primary">info</span>
              Información de la Casa
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#FAF9F6] border border-border/30 rounded-2xl p-4">
                <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-0.5">Descripción / Reglas</h4>
                <p className="text-sm font-bold text-foreground leading-relaxed">{house.description || "Sin descripción disponible."}</p>
              </div>
              <div className="bg-[#FAF9F6] border border-border/30 rounded-2xl p-4">
                <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-0.5">Dirección</h4>
                <p className="text-sm font-bold text-foreground leading-relaxed">{house.address || "Sin dirección configurada."}</p>
              </div>
              <div className="bg-[#FAF9F6] border border-border/30 rounded-2xl p-4 md:col-span-2 flex items-center justify-between">
                <div>
                  <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-0.5">Link de Invitación Directa</h4>
                  <p className="text-xs font-mono text-muted-foreground select-all mt-1">
                    {origin}/join?code={house.inviteCode}
                  </p>
                </div>
                <Button onClick={copyInviteLink} className="rounded-xl px-4 py-2 font-bold shadow-sm shrink-0 flex items-center gap-1.5 ml-4">
                  <span className="material-symbols-rounded text-sm">
                    {copied ? "check" : "content_copy"}
                  </span>
                  {copied ? "Copiado" : "Copiar"}
                </Button>
              </div>
            </div>
          </Card>

          {/* Card Miembros */}
          <Card className="border-border/50 shadow-sm rounded-3xl bg-white/70 backdrop-blur-md p-6">
            <h3 className="font-extrabold text-lg text-foreground flex items-center gap-2 mb-4">
              <span className="material-symbols-rounded text-amber-primary">group</span>
              Miembros ({members.length})
            </h3>
            <div className="divide-y divide-border/30">
              {members.map((member) => (
                <div key={member.userId} className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    {member.avatarUrl ? (
                      <Image
                        src={member.avatarUrl}
                        alt={member.name}
                        width={40}
                        height={40}
                        className="rounded-full shadow-sm"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-amber-primary text-white flex items-center justify-center font-extrabold text-sm shadow-sm">
                        {member.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-bold text-foreground leading-tight">{member.name}</p>
                      <p className="text-xs font-medium text-muted-foreground mt-0.5">{member.email}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                    member.role === "ADMIN" 
                      ? "bg-amber-primary/10 text-amber-primary" 
                      : "bg-teal-secondary/10 text-teal-secondary"
                  }`}>
                    {member.role === "ADMIN" ? "Administrador" : "Roommate"}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Columna Derecha: Código QR / Tips Rápidos */}
        <div className="space-y-6">
          <Card className="border-border/50 shadow-sm rounded-3xl bg-[#FAF9F6] p-6 text-center flex flex-col justify-between min-h-[280px]">
            <div>
              <div className="w-12 h-12 bg-amber-primary/10 text-amber-primary rounded-2xl flex items-center justify-center mx-auto mb-3">
                <span className="material-symbols-rounded text-2xl font-bold">qr_code_2</span>
              </div>
              <h4 className="font-extrabold text-base text-foreground">Código de Invitación Rápido</h4>
              <p className="text-muted-foreground text-xs font-semibold mt-1">Comparte este código para unirse manualmente:</p>
              <div className="bg-white border border-border/30 rounded-2xl p-4 my-4 font-mono font-black text-2xl text-foreground tracking-widest uppercase select-all shadow-sm">
                {house.inviteCode}
              </div>
            </div>
            <p className="text-[10px] text-muted-foreground/80 leading-relaxed font-semibold">
              Cualquier persona con este código o link podrá unirse como roommate de tu hogar.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}

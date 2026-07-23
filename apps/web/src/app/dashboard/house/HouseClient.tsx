"use client";

import { useState, useEffect } from "react";
import type { HouseResponse, HouseMemberResponse, UserDto } from "@kimito/shared-types";
import { createHouseAction, joinHouseAction, updateHouseAction } from "@/app/actions/house-actions";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface HouseClientProps {
  initialHouse: HouseResponse | null;
  initialMembers: HouseMemberResponse[];
  currentUser: UserDto | null;
}

export default function HouseClient({ initialHouse, initialMembers, currentUser }: HouseClientProps) {
  const [house, setHouse] = useState<HouseResponse | null>(initialHouse);
  const [members, setMembers] = useState<HouseMemberResponse[]>(initialMembers);
  const [origin, setOrigin] = useState("...");
  const [activeSection, setActiveSection] = useState<"invite" | "info" | null>(null);

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

  // Edit house states
  const [isEditing, setIsEditing] = useState(false);
  const [editDescription, setEditDescription] = useState(house?.description || "");
  const [editAddress, setEditAddress] = useState(house?.address || "");
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState("");

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

  const handleUpdateHouse = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditLoading(true);
    setEditError("");
    try {
      const updatedHouse = await updateHouseAction({
        description: editDescription,
        address: editAddress,
      });
      setHouse(updatedHouse);
      setIsEditing(false);
    } catch (err: any) {
      setEditError(err.message || "Error al actualizar la información de la casa.");
    } finally {
      setEditLoading(false);
    }
  };

  const copyInviteLink = () => {
    if (!house) return;
    const inviteLink = `${origin}/join?code=${house.inviteCode}`;
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const currentUserMember = members.find(m => m.email === currentUser?.email || m.userId === currentUser?.id);
  const isAdmin = currentUserMember?.role === "ADMIN";

  if (!house) {
    return (
      <div className="flex flex-col gap-6 max-w-xl mx-auto py-4 animate-in fade-in duration-300">
        {/* CARD: Crear Casa */}
        <Card className="border-border/40 shadow-[0_4px_24px_rgba(133,83,0,0.02)] rounded-3xl bg-white p-6">
          <div className="text-left mb-6">
            <h2 className="font-sans font-black text-xl text-foreground">Crear un Hogar</h2>
            <p className="text-xs font-medium text-muted-foreground mt-1">
              Crea un nuevo hogar y comparte el link para invitar a tus roommates.
            </p>
          </div>
          <form onSubmit={handleCreateHouse} className="space-y-4">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-foreground mb-1.5 uppercase tracking-wider">Nombre del Hogar *</label>
              <Input
                required
                placeholder="Ej: Depto 402, Casa Central..."
                value={createName}
                onChange={(e) => setCreateName(e.target.value)}
                className="rounded-xl border-border/60"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-bold text-foreground mb-1.5 uppercase tracking-wider">Descripción / Reglas Cortas</label>
              <textarea
                placeholder="Reglas de convivencia básicas o descripción de la casa..."
                value={createDescription}
                onChange={(e) => setCreateDescription(e.target.value)}
                rows={2}
                className="w-full text-sm rounded-xl border border-border/40 bg-[#FAF9F6] px-3 py-2.5 placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-amber-primary/20 font-medium"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-bold text-foreground mb-1.5 uppercase tracking-wider">Dirección (Opcional)</label>
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
            <button type="submit" disabled={createLoading} className="w-full bg-amber-primary hover:bg-amber-primary/95 text-white font-bold rounded-xl py-3 shadow-sm cursor-pointer mt-2 text-xs">
              {createLoading ? "Creando..." : "Crear mi Casa"}
            </button>
          </form>
        </Card>

        {/* CARD: Unirse a Casa */}
        <Card className="border-border/40 shadow-[0_4px_24px_rgba(133,83,0,0.02)] rounded-3xl bg-white p-6">
          <div className="text-left mb-6">
            <h2 className="font-sans font-black text-xl text-foreground">Unirse a un Hogar</h2>
            <p className="text-xs font-medium text-muted-foreground mt-1">
              Ingresa el código de invitación que te compartió tu roommate.
            </p>
          </div>
          <form onSubmit={handleJoinHouse} className="space-y-4">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-foreground mb-1.5 uppercase tracking-wider">Código de Invitación</label>
              <Input
                required
                placeholder="Ej: A1B2C3D4"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value)}
                className="rounded-xl border-border/60 font-mono tracking-widest text-center text-lg uppercase"
              />
            </div>
            {joinError && (
              <p className="text-xs font-bold text-destructive flex items-center gap-1.5">
                <span className="material-symbols-rounded text-sm">warning</span>
                {joinError}
              </p>
            )}
            <button type="submit" disabled={joinLoading} className="w-full bg-teal-secondary hover:bg-teal-secondary/95 text-white font-bold rounded-xl py-3 shadow-sm cursor-pointer mt-2 text-xs">
              {joinLoading ? "Uniéndose..." : "Unirme a Casa"}
            </button>
          </form>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 select-none pb-2 border-b border-border/30">
        <div>
          <h1 className="font-sans font-black text-2xl text-foreground tracking-tight">
            {house.name}
          </h1>
          <p className="text-xs font-medium text-muted-foreground mt-1">
            Detalles y miembros de tu hogar compartido.
          </p>
        </div>
      </div>

      {/* Card Miembros al inicio */}
      <Card className="border-border/40 shadow-[0_4px_24px_rgba(133,83,0,0.02)] rounded-3xl bg-white p-5">
        <h3 className="font-sans font-black text-base text-foreground flex items-center gap-2 mb-4 select-none">
          <span className="material-symbols-rounded text-amber-primary">group</span>
          Miembros ({members.length})
        </h3>
        <div className="divide-y divide-border/20">
          {members.map((member) => (
            <div key={member.userId} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
              <div className="flex items-center gap-3">
                {member.avatarUrl ? (
                  <Image
                    src={member.avatarUrl}
                    alt={member.name}
                    width={36}
                    height={36}
                    className="rounded-full shadow-sm"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-amber-primary text-white flex items-center justify-center font-extrabold text-xs shadow-sm">
                    {member.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="text-left">
                  <p className="text-sm font-bold text-foreground leading-tight">{member.name}</p>
                  <p className="text-[10px] font-medium text-muted-foreground mt-0.5 max-w-[150px] truncate sm:max-w-none">{member.email}</p>
                </div>
              </div>
              <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
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

      {/* Dos botones abajo de los miembros */}
      <div className="flex gap-3 w-full">
        <button
          onClick={() => {
            setActiveSection(activeSection === "invite" ? null : "invite");
          }}
          className={cn(
            "flex-1 py-3 px-4 rounded-xl border font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer",
            activeSection === "invite"
              ? "bg-amber-primary/10 border-amber-primary/40 text-amber-primary"
              : "bg-white border-border/40 text-foreground hover:bg-[#FAF9F6]"
          )}
        >
          <span className="material-symbols-rounded text-base">forward_to_inbox</span>
          Invitar
        </button>
        <button
          onClick={() => {
            setActiveSection(activeSection === "info" ? null : "info");
          }}
          className={cn(
            "flex-1 py-3 px-4 rounded-xl border font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer",
            activeSection === "info"
              ? "bg-amber-primary/10 border-amber-primary/40 text-amber-primary"
              : "bg-white border-border/40 text-foreground hover:bg-[#FAF9F6]"
          )}
        >
          <span className="material-symbols-rounded text-base">info</span>
          Info de la casa
        </button>
      </div>

      {/* Contenido Desplegable: Invitar */}
      {activeSection === "invite" && (
        <Card className="border-border/40 shadow-[0_4px_24px_rgba(133,83,0,0.02)] rounded-3xl bg-white p-5 animate-in slide-in-from-top-2 duration-200">
          <div className="space-y-4 text-left">
            <div>
              <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Link de Invitación Directa</h4>
              <div className="flex items-center justify-between bg-[#FAF9F6] border border-border/30 rounded-xl p-3 mt-1.5 gap-2">
                <p className="text-xs font-mono text-muted-foreground truncate select-all">
                  {origin}/join?code={house.inviteCode}
                </p>
                <button 
                  onClick={copyInviteLink} 
                  className="rounded-lg bg-white border border-border/40 px-3 py-1.5 text-[10px] font-bold shadow-xs shrink-0 flex items-center gap-1 hover:bg-[#FAF9F6] cursor-pointer"
                >
                  <span className="material-symbols-rounded text-xs">
                    {copied ? "check" : "content_copy"}
                  </span>
                  {copied ? "Copiado" : "Copiar"}
                </button>
              </div>
            </div>
            
            <hr className="border-border/20" />

            <div>
              <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Código de Invitación Manual</h4>
              <div className="bg-[#FAF9F6] border border-border/30 rounded-xl p-4 mt-1.5 text-center font-mono font-black text-xl text-[#1D1B16] tracking-widest uppercase select-all">
                {house.inviteCode}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Contenido Desplegable: Info de la casa */}
      {activeSection === "info" && (
        <Card className="border-border/40 shadow-[0_4px_24px_rgba(133,83,0,0.02)] rounded-3xl bg-white p-5 animate-in slide-in-from-top-2 duration-200">
          <div className="text-left">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-sans font-black text-base text-foreground flex items-center gap-2">
                <span className="material-symbols-rounded text-amber-primary">home</span>
                Detalles del Hogar
              </h3>
              {isAdmin && !isEditing && (
                <button
                  onClick={() => {
                    setIsEditing(true);
                    setEditDescription(house.description || "");
                    setEditAddress(house.address || "");
                  }}
                  className="text-xs font-bold text-amber-primary hover:underline cursor-pointer flex items-center gap-1"
                >
                  <span className="material-symbols-rounded text-xs">edit</span>
                  Editar
                </button>
              )}
            </div>

            {isEditing ? (
              <form onSubmit={handleUpdateHouse} className="space-y-4">
                {editError && (
                  <div className="p-3 bg-destructive/10 text-destructive text-xs font-bold rounded-xl">
                    {editError}
                  </div>
                )}

                <div>
                  <label htmlFor="editDescription" className="block text-xs font-bold text-foreground mb-1.5 uppercase tracking-wider">Descripción / Reglas</label>
                  <textarea
                    id="editDescription"
                    placeholder="Reglas de convivencia..."
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    rows={3}
                    disabled={editLoading}
                    className="w-full text-sm rounded-xl border border-border/40 bg-[#FAF9F6] px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-primary/20 font-medium"
                  />
                </div>

                <div>
                  <label htmlFor="editAddress" className="block text-xs font-bold text-foreground mb-1.5 uppercase tracking-wider">Dirección</label>
                  <input
                    id="editAddress"
                    type="text"
                    placeholder="Dirección del hogar..."
                    value={editAddress}
                    onChange={(e) => setEditAddress(e.target.value)}
                    disabled={editLoading}
                    className="w-full bg-[#FAF9F6] border border-border/40 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-primary/20 font-medium"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    disabled={editLoading}
                    className="flex-1 border border-border/60 hover:bg-muted text-foreground font-bold py-2.5 px-4 rounded-xl text-xs transition-all duration-200 cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={editLoading}
                    className="flex-1 bg-amber-primary hover:bg-amber-primary/95 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-all duration-200 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                  >
                    {editLoading ? "Guardando..." : "Guardar"}
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="bg-[#FAF9F6] border border-border/30 rounded-2xl p-4">
                  <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Descripción / Reglas</h4>
                  <p className="text-xs font-medium text-foreground leading-relaxed whitespace-pre-wrap">
                    {house.description || "Sin descripción ni reglas registradas."}
                  </p>
                </div>
                <div className="bg-[#FAF9F6] border border-border/30 rounded-2xl p-4">
                  <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Dirección</h4>
                  <p className="text-xs font-medium text-foreground leading-relaxed">
                    {house.address || "Sin dirección registrada."}
                  </p>
                </div>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}

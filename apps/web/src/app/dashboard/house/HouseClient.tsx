"use client";

import { useState, useEffect } from "react";
import type { HouseResponse, HouseMemberResponse, UserDto } from "@kimito/shared-types";
import {
  createHouseAction,
  joinHouseAction,
  updateHouseAction,
  leaveHouseAction,
  kickMemberAction,
  deleteHouseAction,
  getMembershipHistoryAction,
} from "@/app/actions/house-actions";
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

  // Experience History State
  const [history, setHistory] = useState<any[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
    }

    // Fetch membership history
    const fetchHistory = async () => {
      setHistoryLoading(true);
      try {
        const data = await getMembershipHistoryAction();
        setHistory(data);
      } catch (err) {
        console.error("Error al cargar historial:", err);
      } finally {
        setHistoryLoading(false);
      }
    };
    fetchHistory();
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
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

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

  const handleShare = async () => {
    const inviteLink = `${origin}/join?code=${house?.inviteCode}`;
    const text = `¡Únete a mi casa en Kimito! Usa este enlace para unirte:`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Kimito - Invitación a Casa",
          text: `${text} ${inviteLink}`,
          url: inviteLink,
        });
        return;
      } catch (err) {
        console.log("Native share failed or dismissed", err);
      }
    }
    
    setShowShareMenu(!showShareMenu);
  };

  const copyInviteCode = () => {
    if (!house) return;
    navigator.clipboard.writeText(house.inviteCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleLeaveHouse = async () => {
    if (!confirm("¿Estás seguro de que deseas salir de la casa?")) return;
    setActionLoading(true);
    try {
      await leaveHouseAction();
      window.location.reload();
    } catch (err: any) {
      alert(err.message || "Error al salir de la casa");
    } finally {
      setActionLoading(false);
    }
  };

  const handleKickMember = async (userId: string, name: string) => {
    if (!confirm(`¿Estás seguro de que deseas expulsar a ${name} de la casa?`)) return;
    setActionLoading(true);
    try {
      await kickMemberAction(userId);
      setMembers((prev) => prev.filter((m) => m.userId !== userId));
    } catch (err: any) {
      alert(err.message || "Error al expulsar al miembro");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteHouse = async () => {
    if (
      !confirm(
        "¡ADVERTENCIA CRÍTICA! ¿Estás seguro de que deseas eliminar la casa? Esta acción es irreversible y eliminará todos los registros asociados de forma permanente."
      )
    )
      return;
    setActionLoading(true);
    try {
      await deleteHouseAction();
      window.location.reload();
    } catch (err: any) {
      alert(err.message || "Error al eliminar la casa");
    } finally {
      setActionLoading(false);
    }
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
            <button type="submit" disabled={joinLoading} className="w-full bg-amber-primary hover:bg-amber-primary/95 text-white font-bold rounded-xl py-3 shadow-sm cursor-pointer mt-2 text-xs">
              {joinLoading ? "Uniéndose..." : "Unirme a Casa"}
            </button>
          </form>
        </Card>

        {/* History CV Section (When user doesn't belong to any house) */}
        {history.length > 0 && (
          <Card className="border-border/40 shadow-[0_4px_24px_rgba(133,83,0,0.02)] rounded-3xl bg-white p-6">
            <h3 className="font-sans font-black text-base text-foreground flex items-center gap-2 mb-4 select-none">
              <span className="material-symbols-rounded text-amber-primary">history</span>
              Tu Historial de Roommate
            </h3>
            <div className="space-y-3">
              {history.map((hist) => (
                <div key={hist.id} className="bg-muted/30 border border-border/10 rounded-xl p-3 text-left">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-foreground">
                      Rol: {hist.role === "ADMIN" ? "Administrador" : "Roommate"}
                    </span>
                    <span className={cn(
                      "text-[9px] font-bold px-2 py-0.5 rounded-full uppercase",
                      hist.actionType === "LEFT" && "bg-green-50 text-green-700",
                      hist.actionType === "KICKED" && "bg-red-50 text-red-700",
                      hist.actionType === "HOUSE_DELETED" && "bg-amber-50 text-amber-700"
                    )}>
                      {hist.actionType === "LEFT" && "Salió"}
                      {hist.actionType === "KICKED" && "Expulsado"}
                      {hist.actionType === "HOUSE_DELETED" && "Casa disuelta"}
                    </span>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    Período: {new Date(hist.joinedAt).toLocaleDateString()} al {new Date(hist.leftAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        )}
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
              <div className="flex items-center gap-2">
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                  member.role === "ADMIN" 
                    ? "bg-amber-primary/10 text-amber-primary" 
                    : "bg-muted text-muted-foreground border border-border/40"
                }`}>
                  {member.role === "ADMIN" ? "Administrador" : "Roommate"}
                </span>

                {isAdmin && member.userId !== currentUser?.id && (
                  <button
                    onClick={() => handleKickMember(member.userId, member.name)}
                    disabled={actionLoading}
                    className="text-[10px] font-bold text-red-500 hover:text-red-700 px-2 py-1 rounded-lg hover:bg-red-50 transition-colors shrink-0 disabled:opacity-50"
                  >
                    Expulsar
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Dos botones abajo de los miembros (Solo para Admin) */}
      {isAdmin ? (
        <>
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
                  <div className="flex items-center justify-between bg-[#FAF9F6] border border-border/30 rounded-xl p-3 mt-1.5 gap-2 relative">
                    <p className="text-xs font-mono text-muted-foreground truncate select-all flex-1">
                      {origin}/join?code={house.inviteCode}
                    </p>
                    
                    <div className="relative">
                      <button 
                        onClick={handleShare} 
                        className="rounded-lg bg-amber-primary hover:bg-[#6c4300] text-white px-3 py-1.5 text-[10px] font-bold shadow-xs shrink-0 flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <span className="material-symbols-rounded text-xs">share</span>
                        Compartir
                      </button>
                      
                      {showShareMenu && (
                        <div className="absolute right-0 mt-2 w-48 bg-white border border-border/30 rounded-xl shadow-lg p-2 z-10 animate-in fade-in slide-in-from-top-1 duration-150 space-y-1">
                          <button
                            onClick={() => {
                              const inviteLink = `${origin}/join?code=${house?.inviteCode}`;
                              window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent("¡Únete a mi casa en Kimito! " + inviteLink)}`, "_blank");
                              setShowShareMenu(false);
                            }}
                            className="w-full text-left px-2.5 py-1.5 text-[11px] font-medium text-foreground hover:bg-[#FAF9F6] rounded-lg flex items-center gap-2"
                          >
                            <span className="w-2.5 h-2.5 rounded-full bg-[#25D366]" />
                            WhatsApp
                          </button>
                          <button
                            onClick={() => {
                              const inviteLink = `${origin}/join?code=${house?.inviteCode}`;
                              window.open(`https://t.me/share/url?url=${encodeURIComponent(inviteLink)}&text=${encodeURIComponent("¡Únete a mi casa en Kimito!")}`, "_blank");
                              setShowShareMenu(false);
                            }}
                            className="w-full text-left px-2.5 py-1.5 text-[11px] font-medium text-foreground hover:bg-[#FAF9F6] rounded-lg flex items-center gap-2"
                          >
                            <span className="w-2.5 h-2.5 rounded-full bg-[#0088cc]" />
                            Telegram
                          </button>
                          <button
                            onClick={() => {
                              const inviteLink = `${origin}/join?code=${house?.inviteCode}`;
                              window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(inviteLink)}`, "_blank");
                              setShowShareMenu(false);
                            }}
                            className="w-full text-left px-2.5 py-1.5 text-[11px] font-medium text-foreground hover:bg-[#FAF9F6] rounded-lg flex items-center gap-2"
                          >
                            <span className="w-2.5 h-2.5 rounded-full bg-[#1877F2]" />
                            Facebook
                          </button>
                          <button
                            onClick={() => {
                              copyInviteLink();
                              setShowShareMenu(false);
                            }}
                            className="w-full text-left px-2.5 py-1.5 text-[11px] font-medium text-foreground hover:bg-[#FAF9F6] rounded-lg flex items-center gap-2 border-t border-border/10 pt-2"
                          >
                            <span className="material-symbols-rounded text-xs text-muted-foreground">content_copy</span>
                            {copied ? "¡Copiado!" : "Copiar Enlace"}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <hr className="border-border/20" />

                <div>
                  <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Código de Invitación Manual (Toca para copiar)</h4>
                  <button
                    onClick={copyInviteCode}
                    className="w-full bg-[#FAF9F6] hover:bg-[#FAF9F6]/80 border border-border/30 rounded-xl p-4 mt-1.5 text-center font-mono font-black text-xl text-[#1D1B16] tracking-widest uppercase select-all relative group cursor-pointer transition-colors"
                  >
                    {house.inviteCode}
                    <span className="absolute bottom-1.5 right-2 text-[9px] font-bold text-amber-primary bg-amber-primary/5 px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      {copiedCode ? "¡Copiado!" : "Toca para copiar"}
                    </span>
                  </button>
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
                  {!isEditing && (
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
          
          {/* Danger Zone for admin */}
          <Card className="border-red-200/50 bg-red-50/10 rounded-3xl p-5 border">
            <h3 className="font-sans font-black text-sm text-red-700 flex items-center gap-2 mb-2 select-none">
              <span className="material-symbols-rounded text-red-600">warning</span>
              Zona de Peligro (Administrador)
            </h3>
            <p className="text-[11px] text-muted-foreground mb-4">
              Eliminar la casa desvinculará a todos los miembros y la borrará del sistema. Puedes también salir si hay otro administrador.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleLeaveHouse}
                disabled={actionLoading}
                className="bg-white border border-red-200 text-red-600 hover:bg-red-50 font-bold rounded-xl px-4 py-2.5 text-xs transition-colors cursor-pointer flex-1 disabled:opacity-50"
              >
                Salir de la Casa
              </button>
              <button
                onClick={handleDeleteHouse}
                disabled={actionLoading}
                className="bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl px-4 py-2.5 text-xs transition-colors cursor-pointer flex-1 disabled:opacity-50"
              >
                Eliminar Casa
              </button>
            </div>
          </Card>
        </>
      ) : (
        /* Para Roommates (no administradores): Mostrar la info y botón de salir */
        <div className="space-y-4">
          <Card className="border-border/40 shadow-[0_4px_24px_rgba(133,83,0,0.02)] rounded-3xl bg-white p-5">
            <div className="text-left">
              <h3 className="font-sans font-black text-base text-foreground flex items-center gap-2 mb-4 select-none">
                <span className="material-symbols-rounded text-amber-primary">home</span>
                Detalles del Hogar
              </h3>
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
            </div>
          </Card>

          <Card className="border-red-100 bg-red-50/10 rounded-3xl p-5 border">
            <h3 className="font-sans font-black text-sm text-red-700 flex items-center gap-2 mb-2 select-none">
              <span className="material-symbols-rounded text-red-600">directions_run</span>
              Salir de la Casa
            </h3>
            <p className="text-[11px] text-muted-foreground mb-4">
              Si decides salir de la casa, tu historial de tareas y reputación actual se guardarán en tu historial de experiencias como roommate.
            </p>
            <button
              onClick={handleLeaveHouse}
              disabled={actionLoading}
              className="bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl px-4 py-2.5 text-xs transition-colors cursor-pointer w-full disabled:opacity-50"
            >
              Confirmar Salida
            </button>
          </Card>
        </div>
      )}

      {/* History CV Section (When user belongs to a house) */}
      {history.length > 0 && (
        <Card className="border-border/40 shadow-[0_4px_24px_rgba(133,83,0,0.02)] rounded-3xl bg-white p-5 mt-4">
          <h3 className="font-sans font-black text-base text-foreground flex items-center gap-2 mb-4 select-none">
            <span className="material-symbols-rounded text-amber-primary">history</span>
            Tu Historial de Roommate (Experiencias previas)
          </h3>
          <div className="space-y-3">
            {history.map((hist) => (
              <div key={hist.id} className="bg-muted/30 border border-border/10 rounded-xl p-3 text-left">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-foreground">
                    Rol: {hist.role === "ADMIN" ? "Administrador" : "Roommate"}
                  </span>
                  <span className={cn(
                    "text-[9px] font-bold px-2 py-0.5 rounded-full uppercase",
                    hist.actionType === "LEFT" && "bg-green-50 text-green-700",
                    hist.actionType === "KICKED" && "bg-red-50 text-red-700",
                    hist.actionType === "HOUSE_DELETED" && "bg-amber-50 text-amber-700"
                  )}>
                    {hist.actionType === "LEFT" && "Salió"}
                    {hist.actionType === "KICKED" && "Expulsado"}
                    {hist.actionType === "HOUSE_DELETED" && "Casa disuelta"}
                  </span>
                </div>
                <p className="text-[10px] text-muted-foreground mt-1">
                  Período: {new Date(hist.joinedAt).toLocaleDateString()} al {new Date(hist.leftAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

"use client";

import { useState, useCallback } from "react";
import type {
  ListingResponse,
  PaginatedListings,
  CreateListingDto,
  UpdateListingDto,
  PreferredGender,
} from "@kimito/shared-types";
import {
  getListingsAction,
  createListingAction,
  updateListingAction,
  deleteListingAction,
} from "@/app/actions/listing-actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ListingsClientProps {
  initialData: PaginatedListings;
  currentUserId?: string;
}

export default function ListingsClient({ initialData, currentUserId }: ListingsClientProps) {
  // State
  const [listings, setListings] = useState<ListingResponse[]>(initialData.data);
  const [total, setTotal] = useState(initialData.total);
  const [page, setPage] = useState(initialData.page);
  const [totalPages, setTotalPages] = useState(initialData.totalPages);
  const [loading, setLoading] = useState(false);

  // Filters
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [minRent, setMinRent] = useState("");
  const [maxRent, setMaxRent] = useState("");
  const [petsFilter, setPetsFilter] = useState<string>("");
  const [smokingFilter, setSmokingFilter] = useState<string>("");
  const [genderFilter, setGenderFilter] = useState<string>("");

  // Create form
  const [showCreate, setShowCreate] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState("");
  const [createSuccess, setCreateSuccess] = useState(false);
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formRent, setFormRent] = useState("");
  const [formDeposit, setFormDeposit] = useState("");
  const [formLocation, setFormLocation] = useState("");
  const [formAvailableFrom, setFormAvailableFrom] = useState("");
  const [formRooms, setFormRooms] = useState("1");
  const [formGender, setFormGender] = useState<PreferredGender | "">("");
  const [formPets, setFormPets] = useState(false);
  const [formSmoking, setFormSmoking] = useState(false);

  // Edit
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editRent, setEditRent] = useState("");
  const [editLocation, setEditLocation] = useState("");
  const [editRooms, setEditRooms] = useState("1");
  const [editLoading, setEditLoading] = useState(false);

  // Delete
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchListings = useCallback(async (pageNum = 1) => {
    setLoading(true);
    try {
      const result = await getListingsAction({
        search: search || undefined,
        location: location || undefined,
        minRent: minRent ? parseFloat(minRent) : undefined,
        maxRent: maxRent ? parseFloat(maxRent) : undefined,
        petsAllowed: petsFilter === "true" ? true : petsFilter === "false" ? false : undefined,
        smokingAllowed: smokingFilter === "true" ? true : smokingFilter === "false" ? false : undefined,
        preferredGender: (genderFilter as PreferredGender) || undefined,
        page: pageNum,
        limit: 12,
      });
      setListings(result.data);
      setTotal(result.total);
      setPage(result.page);
      setTotalPages(result.totalPages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [search, location, minRent, maxRent, petsFilter, smokingFilter, genderFilter]);

  const handleSearch = () => { fetchListings(1); };
  const handleKeyDown = (e: React.KeyboardEvent) => { if (e.key === "Enter") handleSearch(); };

  const handleClearFilters = () => {
    setSearch(""); setLocation(""); setMinRent(""); setMaxRent("");
    setPetsFilter(""); setSmokingFilter(""); setGenderFilter("");
    setLoading(true);
    getListingsAction({ page: 1, limit: 12 }).then((result) => {
      setListings(result.data); setTotal(result.total);
      setPage(result.page); setTotalPages(result.totalPages); setLoading(false);
    });
  };

  const handleCreate = async () => {
    setCreateError("");
    if (!formTitle.trim()) { setCreateError("El título es obligatorio"); return; }
    if (!formDescription.trim()) { setCreateError("La descripción es obligatoria"); return; }
    if (!formRent || parseFloat(formRent) < 0) { setCreateError("Ingresa una renta válida"); return; }
    if (!formLocation.trim()) { setCreateError("La ubicación es obligatoria"); return; }
    if (!formAvailableFrom) { setCreateError("La fecha de disponibilidad es obligatoria"); return; }
    if (!formRooms || parseInt(formRooms) < 1) { setCreateError("Mínimo 1 habitación"); return; }

    setCreateLoading(true);
    try {
      const dto: CreateListingDto = {
        title: formTitle.trim(),
        description: formDescription.trim(),
        monthlyRent: parseFloat(formRent),
        deposit: formDeposit ? parseFloat(formDeposit) : undefined,
        location: formLocation.trim(),
        availableFrom: formAvailableFrom,
        availableRooms: parseInt(formRooms),
        preferredGender: formGender ? formGender : undefined,
        petsAllowed: formPets,
        smokingAllowed: formSmoking,
      };
      await createListingAction(dto);
      setCreateSuccess(true);
      setFormTitle(""); setFormDescription(""); setFormRent(""); setFormDeposit("");
      setFormLocation(""); setFormAvailableFrom(""); setFormRooms("1");
      setFormGender(""); setFormPets(false); setFormSmoking(false);
      setTimeout(() => { setCreateSuccess(false); setShowCreate(false); }, 1500);
      fetchListings(1);
    } catch (err: unknown) {
      setCreateError(err instanceof Error ? err.message : "Error al crear la publicación");
    } finally {
      setCreateLoading(false);
    }
  };

  const handleStartEdit = (listing: ListingResponse) => {
    setEditingId(listing.id);
    setEditTitle(listing.title);
    setEditDescription(listing.description);
    setEditRent(String(listing.monthlyRent));
    setEditLocation(listing.location);
    setEditRooms(String(listing.availableRooms));
  };

  const handleSaveEdit = async () => {
    if (!editingId) return;
    setEditLoading(true);
    try {
      const dto: UpdateListingDto = {
        title: editTitle.trim(),
        description: editDescription.trim(),
        monthlyRent: parseFloat(editRent),
        location: editLocation.trim(),
        availableRooms: parseInt(editRooms),
      };
      const updated = await updateListingAction(editingId, dto);
      setListings((prev) => prev.map((l) => (l.id === editingId ? updated : l)));
      setEditingId(null);
    } catch (err: unknown) {
      console.error(err);
    } finally {
      setEditLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteListingAction(id);
      setListings((prev) => prev.filter((l) => l.id !== id));
      setTotal((t) => t - 1);
    } catch (err: unknown) {
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

  const formatRent = (rent: number) =>
    new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(rent);

  const formatDate = (date: Date | string) =>
    new Date(date).toLocaleDateString("es-MX", { day: "numeric", month: "short", year: "numeric" });

  const hasFilters = search || location || minRent || maxRent || petsFilter || smokingFilter || genderFilter;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between animate-fade-up">
        <div>
          <h1 className="font-sans font-extrabold text-2xl text-foreground tracking-tight">
            Encuentra Roomie
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {total} {total === 1 ? "habitación disponible" : "habitaciones disponibles"}
          </p>
        </div>
        <Button
          onClick={() => setShowCreate(!showCreate)}
          className="bg-amber-primary hover:bg-[#6c4300] text-white font-semibold rounded-xl text-xs shadow-sm"
          size="sm"
        >
          <span className="material-symbols-rounded text-sm mr-1">add_home</span>
          Publicar
        </Button>
      </div>

      {/* Create Form */}
      {showCreate && (
        <div className="bg-white border border-border/30 rounded-2xl p-5 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
          <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
            <span className="material-symbols-rounded text-amber-primary text-lg">real_estate_agent</span>
            Publicar Habitación
          </h3>

          {createError && (
            <div className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-xl px-3 py-2 font-medium">
              {createError}
            </div>
          )}
          {createSuccess && (
            <div className="text-xs text-green-700 bg-green-50 border border-green-100 rounded-xl px-3 py-2 font-medium flex items-center gap-1.5">
              <span className="material-symbols-rounded text-sm">check_circle</span>
              ¡Publicación creada con éxito!
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-semibold text-muted-foreground">Título</label>
              <Input placeholder="Ej: Habitación privada en Cholula" value={formTitle} onChange={(e) => setFormTitle(e.target.value)} className="h-9 rounded-xl" />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-semibold text-muted-foreground">Descripción</label>
              <textarea placeholder="Describe la habitación, la casa y el ambiente..." value={formDescription} onChange={(e) => setFormDescription(e.target.value)} rows={3} className="w-full min-w-0 rounded-xl border border-input bg-transparent px-2.5 py-2 text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 placeholder:text-muted-foreground resize-none" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">Ubicación</label>
              <Input placeholder="Ej: Puebla, Centro" value={formLocation} onChange={(e) => setFormLocation(e.target.value)} className="h-9 rounded-xl" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">Renta mensual (MXN)</label>
              <Input type="number" min="0" step="100" placeholder="4200" value={formRent} onChange={(e) => setFormRent(e.target.value)} className="h-9 rounded-xl" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">Depósito (opcional)</label>
              <Input type="number" min="0" step="100" placeholder="4200" value={formDeposit} onChange={(e) => setFormDeposit(e.target.value)} className="h-9 rounded-xl" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">Habitaciones disponibles</label>
              <Input type="number" min="1" max="10" value={formRooms} onChange={(e) => setFormRooms(e.target.value)} className="h-9 rounded-xl" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">Disponible desde</label>
              <Input type="date" value={formAvailableFrom} onChange={(e) => setFormAvailableFrom(e.target.value)} className="h-9 rounded-xl" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">Género preferido</label>
              <select value={formGender} onChange={(e) => setFormGender(e.target.value as PreferredGender | "")} className="w-full h-9 rounded-xl border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50">
                <option value="">Sin preferencia</option>
                <option value="FEMALE">Mujer</option>
                <option value="MALE">Hombre</option>
                <option value="ANY">Cualquiera</option>
              </select>
            </div>
          </div>

          {/* Toggles */}
          <div className="flex flex-wrap gap-4 pt-1">
            <label className="flex items-center gap-2 text-xs font-medium text-foreground cursor-pointer select-none">
              <input type="checkbox" checked={formPets} onChange={(e) => setFormPets(e.target.checked)} className="w-4 h-4 rounded border-input accent-amber-primary" />
              <span className="material-symbols-rounded text-sm text-muted-foreground">pets</span>
              Mascotas permitidas
            </label>
            <label className="flex items-center gap-2 text-xs font-medium text-foreground cursor-pointer select-none">
              <input type="checkbox" checked={formSmoking} onChange={(e) => setFormSmoking(e.target.checked)} className="w-4 h-4 rounded border-input accent-amber-primary" />
              <span className="material-symbols-rounded text-sm text-muted-foreground">smoking_rooms</span>
              Fumadores permitidos
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" size="sm" onClick={() => { setShowCreate(false); setCreateError(""); }} className="rounded-xl text-xs">
              Cancelar
            </Button>
            <Button onClick={handleCreate} disabled={createLoading} className="bg-amber-primary hover:bg-[#6c4300] text-white font-semibold rounded-xl text-xs shadow-sm" size="sm">
              {createLoading ? (
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Publicando...
                </span>
              ) : "Publicar"}
            </Button>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="space-y-3 animate-fade-up" style={{ animationDelay: "50ms" }}>
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex-1 relative">
            <span className="material-symbols-rounded absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground text-base">search</span>
            <Input placeholder="Buscar habitaciones..." value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={handleKeyDown} className="h-9 rounded-xl pl-8" />
          </div>
          <Button onClick={handleSearch} variant="outline" size="sm" className="rounded-xl text-xs shrink-0">
            Buscar
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="relative">
            <span className="material-symbols-rounded absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">location_on</span>
            <Input placeholder="Ubicación" value={location} onChange={(e) => setLocation(e.target.value)} className="h-8 w-28 rounded-xl text-xs pl-6" />
          </div>
          <Input type="number" min="0" placeholder="Min $" value={minRent} onChange={(e) => setMinRent(e.target.value)} className="h-8 w-20 rounded-xl text-xs" />
          <Input type="number" min="0" placeholder="Max $" value={maxRent} onChange={(e) => setMaxRent(e.target.value)} className="h-8 w-20 rounded-xl text-xs" />
          <select value={petsFilter} onChange={(e) => setPetsFilter(e.target.value)} className="h-8 rounded-xl border border-input bg-transparent px-2 text-xs outline-none focus-visible:border-ring">
            <option value="">Mascotas</option>
            <option value="true">Sí</option>
            <option value="false">No</option>
          </select>
          <select value={smokingFilter} onChange={(e) => setSmokingFilter(e.target.value)} className="h-8 rounded-xl border border-input bg-transparent px-2 text-xs outline-none focus-visible:border-ring">
            <option value="">Fumadores</option>
            <option value="true">Sí</option>
            <option value="false">No</option>
          </select>
          <select value={genderFilter} onChange={(e) => setGenderFilter(e.target.value)} className="h-8 rounded-xl border border-input bg-transparent px-2 text-xs outline-none focus-visible:border-ring">
            <option value="">Género</option>
            <option value="FEMALE">Mujer</option>
            <option value="MALE">Hombre</option>
            <option value="ANY">Cualquiera</option>
          </select>
          {hasFilters && (
            <button onClick={handleClearFilters} className="h-8 px-2.5 rounded-xl text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors flex items-center gap-1">
              <span className="material-symbols-rounded text-sm">close</span>
              Limpiar
            </button>
          )}
        </div>
      </div>

      {/* Listings */}
      {loading ? (
        <div className="grid grid-cols-1 gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-border/30 p-4 space-y-3">
              <div className="h-4 w-2/3 skeleton rounded-lg" />
              <div className="h-3 w-1/3 skeleton rounded-lg" />
              <div className="h-3 w-full skeleton rounded-lg" />
              <div className="flex gap-3">
                <div className="h-5 w-24 skeleton rounded-lg" />
                <div className="h-5 w-20 skeleton rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      ) : listings.length === 0 ? (
        <div className="text-center py-16 px-6 space-y-3 animate-fade-up">
          <div className="w-14 h-14 bg-muted/40 rounded-full flex items-center justify-center mx-auto">
            <span className="material-symbols-rounded text-muted-foreground/60 text-3xl">house</span>
          </div>
          <p className="text-sm font-semibold text-foreground">No hay habitaciones publicadas</p>
          <p className="text-xs text-muted-foreground max-w-xs mx-auto leading-relaxed">
            Sé el primero en publicar una habitación disponible para encontrar al roomie ideal.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 stagger-children animate-fade-up" style={{ animationDelay: "100ms" }}>
          {listings.map((listing) => {
            const isOwner = currentUserId === listing.owner.id;
            const isEditing = editingId === listing.id;

            return (
              <div
                key={listing.id}
                className={cn(
                  "rounded-2xl border p-4 space-y-3 transition-all duration-200 text-left",
                  "bg-white border-border/30 hover:border-amber-primary/25 hover:shadow-[0_2px_12px_rgba(133,83,0,0.04)]",
                  isEditing && "ring-2 ring-amber-primary/20 border-amber-primary/30"
                )}
              >

                {isEditing ? (
                  <div className="space-y-3">
                    <Input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="h-8 rounded-xl text-sm font-semibold" placeholder="Título" />
                    <textarea value={editDescription} onChange={(e) => setEditDescription(e.target.value)} rows={2} className="w-full rounded-xl border border-input bg-transparent px-2.5 py-1.5 text-xs outline-none focus-visible:border-ring resize-none" />
                    <div className="flex gap-2">
                      <Input type="number" value={editRent} onChange={(e) => setEditRent(e.target.value)} className="h-8 rounded-xl text-xs w-28" placeholder="Renta" />
                      <Input value={editLocation} onChange={(e) => setEditLocation(e.target.value)} className="h-8 rounded-xl text-xs flex-1" placeholder="Ubicación" />
                      <Input type="number" value={editRooms} onChange={(e) => setEditRooms(e.target.value)} className="h-8 rounded-xl text-xs w-16" placeholder="Hab." />
                    </div>
                    <div className="flex justify-end gap-2 pt-1">
                      <Button variant="ghost" size="xs" onClick={() => setEditingId(null)} className="rounded-lg text-xs">Cancelar</Button>
                      <Button size="xs" onClick={handleSaveEdit} disabled={editLoading} className="bg-amber-primary hover:bg-[#6c4300] text-white rounded-lg text-xs">
                        {editLoading ? "Guardando..." : "Guardar"}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Title + Location */}
                    <div className="space-y-1">
                      <h3 className="font-bold text-sm text-foreground leading-snug flex items-center gap-1.5">
                        <span className="material-symbols-rounded text-amber-primary text-base">home</span>
                        {listing.title}
                      </h3>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <span className="material-symbols-rounded text-[13px]">location_on</span>
                        {listing.location}
                      </p>
                    </div>

                    {/* Details row */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1 font-semibold text-foreground">
                        <span className="material-symbols-rounded text-[13px] text-amber-primary">payments</span>
                        {formatRent(listing.monthlyRent)}/mes
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-rounded text-[13px]">bed</span>
                        {listing.availableRooms} {listing.availableRooms === 1 ? "hab." : "habs."}
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-rounded text-[13px]">calendar_today</span>
                        {formatDate(listing.availableFrom)}
                      </span>
                      {listing.petsAllowed && (
                        <span className="flex items-center gap-0.5 text-green-600">
                          <span className="material-symbols-rounded text-[13px]">pets</span>
                          Mascotas
                        </span>
                      )}
                      {listing.smokingAllowed && (
                        <span className="flex items-center gap-0.5">
                          <span className="material-symbols-rounded text-[13px]">smoking_rooms</span>
                          Fumadores
                        </span>
                      )}
                    </div>

                    {/* Description */}
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {listing.description}
                    </p>

                    {/* Owner + Reputation */}
                    <div className="flex items-center justify-between pt-2 border-t border-border/15">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-primary/20 to-amber-primary/5 flex items-center justify-center text-[9px] font-bold text-amber-primary shrink-0">
                          {listing.owner.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="text-[11px] font-semibold text-foreground truncate leading-tight">
                            {listing.owner.name}
                          </p>
                          <p className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                            {listing.owner.reputationScore !== null ? (
                              <>
                                <span className="material-symbols-rounded text-amber-400 text-[11px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                <span className="font-semibold">{listing.owner.reputationScore.toFixed(1)}</span>
                              </>
                            ) : (
                              <span className="italic">Sin reputación</span>
                            )}
                          </p>
                        </div>
                      </div>

                      {isOwner && (
                        <div className="flex gap-1.5">
                          <button onClick={() => handleStartEdit(listing)} className="text-[10px] font-semibold text-muted-foreground hover:text-foreground flex items-center gap-0.5 px-2 py-1 rounded-lg hover:bg-muted/50 transition-colors">
                            <span className="material-symbols-rounded text-xs">edit</span>
                            Editar
                          </button>
                          <button onClick={() => handleDelete(listing.id)} disabled={deletingId === listing.id} className="text-[10px] font-semibold text-red-500 hover:text-red-700 flex items-center gap-0.5 px-2 py-1 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50">
                            <span className="material-symbols-rounded text-xs">delete</span>
                            {deletingId === listing.id ? "..." : "Eliminar"}
                          </button>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4 animate-fade-up">
          <Button variant="outline" size="xs" disabled={page <= 1 || loading} onClick={() => fetchListings(page - 1)} className="rounded-xl text-xs">
            <span className="material-symbols-rounded text-sm">chevron_left</span>
          </Button>
          <span className="text-xs text-muted-foreground font-medium">{page} / {totalPages}</span>
          <Button variant="outline" size="xs" disabled={page >= totalPages || loading} onClick={() => fetchListings(page + 1)} className="rounded-xl text-xs">
            <span className="material-symbols-rounded text-sm">chevron_right</span>
          </Button>
        </div>
      )}
    </div>
  );
}

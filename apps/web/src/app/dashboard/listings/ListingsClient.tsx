"use client";

import { useState, useCallback, useEffect } from "react";
import type {
  ListingResponse,
  PaginatedListings,
  CreateListingDto,
  UpdateListingDto,
  PreferredGender,
  ListingApplicationResponse,
} from "@kimito/shared-types";
import {
  getListingsAction,
  createListingAction,
  updateListingAction,
  deleteListingAction,
  applyToListingAction,
  getListingApplicationsAction,
  inviteCandidateAction,
} from "@/app/actions/listing-actions";
import { uploadEvidenceAction } from "@/app/actions/storage-actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import AddressAutocomplete from "@/components/ui/AddressAutocomplete";

interface ListingsClientProps {
  initialData: PaginatedListings;
  currentUserId?: string;
}

export default function ListingsClient({ initialData, currentUserId }: ListingsClientProps) {
  // Navigation & Tabs
  const [activeTab, setActiveTab] = useState<"search" | "my_listings">("search");

  // Core Listings State
  const [listings, setListings] = useState<ListingResponse[]>(initialData.data);
  const [total, setTotal] = useState(initialData.total);
  const [page, setPage] = useState(initialData.page);
  const [totalPages, setTotalPages] = useState(initialData.totalPages);
  const [loading, setLoading] = useState(false);

  // Advanced Filters State
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [minRent, setMinRent] = useState("");
  const [maxRent, setMaxRent] = useState("");
  const [petsFilter, setPetsFilter] = useState<string>("");
  const [smokingFilter, setSmokingFilter] = useState<string>("");
  const [genderFilter, setGenderFilter] = useState<string>("");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Application Modal State
  const [applyingListing, setApplyingListing] = useState<ListingResponse | null>(null);
  const [applyPhone, setApplyPhone] = useState("");
  const [applyMessage, setApplyMessage] = useState("");
  const [applyLoading, setApplyLoading] = useState(false);
  const [applyError, setApplyError] = useState("");
  const [applySuccess, setApplySuccess] = useState(false);

  // My Listings & Applicant management state
  const [showCreate, setShowCreate] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState("");
  const [createSuccess, setCreateSuccess] = useState(false);

  // Create Form fields
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
  const [formImages, setFormImages] = useState<string[]>([]);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Edit / Delete states
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editRent, setEditRent] = useState("");
  const [editLocation, setEditLocation] = useState("");
  const [editRooms, setEditRooms] = useState("1");
  const [editLoading, setEditLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Loaded applications per listing lookup
  const [activeMapListingId, setActiveMapListingId] = useState<string | null>(null);
  const [applicationsMap, setApplicationsMap] = useState<Record<string, ListingApplicationResponse[]>>({});
  const [expandedListingId, setExpandedListingId] = useState<string | null>(null);
  const [loadingAppsId, setLoadingAppsId] = useState<string | null>(null);
  const [invitingAppId, setInvitingAppId] = useState<string | null>(null);
  const [inviteSuccessMap, setInviteSuccessMap] = useState<Record<string, boolean>>({});

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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImage(true);
    setCreateError("");
    try {
      const formData = new FormData();
      formData.append("file", files[0]);
      const result = await uploadEvidenceAction(formData);
      setFormImages((prev) => [...prev, result.url]);
    } catch (err: any) {
      setCreateError(err instanceof Error ? err.message : "Error al subir la imagen");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormImages((prev) => prev.filter((_, i) => i !== index));
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
        images: formImages,
      };
      await createListingAction(dto);
      setCreateSuccess(true);
      setFormTitle(""); setFormDescription(""); setFormRent(""); setFormDeposit("");
      setFormLocation(""); setFormAvailableFrom(""); setFormRooms("1");
      setFormGender(""); setFormPets(false); setFormSmoking(false);
      setFormImages([]);
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
    if (!confirm("¿Estás seguro de que deseas eliminar esta publicación?")) return;
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

  // Applications logic
  const handleOpenApply = (listing: ListingResponse) => {
    setApplyingListing(listing);
    setApplyPhone("");
    setApplyMessage("");
    setApplyError("");
    setApplySuccess(false);
  };

  const handleApplySubmit = async () => {
    if (!applyingListing) return;
    setApplyError("");
    if (!applyPhone.trim()) {
      setApplyError("El número de teléfono es obligatorio para contactarte por WhatsApp");
      return;
    }

    setApplyLoading(true);
    try {
      await applyToListingAction(applyingListing.id, {
        phoneNumber: applyPhone.trim(),
        message: applyMessage.trim() || undefined,
      });
      setApplySuccess(true);
      setTimeout(() => {
        setApplyingListing(null);
        setApplySuccess(false);
      }, 1800);
    } catch (err: any) {
      setApplyError(err instanceof Error ? err.message : "Error al postularse. Revisa si ya te has postulado.");
    } finally {
      setApplyLoading(false);
    }
  };

  const toggleExpandListing = async (listingId: string) => {
    if (expandedListingId === listingId) {
      setExpandedListingId(null);
      return;
    }

    setExpandedListingId(listingId);
    setLoadingAppsId(listingId);
    try {
      const apps = await getListingApplicationsAction(listingId);
      setApplicationsMap((prev) => ({ ...prev, [listingId]: apps }));
    } catch (err) {
      console.error("Error al cargar postulaciones:", err);
    } finally {
      setLoadingAppsId(null);
    }
  };

  const handleSendInvite = async (listingId: string, appId: string) => {
    setInvitingAppId(appId);
    try {
      const res = await inviteCandidateAction(listingId, appId);
      if (res.success) {
        setInviteSuccessMap((prev) => ({ ...prev, [appId]: true }));
        setTimeout(() => {
          setInviteSuccessMap((prev) => ({ ...prev, [appId]: false }));
        }, 3000);
      }
    } catch (err) {
      console.error(err);
      alert("Error al enviar la invitación Web Push.");
    } finally {
      setInvitingAppId(null);
    }
  };

  const formatRent = (rent: number) =>
    new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(rent);

  const formatDate = (date: Date | string) =>
    new Date(date).toLocaleDateString("es-MX", { day: "numeric", month: "short", year: "numeric" });

  const hasFilters = search || location || minRent || maxRent || petsFilter || smokingFilter || genderFilter;

  // Filter listings based on ownership tab
  const searchListings = listings.filter((l) => l.status === "ACTIVE");
  const myOwnListings = listings.filter((l) => l.owner.id === currentUserId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-up">
        <div>
          <h1 className="font-sans font-extrabold text-2xl text-foreground tracking-tight flex items-center gap-2">
            <span className="material-symbols-rounded text-amber-primary text-2xl">apartment</span>
            Marketplace de Roommates
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Encuentra tu próximo hogar o publica una habitación disponible para tus futuros roomies.
          </p>
        </div>
      </div>

      {/* Modern Premium Tabs Switcher */}
      <div className="flex border-b border-border/20 p-1 bg-amber-primary/5 rounded-2xl max-w-md">
        <button
          onClick={() => setActiveTab("search")}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold rounded-xl transition-all duration-200",
            activeTab === "search"
              ? "bg-white text-amber-primary shadow-[0_2px_8px_rgba(0,0,0,0.06)]"
              : "text-muted-foreground hover:text-foreground hover:bg-white/40"
          )}
        >
          <span className="material-symbols-rounded text-base">search</span>
          Buscar Habitación
        </button>
        <button
          onClick={() => setActiveTab("my_listings")}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold rounded-xl transition-all duration-200",
            activeTab === "my_listings"
              ? "bg-white text-amber-primary shadow-[0_2px_8px_rgba(0,0,0,0.06)]"
              : "text-muted-foreground hover:text-foreground hover:bg-white/40"
          )}
        >
          <span className="material-symbols-rounded text-base">real_estate_agent</span>
          Mis Publicaciones
        </button>
      </div>

      {/* ============================================================== */}
      {/* TAB 1: BUSCADOR / EXPLORACIÓN DE HABITACIONES */}
      {/* ============================================================== */}
      {activeTab === "search" && (
        <div className="space-y-6 animate-fade-up">
          {/* Main search and filters card */}
          <div className="bg-white border border-border/30 rounded-2xl p-4 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex-1 relative">
                <span className="material-symbols-rounded absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-base">search</span>
                <Input
                  placeholder="Buscar por descripción, características, Cholula, Puebla..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="h-10 rounded-xl pl-9 text-sm"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSearch} className="bg-amber-primary hover:bg-[#6c4300] text-white font-semibold rounded-xl text-xs px-4">
                  Buscar
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                  className={cn("rounded-xl text-xs border-amber-primary/20", showAdvancedFilters && "bg-amber-primary/10 text-amber-primary")}
                >
                  <span className="material-symbols-rounded text-sm mr-1">tune</span>
                  Filtros
                </Button>
              </div>
            </div>

            {/* Collapsible advanced filters */}
            {showAdvancedFilters && (
              <div className="pt-2 border-t border-border/20 grid grid-cols-1 sm:grid-cols-3 gap-3 animate-in fade-in duration-200">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-muted-foreground">Ubicación</label>
                  <div className="relative">
                    <span className="material-symbols-rounded absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">location_on</span>
                    <Input placeholder="Ej: Cholula" value={location} onChange={(e) => setLocation(e.target.value)} className="h-8 rounded-xl text-xs pl-6" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-muted-foreground">Renta Máxima</label>
                  <div className="flex items-center gap-1.5">
                    <Input type="number" min="0" placeholder="Mín $" value={minRent} onChange={(e) => setMinRent(e.target.value)} className="h-8 rounded-xl text-xs" />
                    <span className="text-muted-foreground text-xs">-</span>
                    <Input type="number" min="0" placeholder="Máx $" value={maxRent} onChange={(e) => setMaxRent(e.target.value)} className="h-8 rounded-xl text-xs" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-muted-foreground">Preferencia de Género</label>
                  <div className="flex border border-border/40 p-0.5 bg-muted/10 rounded-xl h-8 items-center">
                    <button
                      type="button"
                      onClick={() => setGenderFilter("")}
                      className={cn(
                        "flex-1 py-1 text-[10px] font-bold rounded-lg transition-colors cursor-pointer text-center h-full flex items-center justify-center",
                        genderFilter === ""
                          ? "bg-white text-amber-primary shadow-xs"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      Cualquiera
                    </button>
                    <button
                      type="button"
                      onClick={() => setGenderFilter("FEMALE")}
                      className={cn(
                        "flex-1 py-1 text-[10px] font-bold rounded-lg transition-colors cursor-pointer text-center h-full flex items-center justify-center",
                        genderFilter === "FEMALE"
                          ? "bg-white text-amber-primary shadow-xs"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      Mujeres
                    </button>
                    <button
                      type="button"
                      onClick={() => setGenderFilter("MALE")}
                      className={cn(
                        "flex-1 py-1 text-[10px] font-bold rounded-lg transition-colors cursor-pointer text-center h-full flex items-center justify-center",
                        genderFilter === "MALE"
                          ? "bg-white text-amber-primary shadow-xs"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      Hombres
                    </button>
                  </div>
                </div>

                <div className="sm:col-span-3 flex flex-wrap gap-4 pt-1">
                  <label className="flex items-center gap-2 text-xs font-medium text-foreground cursor-pointer select-none">
                    <input type="checkbox" checked={petsFilter === "true"} onChange={(e) => setPetsFilter(e.target.checked ? "true" : "")} className="w-4 h-4 rounded border-input accent-amber-primary" />
                    <span className="material-symbols-rounded text-sm text-muted-foreground">pets</span>
                    Mascotas permitidas
                  </label>
                  <label className="flex items-center gap-2 text-xs font-medium text-foreground cursor-pointer select-none">
                    <input type="checkbox" checked={smokingFilter === "true"} onChange={(e) => setSmokingFilter(e.target.checked ? "true" : "")} className="w-4 h-4 rounded border-input accent-amber-primary" />
                    <span className="material-symbols-rounded text-sm text-muted-foreground">smoking_rooms</span>
                    Fumadores permitidos
                  </label>
                  {hasFilters && (
                    <button onClick={handleClearFilters} className="ml-auto text-xs text-red-500 hover:text-red-700 font-semibold flex items-center gap-1">
                      <span className="material-symbols-rounded text-xs">close</span>
                      Limpiar Filtros
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Grid of Listings */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="rounded-2xl border border-border/30 p-5 space-y-3 bg-white skeleton-container">
                  <div className="h-4 w-2/3 skeleton rounded-lg bg-muted/40 animate-pulse" />
                  <div className="h-3 w-1/3 skeleton rounded-lg bg-muted/40 animate-pulse" />
                  <div className="h-12 w-full skeleton rounded-lg bg-muted/40 animate-pulse" />
                  <div className="h-5 w-24 skeleton rounded-lg bg-muted/40 animate-pulse" />
                </div>
              ))}
            </div>
          ) : searchListings.length === 0 ? (
            <div className="text-center py-16 px-6 bg-white border border-border/30 rounded-2xl space-y-3">
              <div className="w-14 h-14 bg-amber-primary/10 rounded-full flex items-center justify-center mx-auto text-amber-primary">
                <span className="material-symbols-rounded text-3xl">house</span>
              </div>
              <p className="text-sm font-semibold text-foreground">No se encontraron habitaciones</p>
              <p className="text-xs text-muted-foreground max-w-xs mx-auto leading-relaxed">
                Prueba buscando con otros filtros o palabras clave para encontrar habitaciones disponibles.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {searchListings.map((listing) => {
                const isMyListing = currentUserId === listing.owner.id;
                return (
                  <div
                    key={listing.id}
                    className="bg-white rounded-2xl border border-border/30 p-5 flex flex-col justify-between hover:border-amber-primary/30 hover:shadow-[0_4px_16px_rgba(133,83,0,0.05)] transition-all duration-200 text-left"
                  >
                    {listing.images && listing.images.length > 0 && (
                      <div className="relative aspect-video w-full rounded-xl overflow-hidden mb-3 bg-muted">
                        <img
                          src={listing.images[0]}
                          alt={listing.title}
                          className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <div className="space-y-3">
                      {/* Badge / Price */}
                      <div className="flex items-start justify-between">
                        <span className="inline-flex items-center gap-1 bg-amber-primary/10 text-amber-primary font-bold text-xs px-2.5 py-1 rounded-xl">
                          <span className="material-symbols-rounded text-xs">payments</span>
                          {formatRent(listing.monthlyRent)}/mes
                        </span>
                        {listing.deposit && (
                          <span className="text-[10px] text-muted-foreground font-medium">
                            Depósito: {formatRent(listing.deposit)}
                          </span>
                        )}
                      </div>

                      {/* Title & Location */}
                      <div className="space-y-1">
                        <h3 className="font-bold text-base text-foreground leading-snug">
                          {listing.title}
                        </h3>
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <span className="material-symbols-rounded text-sm text-amber-primary">location_on</span>
                            {listing.location}
                          </p>
                          <button
                            onClick={() => setActiveMapListingId(activeMapListingId === listing.id ? null : listing.id)}
                            className="text-[10px] font-bold text-amber-primary hover:underline flex items-center gap-0.5 cursor-pointer shrink-0"
                          >
                            <span className="material-symbols-rounded text-xs">map</span>
                            {activeMapListingId === listing.id ? "Cerrar mapa" : "Ver mapa"}
                          </button>
                        </div>
                      </div>

                      {/* Map Inline Preview */}
                      {activeMapListingId === listing.id && (
                        <div className="rounded-xl overflow-hidden border border-border/20 aspect-video w-full bg-muted animate-in fade-in zoom-in-95 duration-200">
                          <iframe
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            loading="lazy"
                            allowFullScreen
                            src={`https://maps.google.com/maps?q=${encodeURIComponent(listing.location)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                          />
                        </div>
                      )}

                      {/* Description */}
                      <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                        {listing.description}
                      </p>

                      {/* Key features */}
                      <div className="flex flex-wrap gap-2 pt-1">
                        <span className="inline-flex items-center gap-1 bg-muted px-2 py-0.5 rounded-lg text-[10px] font-medium text-muted-foreground">
                          <span className="material-symbols-rounded text-xs">bed</span>
                          {listing.availableRooms} {listing.availableRooms === 1 ? "habitación" : "habitaciones"}
                        </span>
                        <span className="inline-flex items-center gap-1 bg-muted px-2 py-0.5 rounded-lg text-[10px] font-medium text-muted-foreground">
                          <span className="material-symbols-rounded text-xs">calendar_today</span>
                          Disponible: {formatDate(listing.availableFrom)}
                        </span>
                        {listing.preferredGender && (
                          <span className="inline-flex items-center gap-1 bg-muted px-2 py-0.5 rounded-lg text-[10px] font-medium text-muted-foreground">
                            <span className="material-symbols-rounded text-xs">group</span>
                            Preferencia: {listing.preferredGender === "FEMALE" ? "Mujeres" : listing.preferredGender === "MALE" ? "Hombres" : "Cualquiera"}
                          </span>
                        )}
                        {listing.petsAllowed && (
                          <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 px-2 py-0.5 rounded-lg text-[10px] font-semibold">
                            <span className="material-symbols-rounded text-xs">pets</span>
                            Mascotas OK
                          </span>
                        )}
                        {listing.smokingAllowed && (
                          <span className="inline-flex items-center gap-1 bg-muted px-2 py-0.5 rounded-lg text-[10px] font-medium text-muted-foreground">
                            <span className="material-symbols-rounded text-xs">smoking_rooms</span>
                            Fumadores OK
                          </span>
                        )}
                      </div>
                    </div>

                    {/* House aggregate details & Action */}
                    <div className="mt-4 pt-4 border-t border-border/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-1">
                        {listing.houseId ? (
                          <div className="text-[11px] font-semibold text-foreground flex items-center gap-1">
                            <span className="material-symbols-rounded text-amber-500 text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                            <span>Habitantes: {listing.houseMemberCount ?? 0}</span>
                            <span className="text-muted-foreground/30">|</span>
                            <span>Reputación Casa: {listing.houseReputationAverage !== null ? `${listing.houseReputationAverage.toFixed(1)} ★` : "N/A"}</span>
                          </div>
                        ) : (
                          <div className="text-[10px] text-muted-foreground italic">
                            Casa independiente (sin roommates registrados)
                          </div>
                        )}
                        {/* Owner details */}
                        <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                          <span>Anunciante: <strong>{listing.owner.name}</strong></span>
                          {listing.owner.reputationScore !== null && (
                            <span className="text-amber-500">({listing.owner.reputationScore.toFixed(1)} ★)</span>
                          )}
                        </div>
                      </div>

                      {/* Postulación Button */}
                      {isMyListing ? (
                        <span className="text-[10px] font-bold text-amber-primary bg-amber-primary/10 px-2.5 py-1.5 rounded-xl text-center self-end">
                          Tu publicación
                        </span>
                      ) : (
                        <Button
                          onClick={() => handleOpenApply(listing)}
                          className="bg-amber-primary hover:bg-[#6c4300] text-white font-semibold rounded-xl text-xs h-8 shadow-sm self-end"
                        >
                          <span className="material-symbols-rounded text-xs mr-1">mail</span>
                          Postularme
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 2: MIS PUBLICACIONES / FORMULARIO / POSTULANTES */}
      {/* ============================================================== */}
      {activeTab === "my_listings" && (
        <div className="space-y-6 animate-fade-up">
          {/* Action bar */}
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-foreground">
              Gestiona tus anuncios ({myOwnListings.length})
            </h2>
            <Button
              onClick={() => setShowCreate(!showCreate)}
              className="bg-amber-primary hover:bg-[#6c4300] text-white font-semibold rounded-xl text-xs shadow-sm h-8"
              size="sm"
            >
              <span className="material-symbols-rounded text-sm mr-1">{showCreate ? "close" : "add_home"}</span>
              {showCreate ? "Cerrar formulario" : "Nueva Habitación"}
            </Button>
          </div>

          {/* Create Form */}
          {showCreate && (
            <div className="bg-white border border-border/30 rounded-2xl p-5 space-y-4 animate-in fade-in duration-200">
              <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                <span className="material-symbols-rounded text-amber-primary text-lg font-bold">add_circle</span>
                Publicar Habitación Disponible
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
                  <label className="text-xs font-semibold text-muted-foreground">Título del Anuncio</label>
                  <Input placeholder="Ej: Habitación amueblada cerca de UDLAP" value={formTitle} onChange={(e) => setFormTitle(e.target.value)} className="h-9 rounded-xl" />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-semibold text-muted-foreground">Descripción detallada</label>
                  <textarea placeholder="Describe el tamaño de la habitación, áreas compartidas de la casa, reglamento..." value={formDescription} onChange={(e) => setFormDescription(e.target.value)} rows={3} className="w-full min-w-0 rounded-xl border border-input bg-transparent px-2.5 py-2 text-sm transition-colors outline-none focus-visible:border-ring placeholder:text-muted-foreground resize-none" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Ubicación / Zona</label>
                  <AddressAutocomplete
                    value={formLocation}
                    onChange={setFormLocation}
                    placeholder="Ej: San Andrés Cholula, Puebla..."
                    className="h-9 rounded-xl"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Renta Mensual (MXN)</label>
                  <Input type="number" min="0" placeholder="Ej: 3800" value={formRent} onChange={(e) => setFormRent(e.target.value)} className="h-9 rounded-xl" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Depósito Requerido (MXN)</label>
                  <Input type="number" min="0" placeholder="Opcional" value={formDeposit} onChange={(e) => setFormDeposit(e.target.value)} className="h-9 rounded-xl" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Habitaciones Libres</label>
                  <Input type="number" min="1" max="10" value={formRooms} onChange={(e) => setFormRooms(e.target.value)} className="h-9 rounded-xl" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Disponible a partir de</label>
                  <Input type="date" value={formAvailableFrom} onChange={(e) => setFormAvailableFrom(e.target.value)} className="h-9 rounded-xl" />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-semibold text-muted-foreground">Preferencia de Género de Roommate</label>
                  <div className="flex border border-border/40 p-0.5 bg-[#FAF9F6] rounded-xl w-full max-w-md h-9 items-center">
                    <button
                      type="button"
                      onClick={() => setFormGender("")}
                      className={cn(
                        "flex-1 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer text-center h-full flex items-center justify-center",
                        formGender === ""
                          ? "bg-white text-amber-primary shadow-xs"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      Sin preferencia
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormGender("FEMALE")}
                      className={cn(
                        "flex-1 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer text-center h-full flex items-center justify-center",
                        formGender === "FEMALE"
                          ? "bg-white text-amber-primary shadow-xs"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      Solo Mujeres
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormGender("MALE")}
                      className={cn(
                        "flex-1 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer text-center h-full flex items-center justify-center",
                        formGender === "MALE"
                          ? "bg-white text-amber-primary shadow-xs"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      Solo Hombres
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                    <span className="material-symbols-rounded text-xs text-amber-primary">photo_library</span>
                    Fotos de la habitación / casa (máx 4)
                  </label>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {formImages.map((img, idx) => (
                      <div key={idx} className="relative aspect-video rounded-xl overflow-hidden bg-muted group">
                        <img src={img} alt="Preview" className="object-cover w-full h-full" />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="absolute top-1 right-1 bg-red-50 text-white rounded-full p-1 shadow-sm opacity-90 hover:opacity-100 transition-opacity"
                        >
                          <span className="material-symbols-rounded text-[14px] block">delete</span>
                        </button>
                      </div>
                    ))}
                    
                    {formImages.length < 4 && (
                      <label className="border border-dashed border-border/60 hover:border-amber-primary/40 rounded-xl flex flex-col items-center justify-center cursor-pointer aspect-video bg-muted/20 hover:bg-muted/30 transition-all">
                        <span className="material-symbols-rounded text-lg text-muted-foreground">add_a_photo</span>
                        <span className="text-[10px] text-muted-foreground mt-0.5">
                          {uploadingImage ? "Subiendo..." : "Subir Foto"}
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          disabled={uploadingImage}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 pt-1">
                <label className="flex items-center gap-2 text-xs font-medium text-foreground cursor-pointer select-none">
                  <input type="checkbox" checked={formPets} onChange={(e) => setFormPets(e.target.checked)} className="w-4 h-4 rounded border-input accent-amber-primary" />
                  <span className="material-symbols-rounded text-sm text-muted-foreground">pets</span>
                  Se permiten mascotas
                </label>
                <label className="flex items-center gap-2 text-xs font-medium text-foreground cursor-pointer select-none">
                  <input type="checkbox" checked={formSmoking} onChange={(e) => setFormSmoking(e.target.checked)} className="w-4 h-4 rounded border-input accent-amber-primary" />
                  <span className="material-symbols-rounded text-sm text-muted-foreground">smoking_rooms</span>
                  Se permite fumar
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-border/10">
                <Button variant="ghost" size="sm" onClick={() => { setShowCreate(false); setCreateError(""); }} className="rounded-xl text-xs">
                  Cancelar
                </Button>
                <Button onClick={handleCreate} disabled={createLoading} className="bg-amber-primary hover:bg-[#6c4300] text-white font-semibold rounded-xl text-xs shadow-sm h-8" size="sm">
                  {createLoading ? "Publicando..." : "Crear Publicación"}
                </Button>
              </div>
            </div>
          )}

          {/* Owner's publications list */}
          {myOwnListings.length === 0 ? (
            <div className="text-center py-16 px-6 bg-white border border-border/30 rounded-2xl space-y-3">
              <div className="w-14 h-14 bg-amber-primary/10 rounded-full flex items-center justify-center mx-auto text-amber-primary">
                <span className="material-symbols-rounded text-3xl">real_estate_agent</span>
              </div>
              <p className="text-sm font-semibold text-foreground">No tienes publicaciones activas</p>
              <p className="text-xs text-muted-foreground max-w-xs mx-auto leading-relaxed">
                Registra tu habitación o tu casa hoy para que los postulantes se pongan en contacto contigo.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {myOwnListings.map((listing) => {
                const isEditing = editingId === listing.id;
                const isExpanded = expandedListingId === listing.id;
                const apps = applicationsMap[listing.id] || [];

                return (
                  <div
                    key={listing.id}
                    onClick={(e) => {
                      const target = e.target as HTMLElement;
                      if (
                        target.closest("button") ||
                        target.closest("a") ||
                        target.closest("input") ||
                        target.closest("textarea")
                      ) {
                        return;
                      }
                      toggleExpandListing(listing.id);
                    }}
                    className={cn(
                      "bg-white rounded-2xl border border-border/30 p-5 space-y-4 transition-all duration-200 text-left cursor-pointer hover:border-amber-primary/25",
                      isExpanded && "border-amber-primary/30 shadow-[0_4px_16px_rgba(133,83,0,0.04)]"
                    )}
                  >
                    {isEditing ? (
                      <div className="space-y-3">
                        <Input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="h-9 rounded-xl text-sm font-bold" placeholder="Título" />
                        <textarea value={editDescription} onChange={(e) => setEditDescription(e.target.value)} rows={3} className="w-full rounded-xl border border-input bg-transparent px-2.5 py-1.5 text-xs outline-none focus-visible:border-ring resize-none" />
                        <div className="grid grid-cols-3 gap-2">
                          <Input type="number" value={editRent} onChange={(e) => setEditRent(e.target.value)} className="h-8 rounded-xl text-xs" placeholder="Renta" />
                          <Input value={editLocation} onChange={(e) => setEditLocation(e.target.value)} className="h-8 rounded-xl text-xs" placeholder="Ubicación" />
                          <Input type="number" value={editRooms} onChange={(e) => setEditRooms(e.target.value)} className="h-8 rounded-xl text-xs" placeholder="Habs." />
                        </div>
                        <div className="flex justify-end gap-2 pt-1">
                          <Button variant="ghost" size="xs" onClick={() => setEditingId(null)} className="rounded-lg text-xs">Cancelar</Button>
                          <Button size="xs" onClick={handleSaveEdit} disabled={editLoading} className="bg-amber-primary hover:bg-[#6c4300] text-white rounded-lg text-xs">
                            {editLoading ? "Guardando..." : "Guardar Cambios"}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                          <div className="space-y-1">
                            <h3 className="font-bold text-base text-foreground leading-snug flex items-center gap-1.5">
                              {listing.title}
                              <span className={cn(
                                "text-[9px] font-bold px-2 py-0.5 rounded-full",
                                listing.status === "ACTIVE" ? "bg-green-50 text-green-700" : "bg-muted text-muted-foreground"
                              )}>
                                {listing.status === "ACTIVE" ? "Activo" : "Oculto"}
                              </span>
                            </h3>
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <span className="material-symbols-rounded text-sm">location_on</span>
                              {listing.location} &bull; Renta: {formatRent(listing.monthlyRent)}/mes
                            </p>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleStartEdit(listing)}
                              className="text-[11px] font-semibold text-muted-foreground hover:text-foreground flex items-center gap-0.5 px-2.5 py-1.5 rounded-xl hover:bg-muted transition-colors border border-border/20"
                            >
                              <span className="material-symbols-rounded text-xs">edit</span>
                              Editar
                            </button>
                            <button
                              onClick={() => handleDelete(listing.id)}
                              disabled={deletingId === listing.id}
                              className="text-[11px] font-semibold text-red-500 hover:text-red-700 flex items-center gap-0.5 px-2.5 py-1.5 rounded-xl hover:bg-red-50 transition-colors border border-red-200/20 disabled:opacity-50"
                            >
                              <span className="material-symbols-rounded text-xs">delete</span>
                              Eliminar
                            </button>
                            <span className="material-symbols-rounded text-muted-foreground/60 transition-transform duration-200 select-none ml-1">
                              {isExpanded ? "expand_less" : "expand_more"}
                            </span>
                          </div>
                        </div>

                        {/* Collapsible Applicants Panel */}
                        {isExpanded && (
                          <div className="pt-4 border-t border-border/20 space-y-3 animate-in fade-in duration-200">
                            <h4 className="text-xs font-bold text-foreground flex items-center gap-1">
                              <span className="material-symbols-rounded text-xs text-amber-primary">inbox</span>
                              Bandeja de postulantes recibidos
                            </h4>

                            {loadingAppsId === listing.id ? (
                              <div className="text-center py-6 text-xs text-muted-foreground flex items-center justify-center gap-2">
                                <span className="w-3.5 h-3.5 border-2 border-amber-primary/30 border-t-amber-primary rounded-full animate-spin" />
                                Cargando postulantes...
                              </div>
                            ) : apps.length === 0 ? (
                              <p className="text-xs text-muted-foreground italic py-3 bg-muted/40 rounded-xl text-center">
                                Aún no has recibido postulaciones para esta habitación.
                              </p>
                            ) : (
                              <div className="space-y-3">
                                {apps.map((app) => (
                                  <div
                                    key={app.id}
                                    className="bg-amber-primary/[0.02] border border-border/20 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                                  >
                                    <div className="flex items-start gap-2.5">
                                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-primary/20 to-amber-primary/5 flex items-center justify-center text-xs font-bold text-amber-primary shrink-0">
                                        {app.user.name.charAt(0).toUpperCase()}
                                      </div>
                                      <div className="space-y-0.5">
                                        <div className="flex items-center gap-1.5">
                                          <p className="text-xs font-bold text-foreground">
                                            {app.user.name}
                                          </p>
                                          {app.user.reputationScore !== null ? (
                                            <span className="inline-flex items-center text-[10px] font-semibold text-amber-600 bg-amber-50 px-1.5 py-0.2 rounded">
                                              <span className="material-symbols-rounded text-amber-500 text-[10px] mr-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                              {app.user.reputationScore.toFixed(1)}
                                            </span>
                                          ) : (
                                            <span className="text-[10px] text-muted-foreground italic bg-muted px-1.5 py-0.2 rounded">
                                              Sin reputación
                                            </span>
                                          )}
                                        </div>
                                        <p className="text-[10px] text-muted-foreground">
                                          Postulado el: {formatDate(app.createdAt)}
                                        </p>
                                        {app.message && (
                                          <p className="text-xs text-foreground bg-white border border-border/10 rounded-lg p-2 mt-1.5 italic max-w-md">
                                            &ldquo;{app.message}&rdquo;
                                          </p>
                                        )}
                                      </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex flex-wrap items-center gap-2 self-end sm:self-center">
                                      {/* WhatsApp button */}
                                      <a
                                        href={`https://wa.me/${app.phoneNumber}?text=Hola%20${encodeURIComponent(app.user.name)},%20vi%20tu%20postulación%20en%20Kimito%20para%20la%20habitación%20"${encodeURIComponent(listing.title)}".`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center justify-center gap-1 bg-[#25D366] hover:bg-[#20ba5a] text-white text-[11px] font-bold h-8 px-3 rounded-xl shadow-sm transition-colors"
                                      >
                                        <span className="material-symbols-rounded text-sm">chat</span>
                                        Contactar WhatsApp
                                      </a>

                                      {/* Share Invite Code Web Push Button */}
                                      <Button
                                        onClick={() => handleSendInvite(listing.id, app.id)}
                                        disabled={invitingAppId === app.id}
                                        variant="outline"
                                        className={cn(
                                          "rounded-xl text-[11px] font-semibold h-8 border-amber-primary/20 hover:bg-amber-primary/5",
                                          inviteSuccessMap[app.id] && "bg-green-50 text-green-700 border-green-200"
                                        )}
                                      >
                                        {inviteSuccessMap[app.id] ? (
                                          <>
                                            <span className="material-symbols-rounded text-xs mr-1 text-green-600">check_circle</span>
                                            ¡Código Enviado!
                                          </>
                                        ) : invitingAppId === app.id ? (
                                          "Enviando..."
                                        ) : (
                                          <>
                                            <span className="material-symbols-rounded text-xs mr-1 text-amber-primary">send</span>
                                            Enviar Invitación (Push)
                                          </>
                                        )}
                                      </Button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Pagination (Tab 1 Only) */}
      {activeTab === "search" && totalPages > 1 && (
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

      {/* ============================================================== */}
      {/* MODAL: POSTULACIÓN A HABITACIÓN */}
      {/* ============================================================== */}
      {applyingListing && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white border border-border/20 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-xl text-left animate-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between">
              <h3 className="font-bold text-base text-foreground flex items-center gap-1.5">
                <span className="material-symbols-rounded text-amber-primary text-xl">real_estate_agent</span>
                Postularme como Roommate
              </h3>
              <button onClick={() => setApplyingListing(null)} className="text-muted-foreground hover:text-foreground">
                <span className="material-symbols-rounded text-lg">close</span>
              </button>
            </div>

            <p className="text-xs text-muted-foreground">
              Estás postulándote para la habitación <strong>{applyingListing.title}</strong>. El dueño del anuncio podrá ver tu reputación y tu información de contacto para coordinar vía WhatsApp.
            </p>

            {applyError && (
              <div className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-xl px-3 py-2 font-medium">
                {applyError}
              </div>
            )}
            {applySuccess && (
              <div className="text-xs text-green-700 bg-green-50 border border-green-100 rounded-xl px-3 py-2 font-medium flex items-center gap-1.5">
                <span className="material-symbols-rounded text-sm">check_circle</span>
                ¡Tu postulación ha sido enviada con éxito!
              </div>
            )}

            <div className="space-y-3.5">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                  Número de WhatsApp
                  <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="material-symbols-rounded absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">phone</span>
                  <Input
                    placeholder="Ej: +52 222 123 4567"
                    value={applyPhone}
                    onChange={(e) => setApplyPhone(e.target.value)}
                    className="h-10 rounded-xl pl-9 text-sm"
                    type="tel"
                  />
                </div>
                <p className="text-[10px] text-muted-foreground leading-normal">
                  Ingresa tu código de país y número (ej. +52 para México).
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Mensaje de presentación (opcional)</label>
                <textarea
                  placeholder="Preséntate brevemente, dinos a qué te dedicas y por qué te interesa la habitación..."
                  value={applyMessage}
                  onChange={(e) => setApplyMessage(e.target.value)}
                  rows={4}
                  className="w-full rounded-xl border border-input bg-transparent px-3 py-2 text-xs outline-none focus-visible:border-ring placeholder:text-muted-foreground resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-border/10">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setApplyingListing(null)}
                className="rounded-xl text-xs"
                disabled={applyLoading}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleApplySubmit}
                disabled={applyLoading || applySuccess}
                className="bg-amber-primary hover:bg-[#6c4300] text-white font-semibold rounded-xl text-xs shadow-sm h-9 px-4"
              >
                {applyLoading ? "Enviando..." : "Enviar Postulación"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

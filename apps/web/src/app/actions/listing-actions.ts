"use server";

import { fetchFromApi } from "@/lib/api-client";
import type {
  CreateListingDto,
  UpdateListingDto,
  ListingResponse,
  PaginatedListings,
  ListingStatus,
  PreferredGender,
} from "@kimito/shared-types";
import { revalidatePath } from "next/cache";

export async function getListingsAction(filters?: {
  location?: string;
  minRent?: number;
  maxRent?: number;
  availableFrom?: string;
  petsAllowed?: boolean;
  smokingAllowed?: boolean;
  preferredGender?: PreferredGender;
  search?: string;
  status?: ListingStatus;
  page?: number;
  limit?: number;
}): Promise<PaginatedListings> {
  try {
    const params = new URLSearchParams();
    if (filters?.location) params.set("location", filters.location);
    if (filters?.minRent !== undefined) params.set("minRent", String(filters.minRent));
    if (filters?.maxRent !== undefined) params.set("maxRent", String(filters.maxRent));
    if (filters?.availableFrom) params.set("availableFrom", filters.availableFrom);
    if (filters?.petsAllowed !== undefined) params.set("petsAllowed", String(filters.petsAllowed));
    if (filters?.smokingAllowed !== undefined) params.set("smokingAllowed", String(filters.smokingAllowed));
    if (filters?.preferredGender) params.set("preferredGender", filters.preferredGender);
    if (filters?.search) params.set("search", filters.search);
    if (filters?.status) params.set("status", filters.status);
    if (filters?.page) params.set("page", String(filters.page));
    if (filters?.limit) params.set("limit", String(filters.limit));

    const query = params.toString();
    const endpoint = query ? `/listings?${query}` : "/listings";

    return await fetchFromApi<PaginatedListings>(endpoint, { cache: "no-store" });
  } catch (error) {
    console.error("Error al obtener publicaciones:", error);
    return { data: [], total: 0, page: 1, limit: 12, totalPages: 0 };
  }
}

export async function getListingByIdAction(id: string): Promise<ListingResponse | null> {
  try {
    return await fetchFromApi<ListingResponse>(`/listings/${id}`, { cache: "no-store" });
  } catch (error) {
    console.error("Error al obtener publicación:", error);
    return null;
  }
}

export async function createListingAction(dto: CreateListingDto): Promise<ListingResponse> {
  const res = await fetchFromApi<ListingResponse>("/listings", {
    method: "POST",
    body: JSON.stringify(dto),
  });
  revalidatePath("/dashboard/listings");
  return res;
}

export async function updateListingAction(
  id: string,
  dto: UpdateListingDto,
): Promise<ListingResponse> {
  const res = await fetchFromApi<ListingResponse>(`/listings/${id}`, {
    method: "PATCH",
    body: JSON.stringify(dto),
  });
  revalidatePath("/dashboard/listings");
  return res;
}

export async function deleteListingAction(id: string): Promise<{ success: boolean }> {
  const res = await fetchFromApi<{ success: boolean }>(`/listings/${id}`, {
    method: "DELETE",
  });
  revalidatePath("/dashboard/listings");
  return res;
}

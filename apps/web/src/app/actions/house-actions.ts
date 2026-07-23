"use server";

import { fetchFromApi } from "@/lib/api-client";
import type { CreateHouseDto, HouseResponse, HouseMemberResponse } from "@kimito/shared-types";
import { revalidatePath } from "next/cache";

export async function createHouseAction(dto: CreateHouseDto): Promise<HouseResponse> {
  const res = await fetchFromApi<HouseResponse>("/houses", {
    method: "POST",
    body: JSON.stringify(dto),
  });
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/house");
  return res;
}

export async function getInviteInfoAction(code: string): Promise<HouseResponse | null> {
  try {
    return await fetchFromApi<HouseResponse>(`/houses/invite-info?code=${code}`, {
      cache: "no-store",
    });
  } catch (error) {
    console.error("Error al obtener información de invitación:", error);
    return null;
  }
}

export async function joinHouseAction(inviteCode: string): Promise<HouseResponse> {
  const res = await fetchFromApi<HouseResponse>("/houses/join", {
    method: "POST",
    body: JSON.stringify({ inviteCode }),
  });
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/house");
  return res;
}

export async function getMyHouseAction(): Promise<HouseResponse | null> {
  try {
    return await fetchFromApi<HouseResponse>("/houses/my-house", {
      cache: "no-store",
    });
  } catch (error) {
    // Si la API retorna un 404 porque no pertenece a ninguna casa, capturamos y retornamos null
    return null;
  }
}

export async function getMyHouseMembersAction(): Promise<HouseMemberResponse[]> {
  try {
    return await fetchFromApi<HouseMemberResponse[]>("/houses/my-house/members", {
      cache: "no-store",
    });
  } catch (error) {
    console.error("Error al obtener miembros de la casa:", error);
    return [];
  }
}

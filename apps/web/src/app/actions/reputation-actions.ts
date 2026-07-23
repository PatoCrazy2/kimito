"use server";

import { fetchFromApi } from "@/lib/api-client";

export async function getMyReputationAction() {
  try {
    return await fetchFromApi("/reputation/me", { cache: "no-store" });
  } catch (error) {
    console.error("Error al obtener reputación:", error);
    return null;
  }
}

export async function getUserReputationAction(userId: string) {
  try {
    return await fetchFromApi(`/reputation/users/${userId}`, {
      cache: "no-store",
    });
  } catch (error) {
    console.error("Error al obtener reputación del usuario:", error);
    return null;
  }
}

"use server";

import { fetchFromApi } from "@/lib/api-client";
import { UserDto } from "@kimito/shared-types";

/**
 * Obtiene los datos del usuario autenticado actual desde la API de NestJS (GET /me).
 * Si ocurre algún error o no hay sesión activa, retorna null.
 */
export async function getCurrentUser(): Promise<UserDto | null> {
  try {
    return await fetchFromApi<UserDto>("/me", {
      cache: "no-store", // Asegurar que no se guarde en caché de Next.js
    });
  } catch (error) {
    console.error("Error al obtener usuario actual:", error);
    return null;
  }
}

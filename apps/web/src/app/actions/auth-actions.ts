"use server";

import { signIn, signOut } from "@/auth";

/**
 * Inicia el flujo de autenticación con Google OAuth.
 */
export async function loginWithGoogle() {
  await signIn("google", { redirectTo: "/dashboard" });
}

/**
 * Cierra la sesión activa y redirige al login.
 */
export async function logout() {
  await signOut({ redirectTo: "/login" });
}

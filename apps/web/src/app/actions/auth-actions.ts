"use server";

import { signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";

/**
 * Inicia el flujo de autenticación con Google OAuth.
 */
export async function loginWithGoogle() {
  await signIn("google", { redirectTo: "/dashboard" });
}

/**
 * Inicia sesión con credenciales (correo y contraseña).
 */
export async function loginWithCredentials(prevState: any, formData: FormData) {
  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: "/dashboard",
    });
    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Credenciales inválidas." };
        default:
          return { error: "Ocurrió un error al iniciar sesión." };
      }
    }
    
    // Si no es un AuthError, lo lanzamos de nuevo (incluyendo NEXT_REDIRECT)
    // para que Next.js maneje la redirección u otros errores nativos correctamente.
    throw error;
  }
}

/**
 * Registra un nuevo usuario con credenciales.
 */
export async function registerWithCredentials(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const name = formData.get("name") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (password !== confirmPassword) {
    return { error: "Las contraseñas no coinciden." };
  }

  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    const res = await fetch(`${apiUrl}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, name }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      return { error: errorData.message || "Error al registrar el usuario." };
    }
  } catch (error) {
    console.error("Error en el registro:", error);
    return { error: "Error de conexión al registrar." };
  }

  // Tras el registro exitoso, iniciamos sesión automáticamente
  // Lo hacemos fuera del try-catch del fetch para que el redirect fluya correctamente
  return await loginWithCredentials(prevState, formData);
}

/**
 * Cierra la sesión activa y redirige al login.
 */
export async function logout() {
  await signOut({ redirectTo: "/login" });
}

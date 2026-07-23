import { cookies } from "next/headers";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export async function fetchFromApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  let token: string | undefined;

  try {
    const cookieStore = await cookies();
    token = 
      cookieStore.get("authjs.session-token")?.value || 
      cookieStore.get("__Secure-authjs.session-token")?.value ||
      cookieStore.get("next-auth.session-token")?.value ||
      cookieStore.get("__Secure-next-auth.session-token")?.value;
  } catch (error) {
    // Esto previene fallos si se intenta usar fuera de un contexto del servidor con cookies
    console.warn("api-client: No se pudo leer cookies en este contexto. Asegúrate de invocarlo en Server Components o Server Actions.");
  }

  const headers = new Headers(options.headers);
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const response = await fetch(`${API_BASE_URL}${cleanEndpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API Error ${response.status}: ${errorText || response.statusText}`);
  }

  return response.json() as Promise<T>;
}

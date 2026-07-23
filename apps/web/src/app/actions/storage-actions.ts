"use server";

export async function uploadEvidenceAction(
  formData: FormData,
): Promise<{ url: string; key: string }> {
  // Obtenemos el token de la sesión desde las cookies o enviamos multipart a NestJS
  const file = formData.get("file") as File;
  if (!file) {
    throw new Error("No se ha seleccionado ningún archivo");
  }

  const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

  // Enviamos la imagen como multipart/form-data
  const response = await fetch(`${backendUrl}/storage/upload`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Error al subir la imagen de evidencia");
  }

  return response.json();
}

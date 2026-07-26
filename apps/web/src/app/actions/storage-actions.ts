"use server";

import { fetchFromApi } from "@/lib/api-client";

export async function uploadEvidenceAction(
  formData: FormData,
): Promise<{ url: string; key: string }> {
  const file = formData.get("file") as File;
  if (!file) {
    throw new Error("No se ha seleccionado ningún archivo");
  }

  return fetchFromApi<{ url: string; key: string }>("/storage/upload", {
    method: "POST",
    body: formData,
  });
}


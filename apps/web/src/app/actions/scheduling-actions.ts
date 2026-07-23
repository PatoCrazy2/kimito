"use server";

import { fetchFromApi } from "@/lib/api-client";
import type {
  TaskAssignmentResponse,
  OverrideAssignmentDto,
  GenerateScheduleDto,
} from "@kimito/shared-types";
import { revalidatePath } from "next/cache";

export async function getAssignmentsAction(): Promise<
  TaskAssignmentResponse[]
> {
  try {
    return await fetchFromApi<TaskAssignmentResponse[]>(
      "/scheduling/assignments",
      {
        cache: "no-store",
      },
    );
  } catch (error) {
    console.error("Error al obtener asignaciones:", error);
    return [];
  }
}

export async function generateScheduleAction(
  dto?: GenerateScheduleDto,
): Promise<TaskAssignmentResponse[]> {
  const res = await fetchFromApi<TaskAssignmentResponse[]>(
    "/scheduling/generate",
    {
      method: "POST",
      body: JSON.stringify(dto || {}),
    },
  );
  revalidatePath("/dashboard");
  return res;
}

export async function overrideAssignmentAction(
  dto: OverrideAssignmentDto,
): Promise<TaskAssignmentResponse> {
  const res = await fetchFromApi<TaskAssignmentResponse>(
    "/scheduling/override",
    {
      method: "PATCH",
      body: JSON.stringify(dto),
    },
  );
  revalidatePath("/dashboard");
  return res;
}

export async function completeAssignmentAction(
  id: string,
  evidenceUrl?: string,
): Promise<TaskAssignmentResponse> {
  const res = await fetchFromApi<TaskAssignmentResponse>(
    `/scheduling/assignments/${id}/complete`,
    {
      method: "PATCH",
      body: JSON.stringify({ evidenceUrl }),
    },
  );
  revalidatePath("/dashboard");
  return res;
}

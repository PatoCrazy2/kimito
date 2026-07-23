"use server";

import { fetchFromApi } from "@/lib/api-client";
import type { CreateTaskDto, UpdateTaskDto, TaskResponse } from "@kimito/shared-types";
import { revalidatePath } from "next/cache";

export async function getHouseTasksAction(houseId: string): Promise<TaskResponse[]> {
  try {
    return await fetchFromApi<TaskResponse[]>(`/houses/${houseId}/tasks`, {
      cache: "no-store",
    });
  } catch (error) {
    console.error("Error al obtener tareas de la casa:", error);
    return [];
  }
}

export async function createTaskAction(dto: CreateTaskDto): Promise<TaskResponse> {
  const res = await fetchFromApi<TaskResponse>("/tasks", {
    method: "POST",
    body: JSON.stringify(dto),
  });
  revalidatePath("/dashboard/tasks");
  return res;
}

export async function updateTaskAction(id: string, dto: UpdateTaskDto): Promise<TaskResponse> {
  const res = await fetchFromApi<TaskResponse>(`/tasks/${id}`, {
    method: "PUT",
    body: JSON.stringify(dto),
  });
  revalidatePath("/dashboard/tasks");
  return res;
}

export async function deleteTaskAction(id: string): Promise<{ success: boolean }> {
  const res = await fetchFromApi<{ success: boolean }>(`/tasks/${id}`, {
    method: "DELETE",
  });
  revalidatePath("/dashboard/tasks");
  return res;
}

export interface CreateTaskDto {
  title: string;
  weight: number; // strictly restricted 1-5 in business logic
  recurrence: string; // e.g. "daily", "weekly"
  isCustom?: boolean;
}

export interface UpdateTaskDto {
  title?: string;
  weight?: number;
  recurrence?: string;
}

export interface TaskResponse {
  id: string;
  houseId: string;
  title: string;
  weight: number;
  recurrence: string;
  isCustom: boolean;
}

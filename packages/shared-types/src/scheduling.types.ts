export interface TaskAssignmentResponse {
  id: string;
  taskId: string;
  userId: string;
  periodStart: string | Date;
  periodEnd: string | Date;
  status: 'PENDING' | 'COMPLETED' | 'LATE';
  completedAt?: string | Date | null;
  evidenceUrl?: string | null;
  task?: {
    id: string;
    title: string;
    weight: number;
    recurrence: string;
  };
  user?: {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string | null;
  };
}

export interface OverrideAssignmentDto {
  assignmentId: string;
  newUserId: string;
}

export interface GenerateScheduleDto {
  houseId?: string;
  startDate?: string;
  endDate?: string;
}

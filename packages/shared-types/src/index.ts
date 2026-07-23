// Shared Types for Kimito

export interface UserDto {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  createdAt: Date;
}

export * from "./houses.types";
export * from "./tasks.types";
export * from "./scheduling.types";
export * from "./notifications.types";

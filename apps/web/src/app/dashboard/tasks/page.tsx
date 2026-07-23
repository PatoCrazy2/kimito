import { getCurrentUser } from "@/app/actions/user-actions";
import { getMyHouseAction, getMyHouseMembersAction } from "@/app/actions/house-actions";
import { getHouseTasksAction } from "@/app/actions/task-actions";
import type { TaskResponse } from "@kimito/shared-types";
import TasksClient from "./TasksClient";

export const metadata = {
  title: "Tareas del Hogar - Kimito",
  description: "Administra las tareas y el catálogo de limpieza del hogar.",
};

export default async function TasksPage() {
  const user = await getCurrentUser();
  const house = await getMyHouseAction();

  let tasks: TaskResponse[] = [];
  let isAdmin = false;

  if (house) {
    tasks = await getHouseTasksAction(house.id);
    const members = await getMyHouseMembersAction();
    isAdmin = members.some((m) => m.userId === user?.id && m.role === "ADMIN");
  }

  return <TasksClient initialTasks={tasks} house={house} isAdmin={isAdmin} />;
}

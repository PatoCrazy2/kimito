import { getCurrentUser } from "@/app/actions/user-actions";
import {
  getMyHouseAction,
  getMyHouseMembersAction,
} from "@/app/actions/house-actions";
import { getHouseTasksAction } from "@/app/actions/task-actions";
import { getAssignmentsAction } from "@/app/actions/scheduling-actions";
import { getMyReputationAction } from "@/app/actions/reputation-actions";
import OnboardingClient from "./OnboardingClient";
import DashboardClient from "./DashboardClient";
import { redirect } from "next/navigation";

interface PageProps {
  searchParams: Promise<{ skip?: string }>;
}

export default async function DashboardPage({ searchParams }: PageProps) {
  const { skip } = await searchParams;
  const user = await getCurrentUser();
  const house = await getMyHouseAction();

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
        <span className="material-symbols-rounded text-destructive text-5xl mb-4">
          error
        </span>
        <h2 className="text-xl font-bold">Error de Sesión</h2>
        <p className="text-muted-foreground mt-1">
          No se pudieron cargar los datos del usuario autenticado.
        </p>
      </div>
    );
  }

  if (!house) {
    if (skip !== "true") {
      redirect("/onboarding");
    }
    return <OnboardingClient userName={user.name} />;
  }

  // Cargar todos los datos del Sprint 3 en paralelo
  const [tasks, members, assignments, reputation] = await Promise.all([
    getHouseTasksAction(house.id),
    getMyHouseMembersAction(),
    getAssignmentsAction(),
    getMyReputationAction(),
  ]);

  return (
    <DashboardClient
      userName={user.name}
      houseName={house.name}
      tasks={tasks}
      members={members}
      assignments={assignments}
      reputation={reputation}
    />
  );
}

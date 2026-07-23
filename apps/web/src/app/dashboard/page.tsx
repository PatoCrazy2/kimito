import { getCurrentUser } from "@/app/actions/user-actions";
import { getMyHouseAction } from "@/app/actions/house-actions";
import { getHouseTasksAction } from "@/app/actions/task-actions";
import OnboardingClient from "./OnboardingClient";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  const house = await getMyHouseAction();

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
        <span className="material-symbols-rounded text-destructive text-5xl mb-4">
          error
        </span>
        <h2 className="text-xl font-bold">Error de Sesión</h2>
        <p className="text-muted-foreground mt-1">No se pudieron cargar los datos del usuario autenticado.</p>
      </div>
    );
  }

  if (!house) {
    return <OnboardingClient userName={user.name} />;
  }

  const tasks = await getHouseTasksAction(house.id);

  return (
    <DashboardClient 
      userName={user.name} 
      houseName={house.name} 
      tasks={tasks} 
    />
  );
}
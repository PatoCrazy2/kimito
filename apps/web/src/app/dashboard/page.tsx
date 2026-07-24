import { getCurrentUser } from "@/app/actions/user-actions";
import {
  getMyHouseAction,
  getMyHouseMembersAction,
} from "@/app/actions/house-actions";
import { getHouseTasksAction } from "@/app/actions/task-actions";
import { getAssignmentsAction } from "@/app/actions/scheduling-actions";

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
    redirect("/login");
  }


  if (!house) {
    if (skip !== "true") {
      redirect("/onboarding");
    }
    return <OnboardingClient userName={user.name} />;
  }

  const [tasks, members, assignments] = await Promise.all([
    getHouseTasksAction(house.id),
    getMyHouseMembersAction(),
    getAssignmentsAction(),
  ]);

  return (
    <DashboardClient
      userName={user.name}
      currentUserId={user.id}
      houseName={house.name}
      tasks={tasks}
      members={members}
      assignments={assignments}
    />
  );
}

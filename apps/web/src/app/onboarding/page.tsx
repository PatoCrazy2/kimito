import { getCurrentUser } from "@/app/actions/user-actions";
import { getMyHouseAction } from "@/app/actions/house-actions";
import { redirect } from "next/navigation";
import OnboardingFullscreenClient from "./OnboardingFullscreenClient";

export default async function OnboardingPage() {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect("/login");
  }

  const house = await getMyHouseAction();

  // If user already belongs to a house, onboarding is skipped
  if (house) {
    redirect("/dashboard");
  }

  return (
    <OnboardingFullscreenClient userName={user.name} />
  );
}

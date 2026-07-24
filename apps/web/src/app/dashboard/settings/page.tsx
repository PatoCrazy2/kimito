import { getCurrentUser } from "@/app/actions/user-actions";
import { redirect } from "next/navigation";
import SettingsClient from "./SettingsClient";

export default async function SettingsPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  return <SettingsClient userName={user.name} />;
}

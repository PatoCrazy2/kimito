import { getMyHouseAction, getMyHouseMembersAction } from "@/app/actions/house-actions";
import HouseClient from "./HouseClient";

export const metadata = {
  title: "Mi Casa - Kimito",
  description: "Administra tu casa compartida, invita a tus roommates y visualiza los miembros del hogar.",
};

export default async function HousePage() {
  const house = await getMyHouseAction();
  const members = house ? await getMyHouseMembersAction() : [];

  return <HouseClient initialHouse={house} initialMembers={members} />;
}

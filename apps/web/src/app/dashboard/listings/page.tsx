import { getCurrentUser } from "@/app/actions/user-actions";
import { getListingsAction } from "@/app/actions/listing-actions";
import ListingsClient from "./ListingsClient";

export const metadata = {
  title: "Encuentra Roomie - Kimito",
  description: "Busca habitaciones disponibles y encuentra al roomie ideal.",
};

export default async function ListingsPage() {
  const user = await getCurrentUser();
  const initialData = await getListingsAction({ page: 1, limit: 12 });

  return <ListingsClient initialData={initialData} currentUserId={user?.id} />;
}

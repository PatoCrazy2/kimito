import { getCurrentUser } from "@/app/actions/user-actions";
import { getMyReputationAction } from "@/app/actions/reputation-actions";
import ReputationCard from "@/components/reputation/ReputationCard";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";

export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const reputation = await getMyReputationAction() as any;

  return (
    <div className="space-y-6 max-w-xl mx-auto py-4 animate-in fade-in duration-300">
      {/* Cabecera superior */}
      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground select-none pb-1.5 border-b border-border/30 w-full">
        <Link href="/dashboard" className="hover:text-foreground flex items-center gap-1">
          <span className="material-symbols-rounded text-sm">arrow_back</span>
          Volver a Inicio
        </Link>
      </div>

      {/* Información del Perfil */}
      <Card className="border-border/40 shadow-[0_4px_24px_rgba(133,83,0,0.02)] rounded-3xl bg-white p-6 text-center space-y-4">
        <div className="flex flex-col items-center gap-3">
          {user.avatarUrl ? (
            <Image
              src={user.avatarUrl}
              alt={user.name}
              width={80}
              height={80}
              className="rounded-full border-4 border-amber-primary/10 shadow-sm"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-amber-primary text-white flex items-center justify-center font-black text-2xl shadow-sm select-none">
              {user.name.charAt(0).toUpperCase()}
            </div>
          )}
          
          <div className="space-y-1">
            <h2 className="font-sans font-black text-xl text-foreground">
              {user.name}
            </h2>
            <p className="text-xs font-semibold text-muted-foreground truncate max-w-xs">
              {user.email}
            </p>
          </div>
        </div>
      </Card>

      {/* Tarjeta de Reputación */}
      <ReputationCard reputationData={reputation} />
    </div>
  );
}

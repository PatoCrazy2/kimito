import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getInviteInfoAction, joinHouseAction, getMyHouseAction } from "@/app/actions/house-actions";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PageProps {
  searchParams: Promise<{ code?: string }>;
}

export default async function JoinPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const code = params.code;

  if (!code) {
    redirect("/dashboard");
  }

  const session = await auth();
  if (!session) {
    redirect(`/login?callbackUrl=/join?code=${code}`);
  }

  // Si el usuario ya tiene una casa activa, redirigir al dashboard
  const myHouse = await getMyHouseAction();
  if (myHouse) {
    redirect("/dashboard");
  }

  const house = await getInviteInfoAction(code);

  async function handleJoin() {
    "use server";
    if (code) {
      try {
        await joinHouseAction(code);
      } catch (e) {
        console.error("Error uniendo a casa:", e);
      }
      redirect("/dashboard");
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-amber-primary/5 via-[#FAF9F6] to-[#FAF9F6] p-4 text-center">
      {!house ? (
        <Card className="w-full max-w-md border-border/50 shadow-lg rounded-3xl p-6 bg-white/70 backdrop-blur-md">
          <CardHeader>
            <span className="material-symbols-rounded text-destructive text-5xl mb-2 mx-auto">
              error
            </span>
            <CardTitle className="text-2xl font-black text-foreground">
              Invitación Inválida
            </CardTitle>
            <CardDescription className="text-muted-foreground mt-2">
              El código de invitación proporcionado es inválido o ha expirado.
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-center pt-4">
            <a href="/dashboard" className={cn(buttonVariants({ variant: "default" }), "rounded-2xl px-6 py-2.5 font-bold h-10")}>
              Ir al Dashboard
            </a>
          </CardFooter>
        </Card>
      ) : (
        <Card className="w-full max-w-md border-border/50 shadow-xl rounded-3xl overflow-hidden bg-white/80 backdrop-blur-md animate-in fade-in zoom-in-95 duration-300">
          <div className="h-2 bg-gradient-to-r from-amber-primary to-amber-primary/60" />
          <CardHeader className="pt-8 pb-4">
            <div className="w-16 h-16 rounded-3xl bg-amber-primary/10 text-amber-primary flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-rounded text-3xl font-semibold">
                home_work
              </span>
            </div>
            <CardTitle className="text-2xl font-black text-foreground">
              Te invitaron a una Casa
            </CardTitle>
            <CardDescription className="text-muted-foreground text-sm font-medium mt-1">
              Únete para empezar a organizar tareas y mantener el orden del hogar.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-6 py-4">
            <div className="bg-[#FAF9F6] border border-border/40 rounded-2xl p-4 text-left">
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Hogar</h4>
              <p className="text-lg font-black text-foreground">{house.name}</p>
              {house.description && (
                <>
                  <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mt-3 mb-1">Descripción</h4>
                  <p className="text-sm text-foreground/80 leading-relaxed font-medium">{house.description}</p>
                </>
              )}
              {house.address && (
                <>
                  <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mt-3 mb-1">Dirección</h4>
                  <p className="text-sm text-foreground/80 leading-relaxed font-medium">{house.address}</p>
                </>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-3 px-6 pb-8 pt-4">
            <form action={handleJoin} className="w-full">
              <Button type="submit" className="w-full bg-amber-primary text-white hover:bg-amber-primary/95 rounded-2xl py-6 font-bold shadow-md shadow-amber-primary/10 transition-all duration-200">
                Aceptar Invitación y Unirme
              </Button>
            </form>
            <a href="/dashboard" className={cn(buttonVariants({ variant: "outline" }), "w-full rounded-2xl py-6 border-border/60 hover:bg-secondary/5 font-semibold text-muted-foreground h-12 flex items-center justify-center")}>
              Declinar
            </a>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}

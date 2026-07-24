import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { loginWithGoogle } from "@/app/actions/auth-actions";
import { LoginForm } from "./LoginForm";
import { KimitoLogo } from "@/components/KimitoLogo";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string }>;
}) {
  const session = await auth();
  const sp = await searchParams;
  const isSuccess = sp.success === "true";

  // Redirección si ya está autenticado y no venimos de un login de oauth recién completado
  if (session && !isSuccess) {
    redirect("/dashboard");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F7FAF8] px-4">
      <div className="w-full max-w-md bg-card border border-border/40 rounded-3xl p-8 md:p-10 shadow-[0_12px_40px_rgba(30,122,90,0.05)] text-center transition-all duration-300 hover:shadow-[0_16px_50px_rgba(30,122,90,0.08)]">
        {/* Logotipo */}
        <div className="mx-auto w-16 h-16 flex items-center justify-center mb-6">
          <KimitoLogo size={48} />
        </div>

        {/* Nombre del Proyecto */}
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground mb-3">
          Kimito
        </h1>

        {/* Descripción Corta */}
        <p className="text-sm font-medium text-muted-foreground leading-relaxed mb-8 max-w-sm mx-auto">
          Tu hogar, mejor organizado.
        </p>

        {/* LoginForm (Client Component) */}
        <LoginForm oauthSuccess={isSuccess} />
      </div>
    </main>
  );
}
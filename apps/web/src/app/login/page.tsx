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
    <main className="flex min-h-screen items-center justify-center px-4 relative">
      {/* Branded background pattern exclusive to Login */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.05] z-0"
        style={{
          backgroundImage: "url('/logo.svg')",
          backgroundSize: "60px 60px",
          backgroundRepeat: "repeat",
        }}
        aria-hidden="true"
      />
      <div className="w-full max-w-md bg-card border border-border/25 rounded-2xl p-8 md:p-10 shadow-[0_2px_8px_rgba(0,0,0,0.02),0_12px_40px_rgba(133,83,0,0.04)] text-center animate-fade-up relative z-10">
        {/* Logotipo */}
        <div className="mx-auto w-14 h-14 flex items-center justify-center mb-5">
          <KimitoLogo size={46} />
        </div>

        {/* Nombre del Proyecto */}
        <h1 className="text-[26px] font-extrabold tracking-tight text-foreground mb-2">
          Kimito
        </h1>

        {/* Descripción Corta */}
        <p className="text-[13px] font-medium text-muted-foreground leading-relaxed mb-8 max-w-xs mx-auto">
          Tu hogar, mejor organizado.
        </p>

        {/* LoginForm (Client Component) */}
        <LoginForm oauthSuccess={isSuccess} />
      </div>
    </main>
  );
}

import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { RegisterForm } from "./RegisterForm";
import { KimitoLogo } from "@/components/KimitoLogo";

export default async function RegisterPage() {
  const session = await auth();

  // Redirección si ya está autenticado
  if (session) {
    redirect("/dashboard");
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-8">
      <div className="w-full max-w-md bg-card border border-border/25 rounded-2xl p-8 md:p-10 shadow-[0_2px_8px_rgba(0,0,0,0.02),0_12px_40px_rgba(133,83,0,0.04)] text-center animate-fade-up">
        {/* Logotipo */}
        <div className="mx-auto w-14 h-14 flex items-center justify-center mb-5">
          <KimitoLogo size={46} />
        </div>

        {/* Título */}
        <h1 className="text-[26px] font-extrabold tracking-tight text-foreground mb-2">
          Crear cuenta
        </h1>

        {/* Descripción Corta */}
        <p className="text-[13px] font-medium text-muted-foreground leading-relaxed mb-8 max-w-xs mx-auto">
          Únete a Kimito y comienza a organizar las tareas de tu casa de forma equitativa.
        </p>

        {/* Formulario de registro (Client Component) */}
        <RegisterForm />
      </div>
    </main>
  );
}

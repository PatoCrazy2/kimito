import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { RegisterForm } from "./RegisterForm";

export default async function RegisterPage() {
  const session = await auth();

  // Redirección si ya está autenticado
  if (session) {
    redirect("/dashboard");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-cream px-4 py-8">
      <div className="w-full max-w-md bg-card border border-border/40 rounded-3xl p-8 md:p-10 shadow-[0_12px_40px_rgba(133,83,0,0.06)] text-center transition-all duration-300 hover:shadow-[0_16px_50px_rgba(133,83,0,0.1)]">
        {/* Logotipo */}
        <div className="mx-auto w-16 h-16 rounded-full bg-amber-primary/10 flex items-center justify-center mb-6">
          <span className="material-symbols-rounded text-amber-primary text-4xl select-none">
            person_add
          </span>
        </div>

        {/* Título */}
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground mb-3">
          Crear cuenta
        </h1>

        {/* Descripción Corta */}
        <p className="text-sm font-medium text-muted-foreground leading-relaxed mb-8 max-w-sm mx-auto">
          Únete a Kimito y comienza a organizar las tareas de tu casa de forma equitativa.
        </p>

        {/* Formulario de registro (Client Component) */}
        <RegisterForm />
      </div>
    </main>
  );
}

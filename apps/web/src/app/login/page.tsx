import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { loginWithGoogle } from "@/app/actions/auth-actions";

export default async function LoginPage() {
  const session = await auth();

  // Redirección si ya está autenticado
  if (session) {
    redirect("/dashboard");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-cream px-4">
      <div className="w-full max-w-md bg-card border border-border/40 rounded-3xl p-8 md:p-10 shadow-[0_12px_40px_rgba(133,83,0,0.06)] text-center transition-all duration-300 hover:shadow-[0_16px_50px_rgba(133,83,0,0.1)]">
        {/* Logotipo */}
        <div className="mx-auto w-16 h-16 rounded-full bg-amber-primary/10 flex items-center justify-center mb-6">
          <span className="material-symbols-rounded text-amber-primary text-4xl select-none">
            cleaning_services
          </span>
        </div>

        {/* Nombre del Proyecto */}
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground mb-3">
          Kimito
        </h1>

        {/* Descripción Corta */}
        <p className="text-sm font-medium text-muted-foreground leading-relaxed mb-8 max-w-sm mx-auto">
          Gestiona el aseo de áreas comunes, reparte tareas de forma equitativa y mantén tu reputación en tu casa compartida.
        </p>

        {/* Botón de Google OAuth en Formulario (Server Action) */}
        <form action={loginWithGoogle}>
          <button
            type="submit"
            className="w-full h-13 flex items-center justify-center gap-3.5 bg-amber-primary hover:bg-[#6c4300] active:scale-[0.99] text-white font-bold rounded-2xl shadow-md transition-all duration-200 cursor-pointer"
          >
            {/* Google SVG Icon */}
            <svg
              className="w-5 h-5 shrink-0"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                fill="#EA4335"
              />
            </svg>
            <span>Continuar con Google</span>
          </button>
        </form>
      </div>
    </main>
  );
}
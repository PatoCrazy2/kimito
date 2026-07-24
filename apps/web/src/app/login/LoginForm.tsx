"use client";

import { useActionState } from "react";
import { loginWithCredentials, loginWithGoogle } from "@/app/actions/auth-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { LoginSuccessTransition } from "@/components/LoginSuccessTransition";
import { useRouter } from "next/navigation";

export function LoginForm({ oauthSuccess = false }: { oauthSuccess?: boolean }) {
  const [state, formAction, isPending] = useActionState(loginWithCredentials, null);
  const isTransitioning = state?.success || oauthSuccess;
  const router = useRouter();

  const handleTransitionComplete = () => {
    router.replace("/dashboard");
  };

  return (
    <>
      {isTransitioning && (
        <LoginSuccessTransition onComplete={handleTransitionComplete} />
      )}
      <div className="w-full">
      <form action={formAction} className="space-y-4 mb-6 text-left">
        {state?.error && (
          <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-xl text-center">
            {state.error}
          </div>
        )}

        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-foreground" htmlFor="email">
            Correo electrónico
          </label>
          <Input 
            id="email" 
            name="email" 
            type="email" 
            placeholder="ejemplo@correo.com" 
            required 
            className="h-12 rounded-xl"
            disabled={isPending || isTransitioning}
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-foreground" htmlFor="password">
              Contraseña
            </label>
            <Link 
              href="#" 
              className="text-xs font-medium text-amber-primary hover:underline"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
          <Input 
            id="password" 
            name="password" 
            type="password" 
            placeholder="••••••••" 
            required 
            className="h-12 rounded-xl"
            disabled={isPending || isTransitioning}
          />
        </div>

        <Button 
          type="submit" 
          className="w-full h-12 bg-amber-primary hover:bg-[#6c4300] text-white font-bold rounded-xl shadow-md transition-all mt-2"
          disabled={isPending || isTransitioning}
        >
          {isPending ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            "Iniciar sesión"
          )}
        </Button>
      </form>

      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground font-medium">
            O continuar con
          </span>
        </div>
      </div>

      <form action={loginWithGoogle}>
        <Button
          type="submit"
          variant="outline"
          disabled={isPending || isTransitioning}
          className="w-full h-12 flex items-center justify-center gap-3 bg-card hover:bg-muted/50 border border-border/60 text-foreground font-semibold rounded-xl shadow-sm transition-all"
        >
          <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
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
          Google
        </Button>
      </form>

      <div className="mt-8 text-center text-sm font-medium text-muted-foreground">
        ¿No tienes una cuenta?{" "}
        <Link href="/register" className="text-amber-primary hover:underline">
          Crear cuenta
        </Link>
      </div>
    </div>
    </>
  );
}

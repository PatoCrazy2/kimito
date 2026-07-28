"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import {
  getVapidPublicKeyAction,
  subscribePushAction,
} from "@/app/actions/notification-actions";

interface SettingsClientProps {
  userName: string;
}

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export default function SettingsClient({ userName }: SettingsClientProps) {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isPwaInstalled, setIsPwaInstalled] = useState(false);
  const [themeMode, setThemeMode] = useState<"light" | "dark">("light");

  useEffect(() => {
    // 1. Escuchar el evento de instalación de PWA
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // 2. Verificar si está en modo standalone
    const isStandalone =
      typeof window !== "undefined" &&
      (window.matchMedia("(display-mode: standalone)").matches ||
        (window.navigator as any).standalone === true);
    setIsPwaInstalled(isStandalone);

    // 3. Verificar estado de suscripción de notificaciones
    if (
      typeof window !== "undefined" &&
      "Notification" in window &&
      "serviceWorker" in navigator
    ) {
      if (Notification.permission === "granted") {
        setIsSubscribed(true);
      }
      // Pre-registrar el service worker para que esté listo
      navigator.serviceWorker.register("/sw.js").catch((err) => {
        console.warn("SW register on load:", err);
      });
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleSubscribe = async () => {
    setIsSubscribing(true);
    try {
      if (typeof window !== "undefined" && "Notification" in window) {
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
          // Asegurar que el SW esté registrado y activo
          await navigator.serviceWorker.register("/sw.js");
          const registration = await navigator.serviceWorker.ready;

          const { publicKey } = await getVapidPublicKeyAction();
          if (publicKey) {
            const subscription = await registration.pushManager.subscribe({
              userVisibleOnly: true,
              applicationServerKey: urlBase64ToUint8Array(publicKey),
            });

            const subJson = subscription.toJSON();
            if (subJson.endpoint && subJson.keys?.p256dh && subJson.keys?.auth) {
              await subscribePushAction({
                endpoint: subJson.endpoint,
                keys: {
                  p256dh: subJson.keys.p256dh,
                  auth: subJson.keys.auth,
                },
              });
            }
          }
          setIsSubscribed(true);
        } else {
          alert("Permiso de notificaciones denegado en el navegador.");
        }
      }
    } catch (error) {
      console.error("Error al activar notificaciones:", error);
      alert("Error al activar notificaciones. Revisa la consola para más detalles.");
    } finally {
      setIsSubscribing(false);
    }
  };

  const handleInstallPwa = async () => {
    if (isPwaInstalled) {
      alert(
        "Para desinstalar Kimito, haz clic en el menú de tres puntos (Ajustes de la App) en la esquina superior de esta ventana de PWA y selecciona 'Desinstalar Kimito' o bórrala desde el lanzador de tu dispositivo."
      );
      return;
    }

    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setIsPwaInstalled(true);
      }
    } else {
      // En móviles iOS o cuando no hay prompt nativo disponible
      alert(
        "Para instalar Kimito:\n\n" +
        "iPhone/iPad: Toca el botón Compartir y luego 'Agregar a pantalla de inicio'\n\n" +
        "Android/Chrome: Toca el menú (⋮) y luego 'Instalar aplicación' o 'Agregar a pantalla de inicio'"
      );
    }
  };

  const handleUnsubscribe = async () => {
    setIsSubscribing(true);
    try {
      if (typeof window !== "undefined" && "serviceWorker" in navigator) {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();
        if (subscription) {
          await subscription.unsubscribe();
          setIsSubscribed(false);
          alert("Notificaciones desactivadas correctamente en este dispositivo.");
        } else {
          setIsSubscribed(false);
        }
      }
    } catch (error) {
      console.error("Error al desactivar notificaciones:", error);
    } finally {
      setIsSubscribing(false);
    }
  };

  const toggleTheme = () => {
    // Simular el cambio de tema para la UI
    const nextTheme = themeMode === "light" ? "dark" : "light";
    setThemeMode(nextTheme);
    alert(`Tema cambiado a ${nextTheme === "light" ? "Claro" : "Oscuro"} (Soporte completo próximamente)`);
  };

  return (
    <div className="space-y-6 max-w-xl mx-auto py-4 animate-in fade-in duration-300">
      {/* Cabecera superior */}
      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground select-none pb-1.5 border-b border-border/30 w-full">
        <Link href="/dashboard" className="hover:text-foreground flex items-center gap-1">
          <span className="material-symbols-rounded text-sm">arrow_back</span>
          Volver a Inicio
        </Link>
      </div>

      <div className="text-left select-none space-y-1">
        <h1 className="font-sans font-black text-2xl text-foreground tracking-tight">
          Configuración
        </h1>
        <p className="text-xs text-muted-foreground font-semibold">
          Administra las características de tu aplicación
        </p>
      </div>

      {/* Tarjeta de Opciones */}
      <Card className="border-border/40 shadow-[0_4px_24px_rgba(133,83,0,0.02)] rounded-3xl bg-white divide-y divide-border/30">

        {/* Opción 1: Descargar App */}
        <div className="p-5 flex items-center justify-between gap-4 text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-primary/10 text-amber-primary flex items-center justify-center shrink-0">
              <span className="material-symbols-rounded text-xl">install_mobile</span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-foreground">
                Descargar Aplicación (PWA)
              </h4>
              <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed font-medium">
                {isPwaInstalled
                  ? "Ya estás usando la versión instalada en tu dispositivo."
                  : "Instala Kimito en tu pantalla de inicio para una experiencia nativa."}
              </p>
            </div>
          </div>
          <button
            onClick={handleInstallPwa}
            className={`font-bold px-4 py-2 rounded-xl text-xs transition-all shadow-xs cursor-pointer active:scale-95 whitespace-nowrap ${isPwaInstalled
              ? "bg-muted text-muted-foreground hover:bg-muted/80"
              : "bg-amber-primary hover:bg-amber-primary/95 text-white"
              }`}
          >
            {isPwaInstalled ? "Desinstalar" : "Descargar"}
          </button>
        </div>

        {/* Opción 2: Notificaciones */}
        <div className="p-5 flex items-center justify-between gap-4 text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-primary/10 text-amber-primary flex items-center justify-center shrink-0">
              <span className="material-symbols-rounded text-xl">notifications</span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-foreground">
                Notificaciones Push
              </h4>
              <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed font-medium">
                {isSubscribed
                  ? "Las notificaciones están activadas en este dispositivo."
                  : "Recibe avisos en tiempo real sobre tareas asignadas y completadas."}
              </p>
            </div>
          </div>
          <button
            onClick={isSubscribed ? handleUnsubscribe : handleSubscribe}
            disabled={isSubscribing}
            className={`font-bold px-4 py-2 rounded-xl text-xs transition-all shadow-xs cursor-pointer active:scale-95 disabled:opacity-40 whitespace-nowrap ${isSubscribed
              ? "bg-muted text-muted-foreground hover:bg-muted/80"
              : "bg-amber-primary hover:bg-amber-primary/95 text-white"
              }`}
          >
            {isSubscribing ? "Procesando..." : isSubscribed ? "Desactivar" : "Activar"}
          </button>
        </div>

        {/* Opción 3: Cambiar Tema */}
        <div className="p-5 flex items-center justify-between gap-4 text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-primary/10 text-amber-primary flex items-center justify-center shrink-0">
              <span className="material-symbols-rounded text-xl">palette</span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-foreground">
                Tema de la App
              </h4>
              <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed font-medium">
                Alterna entre el modo claro y oscuro para cuidar tu vista.
              </p>
            </div>
          </div>
          <button
            onClick={toggleTheme}
            className="bg-amber-primary hover:bg-amber-primary/95 text-white font-bold px-4 py-2 rounded-xl text-xs transition-all shadow-xs cursor-pointer active:scale-95 whitespace-nowrap"
          >
            Cambiar Tema
          </button>
        </div>

      </Card>
    </div>
  );
}

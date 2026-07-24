"use client";

import { useState, useEffect } from "react";
import {
  getVapidPublicKeyAction,
  subscribePushAction,
} from "@/app/actions/notification-actions";

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

export default function PushNotificationBanner() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    // 1. Escuchar el evento de instalación de PWA
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // 2. Verificar estado de suscripción de notificaciones
    if (
      typeof window !== "undefined" &&
      "Notification" in window &&
      "serviceWorker" in navigator
    ) {
      if (Notification.permission === "granted") {
        setIsSubscribed(true);
      }
    }

    // 3. Comprobar si ya fue ignorado recientemente en localStorage (2 días de gracia)
    const dismissedUntil = localStorage.getItem("pwa_prompt_dismissed_until");
    const isDismissed = dismissedUntil && Date.now() < parseInt(dismissedUntil, 10);

    const hasNotificationSupport = typeof window !== "undefined" && "Notification" in window;
    const isPermissionGranted = hasNotificationSupport && Notification.permission === "granted";

    // 4. Iniciar timer de delay de 1 minuto (60000ms)
    let timer: NodeJS.Timeout;
    if (!isDismissed && !isPermissionGranted) {
      timer = setTimeout(() => {
        setShowPrompt(true);
      }, 60000); // 1 minuto
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      if (timer) clearTimeout(timer);
    };
  }, []);

  const handleDismiss = () => {
    // Ignorar por 2 días
    const twoDaysFromNow = Date.now() + 2 * 24 * 60 * 60 * 1000;
    localStorage.setItem("pwa_prompt_dismissed_until", twoDaysFromNow.toString());
    setShowPrompt(false);
  };

  const handleInstallAndSubscribe = async () => {
    setIsLoading(true);
    try {
      // 1. Intentar instalar PWA si está disponible el prompt
      if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        console.log("PWA install choice:", outcome);
        setDeferredPrompt(null);
      }

      // 2. Solicitar permiso de Notificaciones
      if (typeof window !== "undefined" && "Notification" in window) {
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
          // Registrar Service Worker
          const registration = await navigator.serviceWorker.register("/sw.js");

          // Obtener llave VAPID
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
        }
      }
      setShowPrompt(false);
    } catch (error) {
      console.error("Error en instalación y suscripción:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!showPrompt || isSubscribed) return null;

  return (
    <>
      {/* Backdrop oscuro con desenfoque de fondo */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 animate-in fade-in duration-300"
      />
      
      {/* Bottom Sheet */}
      <div className="fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-sm bg-card/95 backdrop-blur-md border border-border/80 shadow-[0_8px_32px_rgba(133,83,0,0.08)] rounded-3xl p-5 z-50 animate-in slide-in-from-bottom duration-300">
      <div className="flex flex-col gap-4 text-center select-none">
        {/* Isotipo Circular */}
        <div className="w-12 h-12 rounded-full bg-amber-primary/10 text-amber-primary flex items-center justify-center mx-auto shadow-xs">
          <span className="material-symbols-rounded text-2xl">
            install_mobile
          </span>
        </div>

        {/* Textos */}
        <div className="space-y-1">
          <h4 className="font-sans font-black text-sm text-foreground">
            Lleva a Kimito en tu celular
          </h4>
          <p className="text-[11px] text-muted-foreground leading-relaxed max-w-[280px] mx-auto font-medium">
            Instala la app en tu pantalla de inicio y activa las notificaciones para estar al día con tus labores domésticas.
          </p>
        </div>

        {/* Acciones */}
        <div className="flex flex-col gap-2 pt-1">
          <button
            onClick={handleInstallAndSubscribe}
            disabled={isLoading}
            className="w-full bg-amber-primary hover:bg-amber-primary/95 text-white font-bold py-2.5 rounded-xl text-xs transition-all shadow-xs cursor-pointer active:scale-[0.98] disabled:opacity-50"
          >
            {isLoading ? "Configurando..." : "Descargar y Activar Avisos"}
          </button>
          
          <button
            onClick={handleDismiss}
            disabled={isLoading}
            className="w-full text-muted-foreground hover:text-foreground font-bold py-2 rounded-xl text-xs transition-all cursor-pointer text-center"
          >
            Quizás más tarde
          </button>
        </div>
      </div>
    </div>
    </>
  );
}

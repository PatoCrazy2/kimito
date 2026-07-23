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
  const [showBanner, setShowBanner] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    // Verificar si el navegador soporta Service Worker y Notificaciones
    if (
      typeof window !== "undefined" &&
      "Notification" in window &&
      "serviceWorker" in navigator
    ) {
      if (Notification.permission === "default") {
        setShowBanner(true);
      } else if (Notification.permission === "granted") {
        setIsSubscribed(true);
      }
    }
  }, []);

  const handleSubscribe = async () => {
    setIsLoading(true);
    try {
      // 1. Pedir permiso al navegador
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setShowBanner(false);
        return;
      }

      // 2. Registrar el Service Worker
      const registration = await navigator.serviceWorker.register("/sw.js");

      // 3. Obtener la llave VAPID pública
      const { publicKey } = await getVapidPublicKeyAction();
      if (!publicKey) {
        console.error("No se encontró la VAPID public key");
        return;
      }

      // 4. Suscribir al navegador
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey),
      });

      const subJson = subscription.toJSON();
      if (subJson.endpoint && subJson.keys?.p256dh && subJson.keys?.auth) {
        // 5. Guardar la suscripción en la BD a través del backend
        await subscribePushAction({
          endpoint: subJson.endpoint,
          keys: {
            p256dh: subJson.keys.p256dh,
            auth: subJson.keys.auth,
          },
        });
      }

      setIsSubscribed(true);
      setShowBanner(false);
    } catch (error) {
      console.error("Error al suscribirse a notificaciones:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!showBanner || isSubscribed) return null;

  return (
    <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-primary/30 p-4 rounded-3xl flex items-center justify-between gap-4 animate-in fade-in duration-300">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-amber-primary/15 text-amber-primary flex items-center justify-center shrink-0">
          <span className="material-symbols-rounded text-xl">
            notifications_active
          </span>
        </div>
        <div>
          <h4 className="font-bold text-xs text-foreground">
            Activa las notificaciones
          </h4>
          <p className="text-[11px] text-muted-foreground">
            Recibe avisos cuando se te asignen tareas o tus compañeros las
            completen.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => setShowBanner(false)}
          className="text-xs font-bold text-muted-foreground hover:text-foreground px-2 py-1 cursor-pointer"
        >
          Ignorar
        </button>
        <button
          onClick={handleSubscribe}
          disabled={isLoading}
          className="bg-amber-primary hover:bg-amber-primary/95 text-white font-bold px-3.5 py-1.5 rounded-xl text-xs transition-all shadow-sm cursor-pointer disabled:opacity-50 whitespace-nowrap"
        >
          {isLoading ? "Activando..." : "Activar"}
        </button>
      </div>
    </div>
  );
}

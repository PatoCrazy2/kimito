import type { Metadata } from "next";
import "./globals.css";
import { AppPreloader } from "@/components/landing/AppPreloader";

export const metadata: Metadata = {
  title: "Kimito - Gestión de Aseo Compartido",
  description: "La plataforma definitiva para organizar y gestionar la limpieza de áreas comunes en tu casa compartida.",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className="h-full antialiased"
    >
      <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@24,400,0..1,0" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300..800;1,300..800&display=swap" />
        <meta name="theme-color" content="#FAF9F6" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        <AppPreloader />
        <div className="flex flex-col flex-1">
          {children}
        </div>
      </body>
    </html>
  );
}

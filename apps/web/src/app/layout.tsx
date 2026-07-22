import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kimito - Gestión de Aseo Compartido",
  description: "La plataforma definitiva para organizar y gestionar la limpieza de áreas comunes en tu casa compartida.",
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
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        {children}
      </body>
    </html>
  );
}

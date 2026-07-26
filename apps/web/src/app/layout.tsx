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
      <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@24,400,0..1,0" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300..800;1,300..800&display=swap" />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans relative">
        {/* Global branded pattern */}
        <div 
          className="fixed inset-0 pointer-events-none opacity-[0.05] z-0"
          style={{
            backgroundImage: "url('/logo.svg')",
            backgroundSize: "60px 60px",
            backgroundRepeat: "repeat",
          }}
          aria-hidden="true"
        />
        <div className="relative z-10 flex flex-col flex-1">
          {children}
        </div>
      </body>
    </html>
  );
}

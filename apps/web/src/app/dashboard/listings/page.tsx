export default function ListingsPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 animate-in fade-in duration-300">
      <div className="w-16 h-16 bg-[#006B5F]/10 rounded-full flex items-center justify-center mb-6">
        <span className="material-symbols-rounded text-[#006B5F] text-3xl">search</span>
      </div>
      <h1 className="font-sans font-black text-3xl text-foreground tracking-tight mb-2">Buscar Roomie</h1>
      <p className="font-medium text-muted-foreground max-w-sm mb-6">
        El marketplace de ofertas para buscar roommate o publicar tu habitación estará disponible muy pronto.
      </p>
    </div>
  );
}

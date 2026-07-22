import Image from "next/image";
import { getCurrentUser } from "@/app/actions/user-actions";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
        <span className="material-symbols-rounded text-destructive text-5xl mb-4">
          error
        </span>
        <h2 className="text-xl font-bold">Error de Sesión</h2>
        <p className="text-muted-foreground mt-1">No se pudieron cargar los datos del usuario autenticado.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Saludo Principal */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 select-none animate-in fade-in slide-in-from-bottom-2 duration-300">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
            ¡Hola de nuevo, {user.name.split(" ")[0]}! 👋
          </h1>
          <p className="text-muted-foreground text-sm font-medium mt-1">
            Aquí tienes el resumen del aseo y gastos en tu casa compartida hoy.
          </p>
        </div>
        <div className="flex items-center gap-2.5 bg-secondary/10 border border-secondary/20 px-4 py-2.5 rounded-2xl">
          <span className="material-symbols-rounded text-teal-secondary">
            home_work
          </span>
          <div className="text-left">
            <p className="text-xs font-bold text-teal-secondary uppercase tracking-wider leading-none">Mi Casa</p>
            <p className="text-sm font-bold text-foreground mt-0.5">Casa Central</p>
          </div>
        </div>
      </div>

      {/* Bento Grid Layout (Desktop: 3 cols, Tablet/Mobile: 1-2 cols) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[220px]">
        
        {/* CARD 1: Perfil de Usuario y Reputación (Bento 1x1) */}
        <div className="premium-card rounded-3xl p-6 flex flex-col justify-between animate-in fade-in slide-in-from-bottom-3 duration-300">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              {user.avatarUrl ? (
                <Image
                  src={user.avatarUrl}
                  alt={user.name}
                  width={64}
                  height={64}
                  className="rounded-full border-3 border-amber-primary/10 shadow-sm"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-amber-primary text-white flex items-center justify-center font-bold text-2xl shadow-sm">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="text-left">
                <h3 className="font-extrabold text-lg text-foreground leading-snug">{user.name}</h3>
                <p className="text-xs font-semibold text-muted-foreground truncate max-w-[170px]">{user.email}</p>
              </div>
            </div>
          </div>

          <div className="bg-[#FAF9F6] border border-border/40 rounded-2xl p-3 flex items-center justify-between mt-4">
            <div className="flex items-center gap-2">
              <span className="material-symbols-rounded text-amber-primary">
                workspace_premium
              </span>
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase leading-none">Reputación</p>
                <p className="text-sm font-extrabold text-foreground mt-0.5">Excelente Roommate</p>
              </div>
            </div>
            <div className="bg-amber-primary/10 text-amber-primary font-extrabold text-sm px-2.5 py-1 rounded-lg">
              4.9 / 5.0 ⭐
            </div>
          </div>
        </div>

        {/* CARD 2: Tareas Pendientes (Bento 2x1 en Desktop) */}
        <div className="premium-card rounded-3xl p-6 lg:col-span-2 flex flex-col justify-between animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-rounded text-amber-primary">
                  cleaning_services
                </span>
                <h3 className="font-extrabold text-lg text-foreground">Tareas Asignadas</h3>
              </div>
              <span className="text-[10px] bg-amber-primary/10 text-amber-primary font-bold px-2 py-0.5 rounded-full">
                Siguiente Reparto: Lun
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between bg-muted/30 hover:bg-muted/50 transition-colors p-3 rounded-2xl border border-border/20">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-rounded text-amber-primary bg-amber-primary/10 p-1.5 rounded-xl">
                    local_laundry_service
                  </span>
                  <div>
                    <p className="text-xs font-bold text-foreground">Limpieza de Cocina</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">Peso: 5 ptos • Frecuencia: Semanal</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-terracota bg-terracota/10 px-2 py-0.5 rounded-lg">
                  Pendiente
                </span>
              </div>

              <div className="flex items-center justify-between bg-muted/30 hover:bg-muted/50 transition-colors p-3 rounded-2xl border border-border/20">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-rounded text-teal-secondary bg-teal-secondary/10 p-1.5 rounded-xl">
                    delete
                  </span>
                  <div>
                    <p className="text-xs font-bold text-foreground">Sacar la Basura</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">Peso: 2 ptos • Frecuencia: Diario</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-teal-secondary bg-teal-secondary/10 px-2 py-0.5 rounded-lg">
                  Completado
                </span>
              </div>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs font-bold text-amber-primary hover:underline cursor-pointer">
              Ver todas las tareas →
            </span>
          </div>
        </div>

        {/* CARD 3: Facturas & Finanzas (Bento 1x1) */}
        <div className="premium-card rounded-3xl p-6 flex flex-col justify-between animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-rounded text-terracota">
                receipt_long
              </span>
              <h3 className="font-extrabold text-lg text-foreground">Cuentas & Facturas</h3>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground font-semibold">Alquiler Julio</span>
                <span className="font-extrabold text-foreground">$350.00</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground font-semibold">Internet & TV</span>
                <span className="font-extrabold text-foreground">$15.00</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground font-semibold">Servicios (Agua/Luz)</span>
                <span className="font-extrabold text-foreground">$24.50</span>
              </div>
            </div>
          </div>

          <div className="border-t border-border/30 pt-3 flex justify-between items-center">
            <span className="text-[10px] text-muted-foreground font-bold uppercase">Total pendiente</span>
            <span className="text-sm font-extrabold text-terracota">$389.50</span>
          </div>
        </div>

        {/* CARD 4: Calendario de Aseo (Bento 1x1) */}
        <div className="premium-card rounded-3xl p-6 flex flex-col justify-between animate-in fade-in slide-in-from-bottom-6 duration-300">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-rounded text-teal-secondary">
                calendar_today
              </span>
              <h3 className="font-extrabold text-lg text-foreground">Calendario</h3>
            </div>

            <div className="space-y-2.5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-primary/10 text-amber-primary flex flex-col items-center justify-center font-bold">
                  <span className="text-[10px] uppercase font-bold leading-none">Jul</span>
                  <span className="text-sm font-extrabold mt-0.5 leading-none">23</span>
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-foreground">Tu turno: Baño Común</p>
                  <p className="text-[9px] text-muted-foreground">Mañana • Peso: 4 ptos</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-muted text-muted-foreground flex flex-col items-center justify-center font-bold">
                  <span className="text-[10px] uppercase font-bold leading-none">Jul</span>
                  <span className="text-sm font-extrabold mt-0.5 leading-none">25</span>
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-foreground/80">Turno de Carlos: Salón</p>
                  <p className="text-[9px] text-muted-foreground">Viernes • Peso: 3 ptos</p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs font-bold text-teal-secondary hover:underline cursor-pointer">
              Ver calendario completo →
            </span>
          </div>
        </div>

        {/* CARD 5: Perfil & Compartir (Bento 1x1) */}
        <div className="premium-card rounded-3xl p-6 flex flex-col justify-between animate-in fade-in slide-in-from-bottom-7 duration-300">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="material-symbols-rounded text-amber-primary">
                badge
              </span>
              <h3 className="font-extrabold text-lg text-foreground">Carta de Presentación</h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Exporta tu historial de cumplimiento y puntuación como carta de presentación para buscar tu próxima casa.
            </p>
          </div>

          <button className="w-full py-2.5 bg-amber-primary/10 hover:bg-amber-primary/20 text-amber-primary font-bold text-xs rounded-xl transition-all duration-200 cursor-pointer">
            Generar Carta PDF
          </button>
        </div>

      </div>
    </div>
  );
}
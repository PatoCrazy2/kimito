"use client";

interface ReputationCardProps {
  reputationData?: {
    score: number | null;
    totalTasksAssigned: number;
    completedOnTime: number;
    completedLate: number;
    completionRate: number;
  } | null;
}

export default function ReputationCard({
  reputationData,
}: ReputationCardProps) {
  const isNew = reputationData === undefined || reputationData === null || reputationData.score === null;
  const score = isNew ? null : reputationData!.score;
  const rate = isNew ? 0 : reputationData!.completionRate;
  const total = reputationData?.totalTasksAssigned ?? 0;
  const onTime = reputationData?.completedOnTime ?? 0;

  // Calcular número de estrellas de 1 a 5
  const fullStars = score !== null ? Math.floor(score) : 0;
  const hasHalf = score !== null ? score % 1 >= 0.5 : false;

  return (
    <div className="bg-[#FAF9F6] border border-border/40 p-5 rounded-3xl space-y-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">
            Reputación como Roommate
          </span>
          {score !== null ? (
            <h3 className="font-sans font-black text-xl text-foreground flex items-center gap-2 mt-0.5">
              {score.toFixed(1)}
              <div className="flex items-center text-amber-500 text-sm">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="material-symbols-rounded text-base">
                    {i < fullStars
                      ? "star"
                      : i === fullStars && hasHalf
                        ? "star_half"
                        : "star_outline"}
                  </span>
                ))}
              </div>
            </h3>
          ) : (
            <h3 className="font-sans font-black text-sm text-muted-foreground flex items-center gap-1.5 mt-1 select-none">
              <span className="bg-amber-primary/10 text-amber-primary px-2 py-0.5 rounded-full text-[10px] font-black uppercase">
                Nuevo
              </span>
              <span className="text-[11px] font-semibold text-muted-foreground/60">Sin historial</span>
            </h3>
          )}
        </div>

        <div className="text-right">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">
            Efectividad
          </span>
          <p className="font-black text-lg text-amber-primary">{score !== null ? `${rate}%` : "N/A"}</p>
        </div>
      </div>

      {/* Métricas secundarias */}
      <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border/30 text-xs">
        <div className="bg-background/80 p-2.5 rounded-2xl border border-border/20 text-center">
          <p className="text-[10px] font-bold text-muted-foreground uppercase">
            Completadas a Tiempo
          </p>
          <p className="font-black text-sm text-foreground mt-0.5">{onTime}</p>
        </div>

        <div className="bg-background/80 p-2.5 rounded-2xl border border-border/20 text-center">
          <p className="text-[10px] font-bold text-muted-foreground uppercase">
            Total Asignadas
          </p>
          <p className="font-black text-sm text-foreground mt-0.5">{total}</p>
        </div>
      </div>
    </div>
  );
}

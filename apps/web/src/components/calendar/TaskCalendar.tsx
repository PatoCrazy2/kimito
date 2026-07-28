"use client";

import { useState } from "react";
import type {
  TaskAssignmentResponse,
  HouseMemberResponse,
} from "@kimito/shared-types";
import {
  overrideAssignmentAction,
  uncompleteAssignmentAction,
} from "@/app/actions/scheduling-actions";

interface TaskCalendarProps {
  initialAssignments: TaskAssignmentResponse[];
  members: HouseMemberResponse[];
  currentUserId?: string;
  isAdmin?: boolean;
  onCompleteTaskClick?: (assignment: TaskAssignmentResponse) => void;
}

export default function TaskCalendar({
  initialAssignments,
  members,
  currentUserId,
  isAdmin = false,
  onCompleteTaskClick,
}: TaskCalendarProps) {
  const [assignments, setAssignments] =
    useState<TaskAssignmentResponse[]>(initialAssignments);
  const [selectedMemberFilter, setSelectedMemberFilter] =
    useState<string>("ALL");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [confirmingRejectionId, setConfirmingRejectionId] = useState<string | null>(null);

  // Reasignar tarea a otro compañero
  const handleOverride = async (assignmentId: string, newUserId: string) => {
    try {
      const updated = await overrideAssignmentAction({
        assignmentId,
        newUserId,
      });
      setAssignments((prev) =>
        prev.map((a) => (a.id === assignmentId ? updated : a)),
      );
    } catch (err) {
      console.error("Error al reasignar tarea:", err);
    }
  };

  // Rechazar y desmarcar tarea completada
  const handleUncomplete = async (assignmentId: string) => {
    setError(null);
    try {
      const updated = await uncompleteAssignmentAction(assignmentId);
      setAssignments((prev) =>
        prev.map((a) => (a.id === assignmentId ? { ...updated, evidenceUrl: null } : a))
      );
    } catch (err) {
      console.error("Error al desmarcar la tarea:", err);
      setError("No se pudo desmarcar la tarea. Solo los administradores pueden realizar esta acción.");
    }
  };

  // Filtrar asignaciones
  const filteredAssignments =
    selectedMemberFilter === "ALL"
      ? assignments
      : assignments.filter((a) => a.userId === selectedMemberFilter);

  // Obtener rango de fechas de la primera asignación
  let dateRangeText = "";
  if (assignments.length > 0) {
    const first = assignments[0];
    if (first.periodStart && first.periodEnd) {
      const options: Intl.DateTimeFormatOptions = { day: "numeric", month: "short" };
      const startStr = new Date(first.periodStart).toLocaleDateString("es-ES", options);
      const endStr = new Date(first.periodEnd).toLocaleDateString("es-ES", { ...options, year: "numeric" });
      dateRangeText = `Ciclo: del ${startStr} al ${endStr}`;
    }
  }

  return (
    <div className="space-y-4">
      {dateRangeText && (
        <div className="flex items-center gap-1.5 text-[11px] font-bold text-muted-foreground select-none pb-1">
          <span className="material-symbols-rounded text-sm">calendar_today</span>
          <span>{dateRangeText}</span>
        </div>
      )}

      {error && (
        <div className="p-3.5 bg-red-50 border border-red-100 text-red-700 text-xs font-bold rounded-2xl flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-2">
            <span className="material-symbols-rounded text-base text-red-600">warning</span>
            <span>{error}</span>
          </div>
          <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700 transition-colors cursor-pointer">
            <span className="material-symbols-rounded text-sm block">close</span>
          </button>
        </div>
      )}

      {/* Filtro por miembro de la casa */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setSelectedMemberFilter("ALL")}
          className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            selectedMemberFilter === "ALL"
              ? "bg-foreground text-background"
              : "bg-muted/40 text-muted-foreground hover:bg-muted"
          }`}
        >
          Todos ({assignments.length})
        </button>
        {members.map((m) => (
          <button
            key={m.userId}
            onClick={() => setSelectedMemberFilter(m.userId)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              selectedMemberFilter === m.userId
                ? "bg-foreground text-background"
                : "bg-muted/40 text-muted-foreground hover:bg-muted"
            }`}
          >
            <span>{m.name.split(" ")[0]}</span>
          </button>
        ))}
      </div>

      {/* Tarjetas de asignaciones */}
      {filteredAssignments.length === 0 ? (
        <div className="text-center p-8 bg-[#FAF9F6] border border-dashed border-border/60 rounded-3xl space-y-3">
          <span className="material-symbols-rounded text-muted-foreground text-4xl">
            calendar_today
          </span>
          <p className="text-sm font-bold text-foreground">
            No hay asignaciones activas
          </p>
          <p className="text-xs text-muted-foreground">
            Presiona &quot;Generar Reparto&quot; para distribuir las tareas
            entre los habitantes.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredAssignments.map((assignment) => {
            const isCompleted = assignment.status === "COMPLETED";
            return (
              <div
                key={assignment.id}
                className={`p-4 rounded-3xl border transition-all space-y-3 ${
                  isCompleted
                    ? "bg-muted/20 border-border/50"
                    : "bg-[#FAF9F6] border-border/50 hover:border-amber-primary/40"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-bold text-sm text-foreground flex items-center gap-2">
                      {assignment.task?.title || "Tarea"}
                      <span className="text-[10px] bg-amber-primary/10 text-amber-primary font-black px-2 py-0.5 rounded-full inline-flex items-center gap-0.5">
                        Peso: {assignment.task?.weight || 1} <span className="material-symbols-rounded text-[10px] text-amber-primary align-middle select-none">star</span>
                      </span>
                    </h4>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Asignado a:{" "}
                      <span className="font-bold text-foreground">
                        {assignment.user?.name || "Sin asignar"}
                      </span>
                    </p>
                  </div>

                  <span
                    className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider ${
                      isCompleted
                        ? "bg-muted text-muted-foreground border border-border/40"
                        : "bg-amber-primary/10 text-amber-primary"
                    }`}
                  >
                    {isCompleted ? "Completada" : "Pendiente"}
                  </span>
                </div>

                {isCompleted && assignment.evidenceUrl && (
                  <div
                    onClick={() => setSelectedImage(assignment.evidenceUrl!)}
                    className="relative aspect-video w-full rounded-2xl overflow-hidden bg-muted border border-border/10 cursor-pointer group mt-2"
                  >
                    <img
                      src={assignment.evidenceUrl}
                      alt="Evidencia"
                      className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity pointer-events-none">
                      <span className="material-symbols-rounded text-white text-2xl drop-shadow-md">zoom_in</span>
                    </div>
                  </div>
                )}

                {/* Acciones de la tarjeta */}
                <div className="flex items-center justify-between pt-2 border-t border-border/30 text-xs">
                  {/* Select de Reasignación manual (Solo Admin y estilizado premium) */}
                  {isAdmin ? (
                    <div className="relative inline-flex items-center bg-background border border-border/40 hover:border-amber-primary/40 rounded-xl px-2.5 py-1 text-[11px] font-bold transition-all shadow-2xs">
                      <select
                        value={assignment.userId}
                        onChange={(e) =>
                          handleOverride(assignment.id, e.target.value)
                        }
                        className="bg-transparent text-muted-foreground hover:text-foreground cursor-pointer focus:outline-none appearance-none pr-4 select-none"
                      >
                        {members.map((m) => (
                          <option key={m.userId} value={m.userId}>
                            Reasignar a: {m.name.split(" ")[0]}
                          </option>
                        ))}
                      </select>
                      <span className="material-symbols-rounded text-xs absolute right-1.5 pointer-events-none text-muted-foreground">
                        expand_more
                      </span>
                    </div>
                  ) : (
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">
                      Aseo General
                    </span>
                  )}

                  {/* Botón marcar completada o Rechazar (Admin) */}
                  {!isCompleted ? (
                    onCompleteTaskClick && assignment.userId === currentUserId && (
                      <button
                        onClick={() => onCompleteTaskClick(assignment)}
                        className="bg-amber-primary hover:bg-[#6c4300] text-white font-bold px-3 py-1.5 rounded-xl text-[11px] flex items-center gap-1 transition-all cursor-pointer shadow-sm active:scale-95"
                      >
                        <span className="material-symbols-rounded text-sm">
                          check_circle
                        </span>
                        Completar
                      </button>
                    )
                  ) : (
                    isAdmin && (
                      confirmingRejectionId === assignment.id ? (
                        <div className="flex items-center gap-1.5 animate-in fade-in zoom-in-95 duration-150">
                          <button
                            onClick={() => {
                              setConfirmingRejectionId(null);
                              handleUncomplete(assignment.id);
                            }}
                            className="bg-red-600 hover:bg-red-700 text-white font-bold px-3 py-1.5 rounded-xl text-[11px] flex items-center gap-1 transition-all cursor-pointer shadow-xs active:scale-95"
                          >
                            <span className="material-symbols-rounded text-xs">check</span>
                            ¿Seguro?
                          </button>
                          <button
                            onClick={() => setConfirmingRejectionId(null)}
                            className="bg-muted hover:bg-muted/80 text-muted-foreground font-bold px-2 py-1.5 rounded-xl text-[11px] flex items-center transition-all cursor-pointer active:scale-95"
                          >
                            <span className="material-symbols-rounded text-sm">close</span>
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setConfirmingRejectionId(assignment.id)}
                          className="bg-red-50 hover:bg-red-100 text-red-600 font-bold px-3 py-1.5 rounded-xl text-[11px] flex items-center gap-1 transition-all cursor-pointer shadow-xs active:scale-95 animate-in fade-in duration-200"
                        >
                          <span className="material-symbols-rounded text-sm">
                            cancel
                          </span>
                          Rechazar
                        </button>
                      )
                    )
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Evidence Image Zoom Modal */}
      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-lg flex items-center justify-center cursor-zoom-out select-none animate-in fade-in duration-200"
        >
          <img
            src={selectedImage}
            alt="Evidencia de tarea completada"
            className="max-w-full max-h-full object-contain pointer-events-none"
          />
        </div>
      )}
    </div>
  );
}

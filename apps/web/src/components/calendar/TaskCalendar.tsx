"use client";

import { useState } from "react";
import type {
  TaskAssignmentResponse,
  HouseMemberResponse,
} from "@kimito/shared-types";
import {
  generateScheduleAction,
  overrideAssignmentAction,
} from "@/app/actions/scheduling-actions";

interface TaskCalendarProps {
  initialAssignments: TaskAssignmentResponse[];
  members: HouseMemberResponse[];
  onCompleteTaskClick?: (assignment: TaskAssignmentResponse) => void;
}

export default function TaskCalendar({
  initialAssignments,
  members,
  onCompleteTaskClick,
}: TaskCalendarProps) {
  const [assignments, setAssignments] =
    useState<TaskAssignmentResponse[]>(initialAssignments);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedMemberFilter, setSelectedMemberFilter] =
    useState<string>("ALL");

  // Disparar nuevo reparto equitativo
  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const newAssignments = await generateScheduleAction();
      setAssignments(newAssignments);
    } catch (err) {
      console.error("Error al generar reparto:", err);
    } finally {
      setIsGenerating(false);
    }
  };

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

  // Filtrar asignaciones
  const filteredAssignments =
    selectedMemberFilter === "ALL"
      ? assignments
      : assignments.filter((a) => a.userId === selectedMemberFilter);

  return (
    <div className="space-y-6">
      {/* Barra superior de control */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#FAF9F6] border border-border/40 p-4 rounded-3xl">
        <div>
          <h3 className="font-sans font-black text-base text-foreground">
            Calendario de Asignaciones
          </h3>
          <p className="text-xs text-muted-foreground">
            Reparto equitativo de labores del hogar
          </p>
        </div>

        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="bg-amber-primary hover:bg-amber-primary/90 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center gap-2 transition-all shadow-sm cursor-pointer disabled:opacity-50"
        >
          <span className="material-symbols-rounded text-sm">
            {isGenerating ? "autorenew" : "shuffle"}
          </span>
          {isGenerating ? "Repartiendo..." : "Generar Reparto"}
        </button>
      </div>

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

                {/* Acciones de la tarjeta */}
                <div className="flex items-center justify-between pt-2 border-t border-border/30 text-xs">
                  {/* Select de Reasignación manual */}
                  <select
                    value={assignment.userId}
                    onChange={(e) =>
                      handleOverride(assignment.id, e.target.value)
                    }
                    className="bg-transparent text-[11px] font-bold text-muted-foreground hover:text-foreground cursor-pointer focus:outline-none"
                  >
                    {members.map((m) => (
                      <option key={m.userId} value={m.userId}>
                        Reasignar a: {m.name.split(" ")[0]}
                      </option>
                    ))}
                  </select>

                  {/* Botón marcar completada */}
                  {!isCompleted && onCompleteTaskClick && (
                    <button
                      onClick={() => onCompleteTaskClick(assignment)}
                      className="bg-amber-primary hover:bg-amber-primary/95 text-white font-bold px-3 py-1.5 rounded-xl text-[11px] flex items-center gap-1 transition-all cursor-pointer shadow-sm active:scale-95"
                    >
                      <span className="material-symbols-rounded text-sm">
                        check_circle
                      </span>
                      Completar
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

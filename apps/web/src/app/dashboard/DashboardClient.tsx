"use client";

import { useState } from "react";
import type {
  TaskResponse,
  HouseMemberResponse,
  TaskAssignmentResponse,
} from "@kimito/shared-types";
import { getDailyFact } from "@/lib/facts";
import TaskCalendar from "@/components/calendar/TaskCalendar";
import CompleteTaskModal from "@/components/tasks/CompleteTaskModal";
import PushNotificationBanner from "@/components/notifications/PushNotificationBanner";

interface DashboardClientProps {
  userName: string;
  currentUserId: string;
  houseName: string;
  tasks: TaskResponse[];
  members: HouseMemberResponse[];
  assignments: TaskAssignmentResponse[];
}

export default function DashboardClient({
  userName,
  currentUserId,
  houseName,
  tasks,
  members,
  assignments: initialAssignments,
}: DashboardClientProps) {
  const [selectedAssignment, setSelectedAssignment] =
    useState<TaskAssignmentResponse | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [assignments, setAssignments] =
    useState<TaskAssignmentResponse[]>(initialAssignments);
  const [showFullCalendar, setShowFullCalendar] = useState(false);

  const dailyFact = getDailyFact();

  const rawDate = new Date().toLocaleDateString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  const formattedDate = rawDate.charAt(0).toUpperCase() + rawDate.slice(1);

  const handleOpenCompleteModal = (assignment: TaskAssignmentResponse) => {
    setSelectedAssignment(assignment);
    setIsModalOpen(true);
  };

  const handleTaskSuccess = () => {
    if (selectedAssignment) {
      setAssignments((prev) =>
        prev.map((a) =>
          a.id === selectedAssignment.id ? { ...a, status: "COMPLETED" } : a,
        ),
      );
    }
  };

  // Filtrar solo las asignaciones asignadas al usuario actual
  const myAssignments = assignments.filter((a) => a.userId === currentUserId);
  const myCompleted = myAssignments.filter((a) => a.status === "COMPLETED").length;
  const myTotal = myAssignments.length;
  const progressPercentage = myTotal > 0 ? Math.round((myCompleted / myTotal) * 100) : 100;

  return (
    <div className="space-y-7">
      {/* Cabecera superior */}
      <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-wider text-muted-foreground select-none pb-2 border-b border-border/25 w-full animate-fade-up">
        <span>{formattedDate}</span>
        <span>
          <span className="text-foreground font-bold">{houseName}</span>
        </span>
      </div>

      {/* Saludo y Frase del día */}
      <div className="text-left select-none space-y-2.5 animate-fade-up" style={{ animationDelay: "50ms" }}>
        <h1 className="font-sans font-extrabold text-[28px] text-foreground tracking-tight leading-none">
          Hola, {userName.split(" ")[0]}
        </h1>
        <p className="text-[13px] italic text-muted-foreground/70 leading-relaxed max-w-sm">
          &ldquo;{dailyFact.content}&rdquo;
        </p>
      </div>

      {/* Banner de Permiso de Notificaciones Push */}
      <div className="animate-fade-up" style={{ animationDelay: "100ms" }}>
        <PushNotificationBanner />
      </div>

      {/* Barra de progreso de mis tareas */}
      <div className="bg-white border border-border/30 p-5 rounded-2xl shadow-[0_2px_8px_rgba(133,83,0,0.02),0_4px_20px_rgba(133,83,0,0.03)] space-y-3 animate-fade-up" style={{ animationDelay: "150ms" }}>
        <div className="flex justify-between items-center">
          <div className="text-left">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Tu progreso</span>
            <p className="font-sans font-bold text-sm text-foreground mt-0.5">
              {myCompleted} de {myTotal} tareas completadas
            </p>
          </div>
          <span className="font-bold text-xs text-amber-primary bg-amber-primary/8 px-2.5 py-1 rounded-full tabular-nums">
            {progressPercentage}%
          </span>
        </div>
        <div className="w-full h-[7px] bg-muted/80 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-primary to-amber-primary/80 rounded-full transition-all duration-700 ease-out progress-bar-active"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Sección Mis Tareas */}
      <div className="space-y-3 animate-fade-up" style={{ animationDelay: "200ms" }}>
        <h3 className="font-sans font-bold text-[15px] text-foreground text-left flex items-center gap-2 select-none">
          <span className="material-symbols-rounded text-amber-primary text-xl">assignment_ind</span>
          Mis Tareas Pendientes
          <span className="text-muted-foreground font-medium text-xs ml-0.5">
            ({myAssignments.filter(a => a.status !== "COMPLETED").length})
          </span>
        </h3>

        {myAssignments.length === 0 ? (
          <div className="text-center py-10 px-6 bg-muted/30 border border-dashed border-border/50 rounded-2xl space-y-2.5">
            <span className="material-symbols-rounded text-muted-foreground/60 text-4xl">celebration</span>
            <p className="text-sm font-semibold text-foreground">¡Estás al día!</p>
            <p className="text-xs text-muted-foreground leading-relaxed">No tienes tareas asignadas pendientes en este periodo.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 stagger-children">
            {myAssignments.map((assignment) => {
              const isCompleted = assignment.status === "COMPLETED";
              return (
                <div
                  key={assignment.id}
                  className={`p-4 rounded-2xl border transition-all duration-200 space-y-3 text-left ${
                    isCompleted
                      ? "bg-muted/20 border-border/40 opacity-60"
                      : "bg-white border-border/30 hover:border-amber-primary/30 hover:shadow-[0_2px_12px_rgba(133,83,0,0.05)] hover:-translate-y-[1px]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <h4 className="font-semibold text-sm text-foreground flex items-center gap-1.5 flex-wrap">
                        {assignment.task?.title || "Tarea"}
                        <span className="text-[10px] bg-amber-primary/8 text-amber-primary font-bold px-2 py-0.5 rounded-md inline-flex items-center gap-0.5">
                          {assignment.task?.weight || 1} <span className="material-symbols-rounded text-[10px] text-amber-primary select-none">star</span>
                        </span>
                      </h4>
                      <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1 font-medium">
                        <span className="material-symbols-rounded text-xs">repeat</span>
                        {assignment.task?.recurrence === "daily" ? "Diaria" : assignment.task?.recurrence === "weekly" ? "Semanal" : "Mensual"}
                      </p>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wide shrink-0 ${
                        isCompleted
                          ? "bg-muted text-muted-foreground"
                          : "bg-amber-primary/8 text-amber-primary"
                      }`}
                    >
                      {isCompleted ? "Hecha" : "Pendiente"}
                    </span>
                  </div>

                  {!isCompleted && (
                    <div className="flex justify-end pt-2.5 border-t border-border/15">
                      <button
                        onClick={() => handleOpenCompleteModal(assignment)}
                        className="bg-amber-primary hover:bg-[#6c4300] text-white font-semibold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-[0_2px_8px_rgba(133,83,0,0.15)] hover:shadow-[0_4px_12px_rgba(133,83,0,0.2)] active:translate-y-[1px] active:shadow-[0_1px_4px_rgba(133,83,0,0.15)]"
                      >
                        <span className="material-symbols-rounded text-sm">check_circle</span>
                        Completar
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Botón para expandir/colapsar el calendario general */}
      <div className="flex justify-center pt-2 animate-fade-up" style={{ animationDelay: "250ms" }}>
        <button
          onClick={() => setShowFullCalendar(!showFullCalendar)}
          className="border border-border/40 hover:border-border/60 hover:bg-white bg-white/50 text-foreground font-semibold py-2.5 px-6 rounded-xl text-xs flex items-center gap-2 cursor-pointer select-none shadow-[0_1px_4px_rgba(0,0,0,0.03)] hover:shadow-[0_2px_8px_rgba(0,0,0,0.05)] active:translate-y-[1px]"
        >
          <span className="material-symbols-rounded text-base text-muted-foreground">
            {showFullCalendar ? "keyboard_arrow_up" : "calendar_month"}
          </span>
          {showFullCalendar ? "Ocultar Calendario" : "Ver Calendario de la Casa"}
        </button>
      </div>

      {showFullCalendar && (
        <div className="pt-6 border-t border-border/20 animate-in fade-in slide-in-from-top-3 duration-300">
          <TaskCalendar
            initialAssignments={assignments}
            members={members}
            onCompleteTaskClick={handleOpenCompleteModal}
          />
        </div>
      )}

      {/* Modal de finalización con foto de evidencia */}
      <CompleteTaskModal
        assignment={selectedAssignment}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleTaskSuccess}
      />
    </div>
  );
}

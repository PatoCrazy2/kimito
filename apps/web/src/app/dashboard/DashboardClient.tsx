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
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Cabecera superior */}
      <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-muted-foreground select-none pb-1.5 border-b border-border/30 w-full">
        <span>{formattedDate}</span>
        <span>
          Hogar:{" "}
          <span className="font-extrabold text-foreground">{houseName}</span>
        </span>
      </div>

      {/* Saludo y Frase del día */}
      <div className="text-left select-none space-y-2 mt-2">
        <h1 className="font-sans font-black text-3xl text-[#1D1B16] tracking-tight leading-none">
          Hola, {userName.split(" ")[0]}
        </h1>
        <p className="text-xs italic text-muted-foreground/60 leading-relaxed max-w-sm">
          “{dailyFact.content}”
        </p>
      </div>

      {/* Tarea 3.12: Banner de Permiso de Notificaciones Push */}
      <PushNotificationBanner />

      {/* Barra de progreso de mis tareas */}
      <div className="bg-white border border-border/45 p-5 rounded-3xl shadow-[0_4px_24px_rgba(133,83,0,0.01)] space-y-3">
        <div className="flex justify-between items-center text-xs">
          <div className="text-left">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">Tu Progreso de Aseo</span>
            <p className="font-sans font-black text-sm text-foreground mt-0.5">
              {myCompleted} de {myTotal} tareas completadas
            </p>
          </div>
          <span className="font-extrabold text-xs text-amber-primary bg-amber-primary/10 px-2.5 py-1 rounded-full">
            {progressPercentage}%
          </span>
        </div>
        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-amber-primary transition-all duration-500 ease-out rounded-full"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Sección Mis Tareas */}
      <div className="space-y-3">
        <h3 className="font-sans font-black text-base text-foreground text-left flex items-center gap-2 select-none">
          <span className="material-symbols-rounded text-amber-primary">assignment_ind</span>
          Mis Tareas Pendientes ({myAssignments.filter(a => a.status !== "COMPLETED").length})
        </h3>

        {myAssignments.length === 0 ? (
          <div className="text-center p-8 bg-[#FAF9F6] border border-dashed border-border/60 rounded-3xl space-y-3">
            <span className="material-symbols-rounded text-muted-foreground text-4xl">celebration</span>
            <p className="text-sm font-bold text-foreground">¡Estás al día!</p>
            <p className="text-xs text-muted-foreground">No tienes tareas asignadas pendientes en este periodo.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3.5">
            {myAssignments.map((assignment) => {
              const isCompleted = assignment.status === "COMPLETED";
              return (
                <div
                  key={assignment.id}
                  className={`p-4 rounded-3xl border transition-all space-y-3 text-left ${
                    isCompleted
                      ? "bg-muted/20 border-border/50 opacity-70"
                      : "bg-white border-border/50 hover:border-amber-primary/40 shadow-[0_2px_12px_rgba(133,83,0,0.01)]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h4 className="font-bold text-sm text-foreground flex items-center gap-1.5 flex-wrap">
                        {assignment.task?.title || "Tarea"}
                        <span className="text-[10px] bg-amber-primary/10 text-amber-primary font-black px-2 py-0.5 rounded-full inline-flex items-center gap-0.5">
                          Peso: {assignment.task?.weight || 1} <span className="material-symbols-rounded text-[10px] text-amber-primary select-none">star</span>
                        </span>
                      </h4>
                      <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1 font-medium">
                        <span className="material-symbols-rounded text-xs">repeat</span>
                        Frecuencia: {assignment.task?.recurrence === "daily" ? "Diaria" : assignment.task?.recurrence === "weekly" ? "Semanal" : "Mensual"}
                      </p>
                    </div>
                    <span
                      className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider shrink-0 ${
                        isCompleted
                          ? "bg-muted text-muted-foreground border border-border/40"
                          : "bg-amber-primary/10 text-amber-primary"
                      }`}
                    >
                      {isCompleted ? "Completada" : "Pendiente"}
                    </span>
                  </div>

                  {!isCompleted && (
                    <div className="flex justify-end pt-2 border-t border-border/20">
                      <button
                        onClick={() => handleOpenCompleteModal(assignment)}
                        className="bg-amber-primary hover:bg-amber-primary/95 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95"
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
      <div className="flex justify-center pt-2">
        <button
          onClick={() => setShowFullCalendar(!showFullCalendar)}
          className="border border-border/60 hover:bg-[#FAF9F6] text-foreground font-bold py-2.5 px-6 rounded-xl text-xs flex items-center gap-2 transition-all cursor-pointer select-none active:scale-95 shadow-xs"
        >
          <span className="material-symbols-rounded text-base">
            {showFullCalendar ? "keyboard_arrow_up" : "calendar_month"}
          </span>
          {showFullCalendar ? "Ocultar Calendario de la Casa" : "Ver Calendario de la Casa"}
        </button>
      </div>

      {showFullCalendar && (
        <div className="pt-6 border-t border-border/30 animate-in fade-in slide-in-from-top-4 duration-300">
          <TaskCalendar
            initialAssignments={assignments}
            members={members}
            onCompleteTaskClick={handleOpenCompleteModal}
          />
        </div>
      )}

      {/* Tarea 3.11: Modal de finalización con foto de evidencia */}
      <CompleteTaskModal
        assignment={selectedAssignment}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleTaskSuccess}
      />
    </div>
  );
}

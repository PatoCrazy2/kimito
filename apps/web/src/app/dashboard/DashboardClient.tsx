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
import ReputationCard from "@/components/reputation/ReputationCard";

interface DashboardClientProps {
  userName: string;
  houseName: string;
  tasks: TaskResponse[];
  members: HouseMemberResponse[];
  assignments: TaskAssignmentResponse[];
  reputation?: any;
}

export default function DashboardClient({
  userName,
  houseName,
  tasks,
  members,
  assignments: initialAssignments,
  reputation,
}: DashboardClientProps) {
  const [selectedAssignment, setSelectedAssignment] =
    useState<TaskAssignmentResponse | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [assignments, setAssignments] =
    useState<TaskAssignmentResponse[]>(initialAssignments);

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

      {/* Tarea 3.13: Tarjeta de Reputación */}
      <ReputationCard reputationData={reputation} />

      {/* Tarea 3.10: Calendario de Asignaciones Equitativo */}
      <TaskCalendar
        initialAssignments={assignments}
        members={members}
        onCompleteTaskClick={handleOpenCompleteModal}
      />

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

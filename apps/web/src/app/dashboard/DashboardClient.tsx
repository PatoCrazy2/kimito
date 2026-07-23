"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { TaskResponse } from "@kimito/shared-types";

interface DashboardClientProps {
  userName: string;
  houseName: string;
  tasks: TaskResponse[];
}

export default function DashboardClient({ userName, houseName, tasks }: DashboardClientProps) {
  const [completedTaskIds, setCompletedTaskIds] = useState<string[]>([]);

  const toggleTask = (taskId: string) => {
    setCompletedTaskIds((prev) =>
      prev.includes(taskId) ? prev.filter((id) => id !== taskId) : [...prev, taskId]
    );
  };

  const progress = tasks.length > 0 ? (completedTaskIds.length / tasks.length) * 100 : 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Saludo Principal */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 select-none pb-2 border-b border-border/30">
        <div>
          <h1 className="font-sans font-black text-2xl text-foreground tracking-tight">
            ¡Hola, {userName.split(" ")[0]}! 👋
          </h1>
          <p className="text-xs font-medium text-muted-foreground mt-1">
            Hogar: <span className="font-extrabold text-foreground">{houseName}</span>
          </p>
        </div>
        <Link 
          href="/dashboard/house" 
          className="self-start sm:self-auto flex items-center gap-1.5 bg-[#006B5F]/10 hover:bg-[#006B5F]/15 transition-all text-[#006B5F] px-4 py-2 rounded-xl text-xs font-bold"
        >
          <span className="material-symbols-rounded text-sm">home</span>
          Gestionar Casa
        </Link>
      </div>

      {/* Tareas Semanales */}
      <div>
        <h2 className="font-sans font-black text-lg text-foreground mb-4">Aseo de la semana</h2>

        {tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 bg-[#FAF9F6] border border-dashed border-border/85 rounded-3xl text-center">
            <span className="material-symbols-rounded text-muted-foreground text-3xl mb-3">cleaning_services</span>
            <p className="text-sm font-bold text-foreground">No hay tareas asignadas</p>
            <p className="text-xs text-muted-foreground mt-1 max-w-xs mb-4">
              Crea tareas para tu hogar para que aparezcan en el reparto semanal.
            </p>
            <Link 
              href="/dashboard/tasks"
              className="bg-amber-primary hover:bg-amber-primary/95 text-white font-bold py-2 px-4 rounded-xl text-xs transition-all cursor-pointer"
            >
              Agregar Tarea
            </Link>
          </div>
        ) : (
          <>
            {/* Barra de progreso */}
            <div className="bg-[#FAF9F6] border border-border/40 p-5 rounded-3xl mb-6">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">Progreso General</span>
                <span className="text-xs font-black text-amber-primary">{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-[#EAE8E3] h-2.5 rounded-full overflow-hidden">
                <div 
                  className="bg-amber-primary h-full rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Checklist */}
            <div className="space-y-3">
              {tasks.map((task) => {
                const isCompleted = completedTaskIds.includes(task.id);
                return (
                  <div 
                    key={task.id}
                    onClick={() => toggleTask(task.id)}
                    className={cn(
                      "flex items-center justify-between p-4 rounded-2xl border transition-all duration-200 cursor-pointer select-none",
                      isCompleted 
                        ? "bg-[#006B5F]/5 border-[#006B5F]/20 opacity-80" 
                        : "bg-white border-border/40 hover:bg-[#FAF9F6] shadow-xs active:scale-[0.99]"
                    )}
                  >
                    <div className="flex items-center gap-3.5">
                      <div 
                        className={cn(
                          "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200",
                          isCompleted 
                            ? "bg-[#006B5F] border-[#006B5F] text-white" 
                            : "border-muted-foreground/30 text-transparent"
                        )}
                      >
                        <span className="material-symbols-rounded text-xs font-bold">check</span>
                      </div>
                      <div className="text-left">
                        <p className={cn(
                          "text-sm font-bold transition-all",
                          isCompleted ? "line-through text-muted-foreground" : "text-foreground"
                        )}>
                          {task.title}
                        </p>
                        <p className="text-[9px] font-extrabold text-muted-foreground mt-0.5 uppercase tracking-wider">
                          {task.recurrence} • {task.weight} {task.weight === 1 ? "punto" : "puntos"}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

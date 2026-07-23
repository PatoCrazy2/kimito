export interface ScheduleMember {
  userId: string;
}

export interface ScheduleTask {
  id: string;
  weight: number;
}

export interface TaskAssignmentResult {
  taskId: string;
  userId: string;
  weight: number;
}

/**
 * Función pura para calcular un reparto equitativo de tareas entre miembros según los pesos.
 * Utiliza Bin Packing Greedy: ordena tareas por peso descendente y asigna cada tarea al miembro
 * que tenga la menor suma de peso acumulado en ese momento.
 */
export function calculateFairSchedule(
  members: ScheduleMember[],
  tasks: ScheduleTask[],
): TaskAssignmentResult[] {
  if (!members || members.length === 0 || !tasks || tasks.length === 0) {
    return [];
  }

  // Inicializar acumuladores de peso por miembro
  const memberLoads = members.map((m) => ({
    userId: m.userId,
    totalWeight: 0,
  }));

  // Ordenar tareas de mayor a menor peso
  const sortedTasks = [...tasks].sort((a, b) => b.weight - a.weight);

  const assignments: TaskAssignmentResult[] = [];

  for (const task of sortedTasks) {
    // Buscar miembro con menor carga acumulada
    memberLoads.sort((a, b) => a.totalWeight - b.totalWeight);
    const candidate = memberLoads[0];

    assignments.push({
      taskId: task.id,
      userId: candidate.userId,
      weight: task.weight,
    });

    candidate.totalWeight += task.weight;
  }

  return assignments;
}

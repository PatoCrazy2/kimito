import { calculateFairSchedule } from './fair-scheduling.algorithm';

describe('calculateFairSchedule', () => {
  it('debe retornar un arreglo vacío si no hay miembros o tareas', () => {
    expect(calculateFairSchedule([], [{ id: 't1', weight: 3 }])).toEqual([]);
    expect(calculateFairSchedule([{ userId: 'u1' }], [])).toEqual([]);
  });

  it('debe distribuir las tareas de forma equitativa sumando pesos parejos', () => {
    const members = [{ userId: 'user-1' }, { userId: 'user-2' }];
    const tasks = [
      { id: 'task-bano', weight: 5 },
      { id: 'task-cocina', weight: 4 },
      { id: 'task-basura', weight: 1 },
      { id: 'task-barrer', weight: 2 },
    ];

    const assignments = calculateFairSchedule(members, tasks);

    expect(assignments).toHaveLength(4);

    const user1Weight = assignments
      .filter((a) => a.userId === 'user-1')
      .reduce((sum, a) => sum + a.weight, 0);

    const user2Weight = assignments
      .filter((a) => a.userId === 'user-2')
      .reduce((sum, a) => sum + a.weight, 0);

    // Peso total es 12 (5+4+1+2). Cada usuario debe recibir 6 puntos de peso.
    expect(user1Weight).toBe(6);
    expect(user2Weight).toBe(6);
  });

  it('debe asignar a cada miembro de forma balanceada con numero impar de tareas', () => {
    const members = [{ userId: 'u1' }, { userId: 'u2' }, { userId: 'u3' }];
    const tasks = [
      { id: 't1', weight: 5 },
      { id: 't2', weight: 3 },
      { id: 't3', weight: 2 },
    ];

    const assignments = calculateFairSchedule(members, tasks);

    expect(assignments).toHaveLength(3);
    const u1Assignments = assignments.filter((a) => a.userId === 'u1');
    const u2Assignments = assignments.filter((a) => a.userId === 'u2');
    const u3Assignments = assignments.filter((a) => a.userId === 'u3');

    expect(u1Assignments.length).toBe(1);
    expect(u2Assignments.length).toBe(1);
    expect(u3Assignments.length).toBe(1);
  });
});

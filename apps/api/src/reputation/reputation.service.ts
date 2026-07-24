import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReputationService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Calcula el score de reputación de un usuario basado en sus tareas asignadas
   */
  async getUserReputation(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, avatarUrl: true },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const assignments = await this.prisma.taskAssignment.findMany({
      where: { userId },
    });

    const total = assignments.length;
    if (total === 0) {
      return {
        user,
        score: null, // Score nulo si no tiene historial
        totalTasksAssigned: 0,
        completedOnTime: 0,
        completedLate: 0,
        pending: 0,
        completionRate: 0,
      };
    }

    const completedOnTime = assignments.filter(
      (a) => a.status === 'COMPLETED',
    ).length;
    const completedLate = assignments.filter((a) => a.status === 'LATE').length;
    const pending = assignments.filter((a) => a.status === 'PENDING').length;
    const expired = assignments.filter((a) => a.status === 'EXPIRED').length;

    // Fórmula del Score (0.0 a 5.0 estrellas):
    // 5.0 * (completadas a tiempo / total evaluables)
    // Las tareas EXPIRED cuentan como no completadas
    const evaluatedTasks = completedOnTime + completedLate + expired;
    const rate = evaluatedTasks > 0 ? completedOnTime / evaluatedTasks : 1;
    const score = Number((rate * 5.0).toFixed(1));
    const completionRate =
      total > 0 ? Math.round((completedOnTime / total) * 100) : 0;

    // Actualizar o guardar en la tabla ReputationScore de Prisma
    const existingScore = await this.prisma.reputationScore.findFirst({
      where: { userId },
    });

    if (existingScore) {
      await this.prisma.reputationScore.update({
        where: { id: existingScore.id },
        data: { score },
      });
    } else {
      await this.prisma.reputationScore.create({
        data: { userId, houseId: 'default', score },
      });
    }


    return {
      user,
      score,
      totalTasksAssigned: total,
      completedOnTime,
      completedLate,
      pending,
      completionRate,
    };
  }

  async getMyReputation(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    return this.getUserReputation(user.id);
  }
}

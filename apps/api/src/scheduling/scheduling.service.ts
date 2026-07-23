import {
  Injectable,
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { calculateFairSchedule } from './fair-scheduling.algorithm';
import type {
  TaskAssignmentResponse,
  OverrideAssignmentDto,
} from '@kimito/shared-types';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class SchedulingService {
  constructor(private readonly prisma: PrismaService) {}

  private async getUserActiveMembership(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    const membership = await this.prisma.houseMembership.findFirst({
      where: {
        userId: user.id,
        active: true,
      },
    });

    if (!membership) {
      throw new NotFoundException('No perteneces a ninguna casa activa');
    }

    return membership;
  }

  /**
   * Genera el reparto equitativo de tareas para la casa en el periodo actual.
   */
  async generateSchedule(
    email: string,
    startDateStr?: string,
    endDateStr?: string,
  ): Promise<TaskAssignmentResponse[]> {
    const membership = await this.getUserActiveMembership(email);
    const houseId = membership.houseId;

    const activeMembers = await this.prisma.houseMembership.findMany({
      where: { houseId, active: true },
      select: { userId: true },
    });

    const activeTasks = await this.prisma.task.findMany({
      where: { houseId },
      select: { id: true, weight: true },
    });

    if (activeMembers.length === 0) {
      throw new BadRequestException(
        'La casa no tiene miembros activos para asignar tareas',
      );
    }

    if (activeTasks.length === 0) {
      throw new BadRequestException('La casa no tiene tareas registradas');
    }

    // Calcular fechas del periodo (por defecto semana actual: Lunes a Domingo)
    const now = new Date();
    const periodStart = startDateStr
      ? new Date(startDateStr)
      : this.getMonday(now);
    const periodEnd = endDateStr
      ? new Date(endDateStr)
      : this.getSunday(periodStart);

    // Ejecutar algoritmo de reparto
    const calculatedAssignments = calculateFairSchedule(
      activeMembers,
      activeTasks,
    );

    // Borrar asignaciones PENDING existentes para este periodo en la casa
    await this.prisma.taskAssignment.deleteMany({
      where: {
        task: { houseId },
        periodStart: { gte: periodStart },
        periodEnd: { lte: periodEnd },
        status: 'PENDING',
      },
    });

    // Guardar nuevas asignaciones
    const createdAssignments = await Promise.all(
      calculatedAssignments.map((assignment) =>
        this.prisma.taskAssignment.create({
          data: {
            taskId: assignment.taskId,
            userId: assignment.userId,
            periodStart,
            periodEnd,
            status: 'PENDING',
          },
          include: {
            task: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                avatarUrl: true,
              },
            },
          },
        }),
      ),
    );

    return createdAssignments as unknown as TaskAssignmentResponse[];
  }

  /**
   * Obtiene las asignaciones actuales de la casa del usuario.
   */
  async getMyHouseAssignments(
    email: string,
  ): Promise<TaskAssignmentResponse[]> {
    const membership = await this.getUserActiveMembership(email);

    const assignments = await this.prisma.taskAssignment.findMany({
      where: {
        task: { houseId: membership.houseId },
      },
      include: {
        task: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: {
        periodStart: 'desc',
      },
    });

    return assignments as unknown as TaskAssignmentResponse[];
  }

  /**
   * Override manual (Tarea 3.4): Reasigna una tarea puntual a otro miembro de la casa.
   */
  async overrideAssignment(
    email: string,
    dto: OverrideAssignmentDto,
  ): Promise<TaskAssignmentResponse> {
    const membership = await this.getUserActiveMembership(email);

    const assignment = await this.prisma.taskAssignment.findUnique({
      where: { id: dto.assignmentId },
      include: { task: true },
    });

    if (!assignment) {
      throw new NotFoundException('Asignación de tarea no encontrada');
    }

    if (assignment.task.houseId !== membership.houseId) {
      throw new BadRequestException(
        'No puedes modificar asignaciones de otra casa',
      );
    }

    // Verificar que el nuevo usuario sea miembro activo de la casa
    const targetMember = await this.prisma.houseMembership.findFirst({
      where: {
        houseId: membership.houseId,
        userId: dto.newUserId,
        active: true,
      },
    });

    if (!targetMember) {
      throw new BadRequestException(
        'El usuario destino no es miembro activo de esta casa',
      );
    }

    const updated = await this.prisma.taskAssignment.update({
      where: { id: dto.assignmentId },
      data: {
        userId: dto.newUserId,
      },
      include: {
        task: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
          },
        },
      },
    });

    return updated as unknown as TaskAssignmentResponse;
  }

  private getMonday(d: Date): Date {
    const date = new Date(d);
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(date.setDate(diff));
    monday.setHours(0, 0, 0, 0);
    return monday;
  }

  private getSunday(monday: Date): Date {
    const sunday = new Date(monday);
    sunday.setDate(sunday.getDate() + 6);
    sunday.setHours(23, 59, 59, 999);
    return sunday;
  }

  /**
   * Cron job que se ejecuta automáticamente todos los Lunes a las 00:00 (o cada semana).
   * Genera el reparto de tareas para TODAS las casas activas en la BD.
   */
  @Cron(CronExpression.EVERY_WEEK)
  async handleAutomaticWeeklyScheduling() {
    console.log(
      '[Cron Job] Ejecutando asignación semanal automática para todas las casas...',
    );

    const houses = await this.prisma.house.findMany({ select: { id: true } });

    for (const house of houses) {
      try {
        // Obtenemos los miembros y tareas de esta casa
        const members = await this.prisma.houseMembership.findMany({
          where: { houseId: house.id, active: true },
          select: { userId: true },
        });

        const tasks = await this.prisma.task.findMany({
          where: { houseId: house.id },
          select: { id: true, weight: true },
        });

        if (members.length > 0 && tasks.length > 0) {
          const now = new Date();
          const periodStart = this.getMonday(now);
          const periodEnd = this.getSunday(periodStart);

          const assignments = calculateFairSchedule(members, tasks);

          // Borramos las asignaciones PENDING previas del periodo si existen
          await this.prisma.taskAssignment.deleteMany({
            where: {
              task: { houseId: house.id },
              periodStart: { gte: periodStart },
              periodEnd: { lte: periodEnd },
              status: 'PENDING',
            },
          });

          // Creamos las nuevas asignaciones
          await Promise.all(
            assignments.map((a) =>
              this.prisma.taskAssignment.create({
                data: {
                  taskId: a.taskId,
                  userId: a.userId,
                  periodStart,
                  periodEnd,
                  status: 'PENDING',
                },
              }),
            ),
          );

          console.log(
            `[Cron Job] Casa ${house.id}: ${assignments.length} tareas asignadas.`,
          );
        }
      } catch (error) {
        console.error(
          `[Cron Job] Error procesando la casa ${house.id}:`,
          error,
        );
      }
    }
  }
}

import { Injectable, BadRequestException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { calculateFairSchedule } from './fair-scheduling.algorithm';
import type { TaskAssignmentResponse, OverrideAssignmentDto } from '@kimito/shared-types';

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
  async generateSchedule(email: string, startDateStr?: string, endDateStr?: string): Promise<TaskAssignmentResponse[]> {
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
      throw new BadRequestException('La casa no tiene miembros activos para asignar tareas');
    }

    if (activeTasks.length === 0) {
      throw new BadRequestException('La casa no tiene tareas registradas');
    }

    // Calcular fechas del periodo (por defecto semana actual: Lunes a Domingo)
    const now = new Date();
    const periodStart = startDateStr ? new Date(startDateStr) : this.getMonday(now);
    const periodEnd = endDateStr ? new Date(endDateStr) : this.getSunday(periodStart);

    // Ejecutar algoritmo de reparto
    const calculatedAssignments = calculateFairSchedule(activeMembers, activeTasks);

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
  async getMyHouseAssignments(email: string): Promise<TaskAssignmentResponse[]> {
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
  async overrideAssignment(email: string, dto: OverrideAssignmentDto): Promise<TaskAssignmentResponse> {
    const membership = await this.getUserActiveMembership(email);

    const assignment = await this.prisma.taskAssignment.findUnique({
      where: { id: dto.assignmentId },
      include: { task: true },
    });

    if (!assignment) {
      throw new NotFoundException('Asignación de tarea no encontrada');
    }

    if (assignment.task.houseId !== membership.houseId) {
      throw new BadRequestException('No puedes modificar asignaciones de otra casa');
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
      throw new BadRequestException('El usuario destino no es miembro activo de esta casa');
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
}

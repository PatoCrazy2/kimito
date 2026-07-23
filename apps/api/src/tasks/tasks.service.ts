import { Injectable, BadRequestException, NotFoundException, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto, UpdateTaskDto, TaskResponse } from '@kimito/shared-types';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  private async getActiveMembershipAndVerifyAdmin(email: string): Promise<any> {
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

    if (membership.role !== 'ADMIN') {
      throw new ForbiddenException('Solo el administrador de la casa puede gestionar tareas');
    }

    return membership;
  }

  async seedDefaultTasks(houseId: string): Promise<void> {
    const defaultTasks = [
      { title: 'Lavar platos', weight: 2, recurrence: 'daily', isCustom: false },
      { title: 'Sacar basura', weight: 1, recurrence: 'weekly', isCustom: false },
      { title: 'Limpiar baño', weight: 4, recurrence: 'weekly', isCustom: false },
      { title: 'Limpiar cocina', weight: 3, recurrence: 'weekly', isCustom: false },
      { title: 'Barrer y trapear', weight: 2, recurrence: 'weekly', isCustom: false },
    ];

    await this.prisma.task.createMany({
      data: defaultTasks.map((t) => ({
        houseId,
        title: t.title,
        weight: t.weight,
        recurrence: t.recurrence,
        isCustom: t.isCustom,
      })),
    });
  }

  async createTask(email: string, dto: CreateTaskDto): Promise<TaskResponse> {
    const membership = await this.getActiveMembershipAndVerifyAdmin(email);

    if (dto.weight < 1 || dto.weight > 5) {
      throw new BadRequestException('El peso de la tarea debe estar entre 1 y 5');
    }

    const task = await this.prisma.task.create({
      data: {
        houseId: membership.houseId,
        title: dto.title,
        weight: dto.weight,
        recurrence: dto.recurrence,
        isCustom: dto.isCustom !== undefined ? dto.isCustom : true,
      },
    });

    return {
      id: task.id,
      houseId: task.houseId,
      title: task.title,
      weight: task.weight,
      recurrence: task.recurrence,
      isCustom: task.isCustom,
    };
  }

  async getHouseTasks(email: string, houseId: string): Promise<TaskResponse[]> {
    // Verify user belongs to the requested house or has an active membership
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    const membership = await this.prisma.houseMembership.findFirst({
      where: {
        userId: user.id,
        houseId,
        active: true,
      },
    });

    if (!membership) {
      throw new ForbiddenException('No tienes acceso a las tareas de esta casa');
    }

    const tasks = await this.prisma.task.findMany({
      where: { houseId },
    });

    return tasks.map((t) => ({
      id: t.id,
      houseId: t.houseId,
      title: t.title,
      weight: t.weight,
      recurrence: t.recurrence,
      isCustom: t.isCustom,
    }));
  }

  async updateTask(email: string, taskId: string, dto: UpdateTaskDto): Promise<TaskResponse> {
    const membership = await this.getActiveMembershipAndVerifyAdmin(email);

    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task) {
      throw new NotFoundException('Tarea no encontrada');
    }

    if (task.houseId !== membership.houseId) {
      throw new ForbiddenException('No tienes permisos para modificar esta tarea');
    }

    if (dto.weight !== undefined && (dto.weight < 1 || dto.weight > 5)) {
      throw new BadRequestException('El peso de la tarea debe estar entre 1 y 5');
    }

    const updatedTask = await this.prisma.task.update({
      where: { id: taskId },
      data: {
        title: dto.title,
        weight: dto.weight,
        recurrence: dto.recurrence,
      },
    });

    return {
      id: updatedTask.id,
      houseId: updatedTask.houseId,
      title: updatedTask.title,
      weight: updatedTask.weight,
      recurrence: updatedTask.recurrence,
      isCustom: updatedTask.isCustom,
    };
  }

  async deleteTask(email: string, taskId: string): Promise<void> {
    const membership = await this.getActiveMembershipAndVerifyAdmin(email);

    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task) {
      throw new NotFoundException('Tarea no encontrada');
    }

    if (task.houseId !== membership.houseId) {
      throw new ForbiddenException('No tienes permisos para eliminar esta tarea');
    }

    await this.prisma.task.delete({
      where: { id: taskId },
    });
  }
}

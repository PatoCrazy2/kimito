import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { AuthGuard } from '../auth/auth.guard';
import type { CreateTaskDto, UpdateTaskDto, TaskResponse } from '@kimito/shared-types';

@Controller()
@UseGuards(AuthGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post('tasks')
  async createTask(
    @Request() req: any,
    @Body() dto: CreateTaskDto,
  ): Promise<TaskResponse> {
    return this.tasksService.createTask(req.user.email, dto);
  }

  @Get('houses/:houseId/tasks')
  async getHouseTasks(
    @Request() req: any,
    @Param('houseId') houseId: string,
  ): Promise<TaskResponse[]> {
    return this.tasksService.getHouseTasks(req.user.email, houseId);
  }

  @Put('tasks/:id')
  async updateTask(
    @Request() req: any,
    @Param('id') id: string,
    @Body() dto: UpdateTaskDto,
  ): Promise<TaskResponse> {
    return this.tasksService.updateTask(req.user.email, id, dto);
  }

  @Delete('tasks/:id')
  async deleteTask(
    @Request() req: any,
    @Param('id') id: string,
  ): Promise<{ success: boolean }> {
    await this.tasksService.deleteTask(req.user.email, id);
    return { success: true };
  }
}

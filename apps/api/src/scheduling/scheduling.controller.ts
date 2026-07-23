import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { SchedulingService } from './scheduling.service';
import { AuthGuard } from '../auth/auth.guard';
import type {
  TaskAssignmentResponse,
  OverrideAssignmentDto,
  GenerateScheduleDto,
} from '@kimito/shared-types';

@Controller('scheduling')
export class SchedulingController {
  constructor(private readonly schedulingService: SchedulingService) {}

  @UseGuards(AuthGuard)
  @Post('generate')
  async generateSchedule(
    @Request() req: any,
    @Body() dto: GenerateScheduleDto,
  ): Promise<TaskAssignmentResponse[]> {
    return this.schedulingService.generateSchedule(
      req.user.email,
      dto?.startDate,
      dto?.endDate,
    );
  }

  @UseGuards(AuthGuard)
  @Get('assignments')
  async getAssignments(@Request() req: any): Promise<TaskAssignmentResponse[]> {
    return this.schedulingService.getMyHouseAssignments(req.user.email);
  }

  @UseGuards(AuthGuard)
  @Patch('override')
  async overrideAssignment(
    @Request() req: any,
    @Body() dto: OverrideAssignmentDto,
  ): Promise<TaskAssignmentResponse> {
    return this.schedulingService.overrideAssignment(req.user.email, dto);
  }
}

import { Controller, Get, Post, Put, Body, Query, UseGuards, Request } from '@nestjs/common';
import { HousesService } from './houses.service';
import { AuthGuard } from '../auth/auth.guard';
import type { CreateHouseDto, JoinHouseDto, HouseResponse, HouseMemberResponse } from '@kimito/shared-types';

@Controller('houses')
export class HousesController {
  constructor(private readonly housesService: HousesService) {}

  @UseGuards(AuthGuard)
  @Post()
  async createHouse(
    @Request() req: any,
    @Body() dto: CreateHouseDto,
  ): Promise<HouseResponse> {
    return this.housesService.createHouse(req.user.email, dto);
  }

  @Get('invite-info')
  async getInviteInfo(@Query('code') code: string): Promise<HouseResponse> {
    return this.housesService.getInviteInfo(code);
  }

  @UseGuards(AuthGuard)
  @Post('join')
  async joinHouse(
    @Request() req: any,
    @Body() dto: JoinHouseDto,
  ): Promise<HouseResponse> {
    return this.housesService.joinHouse(req.user.email, dto.inviteCode);
  }

  @UseGuards(AuthGuard)
  @Get('my-house')
  async getMyHouse(@Request() req: any): Promise<HouseResponse> {
    return this.housesService.getMyHouse(req.user.email);
  }

  @UseGuards(AuthGuard)
  @Get('my-house/members')
  async getMyHouseMembers(@Request() req: any): Promise<HouseMemberResponse[]> {
    return this.housesService.getMyHouseMembers(req.user.email);
  }

  @UseGuards(AuthGuard)
  @Put('my-house')
  async updateMyHouse(
    @Request() req: any,
    @Body() dto: { name?: string; description?: string; address?: string },
  ): Promise<HouseResponse> {
    return this.housesService.updateHouse(req.user.email, dto);
  }
}


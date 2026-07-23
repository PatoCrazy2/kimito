import { Injectable, BadRequestException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateHouseDto, HouseResponse, HouseMemberResponse } from '@kimito/shared-types';
import { TasksService } from '../tasks/tasks.service';
import * as crypto from 'crypto';

@Injectable()
export class HousesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tasksService: TasksService,
  ) {}

  private generateInviteCode(): string {
    return crypto.randomBytes(4).toString('hex').toUpperCase(); // 8 character alphanumeric string
  }

  async getUserIdByEmail(email: string): Promise<string> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }
    return user.id;
  }

  async createHouse(email: string, dto: CreateHouseDto): Promise<HouseResponse> {
    const userId = await this.getUserIdByEmail(email);

    // Verify if user already has an active house membership
    const activeMembership = await this.prisma.houseMembership.findFirst({
      where: {
        userId,
        active: true,
      },
    });

    if (activeMembership) {
      throw new BadRequestException('Ya perteneces a una casa activa');
    }

    let inviteCode = this.generateInviteCode();
    // Keep generating if it's not unique (rare collision)
    let exists = await this.prisma.house.findUnique({ where: { inviteCode } });
    while (exists) {
      inviteCode = this.generateInviteCode();
      exists = await this.prisma.house.findUnique({ where: { inviteCode } });
    }

    const house = await this.prisma.$transaction(async (tx) => {
      const newHouse = await tx.house.create({
        data: {
          name: dto.name,
          description: dto.description || null,
          address: dto.address || null,
          inviteCode,
        },
      });

      await tx.houseMembership.create({
        data: {
          userId,
          houseId: newHouse.id,
          role: 'ADMIN',
          active: true,
        },
      });

      return newHouse;
    });

    return {
      id: house.id,
      name: house.name,
      inviteCode: house.inviteCode,
      description: house.description,
      address: house.address,
      createdAt: house.createdAt,
    };
  }

  async getInviteInfo(code: string): Promise<HouseResponse> {
    const house = await this.prisma.house.findUnique({
      where: { inviteCode: code },
    });

    if (!house) {
      throw new NotFoundException('Casa no encontrada');
    }

    return {
      id: house.id,
      name: house.name,
      inviteCode: house.inviteCode,
      description: house.description,
      address: house.address,
      createdAt: house.createdAt,
    };
  }

  async joinHouse(email: string, inviteCode: string): Promise<HouseResponse> {
    const userId = await this.getUserIdByEmail(email);

    const house = await this.prisma.house.findUnique({
      where: { inviteCode },
    });

    if (!house) {
      throw new NotFoundException('Código de invitación inválido');
    }

    // Verify if user already has an active house membership
    const activeMembership = await this.prisma.houseMembership.findFirst({
      where: {
        userId,
        active: true,
      },
    });

    if (activeMembership) {
      throw new BadRequestException('Ya perteneces a una casa activa');
    }

    await this.prisma.houseMembership.create({
      data: {
        userId,
        houseId: house.id,
        role: 'MEMBER',
        active: true,
      },
    });

    return {
      id: house.id,
      name: house.name,
      inviteCode: house.inviteCode,
      description: house.description,
      address: house.address,
      createdAt: house.createdAt,
    };
  }

  async getMyHouse(email: string): Promise<HouseResponse> {
    const userId = await this.getUserIdByEmail(email);

    const activeMembership = await this.prisma.houseMembership.findFirst({
      where: {
        userId,
        active: true,
      },
      include: {
        house: true,
      },
    });

    if (!activeMembership) {
      throw new NotFoundException('No perteneces a ninguna casa activa');
    }

    const house = activeMembership.house;

    return {
      id: house.id,
      name: house.name,
      inviteCode: house.inviteCode,
      description: house.description,
      address: house.address,
      createdAt: house.createdAt,
    };
  }

  async getMyHouseMembers(email: string): Promise<HouseMemberResponse[]> {
    const userId = await this.getUserIdByEmail(email);

    const activeMembership = await this.prisma.houseMembership.findFirst({
      where: {
        userId,
        active: true,
      },
    });

    if (!activeMembership) {
      throw new NotFoundException('No perteneces a ninguna casa activa');
    }

    const memberships = await this.prisma.houseMembership.findMany({
      where: {
        houseId: activeMembership.houseId,
        active: true,
      },
      include: {
        user: true,
      },
    });

    return memberships.map((m) => ({
      userId: m.user.id,
      name: m.user.name,
      email: m.user.email,
      avatarUrl: m.user.avatarUrl,
      role: m.role,
      joinedAt: m.joinedAt,
      active: m.active,
    }));
  }
}

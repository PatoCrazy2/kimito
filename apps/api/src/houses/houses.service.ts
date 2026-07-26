import {
  Injectable,
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateHouseDto,
  HouseResponse,
  HouseMemberResponse,
} from '@kimito/shared-types';
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

  async createHouse(
    email: string,
    dto: CreateHouseDto,
  ): Promise<HouseResponse> {
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

  async updateHouse(
    email: string,
    dto: { name?: string; description?: string; address?: string },
  ): Promise<HouseResponse> {
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

    if (activeMembership.role !== 'ADMIN') {
      throw new UnauthorizedException(
        'Solo el administrador puede actualizar los detalles de la casa',
      );
    }

    const updated = await this.prisma.house.update({
      where: { id: activeMembership.houseId },
      data: {
        name: dto.name !== undefined ? dto.name : undefined,
        description:
          dto.description !== undefined ? dto.description : undefined,
        address: dto.address !== undefined ? dto.address : undefined,
      },
    });

    return {
      id: updated.id,
      name: updated.name,
      inviteCode: updated.inviteCode,
      description: updated.description,
      address: updated.address,
      createdAt: updated.createdAt,
    };
  }

  async leaveHouse(email: string): Promise<{ success: boolean }> {
    const userId = await this.getUserIdByEmail(email);

    const activeMembership = await this.prisma.houseMembership.findFirst({
      where: { userId, active: true },
    });

    if (!activeMembership) {
      throw new NotFoundException('No perteneces a ninguna casa activa');
    }

    const houseId = activeMembership.houseId;

    if (activeMembership.role === 'ADMIN') {
      const otherMembers = await this.prisma.houseMembership.findMany({
        where: { houseId, active: true, userId: { not: userId } },
      });

      if (otherMembers.length > 0) {
        const otherAdmins = otherMembers.filter((m) => m.role === 'ADMIN');
        if (otherAdmins.length === 0) {
          throw new BadRequestException(
            'Eres el único administrador de la casa. Debes promover a otro miembro a Administrador antes de salir, o eliminar la casa.',
          );
        }
      } else {
        // Es el único miembro de la casa, por lo tanto eliminamos la casa
        await this.deleteHouse(email);
        return { success: true };
      }
    }

    await this.prisma.$transaction(async (tx) => {
      // Eliminar membresía
      await tx.houseMembership.delete({
        where: { userId_houseId: { userId, houseId } },
      });

      // Crear historial
      await tx.membershipHistory.create({
        data: {
          userId,
          role: activeMembership.role,
          joinedAt: activeMembership.joinedAt,
          actionType: 'LEFT',
        },
      });
    });

    return { success: true };
  }

  async kickMember(email: string, targetUserId: string): Promise<{ success: boolean }> {
    const userId = await this.getUserIdByEmail(email);

    const requesterMembership = await this.prisma.houseMembership.findFirst({
      where: { userId, active: true },
    });

    if (!requesterMembership) {
      throw new NotFoundException('No perteneces a ninguna casa activa');
    }

    if (requesterMembership.role !== 'ADMIN') {
      throw new UnauthorizedException('Solo el administrador puede expulsar miembros');
    }

    if (userId === targetUserId) {
      throw new BadRequestException('No puedes expulsarte a ti mismo. Utiliza la opción de salir de la casa.');
    }

    const targetMembership = await this.prisma.houseMembership.findUnique({
      where: { userId_houseId: { userId: targetUserId, houseId: requesterMembership.houseId } },
    });

    if (!targetMembership || !targetMembership.active) {
      throw new NotFoundException('El miembro no pertenece a esta casa o no está activo');
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.houseMembership.delete({
        where: { userId_houseId: { userId: targetUserId, houseId: requesterMembership.houseId } },
      });

      await tx.membershipHistory.create({
        data: {
          userId: targetUserId,
          role: targetMembership.role,
          joinedAt: targetMembership.joinedAt,
          actionType: 'KICKED',
        },
      });
    });

    return { success: true };
  }

  async deleteHouse(email: string): Promise<{ success: boolean }> {
    const userId = await this.getUserIdByEmail(email);

    const requesterMembership = await this.prisma.houseMembership.findFirst({
      where: { userId, active: true },
    });

    if (!requesterMembership) {
      throw new NotFoundException('No perteneces a ninguna casa activa');
    }

    if (requesterMembership.role !== 'ADMIN') {
      throw new UnauthorizedException('Solo el administrador puede eliminar la casa');
    }

    const houseId = requesterMembership.houseId;

    // Obtener todos los miembros
    const members = await this.prisma.houseMembership.findMany({
      where: { houseId, active: true },
    });

    await this.prisma.$transaction(async (tx) => {
      // Crear historial para todos los miembros antes de borrar
      await tx.membershipHistory.createMany({
        data: members.map((m) => ({
          userId: m.userId,
          role: m.role,
          joinedAt: m.joinedAt,
          actionType: 'HOUSE_DELETED',
        })),
      });

      // Eliminar casa (cascada borra HouseMembership y demás relaciones)
      await tx.house.delete({
        where: { id: houseId },
      });
    });

    return { success: true };
  }

  async getMembershipHistory(email: string): Promise<any[]> {
    const userId = await this.getUserIdByEmail(email);
    return this.prisma.membershipHistory.findMany({
      where: { userId },
      orderBy: { leftAt: 'desc' },
    });
  }
}

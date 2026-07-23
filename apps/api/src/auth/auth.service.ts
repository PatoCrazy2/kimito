import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserDto } from '@kimito/shared-types';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async validateOrCreateUser(payload: { email: string; name: string; picture?: string }): Promise<UserDto> {
    const { email, name, picture } = payload;

    // Buscar el usuario por email
    let user = await this.prisma.user.findUnique({
      where: { email },
    });

    // Si no existe, crear un nuevo usuario (Aprovisionamiento JIT)
    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email,
          name: name || 'Roommate',
          avatarUrl: picture || null,
        },
      });
    } else {
      // Opcional: Actualizar el nombre y foto de perfil si han cambiado en el proveedor OAuth
      const needsUpdate = user.name !== name || user.avatarUrl !== picture;
      if (needsUpdate) {
        user = await this.prisma.user.update({
          where: { email },
          data: {
            name: name || user.name,
            avatarUrl: picture || user.avatarUrl,
          },
        });
      }
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      avatarUrl: user.avatarUrl || undefined,
      createdAt: user.createdAt,
    };
  }

  async registerWithCredentials(payload: any): Promise<UserDto> {
    const { email, password, name } = payload;

    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new Error('EmailAlreadyExists');
    }

    const bcrypt = await import('bcryptjs');
    const passwordHash = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: {
        email,
        passwordHash,
        name,
      },
    });

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      avatarUrl: user.avatarUrl || undefined,
      createdAt: user.createdAt,
    };
  }

  async verifyCredentials(payload: any): Promise<UserDto> {
    const { email, password } = payload;

    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.passwordHash) {
      throw new Error('InvalidCredentials');
    }

    const bcrypt = await import('bcryptjs');
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      throw new Error('InvalidCredentials');
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      avatarUrl: user.avatarUrl || undefined,
      createdAt: user.createdAt,
    };
  }
}

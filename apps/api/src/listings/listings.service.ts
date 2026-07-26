import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ReputationService } from '../reputation/reputation.service';
import { Prisma, Listing } from '@prisma/client';
import type {
  CreateListingDto,
  UpdateListingDto,
  ListingResponse,
  ListingFilters,
  PaginatedListings,
  ListingOwner,
} from '@kimito/shared-types';

@Injectable()
export class ListingsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly reputationService: ReputationService,
  ) {}

  private async getUserByEmail(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }
    return user;
  }

  private async buildOwnerWithReputation(userId: string): Promise<ListingOwner> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, avatarUrl: true },
    });

    if (!user) {
      return { id: userId, name: 'Usuario eliminado', avatarUrl: null, reputationScore: null };
    }

    let reputationScore: number | null = null;
    try {
      const rep = await this.reputationService.getUserReputation(userId);
      reputationScore = rep.score;
    } catch {
      // Sin reputación
    }

    return {
      id: user.id,
      name: user.name,
      avatarUrl: user.avatarUrl,
      reputationScore,
    };
  }

  private mapToResponse(listing: Listing, owner: ListingOwner): ListingResponse {
    return {
      id: listing.id,
      title: listing.title,
      description: listing.description,
      monthlyRent: listing.monthlyRent,
      deposit: listing.deposit,
      location: listing.location,
      availableFrom: listing.availableFrom,
      availableRooms: listing.availableRooms,
      preferredGender: listing.preferredGender as ListingResponse['preferredGender'],
      petsAllowed: listing.petsAllowed,
      smokingAllowed: listing.smokingAllowed,
      images: listing.images,
      status: listing.status as ListingResponse['status'],
      owner,
      houseId: listing.houseId ?? null,
      createdAt: listing.createdAt,
      updatedAt: listing.updatedAt,
    };
  }

  async createListing(email: string, dto: CreateListingDto): Promise<ListingResponse> {
    const user = await this.getUserByEmail(email);

    // Si el usuario tiene casa activa, asociar la publicación a esa casa
    const membership = await this.prisma.houseMembership.findFirst({
      where: { userId: user.id, active: true },
    });

    // Validaciones
    if (!dto.title || dto.title.trim().length === 0) {
      throw new BadRequestException('El título es obligatorio');
    }
    if (!dto.description || dto.description.trim().length === 0) {
      throw new BadRequestException('La descripción es obligatoria');
    }
    if (dto.monthlyRent === undefined || dto.monthlyRent < 0) {
      throw new BadRequestException('La renta mensual debe ser mayor o igual a 0');
    }
    if (!dto.location || dto.location.trim().length === 0) {
      throw new BadRequestException('La ubicación es obligatoria');
    }
    if (!dto.availableFrom) {
      throw new BadRequestException('La fecha de disponibilidad es obligatoria');
    }
    if (!dto.availableRooms || dto.availableRooms < 1) {
      throw new BadRequestException('Debe haber al menos 1 habitación disponible');
    }

    const listing = await this.prisma.listing.create({
      data: {
        title: dto.title.trim(),
        description: dto.description.trim(),
        monthlyRent: dto.monthlyRent,
        deposit: dto.deposit ?? null,
        location: dto.location.trim(),
        availableFrom: new Date(dto.availableFrom),
        availableRooms: dto.availableRooms,
        preferredGender: dto.preferredGender ?? null,
        petsAllowed: dto.petsAllowed ?? false,
        smokingAllowed: dto.smokingAllowed ?? false,
        images: dto.images || [],
        userId: user.id,
        houseId: membership?.houseId ?? null,
      },
    });

    const owner = await this.buildOwnerWithReputation(user.id);
    return this.mapToResponse(listing, owner);
  }

  async getListings(filters: ListingFilters): Promise<PaginatedListings> {
    const page = filters.page && filters.page > 0 ? filters.page : 1;
    const limit = filters.limit && filters.limit > 0 ? Math.min(filters.limit, 50) : 12;
    const skip = (page - 1) * limit;

    const where: Prisma.ListingWhereInput = {};

    // Solo mostrar activos por defecto
    if (filters.status) {
      where.status = filters.status;
    } else {
      where.status = 'ACTIVE';
    }

    if (filters.location) {
      where.location = { contains: filters.location, mode: 'insensitive' };
    }

    if (filters.minRent !== undefined || filters.maxRent !== undefined) {
      where.monthlyRent = {};
      if (filters.minRent !== undefined) {
        where.monthlyRent.gte = filters.minRent;
      }
      if (filters.maxRent !== undefined) {
        where.monthlyRent.lte = filters.maxRent;
      }
    }

    if (filters.availableFrom) {
      where.availableFrom = { lte: new Date(filters.availableFrom) };
    }

    if (filters.petsAllowed !== undefined) {
      where.petsAllowed = filters.petsAllowed;
    }

    if (filters.smokingAllowed !== undefined) {
      where.smokingAllowed = filters.smokingAllowed;
    }

    if (filters.preferredGender) {
      where.OR = [
        { preferredGender: filters.preferredGender },
        { preferredGender: 'ANY' },
        { preferredGender: null },
      ];
    }

    if (filters.search) {
      const searchConditions = [
        { title: { contains: filters.search, mode: 'insensitive' as const } },
        { description: { contains: filters.search, mode: 'insensitive' as const } },
        { location: { contains: filters.search, mode: 'insensitive' as const } },
      ];

      if (where.OR) {
        // Si ya existe OR por preferredGender, combinar con AND
        where.AND = [
          { OR: where.OR },
          { OR: searchConditions },
        ];
        delete where.OR;
      } else {
        where.OR = searchConditions;
      }
    }

    const [listings, total] = await Promise.all([
      this.prisma.listing.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          user: {
            select: { id: true, name: true, avatarUrl: true },
          },
        },
      }),
      this.prisma.listing.count({ where }),
    ]);

    // Obtener reputaciones de todos los owners en paralelo
    const ownerIds = [...new Set(listings.map((l) => l.userId))];
    const reputationMap = new Map<string, number | null>();

    await Promise.all(
      ownerIds.map(async (ownerId) => {
        try {
          const rep = await this.reputationService.getUserReputation(ownerId);
          reputationMap.set(ownerId, rep.score);
        } catch {
          reputationMap.set(ownerId, null);
        }
      }),
    );

    const data: ListingResponse[] = listings.map((listing) => {
      const owner: ListingOwner = {
        id: listing.user.id,
        name: listing.user.name,
        avatarUrl: listing.user.avatarUrl,
        reputationScore: reputationMap.get(listing.userId) ?? null,
      };
      return this.mapToResponse(listing, owner);
    });

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getListingById(id: string): Promise<ListingResponse> {
    const listing = await this.prisma.listing.findUnique({
      where: { id },
      include: {
        user: {
          select: { id: true, name: true, avatarUrl: true },
        },
      },
    });

    if (!listing) {
      throw new NotFoundException('Publicación no encontrada');
    }

    const owner = await this.buildOwnerWithReputation(listing.userId);
    return this.mapToResponse(listing, owner);
  }

  async updateListing(email: string, id: string, dto: UpdateListingDto): Promise<ListingResponse> {
    const user = await this.getUserByEmail(email);

    const listing = await this.prisma.listing.findUnique({ where: { id } });
    if (!listing) {
      throw new NotFoundException('Publicación no encontrada');
    }

    if (listing.userId !== user.id) {
      throw new ForbiddenException('Solo el dueño puede editar esta publicación');
    }

    if (dto.monthlyRent !== undefined && dto.monthlyRent < 0) {
      throw new BadRequestException('La renta mensual debe ser mayor o igual a 0');
    }
    if (dto.availableRooms !== undefined && dto.availableRooms < 1) {
      throw new BadRequestException('Debe haber al menos 1 habitación disponible');
    }

    const updated = await this.prisma.listing.update({
      where: { id },
      data: {
        ...(dto.title !== undefined && { title: dto.title.trim() }),
        ...(dto.description !== undefined && { description: dto.description.trim() }),
        ...(dto.monthlyRent !== undefined && { monthlyRent: dto.monthlyRent }),
        ...(dto.deposit !== undefined && { deposit: dto.deposit }),
        ...(dto.location !== undefined && { location: dto.location.trim() }),
        ...(dto.availableFrom !== undefined && { availableFrom: new Date(dto.availableFrom) }),
        ...(dto.availableRooms !== undefined && { availableRooms: dto.availableRooms }),
        ...(dto.preferredGender !== undefined && { preferredGender: dto.preferredGender }),
        ...(dto.petsAllowed !== undefined && { petsAllowed: dto.petsAllowed }),
        ...(dto.smokingAllowed !== undefined && { smokingAllowed: dto.smokingAllowed }),
        ...(dto.status !== undefined && { status: dto.status }),
        ...(dto.images !== undefined && { images: dto.images }),
      },
    });

    const owner = await this.buildOwnerWithReputation(user.id);
    return this.mapToResponse(updated, owner);
  }

  async deleteListing(email: string, id: string): Promise<void> {
    const user = await this.getUserByEmail(email);

    const listing = await this.prisma.listing.findUnique({ where: { id } });
    if (!listing) {
      throw new NotFoundException('Publicación no encontrada');
    }

    if (listing.userId !== user.id) {
      throw new ForbiddenException('Solo el dueño puede eliminar esta publicación');
    }

    await this.prisma.listing.delete({ where: { id } });
  }
}

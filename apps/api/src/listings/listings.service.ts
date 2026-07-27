import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ReputationService } from '../reputation/reputation.service';
import { NotificationsService } from '../notifications/notifications.service';
import { Prisma, Listing } from '@prisma/client';
import type {
  CreateListingDto,
  UpdateListingDto,
  ListingResponse,
  ListingFilters,
  PaginatedListings,
  ListingOwner,
  CreateListingApplicationDto,
  ListingApplicationResponse,
} from '@kimito/shared-types';

@Injectable()
export class ListingsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly reputationService: ReputationService,
    private readonly notificationsService: NotificationsService,
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

  private async getHouseStats(houseId: string | null): Promise<{ memberCount: number | null; reputationAverage: number | null }> {
    if (!houseId) {
      return { memberCount: null, reputationAverage: null };
    }

    const memberships = await this.prisma.houseMembership.findMany({
      where: { houseId, active: true },
      select: { userId: true },
    });

    const memberCount = memberships.length;
    if (memberCount === 0) {
      return { memberCount: 0, reputationAverage: null };
    }

    const memberIds = memberships.map((m) => m.userId);
    const scores = await this.prisma.reputationScore.findMany({
      where: { userId: { in: memberIds } },
      select: { score: true },
    });

    if (scores.length === 0) {
      return { memberCount, reputationAverage: null };
    }

    const totalScore = scores.reduce((sum, s) => sum + s.score, 0);
    const reputationAverage = Number((totalScore / scores.length).toFixed(1));

    return { memberCount, reputationAverage };
  }

  private mapToResponse(
    listing: Listing,
    owner: ListingOwner,
    houseMemberCount: number | null = null,
    houseReputationAverage: number | null = null,
  ): ListingResponse {
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
      houseMemberCount,
      houseReputationAverage,
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
    const stats = await this.getHouseStats(listing.houseId);
    return this.mapToResponse(listing, owner, stats.memberCount, stats.reputationAverage);
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

    // Obtener información de casa en lote
    const houseIds = [...new Set(listings.map((l) => l.houseId).filter(Boolean) as string[])];
    const houseStatsMap = new Map<string, { memberCount: number; reputationAverage: number | null }>();

    if (houseIds.length > 0) {
      const memberships = await this.prisma.houseMembership.findMany({
        where: { houseId: { in: houseIds }, active: true },
        select: { houseId: true, userId: true },
      });

      const userIds = [...new Set(memberships.map((m) => m.userId))];
      const scores = await this.prisma.reputationScore.findMany({
        where: { userId: { in: userIds } },
        select: { userId: true, score: true },
      });

      const houseMembersMap = new Map<string, string[]>();
      for (const m of memberships) {
        if (!houseMembersMap.has(m.houseId)) {
          houseMembersMap.set(m.houseId, []);
        }
        houseMembersMap.get(m.houseId)!.push(m.userId);
      }

      const userScoreMap = new Map<string, number>();
      for (const s of scores) {
        userScoreMap.set(s.userId, s.score);
      }

      for (const houseId of houseIds) {
        const memberIds = houseMembersMap.get(houseId) || [];
        const memberCount = memberIds.length;
        if (memberCount === 0) {
          houseStatsMap.set(houseId, { memberCount: 0, reputationAverage: null });
          continue;
        }

        let sum = 0;
        let count = 0;
        for (const mId of memberIds) {
          const score = userScoreMap.get(mId);
          if (score !== undefined) {
            sum += score;
            count++;
          }
        }

        const reputationAverage = count > 0 ? Number((sum / count).toFixed(1)) : null;
        houseStatsMap.set(houseId, { memberCount, reputationAverage });
      }
    }

    const data: ListingResponse[] = listings.map((listing) => {
      const owner: ListingOwner = {
        id: listing.user.id,
        name: listing.user.name,
        avatarUrl: listing.user.avatarUrl,
        reputationScore: reputationMap.get(listing.userId) ?? null,
      };
      const stats = listing.houseId ? houseStatsMap.get(listing.houseId) : null;
      return this.mapToResponse(
        listing,
        owner,
        stats?.memberCount ?? null,
        stats?.reputationAverage ?? null,
      );
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
    const stats = await this.getHouseStats(listing.houseId);
    return this.mapToResponse(listing, owner, stats.memberCount, stats.reputationAverage);
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
    const stats = await this.getHouseStats(updated.houseId);
    return this.mapToResponse(updated, owner, stats.memberCount, stats.reputationAverage);
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

  async applyToListing(
    email: string,
    listingId: string,
    dto: CreateListingApplicationDto,
  ): Promise<ListingApplicationResponse> {
    const user = await this.getUserByEmail(email);

    const listing = await this.prisma.listing.findUnique({ where: { id: listingId } });
    if (!listing) {
      throw new NotFoundException('Publicación no encontrada');
    }

    if (listing.userId === user.id) {
      throw new BadRequestException('No puedes postularte a tu propia publicación');
    }

    // Verificar si ya se postuló
    const existing = await this.prisma.listingApplication.findFirst({
      where: { listingId, userId: user.id },
    });
    if (existing) {
      throw new BadRequestException('Ya te has postulado a esta publicación');
    }

    const application = await this.prisma.listingApplication.create({
      data: {
        listingId,
        userId: user.id,
        phoneNumber: dto.phoneNumber.trim(),
        message: dto.message?.trim() ?? null,
      },
      include: {
        user: {
          select: { id: true, name: true, avatarUrl: true },
        },
      },
    });

    let reputationScore: number | null = null;
    try {
      const rep = await this.reputationService.getUserReputation(user.id);
      reputationScore = rep.score;
    } catch {}

    // Enviar notificación al dueño de la publicación
    try {
      const payload = {
        title: 'Nueva postulación 🤝',
        body: `${application.user.name} se ha postulado a tu anuncio "${listing.title}".`,
        url: '/dashboard',
      };
      await this.notificationsService.sendNotificationToUser(
        listing.userId,
        payload,
      );
    } catch (error) {
      console.error('Error al enviar notificación de postulación:', error);
    }

    return {
      id: application.id,
      listingId: application.listingId,
      userId: application.userId,
      phoneNumber: application.phoneNumber,
      message: application.message,
      createdAt: application.createdAt,
      user: {
        id: application.user.id,
        name: application.user.name,
        avatarUrl: application.user.avatarUrl,
        reputationScore,
      },
    };
  }

  async getListingApplications(email: string, listingId: string): Promise<ListingApplicationResponse[]> {
    const user = await this.getUserByEmail(email);

    const listing = await this.prisma.listing.findUnique({ where: { id: listingId } });
    if (!listing) {
      throw new NotFoundException('Publicación no encontrada');
    }

    if (listing.userId !== user.id) {
      throw new ForbiddenException('Solo el dueño puede ver las postulaciones');
    }

    const applications = await this.prisma.listingApplication.findMany({
      where: { listingId },
      include: {
        user: {
          select: { id: true, name: true, avatarUrl: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Cargar reputaciones en paralelo
    const userIds = [...new Set(applications.map((app) => app.userId))];
    const reputationMap = new Map<string, number | null>();
    await Promise.all(
      userIds.map(async (uId) => {
        try {
          const rep = await this.reputationService.getUserReputation(uId);
          reputationMap.set(uId, rep.score);
        } catch {
          reputationMap.set(uId, null);
        }
      }),
    );

    return applications.map((app) => ({
      id: app.id,
      listingId: app.listingId,
      userId: app.userId,
      phoneNumber: app.phoneNumber,
      message: app.message,
      createdAt: app.createdAt,
      user: {
        id: app.user.id,
        name: app.user.name,
        avatarUrl: app.user.avatarUrl,
        reputationScore: reputationMap.get(app.userId) ?? null,
      },
    }));
  }

  async inviteCandidate(email: string, listingId: string, applicationId: string): Promise<{ success: boolean }> {
    const user = await this.getUserByEmail(email);

    const listing = await this.prisma.listing.findUnique({
      where: { id: listingId },
      include: { house: true },
    });
    if (!listing) {
      throw new NotFoundException('Publicación no encontrada');
    }

    if (listing.userId !== user.id) {
      throw new ForbiddenException('Solo el dueño de la publicación puede invitar');
    }

    const application = await this.prisma.listingApplication.findUnique({
      where: { id: applicationId },
    });
    if (!application) {
      throw new NotFoundException('Postulación no encontrada');
    }

    if (!listing.houseId || !listing.house) {
      throw new BadRequestException('Esta publicación no tiene una casa asociada');
    }

    // Enviar notificación al postulante
    await this.notificationsService.sendNotificationToUser(application.userId, {
      title: '¡Invitación a Casa!',
      body: `Has sido invitado a unirte a la casa "${listing.house.name}". Código de invitación: ${listing.house.inviteCode}`,
      url: `/join?code=${listing.house.inviteCode}`,
    });

    return { success: true };
  }
}

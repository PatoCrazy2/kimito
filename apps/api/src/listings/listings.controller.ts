import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ListingsService } from './listings.service';
import { AuthGuard } from '../auth/auth.guard';
import type {
  CreateListingDto,
  UpdateListingDto,
  ListingResponse,
  ListingFilters,
  PaginatedListings,
  ListingStatus,
  PreferredGender,
  CreateListingApplicationDto,
  ListingApplicationResponse,
} from '@kimito/shared-types';

@Controller('listings')
export class ListingsController {
  constructor(private readonly listingsService: ListingsService) {}

  @UseGuards(AuthGuard)
  @Post()
  async createListing(
    @Request() req: any,
    @Body() dto: CreateListingDto,
  ): Promise<ListingResponse> {
    return this.listingsService.createListing(req.user.email, dto);
  }

  @Get()
  async getListings(
    @Query('location') location?: string,
    @Query('minRent') minRent?: string,
    @Query('maxRent') maxRent?: string,
    @Query('availableFrom') availableFrom?: string,
    @Query('petsAllowed') petsAllowed?: string,
    @Query('smokingAllowed') smokingAllowed?: string,
    @Query('preferredGender') preferredGender?: PreferredGender,
    @Query('search') search?: string,
    @Query('status') status?: ListingStatus,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ): Promise<PaginatedListings> {
    const filters: ListingFilters = {
      location: location || undefined,
      minRent: minRent ? parseFloat(minRent) : undefined,
      maxRent: maxRent ? parseFloat(maxRent) : undefined,
      availableFrom: availableFrom || undefined,
      petsAllowed: petsAllowed === 'true' ? true : petsAllowed === 'false' ? false : undefined,
      smokingAllowed: smokingAllowed === 'true' ? true : smokingAllowed === 'false' ? false : undefined,
      preferredGender: preferredGender || undefined,
      search: search || undefined,
      status: status || undefined,
      page: page ? parseInt(page, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
    };
    return this.listingsService.getListings(filters);
  }

  @Get(':id')
  async getListingById(@Param('id') id: string): Promise<ListingResponse> {
    return this.listingsService.getListingById(id);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  async updateListing(
    @Request() req: any,
    @Param('id') id: string,
    @Body() dto: UpdateListingDto,
  ): Promise<ListingResponse> {
    return this.listingsService.updateListing(req.user.email, id, dto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async deleteListing(
    @Request() req: any,
    @Param('id') id: string,
  ): Promise<{ success: boolean }> {
    await this.listingsService.deleteListing(req.user.email, id);
    return { success: true };
  }

  @UseGuards(AuthGuard)
  @Post(':id/apply')
  async applyToListing(
    @Request() req: any,
    @Param('id') id: string,
    @Body() dto: CreateListingApplicationDto,
  ): Promise<ListingApplicationResponse> {
    return this.listingsService.applyToListing(req.user.email, id, dto);
  }

  @UseGuards(AuthGuard)
  @Get(':id/applications')
  async getListingApplications(
    @Request() req: any,
    @Param('id') id: string,
  ): Promise<ListingApplicationResponse[]> {
    return this.listingsService.getListingApplications(req.user.email, id);
  }
}

export type ListingStatus = 'ACTIVE' | 'SOLD' | 'HIDDEN';

export type PreferredGender = 'MALE' | 'FEMALE' | 'ANY';

export interface CreateListingDto {
  title: string;
  description: string;
  monthlyRent: number;
  deposit?: number;
  location: string;
  availableFrom: string; // ISO date string
  availableRooms: number;
  preferredGender?: PreferredGender;
  petsAllowed?: boolean;
  smokingAllowed?: boolean;
  images?: string[];
}

export interface UpdateListingDto {
  title?: string;
  description?: string;
  monthlyRent?: number;
  deposit?: number | null;
  location?: string;
  availableFrom?: string;
  availableRooms?: number;
  preferredGender?: PreferredGender | null;
  petsAllowed?: boolean;
  smokingAllowed?: boolean;
  status?: ListingStatus;
  images?: string[];
}

export interface ListingOwner {
  id: string;
  name: string;
  avatarUrl: string | null;
  reputationScore: number | null;
}

export interface ListingResponse {
  id: string;
  title: string;
  description: string;
  monthlyRent: number;
  deposit: number | null;
  location: string;
  availableFrom: Date;
  availableRooms: number;
  preferredGender: PreferredGender | null;
  petsAllowed: boolean;
  smokingAllowed: boolean;
  images: string[];
  status: ListingStatus;
  owner: ListingOwner;
  houseId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ListingFilters {
  location?: string;
  minRent?: number;
  maxRent?: number;
  availableFrom?: string;
  petsAllowed?: boolean;
  smokingAllowed?: boolean;
  preferredGender?: PreferredGender;
  search?: string;
  status?: ListingStatus;
  page?: number;
  limit?: number;
}

export interface PaginatedListings {
  data: ListingResponse[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

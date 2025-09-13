// Types for Sectors API

export interface SectorResponseDTO {
  id: string;
  name: string;
  description?: string;
  code: string;
  parentId?: string;
  level: number;
  sortOrder: number;
  contactInfo?: string;
  address?: string;
  responsiblePersonId?: string;
  sectorType?: string;
  active: boolean;
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface SectorRequestDTO {
  name: string;
  description?: string;
  code: string;
  parentId?: string;
  sortOrder?: number;
  contactInfo?: string;
  address?: string;
  responsiblePersonId?: string;
  sectorTypeKey?: string;
  active?: boolean;
  metadata?: Record<string, unknown>;
}

export interface WrapperListSectorDTO {
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
  content: SectorResponseDTO[];
}

export interface SectorCodeCheckDTO {
  exists: boolean;
}

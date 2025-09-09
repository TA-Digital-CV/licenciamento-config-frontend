//// Types for Sectors API

export interface SectorResponseDTO {
  id: string;
  name: string;
  description: string;
  code: string;
  sectorType: string;
  active: boolean;
  sortOrder: number;
  metadata: Record<string, unknown>;
}

export interface SectorRequestDTO {
  name: string;
  description?: string;
  code: string;
  sectorTypeKey: string;
  active?: boolean;
  sortOrder?: number;
  metadata?: Record<string, unknown>;
  [key: string]: unknown;
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

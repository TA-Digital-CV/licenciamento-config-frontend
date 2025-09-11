// Types for Categories API

export interface CategoryResponseDTO {
  active: any;
  id: string;
  code: string;
  name: string;
  description: string;
  sectorId: string;
  sectorName: string;
  level: number;
  path: string;
  children: CategoryResponseDTO[];
  metadata: Record<string, unknown>;
}

export interface CategoryRequestDTO {
  name: string;
  description?: string;
  code: string;
  sectorId?: string;
  parentId?: string;
  active?: boolean;
  sortOrder?: number;
  metadata?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface WrapperListCategoryDTO {
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
  content: CategoryResponseDTO[];
}

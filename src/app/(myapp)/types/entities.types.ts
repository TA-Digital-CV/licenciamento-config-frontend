// Types for Entities API

export interface EntityResponseDTO {
  id: string;
  name: string;
  description?: string;
  code: string;
  entityType: string;
  type?: string;
  parentId?: string;
  sectorId?: string;
  contactInfo?: string;
  address?: string;
  active: boolean;
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
  licenseTypeId?: string;
  licenseTypeName?: string;
  taxId?: string;
  registrationNumber?: string;
  legalForm?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  phone?: string;
  email?: string;
  website?: string;
}

export interface EntityRequestDTO {
  name: string;
  description?: string;
  code: string;
  entityType: string;
  type?: string;
  parentId?: string;
  sectorId?: string;
  contactInfo?: string;
  address?: string;
  active?: boolean;
  metadata?: Record<string, unknown>;
  licenseTypeId?: string;
  taxId?: string;
  registrationNumber?: string;
  legalForm?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  phone?: string;
  email?: string;
  website?: string;
}

export interface WrapperListEntityDTO {
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
  content: EntityResponseDTO[];
}

export interface EntityCodeCheckDTO {
  exists: boolean;
}

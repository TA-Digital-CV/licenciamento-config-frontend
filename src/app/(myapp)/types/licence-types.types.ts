// Types for License Types API

export interface LicenseTypeResponseDTO {
  id: string;
  name: string;
  description: string;
  code: string;
  categoryId: string;
  categoryName: string;
  licensingModelKey: string;
  validityPeriod: number;
  validityUnitKey: string;
  renewable: boolean;
  autoRenewal: boolean;
  requiresInspection: boolean;
  requiresPublicConsultation: boolean;
  maxProcessingDays: number;
  hasFees: boolean;
  baseFee: number;
  currencyCode: string;
  metadata: Record<string, unknown>;
}

export interface LicenseTypeRequestDTO {
  name: string;
  description?: string;
  code: string;
  categoryId?: string;
  licensingModelKey: string;
  validityPeriod: number;
  validityUnitKey: string;
  renewable?: boolean;
  autoRenewal?: boolean;
  requiresInspection?: boolean;
  requiresPublicConsultation?: boolean;
  maxProcessingDays?: number;
  hasFees?: boolean;
  baseFee?: number;
  currencyCode?: string;
  active?: boolean;
  sortOrder?: number;
  metadata?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface WrapperListLicenseTypeDTO {
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
  content: LicenseTypeResponseDTO[];
}

// Types for License Types API

export interface LicenseTypeResponseDTO {
  id: string;
  name: string;
  description?: string;
  code: string;
  categoryId: string;
  licensingModel: string;
  validityPeriod?: number;
  validityUnit: string;
  renewable: boolean;
  autoRenewal?: boolean;
  requiresInspection?: boolean;
  requiresPublicConsultation?: boolean;
  maxProcessingDays?: number;
  hasFees?: boolean;
  baseFee?: number;
  currencyCode: string;
  sortOrder?: number;
  active: boolean;
  metadata?: unknown;
}

export interface LicenseTypeRequestDTO {
  name: string;
  description?: string;
  code: string;
  categoryId: string;
  licensingModelKey: string;
  validityPeriod?: number;
  validityUnitKey: string;
  renewable: boolean;
  autoRenewal?: boolean;
  requiresInspection?: boolean;
  requiresPublicConsultation?: boolean;
  maxProcessingDays?: number;
  hasFees?: boolean;
  baseFee?: number;
  currencyCode?: string;
  sortOrder?: number;
  active: boolean;
  metadata?: unknown;
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

// Types for License Process Types API

export interface LicenseProcessTypeResponseDTO {
  id: string;
  licenseTypeId: string;
  licenseTypeName?: string;
  processName: string;
  processCode: string;
  description?: string;
  processCategory: 'INICIAL' | 'RENOVACAO' | 'ALTERACAO' | 'TRANSFERENCIA' | 'CANCELAMENTO' | 'SUSPENSAO';
  requiredDocuments?: string[];
  estimatedDuration: number;
  durationUnit: 'DIAS' | 'SEMANAS' | 'MESES';
  maxProcessingDays: number;
  requiresInspection: boolean;
  requiresPublicConsultation: boolean;
  requiresEnvironmentalLicense: boolean;
  automaticApproval: boolean;
  priority: 'ALTA' | 'MEDIA' | 'BAIXA';
  legalFramework?: string;
  processFlow?: Record<string, unknown>;
  validityPeriod?: number;
  validityUnit?: 'DIAS' | 'MESES' | 'ANOS';
  renewable: boolean;
  maxRenewals?: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, unknown>;
}

export interface LicenseProcessTypeRequestDTO {
  licenseTypeId: string;
  processName: string;
  processCode: string;
  description?: string;
  processCategory: 'INICIAL' | 'RENOVACAO' | 'ALTERACAO' | 'TRANSFERENCIA' | 'CANCELAMENTO' | 'SUSPENSAO';
  requiredDocuments?: string[];
  estimatedDuration: number;
  durationUnit: 'DIAS' | 'SEMANAS' | 'MESES';
  maxProcessingDays: number;
  requiresInspection: boolean;
  requiresPublicConsultation: boolean;
  requiresEnvironmentalLicense: boolean;
  automaticApproval: boolean;
  priority: 'ALTA' | 'MEDIA' | 'BAIXA';
  legalFramework?: string;
  processFlow?: Record<string, unknown>;
  validityPeriod?: number;
  validityUnit?: 'DIAS' | 'MESES' | 'ANOS';
  renewable: boolean;
  maxRenewals?: number;
  metadata?: Record<string, unknown>;
}

export interface WrapperListLicenseProcessTypeDTO {
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
  content: LicenseProcessTypeResponseDTO[];
}
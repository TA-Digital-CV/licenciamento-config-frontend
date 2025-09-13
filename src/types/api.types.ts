// Tipos para Fee Categories
export interface FeeCategoryResponseDTO {
  id: string;
  name: string;
  description?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FeeCategoryRequestDTO {
  name: string;
  description?: string;
  active?: boolean;
}

export interface WrapperListFeeCategoryDTO {
  data: FeeCategoryResponseDTO[];
  total: number;
  page: number;
  limit: number;
}

// Tipos para License Process Types
export interface LicenseProcessTypeResponseDTO {
  id: string;
  processName: string;
  processCategory: string;
  description?: string;
  active: boolean;
  licenseTypeId: string;
  createdAt: string;
  updatedAt: string;
}

export interface LicenseProcessTypeRequestDTO {
  processName: string;
  processCategory: string;
  description?: string;
  active?: boolean;
}

export interface WrapperListLicenseProcessTypeDTO {
  data: LicenseProcessTypeResponseDTO[];
  total: number;
  page: number;
  limit: number;
}

// Tipos para Process Type Fees
export interface ProcessTypeFeeResponseDTO {
  id: string;
  licenseProcessTypeId: string;
  feeCategoryId: string;
  baseAmount: number;
  currencyCode: string;
  validFromDate: string;
  validToDate?: string;
  taxRate?: number;
  discountRate?: number;
  calculationFormula?: string;
  isPercentageBased: boolean;
  requiresApproval: boolean;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProcessTypeFeeRequestDTO {
  licenseProcessTypeId: string;
  feeCategoryId: string;
  baseAmount: number;
  currencyCode: string;
  validFromDate: string;
  validToDate?: string;
  taxRate?: number;
  discountRate?: number;
  calculationFormula?: string;
  isPercentageBased?: boolean;
  requiresApproval?: boolean;
  active?: boolean;
}

export interface WrapperListProcessTypeFeeDTO {
  data: ProcessTypeFeeResponseDTO[];
  total: number;
  page: number;
  limit: number;
}

// Tipos comuns
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface Option {
  value: string;
  label: string;
}

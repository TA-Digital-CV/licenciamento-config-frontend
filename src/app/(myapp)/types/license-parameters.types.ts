// Types for License Parameters API

export interface LicenseParameterResponseDTO {
  id: string;
  name: string;
  description?: string;
  parameterType: string;
  dataType: 'string' | 'number' | 'boolean' | 'date' | 'json';
  defaultValue?: string;
  isRequired: boolean;
  required?: boolean;
  validationRules?: string;
  applicableToTypes: string[];
  category?: string;
  sortOrder: number;
  active: boolean;
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
  licenseTypeId?: string;
  type?: string;
  minValue?: number;
  maxValue?: number;
}

export interface LicenseParameterRequestDTO {
  name: string;
  description?: string;
  parameterType: string;
  dataType: 'string' | 'number' | 'boolean' | 'date' | 'json';
  defaultValue?: string;
  isRequired: boolean;
  validationRules?: string;
  applicableToTypes: string[];
  category?: string;
  sortOrder: number;
  active: boolean;
  metadata?: Record<string, unknown>;
  licenseTypeId?: string;
  validityUnit?: string;
  validityPeriod?: number;
  model?: string;
  minValue?: number;
  maxValue?: number;
}

export interface WrapperListLicenseParameterDTO {
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
  content: LicenseParameterResponseDTO[];
}

export interface LicenseParameterValidationResult {
  isValid: boolean;
  value?: unknown;
  error?: string;
}

export interface LicenseParametersByTypeDTO {
  licenseType: string;
  parameters: LicenseParameterResponseDTO[];
}

export interface LicenseParameterCodeCheckDTO {
  exists: boolean;
}

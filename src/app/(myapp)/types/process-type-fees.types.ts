// Types for Process Type Fees API

export interface ProcessTypeFeeResponseDTO {
  id: string;
  processTypeId: string;
  feeCategoryId: string;
  amount: number;
  currency: string;
  isPercentage: boolean;
  minAmount?: number;
  maxAmount?: number;
  calculationMethod: string;
  applicableConditions?: string;
  priority: number;
  active: boolean;
  validFrom: string;
  validTo?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
  // Dados relacionados
  processType?: {
    id: string;
    name: string;
    code: string;
  };
  feeCategory?: {
    id: string;
    name: string;
    code: string;
    categoryType: string;
  };
}

export interface ProcessTypeFeeRequestDTO {
  processTypeId: string;
  feeCategoryId: string;
  amount: number;
  currency: string;
  isPercentage: boolean;
  minAmount?: number;
  maxAmount?: number;
  calculationMethod: string;
  applicableConditions?: string;
  priority: number;
  active: boolean;
  validFrom: string;
  validTo?: string;
  metadata?: Record<string, unknown>;
  licenseProcessTypeId?: string;
  feeType?: string;
  baseAmount?: number;
}

export interface WrapperListProcessTypeFeeDTO {
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
  content: ProcessTypeFeeResponseDTO[];
}

export interface FeeCalculationResult {
  totalAmount: number;
  currency: string;
  breakdown: Array<{
    feeCategoryId: string;
    feeCategoryName: string;
    baseAmount: number;
    calculatedAmount: number;
    isPercentage: boolean;
    calculationMethod: string;
  }>;
  appliedConditions: string[];
}

export interface FeesByProcessTypeDTO {
  processTypeId: string;
  processTypeName: string;
  fees: ProcessTypeFeeResponseDTO[];
  totalAmount: number;
}

export interface FeeDuplicateCheckResult {
  isDuplicate: boolean;
  existingFeeId?: string;
  conflictReason?: string;
}

export interface FeeCalculationRequestDTO {
  processTypeId: string;
  quantity?: number;
  baseValue?: number;
  additionalParams?: Record<string, unknown>;
}

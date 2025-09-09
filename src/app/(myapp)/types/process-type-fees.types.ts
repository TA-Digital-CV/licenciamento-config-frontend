// Types for Process Type Fees API

export interface ProcessTypeFeeResponseDTO {
  id: string;
  licenseProcessTypeId: string;
  feeCategoryId: string;
  feeCategoryName?: string;
  feeType: 'FIXA' | 'VARIAVEL' | 'PERCENTUAL' | 'CALCULADA';
  baseAmount: number;
  minimumAmount?: number;
  maximumAmount?: number;
  calculationFormula?: string;
  currencyCode: string;
  taxRate?: number;
  discountRate?: number;
  validFrom: string;
  validUntil?: string;
  paymentTermDays: number;
  isRefundable: boolean;
  refundConditions?: string;
  exemptionCriteria?: string;
  priority: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, unknown>;
}

export interface ProcessTypeFeeRequestDTO {
  licenseProcessTypeId: string;
  feeCategoryId: string;
  feeType: 'FIXA' | 'VARIAVEL' | 'PERCENTUAL' | 'CALCULADA';
  baseAmount: number;
  minimumAmount?: number;
  maximumAmount?: number;
  calculationFormula?: string;
  currencyCode: string;
  taxRate?: number;
  discountRate?: number;
  validFrom: string;
  validUntil?: string;
  paymentTermDays: number;
  isRefundable: boolean;
  refundConditions?: string;
  exemptionCriteria?: string;
  priority: number;
  metadata?: Record<string, unknown>;
}

export interface ProcessTypeFeeCalculationRequestDTO {
  licenseProcessTypeId: string;
  baseValue?: number;
  calculationParameters?: Record<string, unknown>;
}

export interface ProcessTypeFeeCalculationResponseDTO {
  totalAmount: number;
  baseAmount: number;
  taxAmount: number;
  discountAmount: number;
  finalAmount: number;
  currencyCode: string;
  calculationDetails: Record<string, unknown>;
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
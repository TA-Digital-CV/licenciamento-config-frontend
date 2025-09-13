// Types for Fee Categories API

export interface FeeCategoryResponseDTO {
  id: string;
  name: string;
  description?: string;
  code: string;
  categoryType: string;
  baseAmount: number;
  currency: string;
  calculationMethod: string;
  isPercentage: boolean;
  minAmount?: number;
  maxAmount?: number;
  applicableToTypes: string[];
  active: boolean;
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface FeeCategoryRequestDTO {
  name: string;
  description?: string;
  code: string;
  categoryType: string;
  baseAmount: number;
  currency?: string;
  calculationMethod: string;
  isPercentage?: boolean;
  minAmount?: number;
  maxAmount?: number;
  applicableToTypes?: string[];
  active?: boolean;
  metadata?: Record<string, unknown>;
}

export interface WrapperListFeeCategoryDTO {
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
  content: FeeCategoryResponseDTO[];
}

export interface FeeCategoryCodeCheckDTO {
  exists: boolean;
}

// FeeCalculationResult e FeeCalculationRequestDTO são definidos em process-type-fees.types.ts
// para evitar duplicação de tipos

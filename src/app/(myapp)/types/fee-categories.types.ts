// Types for Fee Categories API

export interface FeeCategoryResponseDTO {
  id: string;
  name: string;
  description?: string;
  code: string;
  categoryType: 'ADMINISTRATIVA' | 'TECNICA' | 'AMBIENTAL' | 'SANITARIA' | 'SEGURANCA' | 'OUTRA';
  applicableScope: 'GERAL' | 'ESPECIFICA' | 'CONDICIONAL';
  baseAmount?: number;
  currencyCode?: string;
  calculationMethod: 'FIXA' | 'VARIAVEL' | 'PERCENTUAL' | 'FORMULA';
  isRecurring: boolean;
  recurringPeriod?: 'MENSAL' | 'TRIMESTRAL' | 'SEMESTRAL' | 'ANUAL';
  legalReference?: string;
  exemptionCriteria?: string;
  priority: number;
  parentCategoryId?: string;
  parentCategoryName?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, unknown>;
}

export interface FeeCategoryRequestDTO {
  name: string;
  description?: string;
  code: string;
  categoryType: 'ADMINISTRATIVA' | 'TECNICA' | 'AMBIENTAL' | 'SANITARIA' | 'SEGURANCA' | 'OUTRA';
  applicableScope: 'GERAL' | 'ESPECIFICA' | 'CONDICIONAL';
  baseAmount?: number;
  currencyCode?: string;
  calculationMethod: 'FIXA' | 'VARIAVEL' | 'PERCENTUAL' | 'FORMULA';
  isRecurring: boolean;
  recurringPeriod?: 'MENSAL' | 'TRIMESTRAL' | 'SEMESTRAL' | 'ANUAL';
  legalReference?: string;
  exemptionCriteria?: string;
  priority: number;
  parentCategoryId?: string;
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
// Mock data for Fee Associations based on T_PROCESS_TYPE_FEE and T_FEE_CATEGORY tables

// Fee Category interface based on T_FEE_CATEGORY
export interface FeeCategoryRecord {
  id: string;
  name: string;
  description?: string;
  code: string;
  parentCategoryId?: string;
  level: number;
  sortOrder: number;
  active: boolean;
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

// Process Type Fee interface based on T_PROCESS_TYPE_FEE
export interface ProcessTypeFeeRecord {
  id: string;
  processTypeId: string;
  processTypeName?: string; // For display purposes
  feeId: string;
  feeName?: string; // For display purposes
  feeCategoryId: string;
  feeCategoryName?: string; // For display purposes
  amount: number;
  currency: 'CVE' | 'EUR' | 'USD';
  feeType: 'FIXO' | 'PERCENTUAL' | 'VARIAVEL' | 'CONDICIONAL';
  calculationMethod: 'VALOR_FIXO' | 'PERCENTUAL_VALOR' | 'POR_UNIDADE' | 'ESCALONADO';
  minimumAmount?: number;
  maximumAmount?: number;
  percentage?: number;
  unitValue?: number;
  isRequired: boolean;
  isRefundable: boolean;
  paymentTiming: 'ANTECIPADO' | 'POSTERIOR' | 'PARCELADO' | 'CONDICIONAL';
  dueDate?: string;
  gracePeriodDays?: number;
  penaltyRate?: number;
  discountRate?: number;
  discountConditions?: string;
  exemptionCriteria?: string;
  status: 'ATIVO' | 'INATIVO' | 'SUSPENSO' | 'EM_REVISAO';
  priority: 'ALTA' | 'MEDIA' | 'BAIXA';
  effectiveDate: string;
  expirationDate?: string;
  legalBasis?: string;
  observations?: string;
  active: boolean;
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

// Mock Fee Categories
export const mockFeeCategories: FeeCategoryRecord[] = [
  {
    id: 'fc-001',
    name: 'Taxas Administrativas',
    description: 'Taxas relacionadas a processos administrativos',
    code: 'ADMIN',
    level: 1,
    sortOrder: 1,
    active: true,
    createdAt: '2025-01-15T08:00:00Z',
    updatedAt: '2025-01-15T08:00:00Z',
    createdBy: 'system',
    updatedBy: 'system',
  },
  {
    id: 'fc-002',
    name: 'Taxas de Análise',
    description: 'Taxas para análise técnica de processos',
    code: 'ANALISE',
    parentCategoryId: 'fc-001',
    level: 2,
    sortOrder: 1,
    active: true,
    createdAt: '2025-01-15T08:00:00Z',
    updatedAt: '2025-01-15T08:00:00Z',
    createdBy: 'system',
    updatedBy: 'system',
  },
  {
    id: 'fc-003',
    name: 'Taxas de Licenciamento',
    description: 'Taxas específicas para emissão de licenças',
    code: 'LICENC',
    level: 1,
    sortOrder: 2,
    active: true,
    createdAt: '2025-01-15T08:00:00Z',
    updatedAt: '2025-01-15T08:00:00Z',
    createdBy: 'system',
    updatedBy: 'system',
  },
  {
    id: 'fc-004',
    name: 'Taxas de Vistoria',
    description: 'Taxas para vistorias e inspeções',
    code: 'VISTORIA',
    parentCategoryId: 'fc-003',
    level: 2,
    sortOrder: 1,
    active: true,
    createdAt: '2025-01-15T08:00:00Z',
    updatedAt: '2025-01-15T08:00:00Z',
    createdBy: 'system',
    updatedBy: 'system',
  },
  {
    id: 'fc-005',
    name: 'Taxas de Renovação',
    description: 'Taxas para renovação de licenças',
    code: 'RENOV',
    level: 1,
    sortOrder: 3,
    active: true,
    createdAt: '2025-01-15T08:00:00Z',
    updatedAt: '2025-01-15T08:00:00Z',
    createdBy: 'system',
    updatedBy: 'system',
  },
];

// Mock Process Type Fees
export const mockProcessTypeFees: ProcessTypeFeeRecord[] = [
  {
    id: 'ptf-001',
    processTypeId: 'pt-001',
    processTypeName: 'Análise Documental',
    feeId: 'fee-001',
    feeName: 'Taxa de Análise Documental',
    feeCategoryId: 'fc-002',
    feeCategoryName: 'Taxas de Análise',
    amount: 5000,
    currency: 'CVE',
    feeType: 'FIXO',
    calculationMethod: 'VALOR_FIXO',
    isRequired: true,
    isRefundable: false,
    paymentTiming: 'ANTECIPADO',
    gracePeriodDays: 30,
    penaltyRate: 2.5,
    status: 'ATIVO',
    priority: 'ALTA',
    effectiveDate: '2025-01-01T00:00:00Z',
    legalBasis: 'Decreto-Lei nº 123/2025',
    active: true,
    createdAt: '2025-01-15T08:00:00Z',
    updatedAt: '2025-01-15T08:00:00Z',
    createdBy: 'admin',
    updatedBy: 'admin',
  },
  {
    id: 'ptf-002',
    processTypeId: 'pt-002',
    processTypeName: 'Vistoria Técnica',
    feeId: 'fee-002',
    feeName: 'Taxa de Vistoria',
    feeCategoryId: 'fc-004',
    feeCategoryName: 'Taxas de Vistoria',
    amount: 15000,
    currency: 'CVE',
    feeType: 'VARIAVEL',
    calculationMethod: 'POR_UNIDADE',
    unitValue: 15000,
    minimumAmount: 10000,
    maximumAmount: 50000,
    isRequired: true,
    isRefundable: true,
    paymentTiming: 'ANTECIPADO',
    gracePeriodDays: 15,
    penaltyRate: 3.0,
    discountRate: 10,
    discountConditions: 'Pagamento antecipado em 15 dias',
    status: 'ATIVO',
    priority: 'ALTA',
    effectiveDate: '2025-01-01T00:00:00Z',
    legalBasis: 'Portaria nº 456/2025',
    observations: 'Taxa varia conforme complexidade da vistoria',
    active: true,
    createdAt: '2025-01-15T08:00:00Z',
    updatedAt: '2025-02-01T10:30:00Z',
    createdBy: 'admin',
    updatedBy: 'supervisor',
  },
  {
    id: 'ptf-003',
    processTypeId: 'pt-003',
    processTypeName: 'Emissão de Licença',
    feeId: 'fee-003',
    feeName: 'Taxa de Licenciamento',
    feeCategoryId: 'fc-003',
    feeCategoryName: 'Taxas de Licenciamento',
    amount: 25000,
    currency: 'CVE',
    feeType: 'PERCENTUAL',
    calculationMethod: 'PERCENTUAL_VALOR',
    percentage: 2.5,
    minimumAmount: 20000,
    maximumAmount: 100000,
    isRequired: true,
    isRefundable: false,
    paymentTiming: 'POSTERIOR',
    dueDate: '2025-12-31T23:59:59Z',
    gracePeriodDays: 45,
    penaltyRate: 1.5,
    exemptionCriteria: 'Empresas com menos de 5 funcionários',
    status: 'ATIVO',
    priority: 'MEDIA',
    effectiveDate: '2025-01-01T00:00:00Z',
    expirationDate: '2025-12-31T23:59:59Z',
    legalBasis: 'Lei nº 789/2025',
    active: true,
    createdAt: '2025-01-15T08:00:00Z',
    updatedAt: '2025-01-15T08:00:00Z',
    createdBy: 'admin',
    updatedBy: 'admin',
  },
  {
    id: 'ptf-004',
    processTypeId: 'pt-004',
    processTypeName: 'Renovação de Licença',
    feeId: 'fee-004',
    feeName: 'Taxa de Renovação',
    feeCategoryId: 'fc-005',
    feeCategoryName: 'Taxas de Renovação',
    amount: 12500,
    currency: 'CVE',
    feeType: 'FIXO',
    calculationMethod: 'VALOR_FIXO',
    isRequired: true,
    isRefundable: false,
    paymentTiming: 'ANTECIPADO',
    gracePeriodDays: 60,
    penaltyRate: 2.0,
    discountRate: 15,
    discountConditions: 'Renovação antecipada (30 dias antes do vencimento)',
    status: 'ATIVO',
    priority: 'MEDIA',
    effectiveDate: '2025-01-01T00:00:00Z',
    legalBasis: 'Decreto-Lei nº 123/2025',
    active: true,
    createdAt: '2025-01-15T08:00:00Z',
    updatedAt: '2025-01-15T08:00:00Z',
    createdBy: 'admin',
    updatedBy: 'admin',
  },
  {
    id: 'ptf-005',
    processTypeId: 'pt-001',
    processTypeName: 'Análise Documental',
    feeId: 'fee-005',
    feeName: 'Taxa de Urgência',
    feeCategoryId: 'fc-002',
    feeCategoryName: 'Taxas de Análise',
    amount: 10000,
    currency: 'CVE',
    feeType: 'CONDICIONAL',
    calculationMethod: 'VALOR_FIXO',
    isRequired: false,
    isRefundable: true,
    paymentTiming: 'ANTECIPADO',
    gracePeriodDays: 7,
    penaltyRate: 5.0,
    status: 'ATIVO',
    priority: 'BAIXA',
    effectiveDate: '2025-01-01T00:00:00Z',
    legalBasis: 'Portaria nº 789/2025',
    observations: 'Aplicável apenas para processos urgentes',
    active: true,
    createdAt: '2025-01-15T08:00:00Z',
    updatedAt: '2025-01-15T08:00:00Z',
    createdBy: 'admin',
    updatedBy: 'admin',
  },
];

/* Shared in-memory mock data for Dossier Process Types API */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

// Based on T_LICENSE_TYPE_PROCESS_TYPE table from backend documentation
export type ProcessTypeAssociationRecord = {
  id: string;
  licenseTypeId: string;
  licenseTypeName?: string;
  processTypeId: string;
  processTypeName: string;
  processTypeCode?: string;
  processTypeDescription?: string;
  isRequired: boolean;
  executionOrder: number;
  estimatedDuration?: number; // in days
  durationUnit: 'DIAS' | 'SEMANAS' | 'MESES' | 'ANOS';
  prerequisites?: string;
  requiredDocuments?: string[];
  responsibleEntity?: string;
  cost?: number;
  costCurrency: 'CVE' | 'EUR' | 'USD';
  status: 'ATIVO' | 'INATIVO' | 'SUSPENSO' | 'EM_REVISAO';
  priority: 'ALTA' | 'MEDIA' | 'BAIXA';
  category: 'ADMINISTRATIVO' | 'TECNICO' | 'LEGAL' | 'FINANCEIRO' | 'OPERACIONAL';
  canBeParallel: boolean;
  requiresApproval: boolean;
  approvalLevel: 'TECNICO' | 'SUPERVISOR' | 'DIRETOR' | 'MINISTERIAL';
  validFrom?: string;
  validUntil?: string;
  notes?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
};

export const mockProcessTypeAssociations: ProcessTypeAssociationRecord[] = [
  {
    id: '1',
    licenseTypeId: '100',
    licenseTypeName: 'Licença de Hotelaria',
    processTypeId: 'PT001',
    processTypeName: 'Análise de Viabilidade Técnica',
    processTypeCode: 'AVT',
    processTypeDescription: 'Avaliação técnica das condições do estabelecimento hoteleiro',
    isRequired: true,
    executionOrder: 1,
    estimatedDuration: 15,
    durationUnit: 'DIAS',
    prerequisites: 'Apresentação do projeto arquitetónico',
    requiredDocuments: [
      'Projeto arquitetónico',
      'Planta de localização',
      'Certificado de propriedade',
      'Estudo de impacto ambiental'
    ],
    responsibleEntity: 'Direção Geral do Turismo',
    cost: 25000,
    costCurrency: 'CVE',
    status: 'ATIVO',
    priority: 'ALTA',
    category: 'TECNICO',
    canBeParallel: false,
    requiresApproval: true,
    approvalLevel: 'DIRETOR',
    validFrom: '2024-01-01',
    validUntil: undefined,
    notes: 'Processo obrigatório para todos os estabelecimentos hoteleiros',
    active: true,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
    createdBy: 'admin',
    updatedBy: 'admin'
  },
  {
    id: '2',
    licenseTypeId: '100',
    licenseTypeName: 'Licença de Hotelaria',
    processTypeId: 'PT002',
    processTypeName: 'Inspeção Sanitária',
    processTypeCode: 'IS',
    processTypeDescription: 'Verificação das condições sanitárias do estabelecimento',
    isRequired: true,
    executionOrder: 2,
    estimatedDuration: 7,
    durationUnit: 'DIAS',
    prerequisites: 'Conclusão da análise de viabilidade técnica',
    requiredDocuments: [
      'Certificado de análise de água',
      'Plano de higiene e segurança alimentar',
      'Certificado de desinfestação'
    ],
    responsibleEntity: 'Ministério da Saúde',
    cost: 15000,
    costCurrency: 'CVE',
    status: 'ATIVO',
    priority: 'ALTA',
    category: 'TECNICO',
    canBeParallel: true,
    requiresApproval: true,
    approvalLevel: 'TECNICO',
    validFrom: '2024-01-01',
    validUntil: undefined,
    notes: 'Inspeção obrigatória antes da emissão da licença',
    active: true,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
    createdBy: 'admin',
    updatedBy: 'admin'
  },
  {
    id: '3',
    licenseTypeId: '100',
    licenseTypeName: 'Licença de Hotelaria',
    processTypeId: 'PT003',
    processTypeName: 'Verificação de Segurança',
    processTypeCode: 'VS',
    processTypeDescription: 'Avaliação dos sistemas de segurança e proteção civil',
    isRequired: true,
    executionOrder: 3,
    estimatedDuration: 10,
    durationUnit: 'DIAS',
    prerequisites: 'Instalação dos sistemas de segurança',
    requiredDocuments: [
      'Certificado de instalação elétrica',
      'Plano de evacuação',
      'Certificado de sistemas de incêndio',
      'Seguro de responsabilidade civil'
    ],
    responsibleEntity: 'Proteção Civil',
    cost: 20000,
    costCurrency: 'CVE',
    status: 'ATIVO',
    priority: 'ALTA',
    category: 'TECNICO',
    canBeParallel: true,
    requiresApproval: true,
    approvalLevel: 'SUPERVISOR',
    validFrom: '2024-01-01',
    validUntil: undefined,
    notes: 'Verificação obrigatória dos sistemas de segurança',
    active: true,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
    createdBy: 'admin',
    updatedBy: 'admin'
  },
  {
    id: '4',
    licenseTypeId: '101',
    licenseTypeName: 'Licença de Restaurante',
    processTypeId: 'PT004',
    processTypeName: 'Análise Sanitária',
    processTypeCode: 'AS',
    processTypeDescription: 'Verificação das condições sanitárias do restaurante',
    isRequired: true,
    executionOrder: 1,
    estimatedDuration: 5,
    durationUnit: 'DIAS',
    prerequisites: 'Instalação da cozinha e equipamentos',
    requiredDocuments: [
      'Certificado de formação em higiene alimentar',
      'Plano HACCP',
      'Certificado de análise de água'
    ],
    responsibleEntity: 'Ministério da Saúde',
    cost: 10000,
    costCurrency: 'CVE',
    status: 'ATIVO',
    priority: 'ALTA',
    category: 'TECNICO',
    canBeParallel: false,
    requiresApproval: true,
    approvalLevel: 'TECNICO',
    validFrom: '2024-01-01',
    validUntil: undefined,
    notes: 'Processo fundamental para licenciamento de restaurantes',
    active: true,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
    createdBy: 'admin',
    updatedBy: 'admin'
  },
  {
    id: '5',
    licenseTypeId: '101',
    licenseTypeName: 'Licença de Restaurante',
    processTypeId: 'PT005',
    processTypeName: 'Licenciamento Municipal',
    processTypeCode: 'LM',
    processTypeDescription: 'Obtenção da licença municipal de funcionamento',
    isRequired: true,
    executionOrder: 2,
    estimatedDuration: 12,
    durationUnit: 'DIAS',
    prerequisites: 'Aprovação da análise sanitária',
    requiredDocuments: [
      'Certidão de registo comercial',
      'Comprovativo de pagamento de taxas',
      'Planta do estabelecimento'
    ],
    responsibleEntity: 'Câmara Municipal',
    cost: 8000,
    costCurrency: 'CVE',
    status: 'ATIVO',
    priority: 'MEDIA',
    category: 'ADMINISTRATIVO',
    canBeParallel: false,
    requiresApproval: true,
    approvalLevel: 'SUPERVISOR',
    validFrom: '2024-01-01',
    validUntil: undefined,
    notes: 'Licença municipal obrigatória',
    active: true,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
    createdBy: 'admin',
    updatedBy: 'admin'
  },
  {
    id: '6',
    licenseTypeId: '102',
    licenseTypeName: 'Licença de Transporte Urbano',
    processTypeId: 'PT006',
    processTypeName: 'Inspeção Técnica de Veículos',
    processTypeCode: 'ITV',
    processTypeDescription: 'Verificação técnica dos veículos de transporte',
    isRequired: true,
    executionOrder: 1,
    estimatedDuration: 3,
    durationUnit: 'DIAS',
    prerequisites: 'Apresentação dos veículos',
    requiredDocuments: [
      'Certificado de matrícula',
      'Seguro automóvel',
      'Certificado de inspeção técnica'
    ],
    responsibleEntity: 'Direção Geral dos Transportes',
    cost: 5000,
    costCurrency: 'CVE',
    status: 'ATIVO',
    priority: 'ALTA',
    category: 'TECNICO',
    canBeParallel: false,
    requiresApproval: true,
    approvalLevel: 'TECNICO',
    validFrom: '2024-01-01',
    validUntil: undefined,
    notes: 'Inspeção obrigatória para todos os veículos',
    active: true,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
    createdBy: 'admin',
    updatedBy: 'admin'
  }
];
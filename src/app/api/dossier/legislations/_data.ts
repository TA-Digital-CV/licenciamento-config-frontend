/* Shared in-memory mock data for Dossier Legislations API */

// Based on T_LEGISLATION table from backend documentation
export type LegislationRecord = {
  id: string;
  licenseTypeId: string;
  licenseTypeName?: string;
  legislationType: 'LEI' | 'DECRETO' | 'PORTARIA' | 'RESOLUCAO' | 'INSTRUCAO_NORMATIVA' | 'OUTRO';
  legislationNumber: string;
  legislationYear: number;
  title: string;
  description?: string;
  publicationDate: string;
  effectiveDate: string;
  expirationDate?: string;
  issuingAuthority: string;
  officialUrl?: string;
  documentPath?: string;
  status: 'VIGENTE' | 'REVOGADA' | 'SUSPENSA' | 'EM_TRAMITACAO';
  priority: 'ALTA' | 'MEDIA' | 'BAIXA';
  tags?: string[];
  relatedLegislations?: string[]; // IDs of related legislations
  active: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
};

export const mockLegislations: LegislationRecord[] = [
  {
    id: '1',
    licenseTypeId: '100',
    licenseTypeName: 'Licença de Hotelaria',
    legislationType: 'LEI',
    legislationNumber: '12.345',
    legislationYear: 2020,
    title: 'Lei de Regulamentação Hoteleira',
    description: 'Estabelece normas para funcionamento de estabelecimentos hoteleiros',
    publicationDate: '2020-03-15',
    effectiveDate: '2020-06-15',
    expirationDate: undefined,
    issuingAuthority: 'Assembleia Nacional',
    officialUrl: 'https://www.governo.cv/legislacao/lei-12345-2020',
    documentPath: '/documents/lei-12345-2020.pdf',
    status: 'VIGENTE',
    priority: 'ALTA',
    tags: ['hotelaria', 'turismo', 'licenciamento'],
    relatedLegislations: ['2'],
    active: true,
    createdAt: '2025-01-15T10:00:00Z',
    updatedAt: '2025-01-15T10:00:00Z',
    createdBy: 'admin',
    updatedBy: 'admin',
  },
  {
    id: '2',
    licenseTypeId: '100',
    licenseTypeName: 'Licença de Hotelaria',
    legislationType: 'DECRETO',
    legislationNumber: '45',
    legislationYear: 2021,
    title: 'Decreto Regulamentar de Hotelaria',
    description: 'Regulamenta a aplicação da Lei de Regulamentação Hoteleira',
    publicationDate: '2021-01-20',
    effectiveDate: '2021-02-01',
    expirationDate: undefined,
    issuingAuthority: 'Governo de Cabo Verde',
    officialUrl: 'https://www.governo.cv/legislacao/decreto-45-2021',
    documentPath: '/documents/decreto-45-2021.pdf',
    status: 'VIGENTE',
    priority: 'ALTA',
    tags: ['hotelaria', 'regulamentacao', 'decreto'],
    relatedLegislations: ['1'],
    active: true,
    createdAt: '2025-01-15T10:00:00Z',
    updatedAt: '2025-01-15T10:00:00Z',
    createdBy: 'admin',
    updatedBy: 'admin',
  },
  {
    id: '3',
    licenseTypeId: '101',
    licenseTypeName: 'Licença de Restaurante',
    legislationType: 'PORTARIA',
    legislationNumber: '123',
    legislationYear: 2022,
    title: 'Portaria de Normas Sanitárias para Restaurantes',
    description: 'Define normas sanitárias obrigatórias para estabelecimentos de restauração',
    publicationDate: '2022-05-10',
    effectiveDate: '2022-07-01',
    expirationDate: undefined,
    issuingAuthority: 'Ministério da Saúde',
    officialUrl: 'https://www.minsaude.gov.cv/portaria-123-2022',
    documentPath: '/documents/portaria-123-2022.pdf',
    status: 'VIGENTE',
    priority: 'ALTA',
    tags: ['restauracao', 'saude', 'normas-sanitarias'],
    relatedLegislations: [],
    active: true,
    createdAt: '2025-01-15T10:00:00Z',
    updatedAt: '2025-01-15T10:00:00Z',
    createdBy: 'admin',
    updatedBy: 'admin',
  },
  {
    id: '4',
    licenseTypeId: '102',
    licenseTypeName: 'Licença de Transporte Urbano',
    legislationType: 'RESOLUCAO',
    legislationNumber: '78',
    legislationYear: 2023,
    title: 'Resolução sobre Transporte Urbano Sustentável',
    description: 'Estabelece diretrizes para transporte urbano sustentável',
    publicationDate: '2023-02-28',
    effectiveDate: '2023-04-01',
    expirationDate: '2028-04-01',
    issuingAuthority: 'Conselho de Ministros',
    officialUrl: 'https://www.governo.cv/resolucao-78-2023',
    documentPath: '/documents/resolucao-78-2023.pdf',
    status: 'VIGENTE',
    priority: 'MEDIA',
    tags: ['transporte', 'sustentabilidade', 'urbano'],
    relatedLegislations: [],
    active: true,
    createdAt: '2025-01-15T10:00:00Z',
    updatedAt: '2025-01-15T10:00:00Z',
    createdBy: 'admin',
    updatedBy: 'admin',
  },
  {
    id: '5',
    licenseTypeId: '101',
    licenseTypeName: 'Licença de Restaurante',
    legislationType: 'INSTRUCAO_NORMATIVA',
    legislationNumber: '15',
    legislationYear: 2019,
    title: 'Instrução Normativa sobre Segurança Alimentar',
    description: 'Normas técnicas para segurança alimentar em estabelecimentos de restauração',
    publicationDate: '2019-11-15',
    effectiveDate: '2020-01-01',
    expirationDate: undefined,
    issuingAuthority: 'ARFA - Agência de Regulação e Fiscalização Alimentar',
    officialUrl: 'https://www.arfa.cv/instrucao-15-2019',
    documentPath: '/documents/instrucao-15-2019.pdf',
    status: 'VIGENTE',
    priority: 'ALTA',
    tags: ['seguranca-alimentar', 'restauracao', 'normas-tecnicas'],
    relatedLegislations: ['3'],
    active: true,
    createdAt: '2025-01-15T10:00:00Z',
    updatedAt: '2025-01-15T10:00:00Z',
    createdBy: 'admin',
    updatedBy: 'admin',
  },
];

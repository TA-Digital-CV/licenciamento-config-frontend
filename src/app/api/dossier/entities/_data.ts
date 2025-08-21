/* Shared in-memory mock data for Dossier Entities API */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

// Based on T_ENTITY_CONTACT table from backend documentation
export type EntityContactRecord = {
  id: string;
  entityId: string;
  contactType: 'TELEFONE' | 'EMAIL' | 'FAX' | 'WEBSITE' | 'ENDERECO' | 'OUTRO';
  contactValue: string;
  description?: string;
  isPrimary: boolean;
  isPublic: boolean;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

// Based on T_ENTITY table from backend documentation
export type EntityRecord = {
  id: string;
  licenseTypeId: string;
  licenseTypeName?: string;
  entityName: string;
  entityType: 'PUBLICA' | 'PRIVADA' | 'MISTA' | 'ONG' | 'INTERNACIONAL';
  entityCategory: 'REGULADORA' | 'FISCALIZADORA' | 'CONSULTIVA' | 'EXECUTIVA' | 'APOIO';
  description?: string;
  legalFramework?: string;
  jurisdiction: 'NACIONAL' | 'REGIONAL' | 'LOCAL' | 'INTERNACIONAL';
  parentEntityId?: string;
  parentEntityName?: string;
  responsiblePerson?: string;
  establishmentDate?: string;
  website?: string;
  logoUrl?: string;
  status: 'ATIVA' | 'INATIVA' | 'SUSPENSA' | 'EM_REESTRUTURACAO';
  priority: 'ALTA' | 'MEDIA' | 'BAIXA';
  contacts: EntityContactRecord[];
  active: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
};

export const mockEntityContacts: EntityContactRecord[] = [
  {
    id: '1',
    entityId: '1',
    contactType: 'TELEFONE',
    contactValue: '+238 260 1234',
    description: 'Telefone principal',
    isPrimary: true,
    isPublic: true,
    active: true,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    entityId: '1',
    contactType: 'EMAIL',
    contactValue: 'info@turismo.gov.cv',
    description: 'Email institucional',
    isPrimary: true,
    isPublic: true,
    active: true,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '3',
    entityId: '2',
    contactType: 'TELEFONE',
    contactValue: '+238 261 5678',
    description: 'Linha direta',
    isPrimary: true,
    isPublic: true,
    active: true,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '4',
    entityId: '2',
    contactType: 'EMAIL',
    contactValue: 'contacto@saude.gov.cv',
    description: 'Email oficial',
    isPrimary: true,
    isPublic: true,
    active: true,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '5',
    entityId: '3',
    contactType: 'TELEFONE',
    contactValue: '+238 262 9999',
    description: 'Central telefónica',
    isPrimary: true,
    isPublic: true,
    active: true,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  }
];

export const mockEntities: EntityRecord[] = [
  {
    id: '1',
    licenseTypeId: '100',
    licenseTypeName: 'Licença de Hotelaria',
    entityName: 'Direção Geral do Turismo',
    entityType: 'PUBLICA',
    entityCategory: 'REGULADORA',
    description: 'Órgão responsável pela regulamentação e fiscalização do setor turístico',
    legalFramework: 'Decreto-Lei nº 12/2018',
    jurisdiction: 'NACIONAL',
    parentEntityId: undefined,
    parentEntityName: undefined,
    responsiblePerson: 'Dr. João Silva',
    establishmentDate: '2018-03-15',
    website: 'https://www.turismo.gov.cv',
    logoUrl: '/logos/dgt-logo.png',
    status: 'ATIVA',
    priority: 'ALTA',
    contacts: mockEntityContacts.filter(c => c.entityId === '1'),
    active: true,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
    createdBy: 'admin',
    updatedBy: 'admin'
  },
  {
    id: '2',
    licenseTypeId: '101',
    licenseTypeName: 'Licença de Restaurante',
    entityName: 'Ministério da Saúde e Segurança Social',
    entityType: 'PUBLICA',
    entityCategory: 'FISCALIZADORA',
    description: 'Responsável pela fiscalização sanitária de estabelecimentos de restauração',
    legalFramework: 'Lei nº 102/VII/2010',
    jurisdiction: 'NACIONAL',
    parentEntityId: undefined,
    parentEntityName: undefined,
    responsiblePerson: 'Dra. Maria Santos',
    establishmentDate: '2010-12-20',
    website: 'https://www.mss.gov.cv',
    logoUrl: '/logos/mss-logo.png',
    status: 'ATIVA',
    priority: 'ALTA',
    contacts: mockEntityContacts.filter(c => c.entityId === '2'),
    active: true,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
    createdBy: 'admin',
    updatedBy: 'admin'
  },
  {
    id: '3',
    licenseTypeId: '102',
    licenseTypeName: 'Licença de Transporte Urbano',
    entityName: 'Direção Geral dos Transportes Terrestres',
    entityType: 'PUBLICA',
    entityCategory: 'REGULADORA',
    description: 'Entidade reguladora do transporte terrestre nacional',
    legalFramework: 'Decreto-Lei nº 25/2019',
    jurisdiction: 'NACIONAL',
    parentEntityId: undefined,
    parentEntityName: undefined,
    responsiblePerson: 'Eng. Carlos Mendes',
    establishmentDate: '2019-06-10',
    website: 'https://www.dgtt.gov.cv',
    logoUrl: '/logos/dgtt-logo.png',
    status: 'ATIVA',
    priority: 'ALTA',
    contacts: mockEntityContacts.filter(c => c.entityId === '3'),
    active: true,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
    createdBy: 'admin',
    updatedBy: 'admin'
  },
  {
    id: '4',
    licenseTypeId: '100',
    licenseTypeName: 'Licença de Hotelaria',
    entityName: 'Câmara Municipal da Praia',
    entityType: 'PUBLICA',
    entityCategory: 'EXECUTIVA',
    description: 'Autoridade municipal responsável pelo licenciamento local',
    legalFramework: 'Lei das Autarquias Locais',
    jurisdiction: 'LOCAL',
    parentEntityId: undefined,
    parentEntityName: undefined,
    responsiblePerson: 'Dr. António Tavares',
    establishmentDate: '1991-07-29',
    website: 'https://www.cmpraia.cv',
    logoUrl: '/logos/cmp-logo.png',
    status: 'ATIVA',
    priority: 'MEDIA',
    contacts: [],
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
    entityName: 'Associação de Restauração de Cabo Verde',
    entityType: 'PRIVADA',
    entityCategory: 'CONSULTIVA',
    description: 'Associação representativa do setor da restauração',
    legalFramework: 'Estatutos aprovados em 2015',
    jurisdiction: 'NACIONAL',
    parentEntityId: undefined,
    parentEntityName: undefined,
    responsiblePerson: 'Sr. Manuel Rodrigues',
    establishmentDate: '2015-04-22',
    website: 'https://www.arcv.org',
    logoUrl: '/logos/arcv-logo.png',
    status: 'ATIVA',
    priority: 'BAIXA',
    contacts: [],
    active: true,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
    createdBy: 'admin',
    updatedBy: 'admin'
  }
];
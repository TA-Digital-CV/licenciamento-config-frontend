// Types for Entities API

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

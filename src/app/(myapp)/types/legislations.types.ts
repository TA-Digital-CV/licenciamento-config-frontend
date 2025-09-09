// Types for Legislations API

export interface LegislationResponseDTO {
  id: string;
  title: string;
  description?: string;
  legislationType: string;
  publicationDate: string;
  effectiveDate: string;
  expirationDate?: string;
  documentNumber: string;
  issuingAuthority: string;
  legalFramework?: string;
  scope: string;
  status: 'VIGENTE' | 'REVOGADA' | 'SUSPENSA' | 'EM_TRAMITACAO';
  priority: 'ALTA' | 'MEDIA' | 'BAIXA';
  documentUrl?: string;
  relatedLegislationIds?: string[];
  tags?: string[];
  active: boolean;
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, unknown>;
}

export interface LegislationRequestDTO {
  title: string;
  description?: string;
  legislationType: string;
  publicationDate: string;
  effectiveDate: string;
  expirationDate?: string;
  documentNumber: string;
  issuingAuthority: string;
  legalFramework?: string;
  scope: string;
  status: 'VIGENTE' | 'REVOGADA' | 'SUSPENSA' | 'EM_TRAMITACAO';
  priority: 'ALTA' | 'MEDIA' | 'BAIXA';
  documentUrl?: string;
  relatedLegislationIds?: string[];
  tags?: string[];
  metadata?: Record<string, unknown>;
}

export interface WrapperListLegislationDTO {
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
  content: LegislationResponseDTO[];
}
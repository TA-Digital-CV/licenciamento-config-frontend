// Types for Options API

export interface OptionResponseDTO {
  id: string;
  ccode: string;
  ckey: string;
  cvalue: string;
  locale: string;
  sort_order: number | null;
  active?: boolean;
  description?: string;
  metadata?: Record<string, unknown> | null;
}

export interface OptionRequestDTO {
  ccode: string;
  ckey: string;
  cvalue: string;
  locale: string;
  sortOrder: number;
  active?: boolean;
  description?: string;
  metadata?: Record<string, unknown> | null;
  [key: string]: unknown;
}

export interface WrapperListOptionsDTO {
  data: any;
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
  content: OptionResponseDTO[];
}

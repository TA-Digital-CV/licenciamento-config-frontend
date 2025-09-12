/* eslint-disable @typescript-eslint/no-explicit-any */
import { OptionResponseDTO, OptionRequestDTO, WrapperListOptionsDTO } from '../types';
import { 
  LegislationResponseDTO, 
  LegislationRequestDTO, 
  WrapperListLegislationDTO 
} from '../types/legislations.types';

// Tipos para respostas da API
export interface ApiResponse<T = any> {
  data: T;
  success: boolean;
  message?: string;
}

export interface ApiError {
  message: string;
  status?: number;
  details?: any;
}

// Configuração base para fetch
const defaultHeaders = {
  'Content-Type': 'application/json',
};

// Função utilitária para fazer requests HTTP
const apiRequest = async <T>(
  url: string,
  options: RequestInit = {},
  signal?: AbortSignal,
): Promise<T> => {
  const config: RequestInit = {
    headers: { ...defaultHeaders, ...options.headers },
    signal,
    ...options,
  };

  const response = await fetch(url, config);

  if (!response.ok) {
    const errorText = await response.text();
    throw {
      message: errorText || `HTTP ${response.status}: ${response.statusText}`,
      status: response.status,
    };
  }

  return response.json();
};

// === FUNÇÕES PARA OPTIONS ===

/**
 * Carrega uma opção por ID
 */
export const loadOptionById = async (
  id: string,
  signal?: AbortSignal,
): Promise<OptionResponseDTO> => {
  const url = `/api/options/${encodeURIComponent(id)}`;
  return apiRequest<OptionResponseDTO>(url, {}, signal);
};

/**
 * Carrega opções por código
 */
export const loadOptionsByCode = async (
  ccode: string,
  signal?: AbortSignal,
): Promise<OptionResponseDTO[]> => {
  const url = `/api/options?ccode=${encodeURIComponent(ccode)}`;
  const response = await apiRequest<WrapperListOptionsDTO>(url, {}, signal);
  return response.content || [];
};

/**
 * Carrega opções ativas por código
 */
export const loadActiveOptionsByCode = async (
  ccode: string,
  signal?: AbortSignal,
): Promise<OptionResponseDTO[]> => {
  const url = `/api/options?ccode=${encodeURIComponent(ccode)}&active=true`;
  const response = await apiRequest<WrapperListOptionsDTO>(url, {}, signal);
  return response.content || [];
};

/**
 * Verifica se um código de opção já existe
 */
export const checkOptionCodeExists = async (
  ccode: string,
  signal?: AbortSignal,
): Promise<{ exists: boolean }> => {
  const url = `/api/options?ccode=${encodeURIComponent(ccode)}&action=existsByCcode`;
  return apiRequest<{ exists: boolean }>(url, {}, signal);
};

/**
 * Cria uma nova opção
 */
export const createOption = async (
  option: OptionRequestDTO,
  signal?: AbortSignal,
): Promise<OptionResponseDTO> => {
  return apiRequest<OptionResponseDTO>(
    '/api/options',
    {
      method: 'POST',
      body: JSON.stringify(option),
    },
    signal,
  );
};

/**
 * Cria múltiplas opções
 */
export const createMultipleOptions = async (
  options: OptionRequestDTO[],
  signal?: AbortSignal,
): Promise<OptionResponseDTO[]> => {
  const results: OptionResponseDTO[] = [];

  for (const option of options) {
    const result = await createOption(option, signal);
    results.push(result);
  }

  return results;
};

/**
 * Atualiza uma opção por ID
 */
export const updateOptionById = async (
  id: string,
  option: OptionRequestDTO,
  signal?: AbortSignal,
): Promise<OptionResponseDTO> => {
  const url = `/api/options/${encodeURIComponent(id)}`;
  return apiRequest<OptionResponseDTO>(
    url,
    {
      method: 'PUT',
      body: JSON.stringify(option),
    },
    signal,
  );
};

/**
 * Atualiza opções por código
 */
export const updateOptionsByCode = async (
  ccode: string,
  options: OptionRequestDTO[],
  signal?: AbortSignal,
): Promise<void> => {
  const url = `/api/options/by-code/${encodeURIComponent(ccode)}`;
  return apiRequest<void>(
    url,
    {
      method: 'PUT',
      body: JSON.stringify(options),
    },
    signal,
  );
};

// === FUNÇÕES PARA CATEGORIES ===

/**
 * Carrega categorias ativas
 */
export const loadActiveCategories = async (
  signal?: AbortSignal,
): Promise<{ value: string; label: string }[]> => {
  const data = await apiRequest<{ content: any[] }>('/api/categories?active=true', {}, signal);
  return (data.content || []).map((c: any) => ({ value: c.id, label: c.name }));
};

// === FUNÇÕES PARA LICENCE TYPES ===

/**
 * Carrega um tipo de licença por ID
 */
export const loadLicenceTypeById = async (id: string, signal?: AbortSignal): Promise<any> => {
  const url = `/api/licence-types/${id}`;
  return apiRequest<any>(url, {}, signal);
};

/**
 * Cria um novo tipo de licença
 */
export const createLicenceType = async (licenceType: any, signal?: AbortSignal): Promise<any> => {
  return apiRequest<any>(
    '/api/licence-types',
    {
      method: 'POST',
      body: JSON.stringify(licenceType),
    },
    signal,
  );
};

/**
 * Atualiza um tipo de licença
 */
export const updateLicenceType = async (
  id: string,
  licenceType: any,
  signal?: AbortSignal,
): Promise<any> => {
  const url = `/api/licence-types/${id}`;
  return apiRequest<any>(
    url,
    {
      method: 'PUT',
      body: JSON.stringify(licenceType),
    },
    signal,
  );
};

// === FUNÇÕES UTILITÁRIAS ===

/**
 * Transforma OptionResponseDTO em formato para formulário
 */
export const transformOptionToFormItem = (option: OptionResponseDTO) => ({
  ckey: option.ckey || '',
  cvalue: option.cvalue || '',
  locale: option.locale || 'pt-CV',
  sortOrder: option.sort_order || 0,
  active: option.active !== false,
  metadata:
    typeof option.metadata === 'string'
      ? option.metadata
      : option.metadata
        ? JSON.stringify(option.metadata)
        : '',
  description: option.description || '',
});

/**
 * Transforma item do formulário em OptionRequestDTO
 */
export const transformFormItemToOption = (item: any, ccode: string): OptionRequestDTO => ({
  ccode,
  ckey: item.ckey.trim(),
  cvalue: item.cvalue.trim(),
  locale: item.locale || 'pt-CV',
  sortOrder: item.sortOrder ?? 0,
  active: item.active !== false,
  description: item.description || '',
  metadata: (() => {
    try {
      return item.metadata ? JSON.parse(item.metadata) : null;
    } catch {
      return item.metadata || null;
    }
  })(),
});

/**
 * Transforma dados da API para formato do formulário de licence type
 */
export const transformLicenceTypeToForm = (data: any) => ({
  name: data.name ?? '',
  description: data.description ?? '',
  code: data.code ?? '',
  categoryId: data.categoryId ?? '',
  licensingModelKey: data.licensingModel || '',
  validityPeriod: data.validityPeriod ?? undefined,
  validityUnitKey: data.validityUnit || '',
  renewable: data.renewable !== false,
  autoRenewal: data.autoRenewal === true,
  requiresInspection: data.requiresInspection === true,
  requiresPublicConsultation: data.requiresPublicConsultation === true,
  maxProcessingDays: data.maxProcessingDays ?? undefined,
  hasFees: data.hasFees === true,
  baseFee: data.baseFee ?? undefined,
  currencyCode: data.currencyCode || 'CVE',
  sortOrder: data.sortOrder ?? undefined,
  active: data.active !== false,
  metadata: typeof data.metadata === 'string' ? data.metadata : JSON.stringify(data.metadata ?? ''),
});

/**
 * Transforma dados do formulário para payload da API de licence type
 */
export const transformFormToLicenceType = (values: any) => ({
  name: values.name,
  description: values.description || '',
  code: values.code,
  categoryId: values.categoryId,
  licensingModelKey: values.licensingModelKey,
  validityPeriod: values.validityPeriod,
  validityUnitKey: values.validityUnitKey,
  renewable: values.renewable !== false,
  autoRenewal: values.autoRenewal === true,
  requiresInspection: values.requiresInspection === true,
  requiresPublicConsultation: values.requiresPublicConsultation === true,
  maxProcessingDays: values.maxProcessingDays,
  hasFees: values.hasFees === true,
  baseFee: values.baseFee,
  currencyCode: values.currencyCode,
  sortOrder: values.sortOrder,
  active: values.active !== false,
  metadata: (() => {
    try {
      return values.metadata ? JSON.parse(values.metadata) : null;
    } catch {
      return values.metadata || null;
    }
  })(),
});

/**
 * Transforma opções da API em formato para select
 */
export const transformOptionsToSelectItems = (data: any[]): { value: string; label: string }[] => {
  return (Array.isArray(data) ? data : []).map((it: any) => ({
    value: it.ckey ?? it.key,
    label: it.cvalue ?? it.value,
  }));
};

// === FUNÇÕES PARA LEGISLATIONS ===

/**
 * Carrega lista paginada de legislações
 */
export const loadLegislations = async (
  filters: {
    name?: string;
    legislationType?: string;
    licenseTypeId?: string;
    active?: boolean;
    pageNumber?: number;
    pageSize?: number;
  } = {},
  signal?: AbortSignal,
): Promise<WrapperListLegislationDTO> => {
  const params = new URLSearchParams();
  
  if (filters.name) params.append('name', filters.name);
  if (filters.legislationType) params.append('legislationType', filters.legislationType);
  if (filters.licenseTypeId) params.append('licenseTypeId', filters.licenseTypeId);
  if (filters.active !== undefined) params.append('active', filters.active.toString());
  if (filters.pageNumber !== undefined) params.append('pageNumber', filters.pageNumber.toString());
  if (filters.pageSize !== undefined) params.append('pageSize', filters.pageSize.toString());
  
  const url = `/api/legislations${params.toString() ? `?${params.toString()}` : ''}`;
  return apiRequest<WrapperListLegislationDTO>(url, {}, signal);
};

/**
 * Carrega legislação por ID
 */
export const loadLegislationById = async (
  id: string,
  signal?: AbortSignal,
): Promise<LegislationResponseDTO> => {
  const url = `/api/legislations/${encodeURIComponent(id)}`;
  return apiRequest<LegislationResponseDTO>(url, {}, signal);
};

/**
 * Cria nova legislação
 */
export const createLegislation = async (
  data: LegislationRequestDTO,
  signal?: AbortSignal,
): Promise<LegislationResponseDTO> => {
  return apiRequest<LegislationResponseDTO>(
    '/api/legislations',
    {
      method: 'POST',
      body: JSON.stringify(data),
    },
    signal,
  );
};

/**
 * Atualiza legislação existente
 */
export const updateLegislation = async (
  id: string,
  data: LegislationRequestDTO,
  signal?: AbortSignal,
): Promise<LegislationResponseDTO> => {
  const url = `/api/legislations/${encodeURIComponent(id)}`;
  return apiRequest<LegislationResponseDTO>(
    url,
    {
      method: 'PUT',
      body: JSON.stringify(data),
    },
    signal,
  );
};

/**
 * Remove legislação
 */
export const deleteLegislation = async (
  id: string,
  signal?: AbortSignal,
): Promise<void> => {
  const url = `/api/legislations/${encodeURIComponent(id)}`;
  return apiRequest<void>(
    url,
    {
      method: 'DELETE',
    },
    signal,
  );
};

/**
 * Ativa/desativa legislação
 */
export const toggleLegislationStatus = async (
  id: string,
  action: 'activate' | 'deactivate',
  signal?: AbortSignal,
): Promise<string> => {
  const url = `/api/legislations/${encodeURIComponent(id)}`;
  const response = await apiRequest<{ message: string }>(
    url,
    {
      method: 'PATCH',
      body: JSON.stringify({ action }),
    },
    signal,
  );
  return response.message || 'Status atualizado com sucesso';
};

/**
 * Transforma dados da API para formato do formulário de legislação
 */
export const transformLegislationToForm = (data: LegislationResponseDTO) => ({
  title: data.title ?? '',
  description: data.description ?? '',
  legislationType: data.legislationType ?? '',
  publicationDate: data.publicationDate ?? '',
  effectiveDate: data.effectiveDate ?? '',
  expirationDate: data.expirationDate ?? '',
  documentNumber: data.documentNumber ?? '',
  issuingAuthority: data.issuingAuthority ?? '',
  legalFramework: data.legalFramework ?? '',
  scope: data.scope ?? '',
  status: data.status ?? 'EM_TRAMITACAO',
  priority: data.priority ?? 'MEDIA',
  documentUrl: data.documentUrl ?? '',
  relatedLegislationIds: data.relatedLegislationIds ?? [],
  tags: data.tags ?? [],
  active: data.active !== false,
  metadata: typeof data.metadata === 'string' ? data.metadata : JSON.stringify(data.metadata ?? ''),
});

/**
 * Transforma dados do formulário para payload da API de legislação
 */
export const transformFormToLegislation = (values: any): LegislationRequestDTO => ({
  title: values.title,
  description: values.description || '',
  legislationType: values.legislationType,
  publicationDate: values.publicationDate,
  effectiveDate: values.effectiveDate,
  expirationDate: values.expirationDate || undefined,
  documentNumber: values.documentNumber,
  issuingAuthority: values.issuingAuthority,
  legalFramework: values.legalFramework || undefined,
  scope: values.scope,
  status: values.status,
  priority: values.priority,
  documentUrl: values.documentUrl || undefined,
  relatedLegislationIds: values.relatedLegislationIds || [],
  tags: values.tags || [],
  metadata: (() => {
    try {
      return values.metadata ? JSON.parse(values.metadata) : undefined;
    } catch {
      return values.metadata || undefined;
    }
  })(),
});

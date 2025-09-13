import { ApiResponse, ApiError } from '../api.functions';
import {
  ProcessTypeFeeResponseDTO,
  ProcessTypeFeeRequestDTO,
  WrapperListProcessTypeFeeDTO,
  FeeCalculationResult,
  FeesByProcessTypeDTO,
  FeeDuplicateCheckResult,
  FeeCalculationRequestDTO,
} from '../../types/process-type-fees.types';

// Função utilitária para requests da API
const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<ApiResponse<T>> => {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '/api';
  const url = `${baseUrl}${endpoint}`;

  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new ApiError(data.message || 'Erro na requisição', response.status, data);
    }

    return {
      success: true,
      data,
    };
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(error instanceof Error ? error.message : 'Erro desconhecido', 500, error);
  }
};

// Funções do serviço de Process Type Fees

/**
 * Carrega todas as taxas de tipos de processo com paginação e filtros
 */
export const loadProcessTypeFees = async (
  page: number = 1,
  limit: number = 10,
  search?: string,
  processTypeId?: string,
  feeCategoryId?: string,
  active?: boolean,
): Promise<WrapperListProcessTypeFeeDTO> => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (search) params.append('search', search);
  if (processTypeId) params.append('processTypeId', processTypeId);
  if (feeCategoryId) params.append('feeCategoryId', feeCategoryId);
  if (active !== undefined) params.append('active', active.toString());

  const response = await apiRequest<WrapperListProcessTypeFeeDTO>(
    `/process-type-fees?${params.toString()}`,
  );

  return response.data;
};

/**
 * Carrega uma taxa de tipo de processo por ID
 */
export const loadProcessTypeFeeById = async (id: string): Promise<ProcessTypeFeeResponseDTO> => {
  const response = await apiRequest<ProcessTypeFeeResponseDTO>(`/process-type-fees/${id}`);

  return response.data;
};

/**
 * Carrega taxas por tipo de processo
 */
export const loadFeesByProcessType = async (
  processTypeId: string,
  activeOnly: boolean = true,
): Promise<ProcessTypeFeeResponseDTO[]> => {
  const params = new URLSearchParams();
  if (activeOnly) params.append('active', 'true');

  const response = await apiRequest<ProcessTypeFeeResponseDTO[]>(
    `/process-type-fees/by-process-type/${processTypeId}?${params.toString()}`,
  );

  return response.data;
};

/**
 * Carrega taxas por categoria de taxa
 */
export const loadFeesByCategory = async (
  feeCategoryId: string,
  activeOnly: boolean = true,
): Promise<ProcessTypeFeeResponseDTO[]> => {
  const params = new URLSearchParams();
  if (activeOnly) params.append('active', 'true');

  const response = await apiRequest<ProcessTypeFeeResponseDTO[]>(
    `/process-type-fees/by-category/${feeCategoryId}?${params.toString()}`,
  );

  return response.data;
};

/**
 * Cria uma nova taxa de tipo de processo
 */
export const createProcessTypeFee = async (
  data: ProcessTypeFeeRequestDTO,
): Promise<ProcessTypeFeeResponseDTO> => {
  const response = await apiRequest<ProcessTypeFeeResponseDTO>('/process-type-fees', {
    method: 'POST',
    body: JSON.stringify(data),
  });

  return response.data;
};

/**
 * Atualiza uma taxa de tipo de processo existente
 */
export const updateProcessTypeFee = async (
  id: string,
  data: Partial<ProcessTypeFeeRequestDTO>,
): Promise<ProcessTypeFeeResponseDTO> => {
  const response = await apiRequest<ProcessTypeFeeResponseDTO>(`/process-type-fees/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });

  return response.data;
};

/**
 * Deleta uma taxa de tipo de processo
 */
export const deleteProcessTypeFee = async (id: string): Promise<void> => {
  await apiRequest<void>(`/process-type-fees/${id}`, {
    method: 'DELETE',
  });
};

/**
 * Verifica se uma taxa pode ser deletada
 */
export const checkFeeCanBeDeleted = async (
  id: string,
): Promise<{ canDelete: boolean; reason?: string }> => {
  const response = await apiRequest<{ canDelete: boolean; reason?: string }>(
    `/process-type-fees/${id}/can-delete`,
  );

  return response.data;
};

/**
 * Calcula o total de taxas para um tipo de processo
 */
export const calculateTotalFeesByProcessType = async (
  processTypeId: string,
  baseAmount?: number,
  conditions?: Record<string, any>,
): Promise<FeeCalculationResult> => {
  const requestBody: any = { processTypeId };
  if (baseAmount !== undefined) requestBody.baseAmount = baseAmount;
  if (conditions) requestBody.conditions = conditions;

  const response = await apiRequest<FeeCalculationResult>('/process-type-fees/calculate', {
    method: 'POST',
    body: JSON.stringify(requestBody),
  });

  return response.data;
};

/**
 * Verifica se existe duplicata de taxa
 */
export const checkDuplicateFee = async (
  processTypeId: string,
  feeCategoryId: string,
  validFrom: string,
  validTo?: string,
  excludeId?: string,
): Promise<FeeDuplicateCheckResult> => {
  const requestBody = {
    processTypeId,
    feeCategoryId,
    validFrom,
    validTo,
    excludeId,
  };

  const response = await apiRequest<FeeDuplicateCheckResult>('/process-type-fees/check-duplicate', {
    method: 'POST',
    body: JSON.stringify(requestBody),
  });

  return response.data;
};

/**
 * Carrega taxas ativas para um período específico
 */
export const loadFeesForPeriod = async (
  processTypeId: string,
  startDate: string,
  endDate: string,
): Promise<ProcessTypeFeeResponseDTO[]> => {
  const params = new URLSearchParams({
    processTypeId,
    startDate,
    endDate,
  });

  const response = await apiRequest<ProcessTypeFeeResponseDTO[]>(
    `/process-type-fees/for-period?${params.toString()}`,
  );

  return response.data;
};

/**
 * Duplica taxas de um tipo de processo para outro
 */
export const duplicateFeesToProcessType = async (
  sourceProcessTypeId: string,
  targetProcessTypeId: string,
  options?: {
    overwriteExisting?: boolean;
    adjustAmounts?: number; // percentual de ajuste
    validFrom?: string;
  },
): Promise<{
  created: number;
  updated: number;
  errors: Array<{ feeCategoryId: string; message: string }>;
}> => {
  const requestBody = {
    sourceProcessTypeId,
    targetProcessTypeId,
    ...options,
  };

  const response = await apiRequest<{
    created: number;
    updated: number;
    errors: Array<{ feeCategoryId: string; message: string }>;
  }>('/process-type-fees/duplicate', {
    method: 'POST',
    body: JSON.stringify(requestBody),
  });

  return response.data;
};

/**
 * Carrega histórico de alterações de uma taxa
 */
export const loadFeeHistory = async (
  processTypeId: string,
  feeCategoryId: string,
): Promise<ProcessTypeFeeResponseDTO[]> => {
  const response = await apiRequest<ProcessTypeFeeResponseDTO[]>(
    `/process-type-fees/history/${processTypeId}/${feeCategoryId}`,
  );

  return response.data;
};

/**
 * Aplica reajuste em massa para taxas
 */
export const applyBulkAdjustment = async (
  filters: {
    processTypeIds?: string[];
    feeCategoryIds?: string[];
    validFrom?: string;
  },
  adjustment: {
    type: 'percentage' | 'fixed';
    value: number;
    newValidFrom?: string;
  },
): Promise<{
  updated: number;
  errors: Array<{ feeId: string; message: string }>;
}> => {
  const requestBody = {
    filters,
    adjustment,
  };

  const response = await apiRequest<{
    updated: number;
    errors: Array<{ feeId: string; message: string }>;
  }>('/process-type-fees/bulk-adjustment', {
    method: 'POST',
    body: JSON.stringify(requestBody),
  });

  return response.data;
};

/**
 * Exporta taxas para um formato específico
 */
export const exportProcessTypeFees = async (
  format: 'json' | 'csv' | 'xlsx',
  filters?: {
    processTypeIds?: string[];
    feeCategoryIds?: string[];
    active?: boolean;
    validFrom?: string;
    validTo?: string;
  },
): Promise<Blob> => {
  const params = new URLSearchParams({ format });

  if (filters?.processTypeIds?.length) {
    filters.processTypeIds.forEach((id) => params.append('processTypeIds[]', id));
  }
  if (filters?.feeCategoryIds?.length) {
    filters.feeCategoryIds.forEach((id) => params.append('feeCategoryIds[]', id));
  }
  if (filters?.active !== undefined) {
    params.append('active', filters.active.toString());
  }
  if (filters?.validFrom) params.append('validFrom', filters.validFrom);
  if (filters?.validTo) params.append('validTo', filters.validTo);

  const response = await fetch(`/api/process-type-fees/export?${params.toString()}`, {
    method: 'GET',
    headers: {
      Accept: 'application/octet-stream',
    },
  });

  if (!response.ok) {
    throw new ApiError('Erro ao exportar taxas', response.status);
  }

  return response.blob();
};

/**
 * Importa taxas de um arquivo
 */
export const importProcessTypeFees = async (
  file: File,
  options?: {
    overwrite?: boolean;
    validateOnly?: boolean;
    defaultValidFrom?: string;
  },
): Promise<{
  imported: number;
  errors: Array<{ row: number; message: string }>;
  warnings: Array<{ row: number; message: string }>;
}> => {
  const formData = new FormData();
  formData.append('file', file);

  if (options?.overwrite) formData.append('overwrite', 'true');
  if (options?.validateOnly) formData.append('validateOnly', 'true');
  if (options?.defaultValidFrom) formData.append('defaultValidFrom', options.defaultValidFrom);

  const response = await fetch('/api/process-type-fees/import', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new ApiError(error.message || 'Erro ao importar taxas', response.status);
  }

  return response.json();
};

/**
 * Carrega estatísticas das taxas
 */
export const loadProcessTypeFeeStats = async (): Promise<{
  total: number;
  active: number;
  inactive: number;
  byProcessType: Record<string, number>;
  byFeeCategory: Record<string, number>;
  totalAmount: number;
  averageAmount: number;
  currency: string;
}> => {
  const response = await apiRequest<{
    total: number;
    active: number;
    inactive: number;
    byProcessType: Record<string, number>;
    byFeeCategory: Record<string, number>;
    totalAmount: number;
    averageAmount: number;
    currency: string;
  }>('/process-type-fees/stats');

  return response.data;
};

/**
 * Valida configuração de taxa
 */
export const validateFeeConfiguration = async (
  data: ProcessTypeFeeRequestDTO,
): Promise<{
  isValid: boolean;
  errors: Array<{ field: string; message: string }>;
  warnings: Array<{ field: string; message: string }>;
}> => {
  const response = await apiRequest<{
    isValid: boolean;
    errors: Array<{ field: string; message: string }>;
    warnings: Array<{ field: string; message: string }>;
  }>('/process-type-fees/validate', {
    method: 'POST',
    body: JSON.stringify(data),
  });

  return response.data;
};

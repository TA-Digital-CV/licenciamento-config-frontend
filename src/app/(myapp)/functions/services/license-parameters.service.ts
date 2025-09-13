import { ApiResponse, ApiError } from '../api.functions';
import {
  LicenseParameterResponseDTO,
  LicenseParameterRequestDTO,
  WrapperListLicenseParameterDTO,
  LicenseParameterValidationResult,
  LicenseParametersByTypeDTO,
  LicenseParameterCodeCheckDTO,
} from '../../types/license-parameters.types';

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

// Funções do serviço de License Parameters

/**
 * Carrega todos os parâmetros de licença com paginação e filtros
 */
export const loadLicenseParameters = async (
  page: number = 1,
  limit: number = 10,
  search?: string,
  parameterType?: string,
  dataType?: string,
  active?: boolean,
): Promise<WrapperListLicenseParameterDTO> => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (search) params.append('search', search);
  if (parameterType) params.append('parameterType', parameterType);
  if (dataType) params.append('dataType', dataType);
  if (active !== undefined) params.append('active', active.toString());

  const response = await apiRequest<WrapperListLicenseParameterDTO>(
    `/license-parameters?${params.toString()}`,
  );

  return response.data;
};

/**
 * Carrega parâmetros ativos para seleção
 */
export const loadActiveLicenseParametersForSelect = async (): Promise<
  Array<{ value: string; label: string; dataType: string }>
> => {
  const response = await apiRequest<LicenseParameterResponseDTO[]>('/license-parameters/active');

  return response.data.map((param) => ({
    value: param.id,
    label: param.name,
    dataType: param.dataType,
  }));
};

/**
 * Carrega um parâmetro de licença por ID
 */
export const loadLicenseParameterById = async (
  id: string,
): Promise<LicenseParameterResponseDTO> => {
  const response = await apiRequest<LicenseParameterResponseDTO>(`/license-parameters/${id}`);

  return response.data;
};

/**
 * Carrega parâmetros por tipo de licença
 */
export const loadParametersByLicenseType = async (
  licenseType: string,
): Promise<LicenseParameterResponseDTO[]> => {
  const response = await apiRequest<LicenseParameterResponseDTO[]>(
    `/license-parameters/by-type/${licenseType}`,
  );

  return response.data;
};

/**
 * Carrega parâmetros por categoria
 */
export const loadParametersByCategory = async (
  category: string,
): Promise<LicenseParameterResponseDTO[]> => {
  const response = await apiRequest<LicenseParameterResponseDTO[]>(
    `/license-parameters/by-category/${category}`,
  );

  return response.data;
};

/**
 * Cria um novo parâmetro de licença
 */
export const createLicenseParameter = async (
  data: LicenseParameterRequestDTO,
): Promise<LicenseParameterResponseDTO> => {
  const response = await apiRequest<LicenseParameterResponseDTO>('/license-parameters', {
    method: 'POST',
    body: JSON.stringify(data),
  });

  return response.data;
};

/**
 * Atualiza um parâmetro de licença existente
 */
export const updateLicenseParameter = async (
  id: string,
  data: Partial<LicenseParameterRequestDTO>,
): Promise<LicenseParameterResponseDTO> => {
  const response = await apiRequest<LicenseParameterResponseDTO>(`/license-parameters/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });

  return response.data;
};

/**
 * Deleta um parâmetro de licença
 */
export const deleteLicenseParameter = async (id: string): Promise<void> => {
  await apiRequest<void>(`/license-parameters/${id}`, {
    method: 'DELETE',
  });
};

/**
 * Verifica se um parâmetro pode ser deletado
 */
export const checkParameterCanBeDeleted = async (
  id: string,
): Promise<{ canDelete: boolean; reason?: string }> => {
  const response = await apiRequest<{ canDelete: boolean; reason?: string }>(
    `/license-parameters/${id}/can-delete`,
  );

  return response.data;
};

/**
 * Valida um valor de parâmetro
 */
export const validateParameterValue = async (
  parameterId: string,
  value: any,
): Promise<LicenseParameterValidationResult> => {
  const response = await apiRequest<LicenseParameterValidationResult>(
    `/license-parameters/${parameterId}/validate`,
    {
      method: 'POST',
      body: JSON.stringify({ value }),
    },
  );

  return response.data;
};

/**
 * Carrega parâmetros obrigatórios para um tipo de licença
 */
export const loadRequiredParametersForLicenseType = async (
  licenseType: string,
): Promise<LicenseParameterResponseDTO[]> => {
  const response = await apiRequest<LicenseParameterResponseDTO[]>(
    `/license-parameters/required/${licenseType}`,
  );

  return response.data;
};

/**
 * Carrega valores padrão para parâmetros de um tipo de licença
 */
export const loadDefaultParameterValues = async (
  licenseType: string,
): Promise<Record<string, any>> => {
  const response = await apiRequest<Record<string, any>>(
    `/license-parameters/defaults/${licenseType}`,
  );

  return response.data;
};

/**
 * Duplica um parâmetro de licença
 */
export const duplicateLicenseParameter = async (
  id: string,
  newName: string,
): Promise<LicenseParameterResponseDTO> => {
  const response = await apiRequest<LicenseParameterResponseDTO>(
    `/license-parameters/${id}/duplicate`,
    {
      method: 'POST',
      body: JSON.stringify({ newName }),
    },
  );

  return response.data;
};

/**
 * Reordena parâmetros
 */
export const reorderLicenseParameters = async (parameterIds: string[]): Promise<void> => {
  await apiRequest<void>('/license-parameters/reorder', {
    method: 'PUT',
    body: JSON.stringify({ parameterIds }),
  });
};

/**
 * Exporta parâmetros para um formato específico
 */
export const exportLicenseParameters = async (
  format: 'json' | 'csv' | 'xlsx',
  filters?: {
    parameterType?: string;
    dataType?: string;
    active?: boolean;
  },
): Promise<Blob> => {
  const params = new URLSearchParams({ format });

  if (filters?.parameterType) params.append('parameterType', filters.parameterType);
  if (filters?.dataType) params.append('dataType', filters.dataType);
  if (filters?.active !== undefined) params.append('active', filters.active.toString());

  const response = await fetch(`/api/license-parameters/export?${params.toString()}`, {
    method: 'GET',
    headers: {
      Accept: 'application/octet-stream',
    },
  });

  if (!response.ok) {
    throw new ApiError('Erro ao exportar parâmetros', response.status);
  }

  return response.blob();
};

/**
 * Importa parâmetros de um arquivo
 */
export const importLicenseParameters = async (
  file: File,
  options?: {
    overwrite?: boolean;
    validateOnly?: boolean;
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

  const response = await fetch('/api/license-parameters/import', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new ApiError(error.message || 'Erro ao importar parâmetros', response.status);
  }

  return response.json();
};

/**
 * Busca parâmetros com filtros avançados
 */
export const searchLicenseParameters = async (
  query: string,
  filters?: {
    parameterTypes?: string[];
    dataTypes?: string[];
    categories?: string[];
    isRequired?: boolean;
    active?: boolean;
  },
): Promise<LicenseParameterResponseDTO[]> => {
  const params = new URLSearchParams({ q: query });

  if (filters?.parameterTypes?.length) {
    filters.parameterTypes.forEach((type) => params.append('parameterTypes[]', type));
  }
  if (filters?.dataTypes?.length) {
    filters.dataTypes.forEach((type) => params.append('dataTypes[]', type));
  }
  if (filters?.categories?.length) {
    filters.categories.forEach((cat) => params.append('categories[]', cat));
  }
  if (filters?.isRequired !== undefined) {
    params.append('isRequired', filters.isRequired.toString());
  }
  if (filters?.active !== undefined) {
    params.append('active', filters.active.toString());
  }

  const response = await apiRequest<LicenseParameterResponseDTO[]>(
    `/license-parameters/search?${params.toString()}`,
  );

  return response.data;
};

/**
 * Carrega estatísticas dos parâmetros
 */
export const loadLicenseParameterStats = async (): Promise<{
  total: number;
  active: number;
  inactive: number;
  byType: Record<string, number>;
  byDataType: Record<string, number>;
  required: number;
  optional: number;
}> => {
  const response = await apiRequest<{
    total: number;
    active: number;
    inactive: number;
    byType: Record<string, number>;
    byDataType: Record<string, number>;
    required: number;
    optional: number;
  }>('/license-parameters/stats');

  return response.data;
};

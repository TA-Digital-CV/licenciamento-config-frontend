/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApiResponse, ApiError } from '../api.functions';
import {
  FeeCategoryResponseDTO,
  FeeCategoryRequestDTO,
  WrapperListFeeCategoryDTO,
  FeeCategoryCodeCheckDTO,
} from '../../types/fee-categories.types';
import {
  FeeCalculationResult,
  FeeCalculationRequestDTO,
} from '../../types/process-type-fees.types';

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

/**
 * Carrega todas as categorias de taxas com filtros opcionais
 */
export const loadFeeCategories = async (
  params?: {
    active?: boolean;
    categoryType?: string;
    applicableToType?: string;
    search?: string;
    page?: number;
    size?: number;
  },
  signal?: AbortSignal,
): Promise<WrapperListFeeCategoryDTO> => {
  const searchParams = new URLSearchParams();

  if (params?.active !== undefined) {
    searchParams.append('active', params.active.toString());
  }
  if (params?.categoryType) {
    searchParams.append('categoryType', params.categoryType);
  }
  if (params?.applicableToType) {
    searchParams.append('applicableToType', params.applicableToType);
  }
  if (params?.search) {
    searchParams.append('search', params.search);
  }
  if (params?.page !== undefined) {
    searchParams.append('page', params.page.toString());
  }
  if (params?.size !== undefined) {
    searchParams.append('size', params.size.toString());
  }

  const url = `/api/fee-categories${searchParams.toString() ? '?' + searchParams.toString() : ''}`;
  return apiRequest<WrapperListFeeCategoryDTO>(url, {}, signal);
};

/**
 * Carrega categorias de taxas ativas formatadas para select
 */
export const loadActiveFeeCategoriesForSelect = async (
  categoryType?: string,
  signal?: AbortSignal,
): Promise<{ value: string; label: string; amount: number }[]> => {
  const params = { active: true, ...(categoryType && { categoryType }) };
  const data = await loadFeeCategories(params, signal);
  return (data.content || []).map((fc) => ({
    value: fc.id,
    label: `${fc.name} (${fc.baseAmount} ${fc.currency})`,
    amount: fc.baseAmount,
  }));
};

/**
 * Carrega uma categoria de taxa por ID
 */
export const loadFeeCategoryById = async (
  id: string,
  signal?: AbortSignal,
): Promise<FeeCategoryResponseDTO> => {
  const url = `/api/fee-categories/${encodeURIComponent(id)}`;
  return apiRequest<FeeCategoryResponseDTO>(url, {}, signal);
};

/**
 * Carrega uma categoria de taxa por código
 */
export const loadFeeCategoryByCode = async (
  code: string,
  signal?: AbortSignal,
): Promise<FeeCategoryResponseDTO> => {
  const url = `/api/fee-categories/by-code/${encodeURIComponent(code)}`;
  return apiRequest<FeeCategoryResponseDTO>(url, {}, signal);
};

/**
 * Verifica se um código de categoria de taxa já existe
 */
export const checkFeeCategoryCodeExists = async (
  code: string,
  excludeId?: string,
  signal?: AbortSignal,
): Promise<FeeCategoryCodeCheckDTO> => {
  const searchParams = new URLSearchParams();
  searchParams.append('code', code);
  if (excludeId) {
    searchParams.append('excludeId', excludeId);
  }

  const url = `/api/fee-categories/check-code?${searchParams.toString()}`;
  return apiRequest<FeeCategoryCodeCheckDTO>(url, {}, signal);
};

/**
 * Cria uma nova categoria de taxa
 */
export const createFeeCategory = async (
  feeCategory: FeeCategoryRequestDTO,
  signal?: AbortSignal,
): Promise<FeeCategoryResponseDTO> => {
  return apiRequest<FeeCategoryResponseDTO>(
    '/api/fee-categories',
    {
      method: 'POST',
      body: JSON.stringify(feeCategory),
    },
    signal,
  );
};

/**
 * Atualiza uma categoria de taxa por ID
 */
export const updateFeeCategory = async (
  id: string,
  feeCategory: FeeCategoryRequestDTO,
  signal?: AbortSignal,
): Promise<FeeCategoryResponseDTO> => {
  const url = `/api/fee-categories/${encodeURIComponent(id)}`;
  return apiRequest<FeeCategoryResponseDTO>(
    url,
    {
      method: 'PUT',
      body: JSON.stringify(feeCategory),
    },
    signal,
  );
};

/**
 * Deleta uma categoria de taxa por ID
 */
export const deleteFeeCategory = async (id: string, signal?: AbortSignal): Promise<void> => {
  const url = `/api/fee-categories/${encodeURIComponent(id)}`;
  return apiRequest<void>(
    url,
    {
      method: 'DELETE',
    },
    signal,
  );
};

/**
 * Verifica se uma categoria de taxa pode ser deletada
 */
export const checkFeeCategoryCanBeDeleted = async (
  id: string,
  signal?: AbortSignal,
): Promise<{ canDelete: boolean; reason?: string }> => {
  const url = `/api/fee-categories/${encodeURIComponent(id)}/can-delete`;
  return apiRequest<{ canDelete: boolean; reason?: string }>(url, {}, signal);
};

/**
 * Carrega categorias de taxas por tipo
 */
export const loadFeeCategoriesByType = async (
  categoryType: string,
  signal?: AbortSignal,
): Promise<FeeCategoryResponseDTO[]> => {
  const data = await loadFeeCategories({ categoryType, active: true }, signal);
  return data.content || [];
};

/**
 * Carrega categorias de taxas aplicáveis a um tipo específico
 */
export const loadFeeCategoriesApplicableTo = async (
  applicableToType: string,
  signal?: AbortSignal,
): Promise<FeeCategoryResponseDTO[]> => {
  const data = await loadFeeCategories({ applicableToType, active: true }, signal);
  return data.content || [];
};

/**
 * Calcula taxa baseada na categoria e valor base
 */
export const calculateFee = async (
  feeCategoryId: string,
  baseValue: number,
  additionalParams?: Record<string, any>,
  signal?: AbortSignal,
): Promise<FeeCalculationResult> => {
  const url = `/api/fee-categories/${encodeURIComponent(feeCategoryId)}/calculate`;
  return apiRequest<FeeCalculationResult>(
    url,
    {
      method: 'POST',
      body: JSON.stringify({ baseValue, ...additionalParams }),
    },
    signal,
  );
};

/**
 * Calcula múltiplas taxas de uma vez
 */
export const calculateMultipleFees = async (
  calculations: {
    feeCategoryId: string;
    baseValue: number;
    additionalParams?: Record<string, any>;
  }[],
  signal?: AbortSignal,
): Promise<FeeCalculationResult[]> => {
  const url = '/api/fee-categories/calculate-multiple';
  return apiRequest<FeeCalculationResult[]>(
    url,
    {
      method: 'POST',
      body: JSON.stringify({ calculations }),
    },
    signal,
  );
};

/**
 * Busca categorias de taxas por termo
 */
export const searchFeeCategories = async (
  searchTerm: string,
  filters?: {
    categoryType?: string;
    applicableToType?: string;
    active?: boolean;
  },
  signal?: AbortSignal,
): Promise<FeeCategoryResponseDTO[]> => {
  const params = { search: searchTerm, ...filters };
  const data = await loadFeeCategories(params, signal);
  return data.content || [];
};

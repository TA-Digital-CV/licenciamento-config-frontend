/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApiResponse, ApiError } from '../api.functions';
import {
  CategoryResponseDTO,
  CategoryRequestDTO,
  CategoryMoveRequestDTO,
  WrapperListCategoryDTO
} from '../../types/categories.types';

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
 * Carrega todas as categorias com filtros opcionais
 */
export const loadCategories = async (
  params?: {
    active?: boolean;
    sectorId?: string;
    parentId?: string;
    page?: number;
    size?: number;
  },
  signal?: AbortSignal,
): Promise<WrapperListCategoryDTO> => {
  const searchParams = new URLSearchParams();
  
  if (params?.active !== undefined) {
    searchParams.append('active', params.active.toString());
  }
  if (params?.sectorId) {
    searchParams.append('sectorId', params.sectorId);
  }
  if (params?.parentId) {
    searchParams.append('parentId', params.parentId);
  }
  if (params?.page !== undefined) {
    searchParams.append('page', params.page.toString());
  }
  if (params?.size !== undefined) {
    searchParams.append('size', params.size.toString());
  }

  const url = `/api/categories${searchParams.toString() ? '?' + searchParams.toString() : ''}`;
  return apiRequest<WrapperListCategoryDTO>(url, {}, signal);
};

/**
 * Carrega categorias ativas formatadas para select
 */
export const loadActiveCategoriesForSelect = async (
  signal?: AbortSignal,
): Promise<{ value: string; label: string }[]> => {
  const data = await loadCategories({ active: true }, signal);
  return (data.content || []).map((c) => ({ value: c.id, label: c.name }));
};

/**
 * Carrega uma categoria por ID
 */
export const loadCategoryById = async (
  id: string,
  signal?: AbortSignal,
): Promise<CategoryResponseDTO> => {
  const url = `/api/categories/${encodeURIComponent(id)}`;
  return apiRequest<CategoryResponseDTO>(url, {}, signal);
};

/**
 * Cria uma nova categoria
 */
export const createCategory = async (
  category: CategoryRequestDTO,
  signal?: AbortSignal,
): Promise<CategoryResponseDTO> => {
  return apiRequest<CategoryResponseDTO>(
    '/api/categories',
    {
      method: 'POST',
      body: JSON.stringify(category),
    },
    signal,
  );
};

/**
 * Atualiza uma categoria por ID
 */
export const updateCategory = async (
  id: string,
  category: CategoryRequestDTO,
  signal?: AbortSignal,
): Promise<CategoryResponseDTO> => {
  const url = `/api/categories/${encodeURIComponent(id)}`;
  return apiRequest<CategoryResponseDTO>(
    url,
    {
      method: 'PUT',
      body: JSON.stringify(category),
    },
    signal,
  );
};

/**
 * Move uma categoria para nova posição/parent
 */
export const moveCategory = async (
  id: string,
  moveData: CategoryMoveRequestDTO,
  signal?: AbortSignal,
): Promise<void> => {
  const url = `/api/categories/${encodeURIComponent(id)}/move`;
  return apiRequest<void>(
    url,
    {
      method: 'PATCH',
      body: JSON.stringify(moveData),
    },
    signal,
  );
};

/**
 * Deleta uma categoria por ID
 */
export const deleteCategory = async (
  id: string,
  signal?: AbortSignal,
): Promise<void> => {
  const url = `/api/categories/${encodeURIComponent(id)}`;
  return apiRequest<void>(
    url,
    {
      method: 'DELETE',
    },
    signal,
  );
};

/**
 * Verifica se uma categoria pode ser deletada
 */
export const checkCategoryCanBeDeleted = async (
  id: string,
  signal?: AbortSignal,
): Promise<{ canDelete: boolean; reason?: string }> => {
  const url = `/api/categories/${encodeURIComponent(id)}/can-delete`;
  return apiRequest<{ canDelete: boolean; reason?: string }>(url, {}, signal);
};

/**
 * Carrega categorias filhas de uma categoria pai
 */
export const loadCategoryChildren = async (
  parentId: string,
  signal?: AbortSignal,
): Promise<CategoryResponseDTO[]> => {
  const data = await loadCategories({ parentId, active: true }, signal);
  return data.content || [];
};

/**
 * Carrega hierarquia completa de categorias
 */
export const loadCategoryHierarchy = async (
  sectorId?: string,
  signal?: AbortSignal,
): Promise<CategoryResponseDTO[]> => {
  const params = sectorId ? { sectorId, active: true } : { active: true };
  const data = await loadCategories(params, signal);
  return data.content || [];
};
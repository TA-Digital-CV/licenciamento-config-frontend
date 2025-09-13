/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApiResponse, ApiError } from '../api.functions';
import {
  EntityResponseDTO,
  EntityRequestDTO,
  WrapperListEntityDTO,
  EntityCodeCheckDTO
} from '../../types/entities.types';

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
 * Carrega todas as entidades com filtros opcionais
 */
export const loadEntities = async (
  params?: {
    active?: boolean;
    entityType?: string;
    sectorId?: string;
    parentId?: string;
    search?: string;
    page?: number;
    size?: number;
  },
  signal?: AbortSignal,
): Promise<WrapperListEntityDTO> => {
  const searchParams = new URLSearchParams();
  
  if (params?.active !== undefined) {
    searchParams.append('active', params.active.toString());
  }
  if (params?.entityType) {
    searchParams.append('entityType', params.entityType);
  }
  if (params?.sectorId) {
    searchParams.append('sectorId', params.sectorId);
  }
  if (params?.parentId) {
    searchParams.append('parentId', params.parentId);
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

  const url = `/api/entities${searchParams.toString() ? '?' + searchParams.toString() : ''}`;
  return apiRequest<WrapperListEntityDTO>(url, {}, signal);
};

/**
 * Carrega entidades ativas formatadas para select
 */
export const loadActiveEntitiesForSelect = async (
  entityType?: string,
  signal?: AbortSignal,
): Promise<{ value: string; label: string }[]> => {
  const params = { active: true, ...(entityType && { entityType }) };
  const data = await loadEntities(params, signal);
  return (data.content || []).map((e) => ({ value: e.id, label: e.name }));
};

/**
 * Carrega uma entidade por ID
 */
export const loadEntityById = async (
  id: string,
  signal?: AbortSignal,
): Promise<EntityResponseDTO> => {
  const url = `/api/entities/${encodeURIComponent(id)}`;
  return apiRequest<EntityResponseDTO>(url, {}, signal);
};

/**
 * Carrega uma entidade por código
 */
export const loadEntityByCode = async (
  code: string,
  signal?: AbortSignal,
): Promise<EntityResponseDTO> => {
  const url = `/api/entities/by-code/${encodeURIComponent(code)}`;
  return apiRequest<EntityResponseDTO>(url, {}, signal);
};

/**
 * Verifica se um código de entidade já existe
 */
export const checkEntityCodeExists = async (
  code: string,
  excludeId?: string,
  signal?: AbortSignal,
): Promise<EntityCodeCheckDTO> => {
  const searchParams = new URLSearchParams();
  searchParams.append('code', code);
  if (excludeId) {
    searchParams.append('excludeId', excludeId);
  }
  
  const url = `/api/entities/check-code?${searchParams.toString()}`;
  return apiRequest<EntityCodeCheckDTO>(url, {}, signal);
};

/**
 * Cria uma nova entidade
 */
export const createEntity = async (
  entity: EntityRequestDTO,
  signal?: AbortSignal,
): Promise<EntityResponseDTO> => {
  return apiRequest<EntityResponseDTO>(
    '/api/entities',
    {
      method: 'POST',
      body: JSON.stringify(entity),
    },
    signal,
  );
};

/**
 * Atualiza uma entidade por ID
 */
export const updateEntity = async (
  id: string,
  entity: EntityRequestDTO,
  signal?: AbortSignal,
): Promise<EntityResponseDTO> => {
  const url = `/api/entities/${encodeURIComponent(id)}`;
  return apiRequest<EntityResponseDTO>(
    url,
    {
      method: 'PUT',
      body: JSON.stringify(entity),
    },
    signal,
  );
};

/**
 * Deleta uma entidade por ID
 */
export const deleteEntity = async (
  id: string,
  signal?: AbortSignal,
): Promise<void> => {
  const url = `/api/entities/${encodeURIComponent(id)}`;
  return apiRequest<void>(
    url,
    {
      method: 'DELETE',
    },
    signal,
  );
};

/**
 * Verifica se uma entidade pode ser deletada
 */
export const checkEntityCanBeDeleted = async (
  id: string,
  signal?: AbortSignal,
): Promise<{ canDelete: boolean; reason?: string }> => {
  const url = `/api/entities/${encodeURIComponent(id)}/can-delete`;
  return apiRequest<{ canDelete: boolean; reason?: string }>(url, {}, signal);
};

/**
 * Carrega entidades filhas de uma entidade pai
 */
export const loadEntityChildren = async (
  parentId: string,
  signal?: AbortSignal,
): Promise<EntityResponseDTO[]> => {
  const data = await loadEntities({ parentId, active: true }, signal);
  return data.content || [];
};

/**
 * Carrega entidades por setor
 */
export const loadEntitiesBySector = async (
  sectorId: string,
  entityType?: string,
  signal?: AbortSignal,
): Promise<EntityResponseDTO[]> => {
  const params = { sectorId, active: true, ...(entityType && { entityType }) };
  const data = await loadEntities(params, signal);
  return data.content || [];
};

/**
 * Carrega entidades por tipo
 */
export const loadEntitiesByType = async (
  entityType: string,
  signal?: AbortSignal,
): Promise<EntityResponseDTO[]> => {
  const data = await loadEntities({ entityType, active: true }, signal);
  return data.content || [];
};

/**
 * Busca entidades por termo
 */
export const searchEntities = async (
  searchTerm: string,
  filters?: {
    entityType?: string;
    sectorId?: string;
    active?: boolean;
  },
  signal?: AbortSignal,
): Promise<EntityResponseDTO[]> => {
  const params = { search: searchTerm, ...filters };
  const data = await loadEntities(params, signal);
  return data.content || [];
};
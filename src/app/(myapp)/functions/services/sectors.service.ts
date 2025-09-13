/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApiResponse, ApiError } from '../api.functions';
import {
  SectorResponseDTO,
  SectorRequestDTO,
  WrapperListSectorDTO,
  SectorCodeCheckDTO
} from '../../types/sectors.types';

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
 * Carrega todos os setores com filtros opcionais
 */
export const loadSectors = async (
  params?: {
    active?: boolean;
    parentId?: string;
    level?: number;
    search?: string;
    page?: number;
    size?: number;
  },
  signal?: AbortSignal,
): Promise<WrapperListSectorDTO> => {
  const searchParams = new URLSearchParams();
  
  if (params?.active !== undefined) {
    searchParams.append('active', params.active.toString());
  }
  if (params?.parentId) {
    searchParams.append('parentId', params.parentId);
  }
  if (params?.level !== undefined) {
    searchParams.append('level', params.level.toString());
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

  const url = `/api/sectors${searchParams.toString() ? '?' + searchParams.toString() : ''}`;
  return apiRequest<WrapperListSectorDTO>(url, {}, signal);
};

/**
 * Carrega setores ativos formatados para select
 */
export const loadActiveSectorsForSelect = async (
  level?: number,
  signal?: AbortSignal,
): Promise<{ value: string; label: string }[]> => {
  const params = { active: true, ...(level !== undefined && { level }) };
  const data = await loadSectors(params, signal);
  return (data.content || []).map((s) => ({ value: s.id, label: s.name }));
};

/**
 * Carrega um setor por ID
 */
export const loadSectorById = async (
  id: string,
  signal?: AbortSignal,
): Promise<SectorResponseDTO> => {
  const url = `/api/sectors/${encodeURIComponent(id)}`;
  return apiRequest<SectorResponseDTO>(url, {}, signal);
};

/**
 * Carrega um setor por código
 */
export const loadSectorByCode = async (
  code: string,
  signal?: AbortSignal,
): Promise<SectorResponseDTO> => {
  const url = `/api/sectors/by-code/${encodeURIComponent(code)}`;
  return apiRequest<SectorResponseDTO>(url, {}, signal);
};

/**
 * Verifica se um código de setor já existe
 */
export const checkSectorCodeExists = async (
  code: string,
  excludeId?: string,
  signal?: AbortSignal,
): Promise<SectorCodeCheckDTO> => {
  const searchParams = new URLSearchParams();
  searchParams.append('code', code);
  if (excludeId) {
    searchParams.append('excludeId', excludeId);
  }
  
  const url = `/api/sectors/check-code?${searchParams.toString()}`;
  return apiRequest<SectorCodeCheckDTO>(url, {}, signal);
};

/**
 * Cria um novo setor
 */
export const createSector = async (
  sector: SectorRequestDTO,
  signal?: AbortSignal,
): Promise<SectorResponseDTO> => {
  return apiRequest<SectorResponseDTO>(
    '/api/sectors',
    {
      method: 'POST',
      body: JSON.stringify(sector),
    },
    signal,
  );
};

/**
 * Atualiza um setor por ID
 */
export const updateSector = async (
  id: string,
  sector: SectorRequestDTO,
  signal?: AbortSignal,
): Promise<SectorResponseDTO> => {
  const url = `/api/sectors/${encodeURIComponent(id)}`;
  return apiRequest<SectorResponseDTO>(
    url,
    {
      method: 'PUT',
      body: JSON.stringify(sector),
    },
    signal,
  );
};

/**
 * Deleta um setor por ID
 */
export const deleteSector = async (
  id: string,
  signal?: AbortSignal,
): Promise<void> => {
  const url = `/api/sectors/${encodeURIComponent(id)}`;
  return apiRequest<void>(
    url,
    {
      method: 'DELETE',
    },
    signal,
  );
};

/**
 * Verifica se um setor pode ser deletado
 */
export const checkSectorCanBeDeleted = async (
  id: string,
  signal?: AbortSignal,
): Promise<{ canDelete: boolean; reason?: string }> => {
  const url = `/api/sectors/${encodeURIComponent(id)}/can-delete`;
  return apiRequest<{ canDelete: boolean; reason?: string }>(url, {}, signal);
};

/**
 * Carrega setores filhos de um setor pai
 */
export const loadSectorChildren = async (
  parentId: string,
  signal?: AbortSignal,
): Promise<SectorResponseDTO[]> => {
  const data = await loadSectors({ parentId, active: true }, signal);
  return data.content || [];
};

/**
 * Carrega hierarquia completa de setores
 */
export const loadSectorHierarchy = async (
  rootLevel?: number,
  signal?: AbortSignal,
): Promise<SectorResponseDTO[]> => {
  const params = { active: true, ...(rootLevel !== undefined && { level: rootLevel }) };
  const data = await loadSectors(params, signal);
  return data.content || [];
};

/**
 * Carrega setores por nível hierárquico
 */
export const loadSectorsByLevel = async (
  level: number,
  signal?: AbortSignal,
): Promise<SectorResponseDTO[]> => {
  const data = await loadSectors({ level, active: true }, signal);
  return data.content || [];
};

/**
 * Carrega setores raiz (sem pai)
 */
export const loadRootSectors = async (
  signal?: AbortSignal,
): Promise<SectorResponseDTO[]> => {
  const data = await loadSectors({ level: 0, active: true }, signal);
  return data.content || [];
};

/**
 * Busca setores por termo
 */
export const searchSectors = async (
  searchTerm: string,
  filters?: {
    level?: number;
    parentId?: string;
    active?: boolean;
  },
  signal?: AbortSignal,
): Promise<SectorResponseDTO[]> => {
  const params = { search: searchTerm, ...filters };
  const data = await loadSectors(params, signal);
  return data.content || [];
};

/**
 * Carrega caminho completo de um setor (breadcrumb)
 */
export const loadSectorPath = async (
  sectorId: string,
  signal?: AbortSignal,
): Promise<SectorResponseDTO[]> => {
  const url = `/api/sectors/${encodeURIComponent(sectorId)}/path`;
  return apiRequest<SectorResponseDTO[]>(url, {}, signal);
};

/**
 * Carrega estatísticas de um setor
 */
export const loadSectorStats = async (
  sectorId: string,
  signal?: AbortSignal,
): Promise<{
  totalSubsectors: number;
  totalEntities: number;
  totalCategories: number;
  totalActiveLicenses: number;
}> => {
  const url = `/api/sectors/${encodeURIComponent(sectorId)}/stats`;
  return apiRequest<{
    totalSubsectors: number;
    totalEntities: number;
    totalCategories: number;
    totalActiveLicenses: number;
  }>(url, {}, signal);
};
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { 
  OptionResponseDTO, 
  OptionRequestDTO, 
  WrapperListOptionsDTO 
} from '../../types';
import { apiRequest } from '../api.functions';

/**
 * Service para operações com opções
 */
export class OptionsService {
  private static baseUrl = '/api/options';

  /**
   * Carrega lista paginada de opções
   */
  static async getAll(
    filters: {
      ckey?: string;
      cvalue?: string;
      active?: boolean;
      pageNumber?: number;
      pageSize?: number;
    } = {}
  ): Promise<WrapperListOptionsDTO> {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, String(value));
      }
    });

    const url = `${this.baseUrl}${params.toString() ? `?${params.toString()}` : ''}`;
    return apiRequest<WrapperListOptionsDTO>(url);
  }

  /**
   * Busca uma opção por ID
   */
  static async getById(id: string): Promise<OptionResponseDTO> {
    return apiRequest<OptionResponseDTO>(`${this.baseUrl}/${id}`);
  }

  /**
   * Cria uma nova opção
   */
  static async create(data: OptionRequestDTO): Promise<OptionResponseDTO> {
    return apiRequest<OptionResponseDTO>(
      this.baseUrl,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }
    );
  }

  /**
   * Atualiza uma opção existente
   */
  static async update(id: string, data: OptionRequestDTO): Promise<OptionResponseDTO> {
    return apiRequest<OptionResponseDTO>(
      `${this.baseUrl}/${id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }
    );
  }

  /**
   * Remove uma opção
   */
  static async delete(id: string): Promise<void> {
    return apiRequest<void>(
      `${this.baseUrl}/${id}`,
      {
        method: 'DELETE',
      }
    );
  }

  /**
   * Ativa uma opção
   */
  static async activate(id: string): Promise<OptionResponseDTO> {
    return apiRequest<OptionResponseDTO>(
      `${this.baseUrl}/${id}/activate`,
      {
        method: 'PATCH',
      }
    );
  }

  /**
   * Desativa uma opção
   */
  static async deactivate(id: string): Promise<OptionResponseDTO> {
    return apiRequest<OptionResponseDTO>(
      `${this.baseUrl}/${id}/deactivate`,
      {
        method: 'PATCH',
      }
    );
  }

  /**
   * Verifica se uma opção pode ser excluída
   */
  static async canDelete(id: string): Promise<{ canDelete: boolean; reason?: string }> {
    try {
      return apiRequest<{ canDelete: boolean; reason?: string }>(
        `${this.baseUrl}/${id}/can-delete`
      );
    } catch (error) {
      console.error('Erro ao verificar se opção pode ser excluída:', error);
      return { canDelete: false, reason: 'Erro ao verificar dependências' };
    }
  }

  /**
   * Busca opções por chave
   */
  static async getByKey(ckey: string): Promise<OptionResponseDTO[]> {
    return apiRequest<OptionResponseDTO[]>(
      `${this.baseUrl}/by-key/${encodeURIComponent(ckey)}`
    );
  }

  /**
   * Busca todas as chaves disponíveis
   */
  static async getAvailableKeys(): Promise<string[]> {
    return apiRequest<string[]>(`${this.baseUrl}/keys`);
  }

  /**
   * Valida se uma chave já existe
   */
  static async validateKey(ckey: string, excludeId?: string): Promise<{ isValid: boolean; message?: string }> {
    const params = new URLSearchParams({ ckey });
    if (excludeId) {
      params.append('excludeId', excludeId);
    }
    
    return apiRequest<{ isValid: boolean; message?: string }>(
      `${this.baseUrl}/validate-key?${params.toString()}`
    );
  }
}

export default OptionsService;
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import {
  LicenseProcessTypeResponseDTO,
  LicenseProcessTypeRequestDTO,
  WrapperListLicenseProcessTypeDTO,
} from '../../types/license-process-types.types';
import { apiRequest } from '../api.functions';

/**
 * Service para operações com tipos de processo de licença
 */
export class LicenseProcessTypesService {
  private static baseUrl = '/api/license-process-types';

  /**
   * Carrega lista paginada de tipos de processo de licença
   */
  static async getAll(
    filters: {
      name?: string;
      categoryId?: string;
      active?: boolean;
      pageNumber?: number;
      pageSize?: number;
    } = {},
  ): Promise<WrapperListLicenseProcessTypeDTO> {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, String(value));
      }
    });

    const url = `${this.baseUrl}${params.toString() ? `?${params.toString()}` : ''}`;
    return apiRequest<WrapperListLicenseProcessTypeDTO>(url);
  }

  /**
   * Busca um tipo de processo de licença por ID
   */
  static async getById(id: string): Promise<LicenseProcessTypeResponseDTO> {
    return apiRequest<LicenseProcessTypeResponseDTO>(`${this.baseUrl}/${id}`);
  }

  /**
   * Cria um novo tipo de processo de licença
   */
  static async create(data: LicenseProcessTypeRequestDTO): Promise<LicenseProcessTypeResponseDTO> {
    return apiRequest<LicenseProcessTypeResponseDTO>(this.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  }

  /**
   * Atualiza um tipo de processo de licença existente
   */
  static async update(
    id: string,
    data: LicenseProcessTypeRequestDTO,
  ): Promise<LicenseProcessTypeResponseDTO> {
    return apiRequest<LicenseProcessTypeResponseDTO>(`${this.baseUrl}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  }

  /**
   * Remove um tipo de processo de licença
   */
  static async delete(id: string): Promise<void> {
    return apiRequest<void>(`${this.baseUrl}/${id}`, {
      method: 'DELETE',
    });
  }

  /**
   * Ativa um tipo de processo de licença
   */
  static async activate(id: string): Promise<LicenseProcessTypeResponseDTO> {
    return apiRequest<LicenseProcessTypeResponseDTO>(`${this.baseUrl}/${id}/activate`, {
      method: 'PATCH',
    });
  }

  /**
   * Desativa um tipo de processo de licença
   */
  static async deactivate(id: string): Promise<LicenseProcessTypeResponseDTO> {
    return apiRequest<LicenseProcessTypeResponseDTO>(`${this.baseUrl}/${id}/deactivate`, {
      method: 'PATCH',
    });
  }

  /**
   * Verifica se um tipo de processo de licença pode ser excluído
   */
  static async canDelete(id: string): Promise<{ canDelete: boolean; reason?: string }> {
    try {
      return apiRequest<{ canDelete: boolean; reason?: string }>(
        `${this.baseUrl}/${id}/can-delete`,
      );
    } catch (error) {
      console.error('Erro ao verificar se tipo de processo pode ser excluído:', error);
      return { canDelete: false, reason: 'Erro ao verificar dependências' };
    }
  }

  /**
   * Busca tipos de processo por categoria
   */
  static async getByCategory(categoryId: string): Promise<LicenseProcessTypeResponseDTO[]> {
    return apiRequest<LicenseProcessTypeResponseDTO[]>(`${this.baseUrl}/by-category/${categoryId}`);
  }

  /**
   * Calcula taxas para um tipo de processo
   */
  static async calculateFees(
    id: string,
    data: {
      quantity?: number;
      additionalParams?: Record<string, any>;
    },
  ): Promise<{ totalFee: number; breakdown: any[] }> {
    return apiRequest<{ totalFee: number; breakdown: any[] }>(`${this.baseUrl}/${id}/calculate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  }

  /**
   * Duplica um tipo de processo de licença
   */
  static async duplicate(id: string, newName: string): Promise<LicenseProcessTypeResponseDTO> {
    return apiRequest<LicenseProcessTypeResponseDTO>(`${this.baseUrl}/${id}/duplicate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: newName }),
    });
  }
}

export default LicenseProcessTypesService;

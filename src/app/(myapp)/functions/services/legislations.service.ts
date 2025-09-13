/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import {
  LegislationResponseDTO,
  LegislationRequestDTO,
  WrapperListLegislationDTO,
} from '../../types/legislations.types';
import { apiRequest } from '../api.functions';

/**
 * Service para operações com legislações
 */
export class LegislationsService {
  private static baseUrl = '/api/legislations';

  /**
   * Carrega lista paginada de legislações
   */
  static async getAll(
    filters: {
      name?: string;
      legislationType?: string;
      licenseTypeId?: string;
      active?: boolean;
      pageNumber?: number;
      pageSize?: number;
    } = {},
  ): Promise<WrapperListLegislationDTO> {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, String(value));
      }
    });

    const url = `${this.baseUrl}${params.toString() ? `?${params.toString()}` : ''}`;
    return apiRequest<WrapperListLegislationDTO>(url);
  }

  /**
   * Busca uma legislação por ID
   */
  static async getById(id: string): Promise<LegislationResponseDTO> {
    return apiRequest<LegislationResponseDTO>(`${this.baseUrl}/${id}`);
  }

  /**
   * Cria uma nova legislação
   */
  static async create(data: LegislationRequestDTO): Promise<LegislationResponseDTO> {
    return apiRequest<LegislationResponseDTO>(this.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  }

  /**
   * Atualiza uma legislação existente
   */
  static async update(id: string, data: LegislationRequestDTO): Promise<LegislationResponseDTO> {
    return apiRequest<LegislationResponseDTO>(`${this.baseUrl}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  }

  /**
   * Remove uma legislação
   */
  static async delete(id: string): Promise<void> {
    return apiRequest<void>(`${this.baseUrl}/${id}`, {
      method: 'DELETE',
    });
  }

  /**
   * Ativa uma legislação
   */
  static async activate(id: string): Promise<LegislationResponseDTO> {
    return apiRequest<LegislationResponseDTO>(`${this.baseUrl}/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action: 'activate' }),
    });
  }

  /**
   * Desativa uma legislação
   */
  static async deactivate(id: string): Promise<LegislationResponseDTO> {
    return apiRequest<LegislationResponseDTO>(`${this.baseUrl}/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action: 'deactivate' }),
    });
  }

  /**
   * Verifica se uma legislação pode ser excluída
   */
  static async canDelete(id: string): Promise<{ canDelete: boolean; reason?: string }> {
    try {
      return apiRequest<{ canDelete: boolean; reason?: string }>(
        `${this.baseUrl}/${id}/can-delete`,
      );
    } catch (error) {
      console.error('Erro ao verificar se legislação pode ser excluída:', error);
      return { canDelete: false, reason: 'Erro ao verificar dependências' };
    }
  }

  /**
   * Busca legislações por tipo de licença
   */
  static async getByLicenseType(licenseTypeId: string): Promise<LegislationResponseDTO[]> {
    return apiRequest<LegislationResponseDTO[]>(`${this.baseUrl}/by-license-type/${licenseTypeId}`);
  }
}

export default LegislationsService;

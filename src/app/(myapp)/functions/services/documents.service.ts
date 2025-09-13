/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApiResponse, ApiError } from '../api.functions';
import {
  FileResponseDTO,
  FileUrlDTO,
  DocumentRequestDTO,
  DocumentUploadResponseDTO,
  WrapperListDocumentDTO,
  DocumentSearchRequestDTO,
  DocumentBulkOperationDTO,
  DocumentBulkOperationResponseDTO
} from '../../types/documents.types';

/**
 * Serviço para gerenciamento de documentos
 */
export class DocumentsService {
  private static readonly baseUrl = '/documents';

  /**
   * Lista todos os documentos com paginação e filtros
   */
  static async getAll(params?: DocumentSearchRequestDTO): Promise<WrapperListDocumentDTO> {
    return apiRequest<WrapperListDocumentDTO>(
      `${this.baseUrl}${params ? `?${new URLSearchParams(params as any).toString()}` : ''}`,
      {
        method: 'GET',
      },
    );
  }

  /**
   * Busca um documento por ID
   */
  static async getById(id: string): Promise<FileResponseDTO> {
    return apiRequest<FileResponseDTO>(
      `${this.baseUrl}/${id}`,
      {
        method: 'GET',
      },
    );
  }

  /**
   * Faz upload de um novo documento
   */
  static async upload(file: File, metadata?: DocumentRequestDTO): Promise<DocumentUploadResponseDTO> {
    const formData = new FormData();
    formData.append('file', file);
    
    if (metadata) {
      Object.entries(metadata).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, typeof value === 'object' ? JSON.stringify(value) : String(value));
        }
      });
    }

    return apiRequest<DocumentUploadResponseDTO>(
      `${this.baseUrl}/upload`,
      {
        method: 'POST',
        body: formData,
      },
    );
  }

  /**
   * Atualiza metadados de um documento
   */
  static async update(id: string, data: Partial<DocumentRequestDTO>): Promise<FileResponseDTO> {
    return apiRequest<FileResponseDTO>(
      `${this.baseUrl}/${id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      },
    );
  }

  /**
   * Remove um documento
   */
  static async delete(id: string): Promise<void> {
    return apiRequest<void>(
      `${this.baseUrl}/${id}`,
      {
        method: 'DELETE',
      },
    );
  }

  /**
   * Ativa um documento
   */
  static async activate(id: string): Promise<FileResponseDTO> {
    return apiRequest<FileResponseDTO>(
      `${this.baseUrl}/${id}/activate`,
      {
        method: 'PATCH',
      },
    );
  }

  /**
   * Desativa um documento
   */
  static async deactivate(id: string): Promise<FileResponseDTO> {
    return apiRequest<FileResponseDTO>(
      `${this.baseUrl}/${id}/deactivate`,
      {
        method: 'PATCH',
      },
    );
  }

  /**
   * Obtém URL de download de um documento
   */
  static async getDownloadUrl(id: string): Promise<FileUrlDTO> {
    return apiRequest<FileUrlDTO>(
      `${this.baseUrl}/${id}/download-url`,
      {
        method: 'GET',
      },
    );
  }

  /**
   * Obtém URL de preview de um documento
   */
  static async getPreviewUrl(id: string): Promise<FileUrlDTO> {
    return apiRequest<FileUrlDTO>(
      `${this.baseUrl}/${id}/preview-url`,
      {
        method: 'GET',
      },
    );
  }

  /**
   * Operação em lote para múltiplos documentos
   */
  static async bulkOperation(operation: DocumentBulkOperationDTO): Promise<DocumentBulkOperationResponseDTO> {
    return apiRequest<DocumentBulkOperationResponseDTO>(
      `${this.baseUrl}/bulk`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(operation),
      },
    );
  }

  /**
   * Busca documentos por tags
   */
  static async getByTags(tags: string[]): Promise<WrapperListDocumentDTO> {
    const params = new URLSearchParams();
    tags.forEach(tag => params.append('tags', tag));
    
    return apiRequest<WrapperListDocumentDTO>(
      `${this.baseUrl}/by-tags?${params.toString()}`,
      {
        method: 'GET',
      },
    );
  }

  /**
   * Busca documentos por tipo
   */
  static async getByType(documentType: string): Promise<WrapperListDocumentDTO> {
    return apiRequest<WrapperListDocumentDTO>(
      `${this.baseUrl}/by-type/${documentType}`,
      {
        method: 'GET',
      },
    );
  }
}

// Função utilitária para requests da API
const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> => {
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

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        errorData.message || `HTTP error! status: ${response.status}`,
        response.status,
        errorData,
      );
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }
    
    return response as unknown as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      error instanceof Error ? error.message : 'Unknown error occurred',
      500,
      { originalError: error },
    );
  }
};
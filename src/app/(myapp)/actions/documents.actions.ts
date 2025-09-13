'use server';

import {
  FileResponseDTO,
  DocumentRequestDTO,
  DocumentUploadResponseDTO,
  WrapperListDocumentDTO,
  DocumentSearchRequestDTO,
  DocumentBulkOperationDTO,
  DocumentBulkOperationResponseDTO,
} from '../types/documents.types';
import { DocumentsService } from '../functions/services/documents.service';
import { revalidatePath } from 'next/cache';

/**
 * Lista documentos com filtros e paginação
 */
export async function getDocuments(
  params?: DocumentSearchRequestDTO,
): Promise<WrapperListDocumentDTO> {
  try {
    return await DocumentsService.getAll(params);
  } catch (error) {
    console.error('Error in getDocuments action:', error);
    throw error;
  }
}

/**
 * Busca documento por ID
 */
export async function getDocumentById(id: string): Promise<FileResponseDTO> {
  try {
    return await DocumentsService.getById(id);
  } catch (error) {
    console.error('Error in getDocumentById action:', error);
    throw error;
  }
}

/**
 * Upload de documento
 */
export async function uploadDocument(file: File, metadata?: DocumentRequestDTO): Promise<DocumentUploadResponseDTO> {
  try {
    const result = await DocumentsService.upload(file, metadata);
    revalidatePath('/documents');
    return result;
  } catch (error) {
    console.error('Error in uploadDocument action:', error);
    throw error;
  }
}

/**
 * Atualiza metadados do documento
 */
export async function updateDocument(
  id: string,
  data: Partial<DocumentRequestDTO>,
): Promise<FileResponseDTO> {
  try {
    const result = await DocumentsService.update(id, data);
    revalidatePath('/documents');
    revalidatePath(`/documents/${id}`);
    return result;
  } catch (error) {
    console.error('Error in updateDocument action:', error);
    throw error;
  }
}

/**
 * Remove documento
 */
export async function deleteDocument(id: string): Promise<void> {
  try {
    await DocumentsService.delete(id);
    revalidatePath('/documents');
  } catch (error) {
    console.error('Error in deleteDocument action:', error);
    throw error;
  }
}

/**
 * Ativa documento
 */
export async function activateDocument(id: string): Promise<FileResponseDTO> {
  try {
    const result = await DocumentsService.activate(id);
    revalidatePath('/documents');
    revalidatePath(`/documents/${id}`);
    return result;
  } catch (error) {
    console.error('Error in activateDocument action:', error);
    throw error;
  }
}

/**
 * Desativa documento
 */
export async function deactivateDocument(id: string): Promise<FileResponseDTO> {
  try {
    const result = await DocumentsService.deactivate(id);
    revalidatePath('/documents');
    revalidatePath(`/documents/${id}`);
    return result;
  } catch (error) {
    console.error('Error in deactivateDocument action:', error);
    throw error;
  }
}

/**
 * Operações em lote
 */
export async function batchDocumentOperation(
  action: 'activate' | 'deactivate' | 'delete',
  data: DocumentBulkOperationDTO,
): Promise<DocumentBulkOperationResponseDTO> {
  try {
    const result = await DocumentsService.bulkOperation(data);
    revalidatePath('/documents');
    return result;
  } catch (error) {
    console.error('Error in batch document operation:', error);
    throw error;
  }
}

/**
 * Obtém URL de download do documento
 */
export async function getDocumentDownloadUrl(id: string): Promise<string> {
  try {
    const result = await DocumentsService.getDownloadUrl(id);
    return result.downloadUrl;
  } catch (error) {
    console.error('Error in getDocumentDownloadUrl action:', error);
    throw error;
  }
}

/**
 * Obtém URL de preview do documento
 */
export async function getDocumentPreviewUrl(id: string): Promise<string> {
  try {
    const result = await DocumentsService.getPreviewUrl(id);
    return result.previewUrl || result.downloadUrl;
  } catch (error) {
    console.error('Error in getDocumentPreviewUrl action:', error);
    throw error;
  }
}

/**
 * Verifica status de operação em lote
 */
export async function getBatchOperationStatus(batchId: string): Promise<DocumentBulkOperationResponseDTO> {
  try {
    // Note: This method may need to be implemented in the service
    // For now, we'll use a placeholder implementation
    throw new Error('getBatchStatus method not implemented in DocumentsService');
  } catch (error) {
    console.error('Error getting batch operation status:', error);
    throw error;
  }
}

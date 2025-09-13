// Types for Documents API

export interface FileResponseDTO {
  id: string;
  fileName: string;
  originalFileName: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  fileExtension: string;
  uploadedBy?: string;
  uploadedAt: string;
  documentType?: 'LICENSE' | 'CERTIFICATE' | 'REPORT' | 'ATTACHMENT' | 'OTHER';
  description?: string;
  tags?: string[];
  isPublic: boolean;
  downloadCount: number;
  checksum?: string;
  metadata?: Record<string, unknown>;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FileUrlDTO {
  fileId: string;
  fileName: string;
  downloadUrl: string;
  previewUrl?: string;
  expiresAt?: string;
  isTemporary: boolean;
  accessToken?: string;
}

export interface DocumentRequestDTO {
  fileName: string;
  documentType?: 'LICENSE' | 'CERTIFICATE' | 'REPORT' | 'ATTACHMENT' | 'OTHER';
  description?: string;
  tags?: string[];
  isPublic?: boolean;
  metadata?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface DocumentUploadResponseDTO {
  file: FileResponseDTO;
  uploadUrl?: string;
  message: string;
}

export interface WrapperListDocumentDTO {
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
  content: FileResponseDTO[];
}

export interface DocumentSearchRequestDTO {
  fileName?: string;
  documentType?: 'LICENSE' | 'CERTIFICATE' | 'REPORT' | 'ATTACHMENT' | 'OTHER';
  uploadedBy?: string;
  dateFrom?: string;
  dateTo?: string;
  tags?: string[];
  isPublic?: boolean;
  active?: boolean;
  page?: number;
  size?: number;
  sort?: string;
}

export interface DocumentBulkOperationDTO {
  documentIds: string[];
  operation: 'DELETE' | 'ACTIVATE' | 'DEACTIVATE' | 'CHANGE_VISIBILITY';
  parameters?: Record<string, unknown>;
}

export interface DocumentBulkOperationResponseDTO {
  successCount: number;
  failureCount: number;
  results: {
    documentId: string;
    success: boolean;
    message?: string;
  }[];
}
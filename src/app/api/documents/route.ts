/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { apiClient } from '@/app/(myapp)/lib/api-client';
import {
  FileResponseDTO,
  DocumentRequestDTO,
  DocumentUploadResponseDTO,
  WrapperListDocumentDTO,
  DocumentSearchRequestDTO,
} from '@/app/(myapp)/types/documents.types';

// GET /api/documents - Lista documentos com filtros e paginação
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const params: DocumentSearchRequestDTO = {
      fileName: searchParams.get('fileName') || undefined,
      documentType: (searchParams.get('documentType') as any) || undefined,
      uploadedBy: searchParams.get('uploadedBy') || undefined,
      dateFrom: searchParams.get('dateFrom') || undefined,
      dateTo: searchParams.get('dateTo') || undefined,
      isPublic: searchParams.get('isPublic') ? searchParams.get('isPublic') === 'true' : undefined,
      active: searchParams.get('active') ? searchParams.get('active') === 'true' : undefined,
      page: searchParams.get('page') ? parseInt(searchParams.get('page')!) : undefined,
      size: searchParams.get('size') ? parseInt(searchParams.get('size')!) : undefined,
      sort: searchParams.get('sort') || undefined,
    };

    // Remove undefined values
    const cleanParams = Object.fromEntries(
      Object.entries(params).filter(([_, value]) => value !== undefined),
    );

    const queryString = new URLSearchParams(cleanParams as any).toString();
    const endpoint = `/documents${queryString ? `?${queryString}` : ''}`;

    const response = await apiClient.get<WrapperListDocumentDTO>(endpoint);
    return NextResponse.json(response);
  } catch (error: any) {
    console.error('Error fetching documents:', error);
    return NextResponse.json(
      { error: 'Failed to fetch documents' },
      { status: error.status || 500 },
    );
  }
}

// POST /api/documents/upload - Upload de documento
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Extrair metadados do FormData
    const metadata: DocumentRequestDTO = {
      fileName: (formData.get('fileName') as string) || file.name,
      documentType: (formData.get('documentType') as any) || 'OTHER',
      description: (formData.get('description') as string) || undefined,
      isPublic: formData.get('isPublic') ? formData.get('isPublic') === 'true' : false,
    };

    // Processar tags se fornecidas
    const tagsString = formData.get('tags') as string;
    if (tagsString) {
      try {
        metadata.tags = JSON.parse(tagsString);
      } catch {
        metadata.tags = tagsString.split(',').map((tag) => tag.trim());
      }
    }

    // Processar metadata se fornecida
    const metadataString = formData.get('metadata') as string;
    if (metadataString) {
      try {
        metadata.metadata = JSON.parse(metadataString);
      } catch {
        // Ignorar se não for JSON válido
      }
    }

    // Criar FormData para enviar ao backend
    const backendFormData = new FormData();
    backendFormData.append('file', file);

    Object.entries(metadata).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        backendFormData.append(
          key,
          typeof value === 'object' ? JSON.stringify(value) : String(value),
        );
      }
    });

    const response = await apiClient.post<DocumentUploadResponseDTO>(
      '/documents/upload',
      backendFormData,
    );

    return NextResponse.json(response);
  } catch (error: any) {
    console.error('Error uploading document:', error);
    return NextResponse.json(
      { error: 'Failed to upload document' },
      { status: error.status || 500 },
    );
  }
}

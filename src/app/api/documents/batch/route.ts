/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { apiClient } from '@/app/(myapp)/lib/api-client';
import {
  DocumentBulkOperationDTO,
  DocumentBulkOperationResponseDTO,
} from '@/app/(myapp)/types/documents.types';

// POST /api/documents/batch - Operações em lote
export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    if (!action) {
      return NextResponse.json(
        {
          error:
            'Action parameter is required. Use ?action=activate, ?action=deactivate, or ?action=delete',
        },
        { status: 400 },
      );
    }

    const body: DocumentBulkOperationDTO = await request.json();

    if (!body.documentIds || !Array.isArray(body.documentIds) || body.documentIds.length === 0) {
      return NextResponse.json(
        { error: 'documentIds array is required and must not be empty' },
        { status: 400 },
      );
    }

    let endpoint: string;
    let method: 'POST' | 'PATCH' | 'DELETE' = 'POST';

    switch (action) {
      case 'activate':
        endpoint = '/documents/batch/activate';
        method = 'PATCH';
        break;
      case 'deactivate':
        endpoint = '/documents/batch/deactivate';
        method = 'PATCH';
        break;
      case 'delete':
        endpoint = '/documents/batch/delete';
        method = 'DELETE';
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid action. Use activate, deactivate, or delete' },
          { status: 400 },
        );
    }

    let response: DocumentBulkOperationResponseDTO;

    if (method === 'PATCH') {
      response = await apiClient.patch<DocumentBulkOperationResponseDTO>(endpoint, body);
    } else if (method === 'DELETE') {
      response = await apiClient.delete<DocumentBulkOperationResponseDTO>(endpoint);
    } else {
      response = await apiClient.post<DocumentBulkOperationResponseDTO>(endpoint, body);
    }

    return NextResponse.json(response);
  } catch (error: any) {
    console.error('Error processing batch operation:', error);
    return NextResponse.json(
      { error: 'Failed to process batch operation' },
      { status: error.status || 500 },
    );
  }
}

// GET /api/documents/batch/status - Verificar status de operação em lote
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const batchId = searchParams.get('batchId');

    if (!batchId) {
      return NextResponse.json({ error: 'batchId parameter is required' }, { status: 400 });
    }

    const response = await apiClient.get<DocumentBulkOperationResponseDTO>(
      `/documents/batch/status/${batchId}`,
    );

    return NextResponse.json(response);
  } catch (error: any) {
    console.error('Error fetching batch status:', error);
    return NextResponse.json(
      { error: 'Failed to fetch batch status' },
      { status: error.status || 500 },
    );
  }
}

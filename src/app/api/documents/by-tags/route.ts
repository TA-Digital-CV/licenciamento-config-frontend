import { NextRequest, NextResponse } from 'next/server';
import { apiClient } from '../../../(myapp)/lib/api-client';
import { WrapperListDocumentDTO } from '../../../(myapp)/types/documents.types';

// GET /api/documents/by-tags - Busca documentos por tags
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tags = searchParams.getAll('tags');

    if (!tags || tags.length === 0) {
      return NextResponse.json(
        { error: 'At least one tag is required' },
        { status: 400 },
      );
    }

    // Construir query parameters
    const queryParams = new URLSearchParams();
    tags.forEach((tag) => queryParams.append('tags', tag));

    const response = await apiClient.get<WrapperListDocumentDTO>(
      `/documents/by-tags?${queryParams.toString()}`,
    );

    return NextResponse.json(response);
  } catch (error: any) {
    console.error('Error fetching documents by tags:', error);
    return NextResponse.json(
      { error: 'Failed to fetch documents by tags' },
      { status: error.status || 500 },
    );
  }
}
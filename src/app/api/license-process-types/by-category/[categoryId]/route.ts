import { NextRequest, NextResponse } from 'next/server';
import { apiClient } from '@/app/(myapp)/lib/api-client';
import { LicenseProcessTypeResponseDTO } from '@/app/(myapp)/types/license-process-types.types';

interface RouteParams {
  params: Promise<{
    categoryId: string;
  }>;
}

// GET /api/license-process-types/by-category/[categoryId] - Busca tipos de processo por categoria
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { categoryId } = await params;

    if (!categoryId) {
      return NextResponse.json({ error: 'Category ID is required' }, { status: 400 });
    }

    const response = await apiClient.get<LicenseProcessTypeResponseDTO[]>(
      `/license-process-types/by-category/${encodeURIComponent(categoryId)}`,
    );

    return NextResponse.json(response);
  } catch (error: any) {
    console.error('Error fetching license process types by category:', error);
    return NextResponse.json(
      { error: 'Failed to fetch license process types by category' },
      { status: error.status || 500 },
    );
  }
}

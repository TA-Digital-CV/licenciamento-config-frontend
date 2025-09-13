import { NextRequest, NextResponse } from 'next/server';
import { apiClient } from '@/app/(myapp)/lib/api-client';
import { WrapperListEntityDTO } from '@/app/(myapp)/types/entities.types';

interface RouteParams {
  params: Promise<{
    entityType: string;
  }>;
}

// GET /api/entities/by-type/[entityType] - Carrega entidades por tipo
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { entityType } = await params;
    const { searchParams } = new URL(request.url);

    if (!entityType) {
      return NextResponse.json({ error: 'Entity type is required' }, { status: 400 });
    }

    // Parâmetros de paginação e filtros
    const pageNumber = searchParams.get('pageNumber') || '0';
    const pageSize = searchParams.get('pageSize') || '20';
    const sort = searchParams.get('sort') || 'name,asc';
    const active = searchParams.get('active') || 'true';
    const search = searchParams.get('search');

    // Construir query parameters
    const queryParams = new URLSearchParams({
      pageNumber,
      pageSize,
      sort,
      active,
    });

    if (search) {
      queryParams.append('search', search);
    }

    const response = await apiClient.get<WrapperListEntityDTO>(
      `/entities/by-type/${encodeURIComponent(entityType)}?${queryParams.toString()}`,
    );

    return NextResponse.json(response);
  } catch (error: any) {
    console.error('Error fetching entities by type:', error);
    return NextResponse.json(
      { error: 'Failed to fetch entities by type' },
      { status: error.status || 500 },
    );
  }
}

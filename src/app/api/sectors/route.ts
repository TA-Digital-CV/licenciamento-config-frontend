import { NextRequest, NextResponse } from 'next/server';
import { apiClient, ApiResponse } from '../../(myapp)/lib/api-client';
import { SectorResponseDTO, SectorRequestDTO } from '@/app/(myapp)/types/sectors.types';

// GET /api/sectors
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const params: Record<string, string> = {};

    // Map query parameters
    if (searchParams.get('active') !== null) {
      params.active = searchParams.get('active')!;
    }
    if (searchParams.get('sectorType')) {
      params.sectorType = searchParams.get('sectorType')!;
    }
    if (searchParams.get('page')) {
      params.page = searchParams.get('page')!;
    }
    if (searchParams.get('size')) {
      params.size = searchParams.get('size')!;
    }

    const response = await apiClient.get<ApiResponse<SectorResponseDTO>>('/sectors', params);

    // Transform backend response to match frontend expectations
    const transformedContent = response.content.map((sector) => ({
      id: sector.id,
      name: sector.name,
      description: sector.description || '',
      code: sector.code,
      sectorTypeKey: sector.sectorType,
      sectorTypeValue: sector.sectorType,
      active: sector.active,
      sortOrder: sector.sortOrder || 0,
      metadata: sector.metadata || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));

    return NextResponse.json({
      content: transformedContent,
      total: response.total,
    });
  } catch (error) {
    console.error('Error fetching sectors:', error);
    return NextResponse.json({ message: 'Failed to fetch sectors' }, { status: 500 });
  }
}

// POST /api/sectors
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const sectorData: SectorRequestDTO = {
      name: body.name,
      description: body.description || undefined,
      code: body.code,
      sectorTypeKey: body.sectorTypeKey,
      active: body.active !== false,
      sortOrder: body.sortOrder || undefined,
      metadata: body.metadata || undefined,
    };

    const response = await apiClient.post<SectorResponseDTO>('/sectors', sectorData);

    // Transform backend response to match frontend expectations
    const transformedResponse = {
      id: response.id,
      name: response.name,
      description: response.description || '',
      code: response.code,
      sectorTypeKey: response.sectorType,
      sectorTypeValue: response.sectorType,
      active: response.active,
      sortOrder: response.sortOrder || 0,
      metadata: response.metadata || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json(transformedResponse, { status: 201 });
  } catch (error) {
    console.error('Error creating sector:', error);
    return NextResponse.json({ message: 'Failed to create sector' }, { status: 500 });
  }
}

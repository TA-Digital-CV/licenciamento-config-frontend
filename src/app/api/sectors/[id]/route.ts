import { NextRequest, NextResponse } from 'next/server';
import { apiClient } from '../../../(myapp)/lib/api-client';
import { SectorResponseDTO, SectorRequestDTO } from '../../../(myapp)/types/sectors.types';

// Helper: transforma SectorResponseDTO no formato esperado pelo frontend
function transformSector(res: SectorResponseDTO) {
  return {
    id: res.id,
    name: res.name,
    description: res.description || '',
    code: res.code,
    sectorTypeKey: res.sectorType,
    sectorTypeValue: res.sectorType,
    active: res.active,
    sortOrder: res.sortOrder || 0,
    metadata: res.metadata || null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

// GET /api/sectors/[id]
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const response = await apiClient.get<SectorResponseDTO>(`/sectors/${id}`);
    return NextResponse.json(transformSector(response));
  } catch (error) {
    console.error('Error fetching sector:', error);
    return NextResponse.json({ message: 'Sector not found' }, { status: 404 });
  }
}

// PUT /api/sectors/[id]
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Check if this is an enable/disable operation
    if (body.action === 'enable') {
      await apiClient.patch(`/sectors/${id}/ativar`);
      const response = await apiClient.get<SectorResponseDTO>(`/sectors/${id}`);
      return NextResponse.json(transformSector(response));
    }

    if (body.action === 'disable') {
      await apiClient.patch(`/sectors/${id}/desativar`);
      const response = await apiClient.get<SectorResponseDTO>(`/sectors/${id}`);
      return NextResponse.json(transformSector(response));
    }

    // Regular update operation
    const sectorData: SectorRequestDTO = {
      name: body.name,
      description: body.description,
      code: body.code,
      sectorTypeKey: body.sectorTypeKey,
      active: body.active,
      sortOrder: body.sortOrder,
      metadata: body.metadata,
    };

    const response = await apiClient.put<SectorResponseDTO>(`/sectors/${id}`, sectorData);
    return NextResponse.json(transformSector(response));
  } catch (error) {
    console.error('Error updating sector:', error);
    return NextResponse.json({ message: 'Failed to update sector' }, { status: 500 });
  }
}

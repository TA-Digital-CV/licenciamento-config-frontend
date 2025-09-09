import { NextRequest, NextResponse } from 'next/server';
import { apiClient } from '../../../(myapp)/lib/api-client';
import { SectorResponseDTO, SectorRequestDTO } from '../../../(myapp)/types/sectors.types';

// GET /api/sectors/[id]
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const response = await apiClient.get<SectorResponseDTO>(`/sectors/${id}`);

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

    return NextResponse.json(transformedResponse);
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
      // Buscar o setor atualizado
      const response = await apiClient.get<SectorResponseDTO>(`/sectors/${id}`);

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

      return NextResponse.json(transformedResponse);
    }

    if (body.action === 'disable') {
      await apiClient.patch(`/sectors/${id}/desativar`);
      // Buscar o setor atualizado
      const response = await apiClient.get<SectorResponseDTO>(`/sectors/${id}`);

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

      return NextResponse.json(transformedResponse);
    }

    // Regular update operation
    const sectorData: SectorRequestDTO = {
      name: body.name,
      description: body.description,
      code: body.code, // Note: code might be immutable on backend
      sectorTypeKey: body.sectorTypeKey,
      active: body.active,
      sortOrder: body.sortOrder,
      metadata: body.metadata,
    };

    const response = await apiClient.put<SectorResponseDTO>(`/sectors/${id}`, sectorData);

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

    return NextResponse.json(transformedResponse);
  } catch (error) {
    console.error('Error updating sector:', error);
    return NextResponse.json({ message: 'Failed to update sector' }, { status: 500 });
  }
}

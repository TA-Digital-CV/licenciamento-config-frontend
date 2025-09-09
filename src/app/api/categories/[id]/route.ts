import { NextRequest, NextResponse } from 'next/server';
import { apiClient } from '../../../(myapp)/lib/api-client';
import { CategoryResponseDTO, CategoryRequestDTO } from '../../../(myapp)/types/categories.types';

// GET /api/categories/[id]
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const response = await apiClient.get<CategoryResponseDTO>(`/categories/${id}`);

    // Transform backend response to match frontend expectations
    const transformedResponse = {
      id: response.id,
      name: response.name,
      description: '',
      code: response.code,
      active: true,
      level: response.level,
      sortOrder: 0,
      metadata: response.metadata,
      path: response.path,
      parentId: null,
      sectorId: response.sectorId,
      sectorName: response.sectorName,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json(transformedResponse);
  } catch (error) {
    console.error('Error fetching category:', error);
    return NextResponse.json({ message: 'Category not found' }, { status: 404 });
  }
}

// PUT /api/categories/[id]
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Check if this is an enable/disable operation
    if (body.action === 'enable') {
      await apiClient.patch(`/categories/${id}/ativar`);
      // Buscar a categoria atualizada
      const response = await apiClient.get<CategoryResponseDTO>(`/categories/${id}`);

      const transformedResponse = {
        id: response.id,
        name: response.name,
        description: '',
        code: response.code,
        active: true,
        level: response.level,
        sortOrder: 0,
        metadata: response.metadata,
        path: response.path,
        parentId: null,
        sectorId: response.sectorId,
        sectorName: response.sectorName,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      return NextResponse.json(transformedResponse);
    }

    if (body.action === 'disable') {
      await apiClient.patch(`/categories/${id}/desativar`);
      // Buscar a categoria atualizada
      const response = await apiClient.get<CategoryResponseDTO>(`/categories/${id}`);

      const transformedResponse = {
        id: response.id,
        name: response.name,
        description: '', // Not available in backend DTO
        code: response.code,
        active: true, // Not available in backend DTO, default to true
        level: response.level,
        sortOrder: 0, // Not available in backend DTO, default to 0
        metadata: response.metadata,
        path: response.path,
        parentId: null, // Derived from path or children structure
        sectorId: response.sectorId,
        sectorName: response.sectorName,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      return NextResponse.json(transformedResponse);
    }

    // Regular update operation
    const categoryData: CategoryRequestDTO = {
      name: body.name,
      description: body.description,
      code: body.code, // Note: code might be immutable on backend
      active: body.active,
      sortOrder: body.sortOrder,
      metadata: body.metadata,
      parentId: body.parentId,
      sectorId: body.sectorId,
    };

    const response = await apiClient.put<CategoryResponseDTO>(`/categories/${id}`, categoryData);

    const transformedResponse = {
      id: response.id,
      name: response.name,
      description: '', // Not available in backend DTO
      code: response.code,
      active: true, // Not available in backend DTO, default to true
      level: response.level,
      sortOrder: 0, // Not available in backend DTO, default to 0
      metadata: response.metadata,
      path: response.path,
      parentId: null, // Derived from path or children structure
      sectorId: response.sectorId,
      sectorName: response.sectorName,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json(transformedResponse);
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json({ message: 'Failed to update category' }, { status: 500 });
  }
}

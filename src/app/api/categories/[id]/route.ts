/* eslint-disable @typescript-eslint/no-explicit-any */
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
      description: (response as any)?.description ?? '',
      code: response.code,
      active: response.active,
      level: response.level,
      sortOrder: (response as any)?.level ?? 0,
      metadata: response.metadata,
      path: response.path,
      parentId: (response as any)?.parentId ?? null,
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
        description: (response as any)?.description ?? '',
        code: response.code,
        active: false,
        level: response.level,
        sortOrder: (response as any)?.level ?? 0,
        metadata: response.metadata,
        path: response.path,
        parentId: (response as any)?.parentId ?? null,
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
        description: (response as any)?.description ?? '',
        code: response.code,
        active: (response as CategoryResponseDTO).active,
        level: response.level,
        sortOrder: (response as any)?.level ?? 0,
        metadata: response.metadata,
        path: response.path,
        parentId: (response as any)?.parentId ?? null,
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
      code: body.code,
      // active omitido: usar ações específicas enable/disable
      sortOrder: body.sortOrder,
      metadata: body.metadata && typeof body.metadata === 'object' ? body.metadata : undefined,
      parentId: body.parentId ?? undefined,
      sectorId: body.sectorId,
    };

    let response = await apiClient.put<CategoryResponseDTO | undefined>(`/categories/${id}`, categoryData);

    // Alguns backends retornam 204/sem body no update. Buscar a categoria para construir resposta.
    if (!response || !(response as any)?.id) {
      response = await apiClient.get<CategoryResponseDTO>(`/categories/${id}`);
    }

    const transformedResponse = {
      id: (response as CategoryResponseDTO).id,
      name: (response as CategoryResponseDTO).name,
      description: ((response as any))?.description ?? '',
      code: (response as CategoryResponseDTO).code,
      active: true,
      level: (response as CategoryResponseDTO).level,
      sortOrder: ((response as any))?.level ?? 0,
      metadata: (response as CategoryResponseDTO).metadata,
      path: (response as CategoryResponseDTO).path,
      parentId: ((response as any))?.parentId ?? null,
      sectorId: (response as CategoryResponseDTO).sectorId,
      sectorName: (response as CategoryResponseDTO).sectorName,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json(transformedResponse);
  } catch (error: any) {
    console.error('Error updating category:', error);
    const status = error?.status || 500;
    let details: any = undefined;
    try {
      if (error?.body) {
        details = JSON.parse(error.body);
      }
    } catch {
      details = error?.body || undefined;
    }
    return NextResponse.json(
      { message: 'Failed to update category', details },
      { status },
    );
  }
}

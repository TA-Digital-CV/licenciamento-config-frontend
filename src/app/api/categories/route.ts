/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { apiClient, ApiResponse } from '../../(myapp)/lib/api-client';
import { CategoryResponseDTO, CategoryRequestDTO } from '@/app/(myapp)/types/categories.types';

// GET /api/categories
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const params: Record<string, string> = {};

    // Map query parameters
    if (searchParams.get('active') !== null) {
      params.active = searchParams.get('active')!;
    }
    if (searchParams.get('parentId')) {
      params.parentId = searchParams.get('parentId')!;
    }
    if (searchParams.get('sectorId')) {
      params.sectorId = searchParams.get('sectorId')!;
    }
    if (searchParams.get('page')) {
      params.page = searchParams.get('page')!;
    }
    if (searchParams.get('size')) {
      params.size = searchParams.get('size')!;
    }

    const response = await apiClient.get<ApiResponse<CategoryResponseDTO>>('/categories', params);

    // Transform backend response to match frontend expectations
    const transformedContent = response.content.map((category) => ({
      id: category.id,
      name: category.name,
      description: (category as any)?.description ?? '',
      code: category.code,
      active: category.active,
      level: category.level,
      sortOrder: (category as any)?.level ?? 0,
      metadata: category.metadata,
      path: category.path,
      parentId: (category as any)?.parentId ?? null,
      sectorId: category.sectorId,
      sectorName: category.sectorName,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));

    return NextResponse.json({
      content: transformedContent,
      total: (response as any)?.total ?? (response as any)?.totalElements ?? transformedContent.length,
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ message: 'Failed to fetch categories' }, { status: 500 });
  }
}

// POST /api/categories
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const categoryData: CategoryRequestDTO = {
      name: body.name,
      description: body.description || undefined,
      code: body.code,
      active: body.active !== false,
      sortOrder: body.sortOrder || undefined,
      metadata: body.metadata || undefined,
      parentId: body.parentId || undefined,
      sectorId: body.sectorId,
    };

    const response = await apiClient.post<CategoryResponseDTO>('/categories', categoryData);

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

    return NextResponse.json(transformedResponse, { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json({ message: 'Failed to create category' }, { status: 500 });
  }
}

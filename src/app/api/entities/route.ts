/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { apiClient, ApiResponse } from '../../(myapp)/lib/api-client';
import { EntityRequestDTO, EntityResponseDTO } from '@/app/(myapp)/types/entities.types';

// GET /api/entities
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const params: Record<string, string> = {};

    // Map query parameters
    if (searchParams.get('active') !== null) {
      params.active = searchParams.get('active')!;
    }
    if (searchParams.get('entityType')) {
      params.entityType = searchParams.get('entityType')!;
    }
    if (searchParams.get('licenseTypeId')) {
      params.licenseTypeId = searchParams.get('licenseTypeId')!;
    }
    if (searchParams.get('page')) {
      params.page = searchParams.get('page')!;
    }
    if (searchParams.get('size')) {
      params.size = searchParams.get('size')!;
    }

    const response = await apiClient.get<ApiResponse<EntityResponseDTO>>('/entities', params);

    // Transform backend response to match frontend expectations
    const transformedContent = response.content.map((entity) => ({
      id: entity.id,
      licenseTypeId: entity.licenseTypeId,
      licenseTypeName: entity.licenseTypeName || '',
      entityType: entity.entityType,
      name: entity.name,
      description: entity.description || '',
      taxId: entity.taxId || '',
      registrationNumber: entity.registrationNumber || '',
      legalForm: entity.legalForm || '',
      sector: entity.sectorId || '',
      address: entity.address || '',
      city: entity.city || '',
      state: entity.state || '',
      postalCode: entity.postalCode || '',
      country: entity.country || '',
      website: entity.website || '',
      email: entity.email || '',
      phone: entity.phone || '',
      active: entity.active,
      metadata: entity.metadata || {},
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    }));

    return NextResponse.json({
      content: transformedContent,
      total:
        (response as any)?.total ?? (response as any)?.totalElements ?? transformedContent.length,
    });
  } catch (error) {
    console.error('Error fetching entities:', error);
    return NextResponse.json({ message: 'Failed to fetch entities' }, { status: 500 });
  }
}

// POST /api/entities
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const entityData: EntityRequestDTO = {
      code: body.code || '',
      licenseTypeId: body.licenseTypeId || undefined,
      entityType: body.entityType || '',
      name: body.name || '',
      description: body.description || undefined,
      taxId: body.taxId || undefined,
      registrationNumber: body.registrationNumber || undefined,
      legalForm: body.legalForm || undefined,
      sectorId: body.sectorId || undefined,
      address: body.address || undefined,
      city: body.city || undefined,
      state: body.state || undefined,
      postalCode: body.postalCode || undefined,
      country: body.country || undefined,
      phone: body.phone || undefined,
      email: body.email || undefined,
      website: body.website || undefined,
      active: body.active !== undefined ? body.active : true,
      metadata: body.metadata || undefined,
    };

    const response = await apiClient.post<EntityResponseDTO>('/entities', entityData);

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('Error creating entity:', error);
    return NextResponse.json({ message: 'Failed to create entity' }, { status: 500 });
  }
}

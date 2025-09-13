/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { apiClient } from '../../../(myapp)/lib/api-client';
import { EntityRequestDTO, EntityResponseDTO } from '@/app/(myapp)/types/entities.types';

// GET /api/entities/[id]
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const response = await apiClient.get<EntityResponseDTO>(`/entities/${id}`);
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching entity:', error);
    return NextResponse.json({ message: 'Failed to fetch entity' }, { status: 500 });
  }
}

// PUT /api/entities/[id]
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
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

    const response = await apiClient.put<EntityResponseDTO>(`/entities/${id}`, entityData);
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error updating entity:', error);
    return NextResponse.json({ message: 'Failed to update entity' }, { status: 500 });
  }
}

// DELETE /api/entities/[id]
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await apiClient.delete(`/entities/${id}`);
    return NextResponse.json({ message: 'Entity deleted successfully' });
  } catch (error) {
    console.error('Error deleting entity:', error);
    return NextResponse.json({ message: 'Failed to delete entity' }, { status: 500 });
  }
}

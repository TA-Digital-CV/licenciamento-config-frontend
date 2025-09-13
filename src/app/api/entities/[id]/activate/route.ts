import { NextRequest, NextResponse } from 'next/server';
import { apiClient } from '../../../../(myapp)/lib/api-client';
import { EntityResponseDTO } from '../../../../(myapp)/types/entities.types';

// PATCH /api/entities/[id]/activate
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: 'Entity ID is required' }, { status: 400 });
    }

    // Call backend activation endpoint
    await apiClient.patch(`/entities/${id}/ativar`);

    // Get updated entity
    const response = await apiClient.get<EntityResponseDTO>(`/entities/${id}`);

    return NextResponse.json({
      ...response,
      message: 'Entity activated successfully',
    });
  } catch (error) {
    console.error('Error activating entity:', error);
    return NextResponse.json({ error: 'Failed to activate entity' }, { status: 500 });
  }
}

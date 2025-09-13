import { NextRequest, NextResponse } from 'next/server';
import { apiClient } from '../../../../(myapp)/lib/api-client';
import { EntityResponseDTO } from '../../../../(myapp)/types/entities.types';

// PATCH /api/entities/[id]/deactivate
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: 'Entity ID is required' }, { status: 400 });
    }

    // Call backend deactivation endpoint
    await apiClient.patch(`/entities/${id}/desativar`);

    // Get updated entity
    const response = await apiClient.get<EntityResponseDTO>(`/entities/${id}`);

    return NextResponse.json({
      ...response,
      message: 'Entity deactivated successfully',
    });
  } catch (error) {
    console.error('Error deactivating entity:', error);
    return NextResponse.json({ error: 'Failed to deactivate entity' }, { status: 500 });
  }
}

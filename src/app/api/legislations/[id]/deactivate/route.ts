import { NextRequest, NextResponse } from 'next/server';
import { apiClient } from '../../../../(myapp)/lib/api-client';
import { LegislationResponseDTO } from '../../../../(myapp)/types/legislations.types';

// PATCH /api/legislations/[id]/deactivate
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: 'Legislation ID is required' }, { status: 400 });
    }

    // Call backend deactivation endpoint
    await apiClient.patch(`/legislations/${id}/desativar`);

    // Get updated legislation
    const response = await apiClient.get<LegislationResponseDTO>(`/legislations/${id}`);

    return NextResponse.json({
      ...response,
      message: 'Legislation deactivated successfully',
    });
  } catch (error) {
    console.error('Error deactivating legislation:', error);
    return NextResponse.json({ error: 'Failed to deactivate legislation' }, { status: 500 });
  }
}

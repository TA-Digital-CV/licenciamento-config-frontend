import { NextRequest, NextResponse } from 'next/server';
import { apiClient } from '../../../../(myapp)/lib/api-client';
import { LegislationResponseDTO } from '../../../../(myapp)/types/legislations.types';

// PATCH /api/legislations/[id]/activate
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: 'Legislation ID is required' }, { status: 400 });
    }

    // Call backend activation endpoint
    await apiClient.patch(`/legislations/${id}/ativar`);

    // Get updated legislation
    const response = await apiClient.get<LegislationResponseDTO>(`/legislations/${id}`);

    return NextResponse.json({
      ...response,
      message: 'Legislation activated successfully',
    });
  } catch (error) {
    console.error('Error activating legislation:', error);
    return NextResponse.json({ error: 'Failed to activate legislation' }, { status: 500 });
  }
}

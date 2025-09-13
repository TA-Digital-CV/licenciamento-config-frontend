import { NextRequest, NextResponse } from 'next/server';
import { apiClient } from '../../../../(myapp)/lib/api-client';
import { ProcessTypeFeeResponseDTO } from '../../../../(myapp)/types/process-type-fees.types';

// PATCH /api/process-type-fees/[id]/deactivate
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: 'Process type fee ID is required' }, { status: 400 });
    }

    // Call backend deactivation endpoint
    await apiClient.patch(`/process-type-fees/${id}/desativar`);

    // Get updated process type fee
    const response = await apiClient.get<ProcessTypeFeeResponseDTO>(`/process-type-fees/${id}`);

    return NextResponse.json({
      ...response,
      message: 'Process type fee deactivated successfully',
    });
  } catch (error) {
    console.error('Error deactivating process type fee:', error);
    return NextResponse.json({ error: 'Failed to deactivate process type fee' }, { status: 500 });
  }
}

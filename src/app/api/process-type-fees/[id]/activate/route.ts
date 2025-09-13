import { NextRequest, NextResponse } from 'next/server';
import { apiClient } from '../../../../(myapp)/lib/api-client';
import { ProcessTypeFeeResponseDTO } from '../../../../(myapp)/types/process-type-fees.types';

// PATCH /api/process-type-fees/[id]/activate
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: 'Process type fee ID is required' }, { status: 400 });
    }

    // Call backend activation endpoint
    await apiClient.patch(`/process-type-fees/${id}/ativar`);

    // Get updated process type fee
    const response = await apiClient.get<ProcessTypeFeeResponseDTO>(`/process-type-fees/${id}`);

    return NextResponse.json({
      ...response,
      message: 'Process type fee activated successfully',
    });
  } catch (error) {
    console.error('Error activating process type fee:', error);
    return NextResponse.json({ error: 'Failed to activate process type fee' }, { status: 500 });
  }
}

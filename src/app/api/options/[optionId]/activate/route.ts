import { NextRequest, NextResponse } from 'next/server';
import { apiClient } from '../../../../(myapp)/lib/api-client';
import { OptionResponseDTO } from '../../../../(myapp)/types/options.types';

// PATCH /api/options/[optionId]/activate
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ optionId: string }> }) {
  try {
    const { optionId } = await params;

    if (!optionId) {
      return NextResponse.json({ error: 'Option ID is required' }, { status: 400 });
    }

    // Call backend activation endpoint
    await apiClient.patch(`/options/${optionId}/ativar`);

    // Get updated option
    const response = await apiClient.get<OptionResponseDTO>(`/options/${optionId}`);

    return NextResponse.json({
      ...response,
      message: 'Option activated successfully',
    });
  } catch (error) {
    console.error('Error activating option:', error);
    return NextResponse.json({ error: 'Failed to activate option' }, { status: 500 });
  }
}

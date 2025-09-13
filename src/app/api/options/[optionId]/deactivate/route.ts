import { NextRequest, NextResponse } from 'next/server';
import { apiClient } from '../../../../(myapp)/lib/api-client';
import { OptionResponseDTO } from '../../../../(myapp)/types/options.types';

// PATCH /api/options/[optionId]/deactivate
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ optionId: string }> }) {
  try {
    const { optionId } = await params;

    if (!optionId) {
      return NextResponse.json({ error: 'Option ID is required' }, { status: 400 });
    }

    // Call backend deactivation endpoint
    await apiClient.patch(`/options/${optionId}/desativar`);

    // Get updated option
    const response = await apiClient.get<OptionResponseDTO>(`/options/${optionId}`);

    return NextResponse.json({
      ...response,
      message: 'Option deactivated successfully',
    });
  } catch (error) {
    console.error('Error deactivating option:', error);
    return NextResponse.json({ error: 'Failed to deactivate option' }, { status: 500 });
  }
}

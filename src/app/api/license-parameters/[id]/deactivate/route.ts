import { NextRequest, NextResponse } from 'next/server';
import { apiClient } from '../../../../(myapp)/lib/api-client';
import { LicenseParameterResponseDTO } from '../../../../(myapp)/types/license-parameters.types';

// PATCH /api/license-parameters/[id]/deactivate
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: 'License parameter ID is required' }, { status: 400 });
    }

    // Call backend deactivation endpoint
    await apiClient.patch(`/license-parameters/${id}/desativar`);

    // Get updated license parameter
    const response = await apiClient.get<LicenseParameterResponseDTO>(`/license-parameters/${id}`);

    return NextResponse.json({
      ...response,
      message: 'License parameter deactivated successfully',
    });
  } catch (error) {
    console.error('Error deactivating license parameter:', error);
    return NextResponse.json({ error: 'Failed to deactivate license parameter' }, { status: 500 });
  }
}

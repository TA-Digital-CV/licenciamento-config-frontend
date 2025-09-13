import { NextRequest, NextResponse } from 'next/server';
import { apiClient } from '../../../../(myapp)/lib/api-client';
import { LicenseParameterResponseDTO } from '../../../../(myapp)/types/license-parameters.types';

// PATCH /api/license-parameters/[id]/activate
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: 'License parameter ID is required' }, { status: 400 });
    }

    // Call backend activation endpoint
    await apiClient.patch(`/license-parameters/${id}/ativar`);

    // Get updated license parameter
    const response = await apiClient.get<LicenseParameterResponseDTO>(`/license-parameters/${id}`);

    return NextResponse.json({
      ...response,
      message: 'License parameter activated successfully',
    });
  } catch (error) {
    console.error('Error activating license parameter:', error);
    return NextResponse.json({ error: 'Failed to activate license parameter' }, { status: 500 });
  }
}

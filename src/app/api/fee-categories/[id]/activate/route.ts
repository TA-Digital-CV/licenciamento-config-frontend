import { NextRequest, NextResponse } from 'next/server';
import { apiClient } from '../../../../(myapp)/lib/api-client';
import { FeeCategoryResponseDTO } from '../../../../(myapp)/types/fee-categories.types';

// PATCH /api/fee-categories/[id]/activate
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: 'Fee category ID is required' }, { status: 400 });
    }

    // Call backend activation endpoint
    await apiClient.patch(`/fee-categories/${id}/ativar`);

    // Get updated fee category
    const response = await apiClient.get<FeeCategoryResponseDTO>(`/fee-categories/${id}`);

    return NextResponse.json({
      ...response,
      message: 'Fee category activated successfully',
    });
  } catch (error) {
    console.error('Error activating fee category:', error);
    return NextResponse.json({ error: 'Failed to activate fee category' }, { status: 500 });
  }
}

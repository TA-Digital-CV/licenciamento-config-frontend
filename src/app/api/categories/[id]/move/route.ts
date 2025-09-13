/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { apiClient } from '../../../../(myapp)/lib/api-client';

// PATCH /api/categories/[id]/move
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();

    const moveData = {
      newParentId: body.newParentId || null,
      newPosition: body.newPosition || undefined,
      targetSectorId: body.targetSectorId || undefined,
    };

    const response = await apiClient.patch(`/categories/${id}/move`, moveData);
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error moving category:', error);
    return NextResponse.json({ message: 'Failed to move category' }, { status: 500 });
  }
}

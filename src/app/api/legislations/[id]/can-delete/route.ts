import { NextRequest, NextResponse } from 'next/server';
import { apiClient } from '../../../../(myapp)/lib/api-client';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

// GET /api/legislations/[id]/can-delete - Verifica se uma legislação pode ser excluída
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: 'Legislation ID is required' }, { status: 400 });
    }

    const response = await apiClient.get<{ canDelete: boolean; reason?: string }>(
      `/legislations/${encodeURIComponent(id)}/can-delete`,
    );

    return NextResponse.json(response);
  } catch (error: any) {
    console.error('Error checking if legislation can be deleted:', error);
    return NextResponse.json(
      { error: 'Failed to check if legislation can be deleted' },
      { status: error.status || 500 },
    );
  }
}

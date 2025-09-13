import { NextRequest, NextResponse } from 'next/server';
import { apiClient } from '@/app/(myapp)/lib/api-client';
import { LegislationResponseDTO } from '@/app/(myapp)/types/legislations.types';

interface RouteParams {
  params: Promise<{
    licenseTypeId: string;
  }>;
}

// GET /api/legislations/by-license-type/[licenseTypeId] - Busca legislações por tipo de licença
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { licenseTypeId } = await params;

    if (!licenseTypeId) {
      return NextResponse.json({ error: 'License Type ID is required' }, { status: 400 });
    }

    const response = await apiClient.get<LegislationResponseDTO[]>(
      `/legislations/by-license-type/${encodeURIComponent(licenseTypeId)}`,
    );

    return NextResponse.json(response);
  } catch (error: any) {
    console.error('Error fetching legislations by license type:', error);
    return NextResponse.json(
      { error: 'Failed to fetch legislations by license type' },
      { status: error.status || 500 },
    );
  }
}

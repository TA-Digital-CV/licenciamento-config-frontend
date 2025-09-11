import { NextRequest, NextResponse } from 'next/server';
import { apiClient } from '@/app/(myapp)/lib/api-client';
import {
  WrapperListLegislationDTO,
  LegislationRequestDTO,
  LegislationResponseDTO,
} from '@/app/(myapp)/types/legislations.types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const active = searchParams.get('active') || 'true';
    const legislationType = searchParams.get('legislationType');
    const licenseTypeId = searchParams.get('licenseTypeId');
    const name = searchParams.get('name');
    const pageNumber = searchParams.get('pageNumber') || '0';
    const pageSize = searchParams.get('pageSize') || '20';

    // Build query parameters matching backend controller
    const params = new URLSearchParams({
      pageNumber,
      pageSize,
      active,
    });

    if (legislationType) params.append('legislationType', legislationType);
    if (licenseTypeId) params.append('licenseTypeId', licenseTypeId);
    if (name) params.append('name', name);

    const response = await apiClient.get<WrapperListLegislationDTO>(`/legislations?${params.toString()}`);

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching legislations:', error);
    return NextResponse.json({ error: 'Failed to fetch legislations' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: LegislationRequestDTO = await request.json();

    if (!body.title || !body.legislationType) {
      return NextResponse.json(
        { error: 'Missing required fields: title, legislationType' },
        { status: 400 },
      );
    }

    const response = await apiClient.post<LegislationResponseDTO>('/legislations', body);

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('Error creating legislation:', error);
    return NextResponse.json({ error: 'Failed to create legislation' }, { status: 500 });
  }
}
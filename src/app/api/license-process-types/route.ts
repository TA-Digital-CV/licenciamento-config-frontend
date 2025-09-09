import { NextRequest, NextResponse } from 'next/server';
import { apiClient } from '@/app/(myapp)/lib/api-client';
import {
  WrapperListLicenseProcessTypesDTO,
  LicenseProcessTypeRequestDTO,
  LicenseProcessTypeResponseDTO,
} from '@/app/(myapp)/types/license-process-types.types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const active = searchParams.get('active') || 'true';
    const licenseTypeId = searchParams.get('licenseTypeId');
    const processType = searchParams.get('processType');
    const pageNumber = searchParams.get('pageNumber') || '0';
    const pageSize = searchParams.get('pageSize') || '20';

    // Build query parameters matching backend controller
    const params = new URLSearchParams({
      pageNumber,
      pageSize,
      active,
    });

    if (licenseTypeId) params.append('licenseTypeId', licenseTypeId);
    if (processType) params.append('processType', processType);

    const response = await apiClient.get<WrapperListLicenseProcessTypesDTO>(`/license-process-types?${params.toString()}`);

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching license process types:', error);
    return NextResponse.json({ error: 'Failed to fetch license process types' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: LicenseProcessTypeRequestDTO = await request.json();

    if (!body.name || !body.processType || !body.licenseTypeId) {
      return NextResponse.json(
        { error: 'Missing required fields: name, processType, licenseTypeId' },
        { status: 400 },
      );
    }

    const response = await apiClient.post<LicenseProcessTypeResponseDTO>('/license-process-types', body);

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('Error creating license process type:', error);
    return NextResponse.json({ error: 'Failed to create license process type' }, { status: 500 });
  }
}
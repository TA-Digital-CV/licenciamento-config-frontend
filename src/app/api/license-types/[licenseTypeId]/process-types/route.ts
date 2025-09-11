import { NextRequest, NextResponse } from 'next/server';
import { apiClient } from '@/app/(myapp)/lib/api-client';
import {
  WrapperListLicenseProcessTypeDTO,
  LicenseProcessTypeRequestDTO,
  LicenseProcessTypeResponseDTO,
} from '@/app/(myapp)/types/license-process-types.types';

export async function GET(request: NextRequest, { params }: { params: { licenseTypeId: string } }) {
  try {
    const { searchParams } = new URL(request.url);
    const active = searchParams.get('active') || 'true';
    const processType = searchParams.get('processType');
    const pageNumber = searchParams.get('pageNumber') || '0';
    const pageSize = searchParams.get('pageSize') || '20';

    // Build query parameters matching backend controller
    const queryParams = new URLSearchParams({
      pageNumber,
      pageSize,
      active,
    });

    if (processType) queryParams.append('processType', processType);

    const response = await apiClient.get<WrapperListLicenseProcessTypeDTO>(
      `/license-types/${params.licenseTypeId}/process-types?${queryParams.toString()}`
    );

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching license process types:', error);
    return NextResponse.json({ error: 'Failed to fetch license process types' }, { status: 500 });
  }
}

export async function POST(request: NextRequest, { params }: { params: { licenseTypeId: string } }) {
  try {
    const body: LicenseProcessTypeRequestDTO = await request.json();

    if (!body.processName || !body.processCode) {
      return NextResponse.json(
        { error: 'Missing required fields: processName, processCode' },
        { status: 400 },
      );
    }

    // Add licenseTypeId from URL params to the body
    const requestBody = {
      ...body,
      licenseTypeId: params.licenseTypeId,
    };

    const response = await apiClient.post<LicenseProcessTypeResponseDTO>(
      `/license-types/${params.licenseTypeId}/process-types`,
      requestBody
    );

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('Error creating license process type:', error);
    return NextResponse.json({ error: 'Failed to create license process type' }, { status: 500 });
  }
}
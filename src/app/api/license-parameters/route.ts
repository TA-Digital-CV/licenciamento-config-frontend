import { NextRequest, NextResponse } from 'next/server';
import { apiClient } from '@/app/(myapp)/lib/api-client';
import {
  WrapperListLicenseParameterDTO,
  LicenseParameterRequestDTO,
  LicenseParameterResponseDTO,
} from '@/app/(myapp)/types/license-parameters.types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const active = searchParams.get('active') || 'true';
    const licenseTypeId = searchParams.get('licenseTypeId');
    const parameterType = searchParams.get('parameterType');
    const pageNumber = searchParams.get('pageNumber') || '0';
    const pageSize = searchParams.get('pageSize') || '20';

    // Build query parameters matching backend controller
    const params = new URLSearchParams({
      pageNumber,
      pageSize,
      active,
    });

    if (licenseTypeId) params.append('licenseTypeId', licenseTypeId);
    if (parameterType) params.append('parameterType', parameterType);

    const response = await apiClient.get<WrapperListLicenseParameterDTO>(`/license-parameters?${params.toString()}`);

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching license parameters:', error);
    return NextResponse.json({ error: 'Failed to fetch license parameters' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: LicenseParameterRequestDTO = await request.json();

    if (!body.licenseTypeId || !body.validityUnit || !body.model) {
      return NextResponse.json(
        { error: 'Missing required fields: licenseTypeId, validityUnit, model' },
        { status: 400 },
      );
    }

    const response = await apiClient.post<LicenseParameterResponseDTO>('/license-parameters', body);

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('Error creating license parameter:', error);
    return NextResponse.json({ error: 'Failed to create license parameter' }, { status: 500 });
  }
}
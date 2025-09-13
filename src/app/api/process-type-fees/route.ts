import { NextRequest, NextResponse } from 'next/server';
import { apiClient } from '@/app/(myapp)/lib/api-client';
import {
  WrapperListProcessTypeFeeDTO,
  ProcessTypeFeeRequestDTO,
  ProcessTypeFeeResponseDTO,
} from '@/app/(myapp)/types/process-type-fees.types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const active = searchParams.get('active') || 'true';
    const licenseTypeProcessTypeId = searchParams.get('licenseTypeProcessTypeId');
    const feeCategoryId = searchParams.get('feeCategoryId');
    const name = searchParams.get('name');
    const feeType = searchParams.get('feeType');
    const pageNumber = searchParams.get('pageNumber') || '0';
    const pageSize = searchParams.get('pageSize') || '20';

    // Build query parameters matching backend controller
    const params = new URLSearchParams({
      pageNumber,
      pageSize,
      active,
    });

    if (licenseTypeProcessTypeId)
      params.append('licenseTypeProcessTypeId', licenseTypeProcessTypeId);
    if (feeCategoryId) params.append('feeCategoryId', feeCategoryId);
    if (name) params.append('name', name);
    if (feeType) params.append('feeType', feeType);

    const response = await apiClient.get<WrapperListProcessTypeFeeDTO>(
      `/process-type-fees?${params.toString()}`,
    );

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching process type fees:', error);
    return NextResponse.json({ error: 'Failed to fetch process type fees' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: ProcessTypeFeeRequestDTO = await request.json();

    if (
      !body.licenseProcessTypeId ||
      !body.feeCategoryId ||
      !body.feeType ||
      body.baseAmount === undefined
    ) {
      return NextResponse.json(
        {
          error:
            'Missing required fields: licenseProcessTypeId, feeCategoryId, feeType, baseAmount',
        },
        { status: 400 },
      );
    }

    const response = await apiClient.post<ProcessTypeFeeResponseDTO>('/process-type-fees', body);

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('Error creating process type fee:', error);
    return NextResponse.json({ error: 'Failed to create process type fee' }, { status: 500 });
  }
}

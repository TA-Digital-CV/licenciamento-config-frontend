import { NextRequest, NextResponse } from 'next/server';
import { apiClient } from '@/app/(myapp)/lib/api-client';
import {
  LicenseProcessTypeRequestDTO,
  LicenseProcessTypeResponseDTO,
} from '@/app/(myapp)/types/license-process-types.types';

export async function GET(
  request: NextRequest,
  { params }: { params: { licenseTypeId: string; licenseProcessTypeId: string } }
) {
  try {
    const response = await apiClient.get<LicenseProcessTypeResponseDTO>(
      `/license-types/${params.licenseTypeId}/process-types/${params.licenseProcessTypeId}`
    );

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching license process type:', error);
    return NextResponse.json({ error: 'Failed to fetch license process type' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { licenseTypeId: string; licenseProcessTypeId: string } }
) {
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

    const response = await apiClient.put<LicenseProcessTypeResponseDTO>(
      `/license-types/${params.licenseTypeId}/process-types/${params.licenseProcessTypeId}`,
      requestBody
    );

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error updating license process type:', error);
    return NextResponse.json({ error: 'Failed to update license process type' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { licenseTypeId: string; licenseProcessTypeId: string } }
) {
  try {
    await apiClient.delete(
      `/license-types/${params.licenseTypeId}/process-types/${params.licenseProcessTypeId}`
    );

    return NextResponse.json({ message: 'License process type deleted successfully' });
  } catch (error) {
    console.error('Error deleting license process type:', error);
    return NextResponse.json({ error: 'Failed to delete license process type' }, { status: 500 });
  }
}
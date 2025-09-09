import { NextRequest, NextResponse } from 'next/server';
import { apiClient } from '@/app/(myapp)/lib/api-client';
import {
  LicenseParameterRequestDTO,
  LicenseParameterResponseDTO,
} from '@/app/(myapp)/types/license-parameters.types';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json({ error: 'License parameter ID is required' }, { status: 400 });
    }

    const response = await apiClient.get<LicenseParameterResponseDTO>(`/license-parameters/${id}`);

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching license parameter:', error);
    return NextResponse.json({ error: 'Failed to fetch license parameter' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body: LicenseParameterRequestDTO = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'License parameter ID is required' }, { status: 400 });
    }

    if (!body.licenseTypeId || !body.validityUnit || !body.model) {
      return NextResponse.json(
        { error: 'Missing required fields: licenseTypeId, validityUnit, model' },
        { status: 400 },
      );
    }

    const response = await apiClient.put<LicenseParameterResponseDTO>(`/license-parameters/${id}`, body);

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error updating license parameter:', error);
    return NextResponse.json({ error: 'Failed to update license parameter' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json({ error: 'License parameter ID is required' }, { status: 400 });
    }

    await apiClient.delete(`/license-parameters/${id}`);

    return NextResponse.json({ message: 'License parameter deleted successfully' });
  } catch (error) {
    console.error('Error deleting license parameter:', error);
    return NextResponse.json({ error: 'Failed to delete license parameter' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    if (!id) {
      return NextResponse.json({ error: 'License parameter ID is required' }, { status: 400 });
    }

    if (action === 'activate') {
      await apiClient.patch(`/license-parameters/${id}/activate`);
      return NextResponse.json({ message: 'License parameter activated successfully' });
    } else if (action === 'deactivate') {
      await apiClient.patch(`/license-parameters/${id}/deactivate`);
      return NextResponse.json({ message: 'License parameter deactivated successfully' });
    } else {
      return NextResponse.json({ error: 'Invalid action. Use activate or deactivate' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error updating license parameter status:', error);
    return NextResponse.json({ error: 'Failed to update license parameter status' }, { status: 500 });
  }
}
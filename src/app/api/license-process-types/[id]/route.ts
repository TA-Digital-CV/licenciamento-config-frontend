import { NextRequest, NextResponse } from 'next/server';
import { apiClient } from '@/app/(myapp)/lib/api-client';
import {
  LicenseProcessTypeRequestDTO,
  LicenseProcessTypeResponseDTO,
} from '@/app/(myapp)/types/license-process-types.types';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json({ error: 'License process type ID is required' }, { status: 400 });
    }

    const response = await apiClient.get<LicenseProcessTypeResponseDTO>(`/license-process-types/${id}`);

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching license process type:', error);
    return NextResponse.json({ error: 'Failed to fetch license process type' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body: LicenseProcessTypeRequestDTO = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'License process type ID is required' }, { status: 400 });
    }

    if (!body.name || !body.processType || !body.licenseTypeId) {
      return NextResponse.json(
        { error: 'Missing required fields: name, processType, licenseTypeId' },
        { status: 400 },
      );
    }

    const response = await apiClient.put<LicenseProcessTypeResponseDTO>(`/license-process-types/${id}`, body);

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error updating license process type:', error);
    return NextResponse.json({ error: 'Failed to update license process type' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json({ error: 'License process type ID is required' }, { status: 400 });
    }

    await apiClient.delete(`/license-process-types/${id}`);

    return NextResponse.json({ message: 'License process type deleted successfully' });
  } catch (error) {
    console.error('Error deleting license process type:', error);
    return NextResponse.json({ error: 'Failed to delete license process type' }, { status: 500 });
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
      return NextResponse.json({ error: 'License process type ID is required' }, { status: 400 });
    }

    if (action === 'activate') {
      await apiClient.patch(`/license-process-types/${id}/activate`);
      return NextResponse.json({ message: 'License process type activated successfully' });
    } else if (action === 'deactivate') {
      await apiClient.patch(`/license-process-types/${id}/deactivate`);
      return NextResponse.json({ message: 'License process type deactivated successfully' });
    } else {
      return NextResponse.json({ error: 'Invalid action. Use activate or deactivate' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error updating license process type status:', error);
    return NextResponse.json({ error: 'Failed to update license process type status' }, { status: 500 });
  }
}
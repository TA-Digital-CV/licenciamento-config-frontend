import { NextRequest, NextResponse } from 'next/server';
import { apiClient } from '@/app/(myapp)/lib/api-client';
import {
  ProcessTypeFeeRequestDTO,
  ProcessTypeFeeResponseDTO,
} from '@/app/(myapp)/types/process-type-fees.types';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json({ error: 'Process type fee ID is required' }, { status: 400 });
    }

    const response = await apiClient.get<ProcessTypeFeeResponseDTO>(`/process-type-fees/${id}`);

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching process type fee:', error);
    return NextResponse.json({ error: 'Failed to fetch process type fee' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body: ProcessTypeFeeRequestDTO = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'Process type fee ID is required' }, { status: 400 });
    }

    if (!body.licenseProcessTypeId || !body.feeCategoryId || !body.feeType || body.baseAmount === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: licenseProcessTypeId, feeCategoryId, feeType, baseAmount' },
        { status: 400 },
      );
    }

    const response = await apiClient.put<ProcessTypeFeeResponseDTO>(`/process-type-fees/${id}`, body);

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error updating process type fee:', error);
    return NextResponse.json({ error: 'Failed to update process type fee' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json({ error: 'Process type fee ID is required' }, { status: 400 });
    }

    await apiClient.delete(`/process-type-fees/${id}`);

    return NextResponse.json({ message: 'Process type fee deleted successfully' });
  } catch (error) {
    console.error('Error deleting process type fee:', error);
    return NextResponse.json({ error: 'Failed to delete process type fee' }, { status: 500 });
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
      return NextResponse.json({ error: 'Process type fee ID is required' }, { status: 400 });
    }

    if (action === 'activate') {
      await apiClient.patch(`/process-type-fees/${id}/activate`);
      return NextResponse.json({ message: 'Process type fee activated successfully' });
    } else if (action === 'deactivate') {
      await apiClient.patch(`/process-type-fees/${id}/deactivate`);
      return NextResponse.json({ message: 'Process type fee deactivated successfully' });
    } else {
      return NextResponse.json({ error: 'Invalid action. Use activate or deactivate' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error updating process type fee status:', error);
    return NextResponse.json({ error: 'Failed to update process type fee status' }, { status: 500 });
  }
}
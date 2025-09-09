import { NextRequest, NextResponse } from 'next/server';
import { apiClient } from '@/app/(myapp)/lib/api-client';
import {
  FeeCategoryRequestDTO,
  FeeCategoryResponseDTO,
} from '@/app/(myapp)/types/fee-categories.types';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json({ error: 'Fee category ID is required' }, { status: 400 });
    }

    const response = await apiClient.get<FeeCategoryResponseDTO>(`/fee-categories/${id}`);

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching fee category:', error);
    return NextResponse.json({ error: 'Failed to fetch fee category' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body: FeeCategoryRequestDTO = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'Fee category ID is required' }, { status: 400 });
    }

    if (!body.name || !body.categoryType) {
      return NextResponse.json(
        { error: 'Missing required fields: name, categoryType' },
        { status: 400 },
      );
    }

    const response = await apiClient.put<FeeCategoryResponseDTO>(`/fee-categories/${id}`, body);

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error updating fee category:', error);
    return NextResponse.json({ error: 'Failed to update fee category' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json({ error: 'Fee category ID is required' }, { status: 400 });
    }

    await apiClient.delete(`/fee-categories/${id}`);

    return NextResponse.json({ message: 'Fee category deleted successfully' });
  } catch (error) {
    console.error('Error deleting fee category:', error);
    return NextResponse.json({ error: 'Failed to delete fee category' }, { status: 500 });
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
      return NextResponse.json({ error: 'Fee category ID is required' }, { status: 400 });
    }

    if (action === 'activate') {
      await apiClient.patch(`/fee-categories/${id}/activate`);
      return NextResponse.json({ message: 'Fee category activated successfully' });
    } else if (action === 'deactivate') {
      await apiClient.patch(`/fee-categories/${id}/deactivate`);
      return NextResponse.json({ message: 'Fee category deactivated successfully' });
    } else {
      return NextResponse.json({ error: 'Invalid action. Use activate or deactivate' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error updating fee category status:', error);
    return NextResponse.json({ error: 'Failed to update fee category status' }, { status: 500 });
  }
}
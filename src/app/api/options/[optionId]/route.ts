import { NextRequest, NextResponse } from 'next/server';
import { apiClient } from '@/app/(myapp)/lib/api-client';
import { OptionResponseDTO, OptionRequestDTO } from '@/app/(myapp)/types/options.types';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ optionId: string }> },
) {
  try {
    const { optionId } = await params;

    const response = await apiClient.get<OptionResponseDTO>(`/options/${optionId}`);

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching option:', error);
    return NextResponse.json({ error: 'Failed to fetch option' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ optionId: string }> },
) {
  try {
    const { optionId } = await params;
    const body = await request.json();

    const response = await apiClient.put<OptionResponseDTO>(`/options/${optionId}`, body);

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error updating option:', error);
    return NextResponse.json({ error: 'Failed to update option' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ optionId: string }> },
) {
  try {
    const { optionId } = await params;

    await apiClient.delete(`/options/${optionId}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting option:', error);
    return NextResponse.json({ error: 'Failed to delete option' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ optionId: string }> },
) {
  try {
    const { optionId } = await params;
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action'); // 'activate' or 'deactivate'

    if (action === 'activate') {
      const response = await apiClient.patch<OptionResponseDTO>(`/options/${optionId}/activate`);
      return NextResponse.json(response);
    }

    if (action === 'deactivate') {
      const response = await apiClient.patch<OptionResponseDTO>(`/options/${optionId}/deactivate`);
      return NextResponse.json(response);
    }

    return NextResponse.json(
      { error: 'Invalid action. Use ?action=activate or ?action=deactivate' },
      { status: 400 },
    );
  } catch (error) {
    console.error('Error updating option status:', error);
    return NextResponse.json({ error: 'Failed to update option status' }, { status: 500 });
  }
}

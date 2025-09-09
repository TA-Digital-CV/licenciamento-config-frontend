import { NextRequest, NextResponse } from 'next/server';
import { apiClient } from '@/app/(myapp)/lib/api-client';
import {
  LegislationRequestDTO,
  LegislationResponseDTO,
} from '@/app/(myapp)/types/legislations.types';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json({ error: 'Legislation ID is required' }, { status: 400 });
    }

    const response = await apiClient.get<LegislationResponseDTO>(`/legislations/${id}`);

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching legislation:', error);
    return NextResponse.json({ error: 'Failed to fetch legislation' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body: LegislationRequestDTO = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'Legislation ID is required' }, { status: 400 });
    }

    if (!body.title || !body.legislationType || !body.jurisdiction) {
      return NextResponse.json(
        { error: 'Missing required fields: title, legislationType, jurisdiction' },
        { status: 400 },
      );
    }

    const response = await apiClient.put<LegislationResponseDTO>(`/legislations/${id}`, body);

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error updating legislation:', error);
    return NextResponse.json({ error: 'Failed to update legislation' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json({ error: 'Legislation ID is required' }, { status: 400 });
    }

    await apiClient.delete(`/legislations/${id}`);

    return NextResponse.json({ message: 'Legislation deleted successfully' });
  } catch (error) {
    console.error('Error deleting legislation:', error);
    return NextResponse.json({ error: 'Failed to delete legislation' }, { status: 500 });
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
      return NextResponse.json({ error: 'Legislation ID is required' }, { status: 400 });
    }

    if (action === 'activate') {
      await apiClient.patch(`/legislations/${id}/activate`);
      return NextResponse.json({ message: 'Legislation activated successfully' });
    } else if (action === 'deactivate') {
      await apiClient.patch(`/legislations/${id}/deactivate`);
      return NextResponse.json({ message: 'Legislation deactivated successfully' });
    } else {
      return NextResponse.json({ error: 'Invalid action. Use activate or deactivate' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error updating legislation status:', error);
    return NextResponse.json({ error: 'Failed to update legislation status' }, { status: 500 });
  }
}
import { NextRequest, NextResponse } from 'next/server';
import { apiClient } from '@/app/(myapp)/lib/api-client';
import {
  WrapperListFeeCategoryDTO,
  FeeCategoryRequestDTO,
  FeeCategoryResponseDTO,
} from '@/app/(myapp)/types/fee-categories.types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const active = searchParams.get('active') || 'true';
    const feeType = searchParams.get('feeType');
    const pageNumber = searchParams.get('pageNumber') || '0';
    const pageSize = searchParams.get('pageSize') || '20';

    // Build query parameters matching backend controller
    const params = new URLSearchParams({
      pageNumber,
      pageSize,
      active,
    });

    if (feeType) params.append('feeType', feeType);

    const response = await apiClient.get<WrapperListFeeCategoryDTO>(`/fee-categories?${params.toString()}`);

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching fee categories:', error);
    return NextResponse.json({ error: 'Failed to fetch fee categories' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: FeeCategoryRequestDTO = await request.json();

    if (!body.name || !body.categoryType) {
      return NextResponse.json(
        { error: 'Missing required fields: name, categoryType' },
        { status: 400 },
      );
    }

    const response = await apiClient.post<FeeCategoryResponseDTO>('/fee-categories', body);

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('Error creating fee category:', error);
    return NextResponse.json({ error: 'Failed to create fee category' }, { status: 500 });
  }
}
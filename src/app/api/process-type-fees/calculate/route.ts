import { NextRequest, NextResponse } from 'next/server';
import { apiClient } from '@/app/(myapp)/lib/api-client';
import {
  FeeCalculationRequestDTO,
  FeeCalculationResult,
} from '@/app/(myapp)/types/process-type-fees.types';

export async function POST(request: NextRequest) {
  try {
    const body: FeeCalculationRequestDTO = await request.json();

    if (!body.processTypeId || body.baseValue === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: processTypeId, baseValue' },
        { status: 400 },
      );
    }

    const response = await apiClient.post<FeeCalculationResult>(
      '/process-type-fees/calculate',
      body,
    );

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error calculating process type fee:', error);
    return NextResponse.json({ error: 'Failed to calculate process type fee' }, { status: 500 });
  }
}

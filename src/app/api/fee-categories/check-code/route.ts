import { NextRequest, NextResponse } from 'next/server';
import { apiClient } from '../../../(myapp)/lib/api-client';
import { FeeCategoryCodeCheckDTO } from '../../../(myapp)/types/fee-categories.types';

// GET /api/fee-categories/check-code - Verifica se um código de categoria de taxa já existe
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const excludeId = searchParams.get('excludeId');

    if (!code) {
      return NextResponse.json(
        { error: 'Code parameter is required' },
        { status: 400 },
      );
    }

    // Construir query parameters
    const queryParams = new URLSearchParams({ code });
    if (excludeId) {
      queryParams.append('excludeId', excludeId);
    }

    const response = await apiClient.get<FeeCategoryCodeCheckDTO>(
      `/fee-categories/check-code?${queryParams.toString()}`,
    );

    return NextResponse.json(response);
  } catch (error: any) {
    console.error('Error checking fee category code:', error);
    return NextResponse.json(
      { error: 'Failed to check fee category code' },
      { status: error.status || 500 },
    );
  }
}
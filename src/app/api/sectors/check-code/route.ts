import { NextRequest, NextResponse } from 'next/server';
import { apiClient } from '../../../(myapp)/lib/api-client';
import { SectorCodeCheckDTO } from '../../../(myapp)/types/sectors.types';

// GET /api/sectors/check-code - Verifica se um código de setor já existe
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

    const response = await apiClient.get<SectorCodeCheckDTO>(
      `/sectors/check-code?${queryParams.toString()}`,
    );

    return NextResponse.json(response);
  } catch (error: any) {
    console.error('Error checking sector code:', error);
    return NextResponse.json(
      { error: 'Failed to check sector code' },
      { status: error.status || 500 },
    );
  }
}
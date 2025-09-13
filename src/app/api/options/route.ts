/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { apiClient, ApiResponse } from '@/app/(myapp)/lib/api-client';
import {
  WrapperListOptionsDTO,
  OptionRequestDTO,
  OptionResponseDTO,
} from '@/app/(myapp)/types/options.types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const codes = searchParams.get('codes');
    const ccode = searchParams.get('ccode');
    const ckey = searchParams.get('ckey');
    const cvalue = searchParams.get('cvalue');
    const locale = searchParams.get('locale');
    const sortOrder = searchParams.get('sortOrder');
    const active = searchParams.get('active') || 'true';
    const pageNumber = searchParams.get('pageNumber') || '0';
    const pageSize = searchParams.get('pageSize') || '20';

    // Handle multiple codes request
    if (codes) {
      const codeList = codes
        .split(',')
        .map((code) => code.trim())
        .filter(Boolean);
      const optionSets: Record<string, { items: any[] }> = {};

      // Process each code separately
      for (const code of codeList) {
        try {
          const params = new URLSearchParams({
            pageNumber: '0',
            pageSize: '1000', // Get all items for each code
            active: 'true',
            ccode: code,
          });

          const response = await apiClient.get<WrapperListOptionsDTO>(
            `/options?${params.toString()}`,
          );

          // Transform response to match expected format
          optionSets[code] = {
            items:
              response.data?.content?.map((item: { ckey: any; cvalue: any }) => ({
                key: item.ckey,
                value: item.cvalue,
                ...item,
              })) || [],
          };
        } catch (error) {
          console.error(`Error fetching options for code ${code}:`, error);
          // Continue with other codes even if one fails
          optionSets[code] = { items: [] };
        }
      }

      return NextResponse.json({ optionSets });
    }

    // Original single code behavior
    const params = new URLSearchParams({
      pageNumber,
      pageSize,
      active,
    });

    if (ccode) params.append('ccode', ccode);
    if (ckey) params.append('ckey', ckey);
    if (cvalue) params.append('cvalue', cvalue);
    if (locale) params.append('locale', locale);
    if (sortOrder) params.append('sortOrder', sortOrder);

    const response = await apiClient.get<WrapperListOptionsDTO>(`/options?${params.toString()}`);

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching options:', error);
    return NextResponse.json({ error: 'Failed to fetch options' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: OptionRequestDTO = await request.json();

    if (!body.ccode || !body.ckey || !body.cvalue) {
      return NextResponse.json(
        { error: 'Missing required fields: ccode, ckey, cvalue' },
        { status: 400 },
      );
    }

    const response = await apiClient.post<OptionResponseDTO>('/options', body);

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('Error creating option:', error);
    return NextResponse.json({ error: 'Failed to create option' }, { status: 500 });
  }
}

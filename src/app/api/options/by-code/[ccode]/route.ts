/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { apiClient } from '@/app/(myapp)/lib/api-client';
import { WrapperListOptionsDTO, OptionResponseDTO } from '@/app/(myapp)/types/options.types';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ ccode: string }> },
) {
  let codeParam = '';
  try {
    const { ccode } = await params;
    codeParam = ccode;
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale') ?? undefined;
    const active = searchParams.get('active');
    let includeInactive = searchParams.get('includeInactive');
    const format = searchParams.get('format') ?? 'list';
    const action = searchParams.get('action'); // 'findByCcode' or 'existsByCcode'

    // Backward compatibility: if "active" is provided, infer includeInactive
    if (includeInactive === null && active !== null) {
      includeInactive = active === 'true' ? 'false' : 'true';
    }

    if (action === 'existsByCcode') {
      // Check if options exist for this ccode
      try {
        const existsParams = new URLSearchParams();
        existsParams.append('ccode', ccode);
        existsParams.append('action', 'exists');
        const existsUrl = `/options?${existsParams.toString()}`;
        const exists = await apiClient.get<boolean>(existsUrl);
        return NextResponse.json({ exists: Boolean(exists) });
      } catch (err: any) {
        // If backend returns 404 or network fails, assume it does not exist
        const msg = (err?.message || '').toString();
        if (msg.includes('status: 404') || msg.toLowerCase().includes('fetch failed')) {
          return NextResponse.json({ exists: false });
        }
        // Other errors -> return false but log
        console.error('existsByCcode error:', err);
        return NextResponse.json({ exists: false });
      }
    }

    // Default action: find options by ccode using query parameters
    const queryParams = new URLSearchParams();
    queryParams.append('ccode', ccode);
    if (active !== null) queryParams.append('active', active);
    if (locale) queryParams.append('locale', locale);
    if (includeInactive !== null && includeInactive !== undefined)
      queryParams.append('includeInactive', includeInactive);
    if (format) queryParams.append('format', format);
    
    // Add pagination parameters as expected by the API
    queryParams.append('pageNumber', '0');
    queryParams.append('pageSize', '20');
    
    const findUrl = `/options?${queryParams.toString()}`;

    const response: any = await apiClient.get<any>(findUrl);
    // API externa retorna dados em 'content', não 'items'
    const items = Array.isArray(response?.content) ? response.content : [];

    const mapped: OptionResponseDTO[] = items.map((it: any, idx: number) => ({
      id: it?.id ?? `${ccode}:${it?.ckey ?? idx}:${it?.locale ?? locale ?? ''}`,
      ccode: it?.ccode ?? ccode,
      ckey: it?.ckey ?? '',
      cvalue: it?.cvalue ?? '',
      locale: it?.locale ?? locale ?? '',
      sort_order: typeof it?.sortOrder === 'number' ? it.sortOrder : null,
      active: it?.active ?? true,
      description: it?.description ?? '',
      metadata: it?.metadata ?? null,
    }));

    return NextResponse.json(mapped);
  } catch (error: any) {
    console.error('Error fetching options by ccode:', error);
    const msg = (error?.message || '').toString();

    // If it's a 400/404 error from backend, return empty array instead of error
    if (msg.includes('status: 400') || msg.includes('status: 404')) {
      console.log(`No options found for ccode: ${codeParam}, returning empty array`);
      return NextResponse.json([]);
    }

    // Network failures: degrade gracefully to empty list so UI can still render
    if (msg.toLowerCase().includes('fetch failed') || msg.toLowerCase().includes('econnrefused')) {
      console.warn(`Backend unavailable when fetching ccode ${codeParam}; returning empty array`);
      return NextResponse.json([]);
    }

    return NextResponse.json({ error: 'Failed to fetch options' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ ccode: string }> },
) {
  try {
    const { ccode } = await params;
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale') || 'pt-BR';
    const body = await request.json();

    if (!Array.isArray(body)) {
      return NextResponse.json({ error: 'Body must be an array of options' }, { status: 400 });
    }

    // Update options for this ccode and locale
    const response = await apiClient.put<OptionResponseDTO[]>(
      `/options/${ccode}?locale=${locale}`,
      { options: body },
    );

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error updating options:', error);
    return NextResponse.json({ error: 'Failed to update options' }, { status: 500 });
  }
}

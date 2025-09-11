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

    // 1) Tentativa de atualização em lote (bulk)
    try {
      const bulkResponse = await apiClient.put<OptionResponseDTO[]>(
        `/options/${ccode}?locale=${locale}`,
        body as unknown as Record<string, unknown>,
      );
      return NextResponse.json(bulkResponse ?? { success: true });
    } catch (bulkError) {
      console.warn('Bulk update failed, falling back to per-item upsert strategy:', bulkError);
    }

    // 2) Fallback: upsert item-a-item e remoção dos ausentes
    // Carregar existentes para mapear IDs
    const existingResp: any = await apiClient.get<any>(
      `/options?${new URLSearchParams({ ccode, pageNumber: '0', pageSize: '1000' }).toString()}`,
    );

    const existingItems: any[] = Array.isArray(existingResp?.content)
      ? existingResp.content
      : Array.isArray(existingResp)
        ? existingResp
        : [];

    const existingMap = new Map<string, any>();
    existingItems.forEach((it: any) => {
      const composite = `${(it?.ckey ?? '').toString().trim()}::${(it?.locale ?? '').toString().trim()}`;
      existingMap.set(composite, it);
    });

    const requestedKeys = new Set<string>();
    const results: any[] = [];

    // Upsert dos itens enviados
    for (const item of body) {
      const composite = `${(item?.ckey ?? '').toString().trim()}::${(item?.locale ?? '').toString().trim()}`;
      requestedKeys.add(composite);

      const payload = {
        ccode,
        ckey: (item?.ckey ?? '').toString().trim(),
        cvalue: (item?.cvalue ?? '').toString().trim(),
        locale: (item?.locale ?? 'pt-CV').toString().trim(),
        sortOrder:
          typeof item?.sortOrder === 'number'
            ? item.sortOrder
            : item?.sortOrder
            ? Number(item.sortOrder)
            : 0,
        active: item?.active !== false,
        description: typeof item?.description === 'string' ? item.description : '',
        metadata: (() => {
          const md = item?.metadata;
          if (md === null || md === undefined || md === '') return null;
          if (typeof md === 'string') {
            try {
              return JSON.parse(md);
            } catch {
              return md;
            }
          }
          return md;
        })(),
      } as Record<string, unknown>;

      const existing = existingMap.get(composite);
      if (existing && existing.id) {
        const updated = await apiClient.put<OptionResponseDTO>(`/options/${existing.id}`, payload);
        results.push(updated);
      } else {
        const created = await apiClient.post<OptionResponseDTO>('/options', payload);
        results.push(created);
      }
    }

    // Remover itens que existiam e não foram enviados agora (sync hard)
    for (const [composite, it] of existingMap.entries()) {
      if (!requestedKeys.has(composite) && it?.id) {
        try {
          await apiClient.delete(`/options/${it.id}`);
        } catch (delErr) {
          console.warn('Failed to delete removed option id=', it.id, delErr);
        }
      }
    }

    return NextResponse.json(results);
  } catch (error) {
    console.error('Error updating options:', error);
    return NextResponse.json({ error: 'Failed to update options' }, { status: 500 });
  }
}

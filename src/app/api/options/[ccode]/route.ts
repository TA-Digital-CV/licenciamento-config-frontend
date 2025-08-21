/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { mockOptions } from '../_data';

export async function GET(request: NextRequest, context: { params: { ccode: string } }) {
  const { ccode } = context.params;
  const { searchParams } = new URL(request.url);
  const locale = searchParams.get('locale') || 'pt-CV';
  const includeInactive = searchParams.get('includeInactive') === 'true';

  const items = mockOptions
    .filter(o => o.ccode === ccode && o.locale === locale && (includeInactive || o.active))
    .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
    .map(o => ({ key: o.ckey, value: o.cvalue, sortOrder: o.sort_order, description: o.description, metadata: o.metadata, active: o.active }));

  return NextResponse.json({ code: ccode, locale, items });
}

// PUT /api/(myapp)/(mockapi)/options/[ccode]
// Expected body: { code: string, locale?: string, items: Array<{ key, value, sortOrder?, description?, metadata?, active? }> }
export async function PUT(request: NextRequest, context: { params: { ccode: string } }) {
  const { ccode } = context.params;
  const body = await request.json();
  const locale = body.locale || 'pt-CV';
  const items = Array.isArray(body.items) ? body.items : [];

  // Remove existing items for this code + locale
  for (let i = mockOptions.length - 1; i >= 0; i--) {
    if (mockOptions[i].ccode === ccode && mockOptions[i].locale === locale) {
      mockOptions.splice(i, 1);
    }
  }

  // Insert new items
  items.forEach((it: any, index: number) => {
    mockOptions.push({
      id: `${Date.now()}-${index}`,
      ccode,
      ckey: it.key,
      cvalue: it.value,
      locale,
      sort_order: it.sortOrder ?? index + 1,
      active: it.active !== false,
      description: it.description || '',
      metadata: it.metadata ?? null,
    });
  });

  return NextResponse.json({ code: ccode, locale, items }, { status: 200 });
}
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextRequest, NextResponse } from 'next/server';
import { mockOptions } from './_data';

// GET /api/(myapp)/(mockapi)/options - Get all options grouped by code
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const codes = searchParams.get('codes');
  const locale = searchParams.get('locale') || 'pt-CV';
  const includeInactive = searchParams.get('includeInactive') === 'true';

  // Filter options
  let filteredOptions = mockOptions.filter(option => 
    option.locale === locale && (includeInactive || option.active)
  );

  if (codes) {
    const codeList = codes.split(',').map(c => c.trim());
    filteredOptions = filteredOptions.filter(option => 
      codeList.includes(option.ccode)
    );
  }

  // Group by code and count items
  const groupedOptions = filteredOptions.reduce((acc, option) => {
    if (!acc[option.ccode]) {
      acc[option.ccode] = {
        code: option.ccode,
        locale: option.locale,
        items: [],
        count: 0
      };
    }
    acc[option.ccode].items.push({
      key: option.ckey,
      value: option.cvalue,
      sortOrder: option.sort_order,
      description: option.description,
      metadata: option.metadata
    });
    acc[option.ccode].count++;
    return acc;
  }, {} as Record<string, any>);

  // Sort items within each group
  Object.values(groupedOptions).forEach((group: any) => {
    group.items.sort((a: any, b: any) => (a.sortOrder || 0) - (b.sortOrder || 0));
  });

  return NextResponse.json({
    locale,
    optionSets: groupedOptions
  });
}

// POST /api/(myapp)/(mockapi)/options - Create new option
export async function POST(request: NextRequest) {
  const body = await request.json();
  
  const newOption = {
    id: (mockOptions.length + 1).toString(),
    ccode: body.code,
    ckey: body.key,
    cvalue: body.value,
    locale: body.locale || 'pt-CV',
    sort_order: body.sortOrder ?? (mockOptions.filter(o => o.ccode === body.code).length + 1),
    active: body.active !== false,
    description: body.description || '',
    metadata: body.metadata ?? null
  } as any;

  mockOptions.push(newOption);

  return NextResponse.json(newOption, { status: 201 });
}
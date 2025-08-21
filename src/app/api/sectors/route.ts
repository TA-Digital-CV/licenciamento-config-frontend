/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextRequest, NextResponse } from 'next/server';
import { mockSectors } from './_data';

// GET /api/(myapp)/(mockapi)/sectors
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const active = searchParams.get('active');
  const sectorType = searchParams.get('sectorType');

  let list = [...mockSectors];
  if (active != null) {
    const wantActive = active === 'true';
    list = list.filter(s => (s.active === wantActive));
  }
  if (sectorType) {
    list = list.filter(s => s.sectorTypeKey === sectorType);
  }

  // sort by sortOrder then name
  list.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0) || a.name.localeCompare(b.name));

  return NextResponse.json({ content: list, total: list.length });
}

// POST /api/(myapp)/(mockapi)/sectors
export async function POST(request: NextRequest) {
  const body = await request.json();
  const newItem = {
    id: `${Date.now()}`,
    name: body.name,
    description: body.description || '',
    code: body.code,
    sectorTypeKey: body.sectorTypeKey,
    sectorTypeValue: body.sectorTypeValue || undefined,
    active: body.active !== false,
    sortOrder: body.sortOrder ?? (mockSectors.length + 1),
    metadata: body.metadata ?? null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  } as any;
  mockSectors.push(newItem);
  return NextResponse.json(newItem, { status: 201 });
}
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { mockSectors } from '../_data';

export async function GET(request: NextRequest, context: { params: { id: string } }) {
  const { id } = context.params;
  const found = mockSectors.find(s => s.id === id);
  if (!found) return NextResponse.json({ message: 'Not found' }, { status: 404 });
  return NextResponse.json(found);
}

export async function PUT(request: NextRequest, context: { params: { id: string } }) {
  const { id } = context.params;
  const idx = mockSectors.findIndex(s => s.id === id);
  if (idx === -1) return NextResponse.json({ message: 'Not found' }, { status: 404 });
  const body = await request.json();
  const updated = {
    ...mockSectors[idx],
    name: body.name,
    description: body.description || '',
    code: mockSectors[idx].code, // keep original code immutable
    sectorTypeKey: body.sectorTypeKey,
    sectorTypeValue: body.sectorTypeValue || undefined,
    active: body.active !== false,
    sortOrder: body.sortOrder ?? mockSectors[idx].sortOrder,
    metadata: body.metadata ?? mockSectors[idx].metadata,
    updatedAt: new Date().toISOString(),
  } as any;
  mockSectors[idx] = updated;
  return NextResponse.json(updated);
}
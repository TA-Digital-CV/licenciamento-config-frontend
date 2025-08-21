/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { mockCategories } from '../_data';
import { mockSectors } from '../../sectors/_data';

export async function GET(request: NextRequest, context: { params: { id: string } }) {
  const { id } = await context.params;
  const found = mockCategories.find(s => s.id === id);
  if (!found) return NextResponse.json({ message: 'Not found' }, { status: 404 });
  return NextResponse.json(found);
}

export async function PUT(request: NextRequest, context: { params: { id: string } }) {
  const { id } = await context.params;
  const idx = mockCategories.findIndex(s => s.id === id);
  if (idx === -1) return NextResponse.json({ message: 'Not found' }, { status: 404 });
  const body = await request.json();
  const updatedSectorId = (body.sectorId !== undefined) ? body.sectorId : mockCategories[idx].sectorId;
  const sectorName = updatedSectorId ? (mockSectors.find(s => s.id === updatedSectorId)?.name) : mockCategories[idx].sectorName;
  const updated = {
    ...mockCategories[idx],
    name: body.name,
    description: body.description || '',
    code: mockCategories[idx].code, // keep code immutable
    parentCategoryId: body.parentCategoryId ?? mockCategories[idx].parentCategoryId,
    parentCategoryName: body.parentCategoryName ?? mockCategories[idx].parentCategoryName,
    sectorId: updatedSectorId,
    sectorName: sectorName,
    active: body.active !== false,
    sortOrder: body.sortOrder ?? mockCategories[idx].sortOrder,
    metadata: body.metadata ?? mockCategories[idx].metadata,
    updatedAt: new Date().toISOString(),
  } as any;
  mockCategories[idx] = updated;
  return NextResponse.json(updated);
}
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { mockLicenceTypes } from '../_data';

export async function GET(request: NextRequest, context: { params: { id: string } }) {
  const { id } = await context.params;
  const found = mockLicenceTypes.find(s => s.id === id);
  if (!found) return NextResponse.json({ message: 'Not found' }, { status: 404 });
  return NextResponse.json(found);
}

export async function PUT(request: NextRequest, context: { params: { id: string } }) {
  const { id } = await context.params;
  const idx = mockLicenceTypes.findIndex(s => s.id === id);
  if (idx === -1) return NextResponse.json({ message: 'Not found' }, { status: 404 });
  const body = await request.json();
  const updated = {
    ...mockLicenceTypes[idx],
    name: body.name,
    description: body.description || '',
    code: mockLicenceTypes[idx].code, // keep code immutable
    categoryId: body.categoryId ?? mockLicenceTypes[idx].categoryId,
    categoryName: body.categoryName ?? mockLicenceTypes[idx].categoryName,
    active: body.active !== false,
    sortOrder: body.sortOrder ?? mockLicenceTypes[idx].sortOrder,
    metadata: body.metadata ?? mockLicenceTypes[idx].metadata,
    updatedAt: new Date().toISOString(),
  } as any;
  mockLicenceTypes[idx] = updated;
  return NextResponse.json(updated);
}
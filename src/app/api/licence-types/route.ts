/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextRequest, NextResponse } from 'next/server';
import { mockLicenceTypes } from './_data';

// GET /api/(myapp)/(mockapi)/licence-types
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const active = searchParams.get('active');
  const categoryId = searchParams.get('categoryId');

  let list = [...mockLicenceTypes];
  if (active != null) {
    const wantActive = active === 'true';
    list = list.filter(s => (s.active === wantActive));
  }
  if (categoryId) {
    list = list.filter(s => s.categoryId === categoryId);
  }

  list.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0) || a.name.localeCompare(b.name));

  return NextResponse.json({ content: list, total: list.length });
}

// POST /api/(myapp)/(mockapi)/licence-types
export async function POST(request: NextRequest) {
  const body = await request.json();
  const newItem = {
    id: `${Date.now()}`,
    name: body.name,
    description: body.description || '',
    code: body.code,
    categoryId: body.categoryId || undefined,
    categoryName: body.categoryName || undefined,
    active: body.active !== false,
    sortOrder: body.sortOrder ?? (mockLicenceTypes.length + 1),
    metadata: body.metadata ?? null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  } as any;
  mockLicenceTypes.push(newItem);
  return NextResponse.json(newItem, { status: 201 });
}
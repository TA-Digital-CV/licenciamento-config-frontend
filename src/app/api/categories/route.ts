/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextRequest, NextResponse } from 'next/server';
import { mockCategories } from './_data';
import { mockSectors } from '../sectors/_data';

// GET /api/(myapp)/(mockapi)/categories
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const active = searchParams.get('active');
  const parentId = searchParams.get('parentId');
  const sectorId = searchParams.get('sectorId');

  let list = [...mockCategories];
  if (active != null) {
    const wantActive = active === 'true';
    list = list.filter(s => (s.active === wantActive));
  }
  if (parentId) {
    list = list.filter(s => s.parentCategoryId === parentId);
  }
  if (sectorId) {
    list = list.filter(s => s.sectorId === sectorId);
  }

  list.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0) || a.name.localeCompare(b.name));

  return NextResponse.json({ content: list, total: list.length });
}

// POST /api/(myapp)/(mockapi)/categories
export async function POST(request: NextRequest) {
  const body = await request.json();
  const sector = body.sectorId ? mockSectors.find(s => s.id === body.sectorId) : undefined;
  const newItem = {
    id: `${Date.now()}`,
    name: body.name,
    description: body.description || '',
    code: body.code,
    parentCategoryId: body.parentCategoryId || undefined,
    parentCategoryName: body.parentCategoryName || undefined,
    sectorId: body.sectorId || undefined,
    sectorName: sector?.name || undefined,
    active: body.active !== false,
    sortOrder: body.sortOrder ?? (mockCategories.length + 1),
    metadata: body.metadata ?? null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  } as any;
  mockCategories.push(newItem);
  return NextResponse.json(newItem, { status: 201 });
}
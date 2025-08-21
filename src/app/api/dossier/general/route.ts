/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextRequest, NextResponse } from 'next/server';
import { mockGeneralData } from './_data';

// GET /api/dossier/general
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const active = searchParams.get('active');
  const licenseTypeId = searchParams.get('licenseTypeId');
  const category = searchParams.get('category');
  const parameterType = searchParams.get('parameterType');
  const isRequired = searchParams.get('isRequired');
  const search = searchParams.get('search');
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');

  let list = [...mockGeneralData];

  // Apply filters
  if (active != null) {
    const wantActive = active === 'true';
    list = list.filter(item => item.active === wantActive);
  }

  if (licenseTypeId) {
    list = list.filter(item => item.licenseTypeId === licenseTypeId);
  }

  if (category) {
    list = list.filter(item => item.category === category);
  }

  if (parameterType) {
    list = list.filter(item => item.parameterType === parameterType);
  }

  if (isRequired != null) {
    const wantRequired = isRequired === 'true';
    list = list.filter(item => item.isRequired === wantRequired);
  }

  if (search) {
    const searchLower = search.toLowerCase();
    list = list.filter(item => 
      item.parameterName.toLowerCase().includes(searchLower) ||
      item.description?.toLowerCase().includes(searchLower) ||
      item.licenseTypeName?.toLowerCase().includes(searchLower)
    );
  }

  // Sort by displayOrder and then by parameterName
  list.sort((a, b) => {
    const orderA = a.displayOrder || 999;
    const orderB = b.displayOrder || 999;
    if (orderA !== orderB) {
      return orderA - orderB;
    }
    return a.parameterName.localeCompare(b.parameterName);
  });

  // Apply pagination
  const total = list.length;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedList = list.slice(startIndex, endIndex);

  return NextResponse.json({
    content: paginatedList,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit)
  });
}

// POST /api/dossier/general
export async function POST(request: NextRequest) {
  const body = await request.json();
  const newItem = {
    id: `${Date.now()}`,
    licenseTypeId: body.licenseTypeId,
    licenseTypeName: body.licenseTypeName || '',
    parameterName: body.parameterName,
    parameterValue: body.parameterValue || '',
    parameterType: body.parameterType || 'STRING',
    description: body.description || '',
    isRequired: body.isRequired !== false,
    isEditable: body.isEditable !== false,
    displayOrder: body.displayOrder ?? (mockGeneralData.length + 1),
    validationRules: body.validationRules || '{}',
    defaultValue: body.defaultValue || '',
    category: body.category || '',
    active: body.active !== false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: body.createdBy || 'system',
    updatedBy: body.updatedBy || 'system'
  } as any;
  
  mockGeneralData.push(newItem);
  return NextResponse.json(newItem, { status: 201 });
}
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextRequest, NextResponse } from 'next/server';
import { mockLegislations } from './_data';

// GET /api/dossier/legislations
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const active = searchParams.get('active');
  const licenseTypeId = searchParams.get('licenseTypeId');
  const legislationType = searchParams.get('legislationType');
  const status = searchParams.get('status');
  const priority = searchParams.get('priority');
  const year = searchParams.get('year');
  const search = searchParams.get('search');
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');

  let list = [...mockLegislations];

  // Apply filters
  if (active != null) {
    const wantActive = active === 'true';
    list = list.filter(item => item.active === wantActive);
  }

  if (licenseTypeId) {
    list = list.filter(item => item.licenseTypeId === licenseTypeId);
  }

  if (legislationType) {
    list = list.filter(item => item.legislationType === legislationType);
  }

  if (status) {
    list = list.filter(item => item.status === status);
  }

  if (priority) {
    list = list.filter(item => item.priority === priority);
  }

  if (year) {
    list = list.filter(item => item.legislationYear === parseInt(year));
  }

  if (search) {
    const searchLower = search.toLowerCase();
    list = list.filter(item => 
      item.title.toLowerCase().includes(searchLower) ||
      item.description?.toLowerCase().includes(searchLower) ||
      item.legislationNumber.toLowerCase().includes(searchLower) ||
      item.issuingAuthority.toLowerCase().includes(searchLower) ||
      item.licenseTypeName?.toLowerCase().includes(searchLower)
    );
  }

  // Sort by priority (ALTA first), then by effectiveDate (newest first)
  list.sort((a, b) => {
    const priorityOrder = { 'ALTA': 1, 'MEDIA': 2, 'BAIXA': 3 };
    const priorityA = priorityOrder[a.priority] || 4;
    const priorityB = priorityOrder[b.priority] || 4;
    
    if (priorityA !== priorityB) {
      return priorityA - priorityB;
    }
    
    return new Date(b.effectiveDate).getTime() - new Date(a.effectiveDate).getTime();
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

// POST /api/dossier/legislations
export async function POST(request: NextRequest) {
  const body = await request.json();
  const newItem = {
    id: `${Date.now()}`,
    licenseTypeId: body.licenseTypeId,
    licenseTypeName: body.licenseTypeName || '',
    legislationType: body.legislationType || 'LEI',
    legislationNumber: body.legislationNumber,
    legislationYear: body.legislationYear || new Date().getFullYear(),
    title: body.title,
    description: body.description || '',
    publicationDate: body.publicationDate,
    effectiveDate: body.effectiveDate,
    expirationDate: body.expirationDate || undefined,
    issuingAuthority: body.issuingAuthority,
    officialUrl: body.officialUrl || '',
    documentPath: body.documentPath || '',
    status: body.status || 'VIGENTE',
    priority: body.priority || 'MEDIA',
    tags: body.tags || [],
    relatedLegislations: body.relatedLegislations || [],
    active: body.active !== false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: body.createdBy || 'system',
    updatedBy: body.updatedBy || 'system'
  } as any;
  
  mockLegislations.push(newItem);
  return NextResponse.json(newItem, { status: 201 });
}
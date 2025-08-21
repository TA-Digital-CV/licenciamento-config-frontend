/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextRequest, NextResponse } from 'next/server';
import { mockLegislations } from '../_data';

// GET /api/dossier/legislations/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const item = mockLegislations.find(item => item.id === id);
  
  if (!item) {
    return NextResponse.json(
      { error: 'Legislation not found' },
      { status: 404 }
    );
  }
  
  return NextResponse.json(item);
}

// PUT /api/dossier/legislations/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const body = await request.json();
  
  const itemIndex = mockLegislations.findIndex(item => item.id === id);
  
  if (itemIndex === -1) {
    return NextResponse.json(
      { error: 'Legislation not found' },
      { status: 404 }
    );
  }
  
  const existingItem = mockLegislations[itemIndex];
  const updatedItem = {
    ...existingItem,
    licenseTypeId: body.licenseTypeId ?? existingItem.licenseTypeId,
    licenseTypeName: body.licenseTypeName ?? existingItem.licenseTypeName,
    legislationType: body.legislationType ?? existingItem.legislationType,
    legislationNumber: body.legislationNumber ?? existingItem.legislationNumber,
    legislationYear: body.legislationYear ?? existingItem.legislationYear,
    title: body.title ?? existingItem.title,
    description: body.description ?? existingItem.description,
    publicationDate: body.publicationDate ?? existingItem.publicationDate,
    effectiveDate: body.effectiveDate ?? existingItem.effectiveDate,
    expirationDate: body.expirationDate ?? existingItem.expirationDate,
    issuingAuthority: body.issuingAuthority ?? existingItem.issuingAuthority,
    officialUrl: body.officialUrl ?? existingItem.officialUrl,
    documentPath: body.documentPath ?? existingItem.documentPath,
    status: body.status ?? existingItem.status,
    priority: body.priority ?? existingItem.priority,
    tags: body.tags ?? existingItem.tags,
    relatedLegislations: body.relatedLegislations ?? existingItem.relatedLegislations,
    active: body.active ?? existingItem.active,
    updatedAt: new Date().toISOString(),
    updatedBy: body.updatedBy || 'system'
  };
  
  mockLegislations[itemIndex] = updatedItem;
  return NextResponse.json(updatedItem);
}

// DELETE /api/dossier/legislations/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const itemIndex = mockLegislations.findIndex(item => item.id === id);
  
  if (itemIndex === -1) {
    return NextResponse.json(
      { error: 'Legislation not found' },
      { status: 404 }
    );
  }
  
  const deletedItem = mockLegislations.splice(itemIndex, 1)[0];
  return NextResponse.json(deletedItem);
}
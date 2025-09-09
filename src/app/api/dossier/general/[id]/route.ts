import { NextRequest, NextResponse } from 'next/server';
import { mockGeneralData } from '../_data';

// GET /api/dossier/general/[id]
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = mockGeneralData.find((item) => item.id === id);

  if (!item) {
    return NextResponse.json({ error: 'General data parameter not found' }, { status: 404 });
  }

  return NextResponse.json(item);
}

// PUT /api/dossier/general/[id]
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();

  const itemIndex = mockGeneralData.findIndex((item) => item.id === id);

  if (itemIndex === -1) {
    return NextResponse.json({ error: 'General data parameter not found' }, { status: 404 });
  }

  const existingItem = mockGeneralData[itemIndex];
  const updatedItem = {
    ...existingItem,
    licenseTypeId: body.licenseTypeId ?? existingItem.licenseTypeId,
    licenseTypeName: body.licenseTypeName ?? existingItem.licenseTypeName,
    parameterName: body.parameterName ?? existingItem.parameterName,
    parameterValue: body.parameterValue ?? existingItem.parameterValue,
    parameterType: body.parameterType ?? existingItem.parameterType,
    description: body.description ?? existingItem.description,
    isRequired: body.isRequired ?? existingItem.isRequired,
    isEditable: body.isEditable ?? existingItem.isEditable,
    displayOrder: body.displayOrder ?? existingItem.displayOrder,
    validationRules: body.validationRules ?? existingItem.validationRules,
    defaultValue: body.defaultValue ?? existingItem.defaultValue,
    category: body.category ?? existingItem.category,
    active: body.active ?? existingItem.active,
    updatedAt: new Date().toISOString(),
    updatedBy: body.updatedBy || 'system',
  };

  mockGeneralData[itemIndex] = updatedItem;
  return NextResponse.json(updatedItem);
}

// DELETE /api/dossier/general/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const itemIndex = mockGeneralData.findIndex((item) => item.id === id);

  if (itemIndex === -1) {
    return NextResponse.json({ error: 'General data parameter not found' }, { status: 404 });
  }

  const deletedItem = mockGeneralData.splice(itemIndex, 1)[0];
  return NextResponse.json(deletedItem);
}

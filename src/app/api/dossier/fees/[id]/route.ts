import { NextRequest, NextResponse } from 'next/server';
import { mockProcessTypeFees, mockFeeCategories, ProcessTypeFeeRecord } from '../_data';

// GET /api/dossier/fees/[id] - Get specific process type fee
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    const fee = mockProcessTypeFees.find(f => f.id === id);
    
    if (!fee) {
      return NextResponse.json(
        { error: 'Process type fee not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(fee);
  } catch (error) {
    console.error('Error fetching process type fee:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/dossier/fees/[id] - Update specific process type fee
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    
    const feeIndex = mockProcessTypeFees.findIndex(f => f.id === id);
    
    if (feeIndex === -1) {
      return NextResponse.json(
        { error: 'Process type fee not found' },
        { status: 404 }
      );
    }
    
    const currentFee = mockProcessTypeFees[feeIndex];
    
    // Validate enum values if provided
    if (body.currency) {
      const validCurrencies = ['CVE', 'EUR', 'USD'];
      if (!validCurrencies.includes(body.currency)) {
        return NextResponse.json(
          { error: `Invalid currency. Must be one of: ${validCurrencies.join(', ')}` },
          { status: 400 }
        );
      }
    }
    
    if (body.feeType) {
      const validFeeTypes = ['FIXO', 'PERCENTUAL', 'VARIAVEL', 'CONDICIONAL'];
      if (!validFeeTypes.includes(body.feeType)) {
        return NextResponse.json(
          { error: `Invalid feeType. Must be one of: ${validFeeTypes.join(', ')}` },
          { status: 400 }
        );
      }
    }
    
    if (body.calculationMethod) {
      const validCalculationMethods = ['VALOR_FIXO', 'PERCENTUAL_VALOR', 'POR_UNIDADE', 'ESCALONADO'];
      if (!validCalculationMethods.includes(body.calculationMethod)) {
        return NextResponse.json(
          { error: `Invalid calculationMethod. Must be one of: ${validCalculationMethods.join(', ')}` },
          { status: 400 }
        );
      }
    }
    
    if (body.paymentTiming) {
      const validPaymentTimings = ['ANTECIPADO', 'POSTERIOR', 'PARCELADO', 'CONDICIONAL'];
      if (!validPaymentTimings.includes(body.paymentTiming)) {
        return NextResponse.json(
          { error: `Invalid paymentTiming. Must be one of: ${validPaymentTimings.join(', ')}` },
          { status: 400 }
        );
      }
    }
    
    if (body.status) {
      const validStatuses = ['ATIVO', 'INATIVO', 'SUSPENSO', 'EM_REVISAO'];
      if (!validStatuses.includes(body.status)) {
        return NextResponse.json(
          { error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` },
          { status: 400 }
        );
      }
    }
    
    if (body.priority) {
      const validPriorities = ['ALTA', 'MEDIA', 'BAIXA'];
      if (!validPriorities.includes(body.priority)) {
        return NextResponse.json(
          { error: `Invalid priority. Must be one of: ${validPriorities.join(', ')}` },
          { status: 400 }
        );
      }
    }
    
    // Validate numeric fields
    if (body.amount !== undefined && (typeof body.amount !== 'number' || body.amount < 0)) {
      return NextResponse.json(
        { error: 'Amount must be a positive number' },
        { status: 400 }
      );
    }
    
    // Validate percentage for PERCENTUAL fee type
    const feeType = body.feeType || currentFee.feeType;
    if (feeType === 'PERCENTUAL' && body.percentage !== undefined && 
        (body.percentage <= 0 || body.percentage > 100)) {
      return NextResponse.json(
        { error: 'Percentage must be between 0 and 100 for PERCENTUAL fee type' },
        { status: 400 }
      );
    }
    
    // Check for duplicate association if processTypeId or feeId is being changed
    if ((body.processTypeId && body.processTypeId !== currentFee.processTypeId) ||
        (body.feeId && body.feeId !== currentFee.feeId)) {
      const existingFee = mockProcessTypeFees.find(fee => 
        fee.id !== id &&
        fee.processTypeId === (body.processTypeId || currentFee.processTypeId) &&
        fee.feeId === (body.feeId || currentFee.feeId) &&
        fee.active
      );
      
      if (existingFee) {
        return NextResponse.json(
          { error: 'An active fee association between this process type and fee already exists' },
          { status: 409 }
        );
      }
    }
    
    // Validate fee category exists if being changed
    if (body.feeCategoryId && body.feeCategoryId !== currentFee.feeCategoryId) {
      const feeCategory = mockFeeCategories.find(cat => cat.id === body.feeCategoryId && cat.active);
      if (!feeCategory) {
        return NextResponse.json(
          { error: 'Invalid fee category ID' },
          { status: 400 }
        );
      }
      body.feeCategoryName = feeCategory.name;
    }
    
    // Update the fee
    const updatedFee: ProcessTypeFeeRecord = {
      ...currentFee,
      ...body,
      id, // Ensure ID doesn't change
      updatedAt: new Date().toISOString(),
      updatedBy: body.updatedBy || 'system'
    };
    
    mockProcessTypeFees[feeIndex] = updatedFee;
    
    return NextResponse.json(updatedFee);
  } catch (error) {
    console.error('Error updating process type fee:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/dossier/fees/[id] - Delete specific process type fee
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { searchParams } = new URL(request.url);
    const hardDelete = searchParams.get('hardDelete') === 'true';
    
    const feeIndex = mockProcessTypeFees.findIndex(f => f.id === id);
    
    if (feeIndex === -1) {
      return NextResponse.json(
        { error: 'Process type fee not found' },
        { status: 404 }
      );
    }
    
    if (hardDelete) {
      // Hard delete - remove from array
      const deletedFee = mockProcessTypeFees.splice(feeIndex, 1)[0];
      return NextResponse.json({
        message: 'Process type fee permanently deleted',
        deletedFee
      });
    } else {
      // Soft delete - mark as inactive
      mockProcessTypeFees[feeIndex] = {
        ...mockProcessTypeFees[feeIndex],
        active: false,
        status: 'INATIVO',
        updatedAt: new Date().toISOString(),
        updatedBy: 'system'
      };
      
      return NextResponse.json({
        message: 'Process type fee deactivated',
        fee: mockProcessTypeFees[feeIndex]
      });
    }
  } catch (error) {
    console.error('Error deleting process type fee:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
import { NextRequest, NextResponse } from 'next/server';
import { mockProcessTypeAssociations, ProcessTypeAssociationRecord } from '../_data';

// GET /api/dossier/process-types/[id] - Get process type association by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    const association = mockProcessTypeAssociations.find(a => a.id === id);
    
    if (!association) {
      return NextResponse.json(
        { error: 'Process type association not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(association);
  } catch (error) {
    console.error('Error fetching process type association:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/dossier/process-types/[id] - Update process type association by ID
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    
    const associationIndex = mockProcessTypeAssociations.findIndex(a => a.id === id);
    
    if (associationIndex === -1) {
      return NextResponse.json(
        { error: 'Process type association not found' },
        { status: 404 }
      );
    }
    
    // Validate enum values if provided
    const validStatuses = ['ATIVO', 'INATIVO', 'SUSPENSO', 'EM_REVISAO'];
    const validPriorities = ['ALTA', 'MEDIA', 'BAIXA'];
    const validCategories = ['ADMINISTRATIVO', 'TECNICO', 'LEGAL', 'FINANCEIRO', 'OPERACIONAL'];
    const validDurationUnits = ['DIAS', 'SEMANAS', 'MESES', 'ANOS'];
    const validCurrencies = ['CVE', 'EUR', 'USD'];
    const validApprovalLevels = ['TECNICO', 'SUPERVISOR', 'DIRETOR', 'MINISTERIAL'];

    if (body.status && !validStatuses.includes(body.status)) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` },
        { status: 400 }
      );
    }

    if (body.priority && !validPriorities.includes(body.priority)) {
      return NextResponse.json(
        { error: `Invalid priority. Must be one of: ${validPriorities.join(', ')}` },
        { status: 400 }
      );
    }

    if (body.category && !validCategories.includes(body.category)) {
      return NextResponse.json(
        { error: `Invalid category. Must be one of: ${validCategories.join(', ')}` },
        { status: 400 }
      );
    }

    if (body.durationUnit && !validDurationUnits.includes(body.durationUnit)) {
      return NextResponse.json(
        { error: `Invalid durationUnit. Must be one of: ${validDurationUnits.join(', ')}` },
        { status: 400 }
      );
    }

    if (body.costCurrency && !validCurrencies.includes(body.costCurrency)) {
      return NextResponse.json(
        { error: `Invalid costCurrency. Must be one of: ${validCurrencies.join(', ')}` },
        { status: 400 }
      );
    }

    if (body.approvalLevel && !validApprovalLevels.includes(body.approvalLevel)) {
      return NextResponse.json(
        { error: `Invalid approvalLevel. Must be one of: ${validApprovalLevels.join(', ')}` },
        { status: 400 }
      );
    }

    // Check for duplicate association (excluding current one)
    if (body.licenseTypeId && body.processTypeId) {
      const existingAssociation = mockProcessTypeAssociations.find(association => 
        association.id !== id &&
        association.licenseTypeId === body.licenseTypeId &&
        association.processTypeId === body.processTypeId &&
        association.active
      );

      if (existingAssociation) {
        return NextResponse.json(
          { error: 'An active association between this license type and process type already exists' },
          { status: 409 }
        );
      }
    }

    // Check for duplicate execution order within the same license type (excluding current one)
    if (body.executionOrder && body.licenseTypeId) {
      const currentAssociation = mockProcessTypeAssociations[associationIndex];
      const licenseTypeId = body.licenseTypeId || currentAssociation.licenseTypeId;
      
      const duplicateOrder = mockProcessTypeAssociations.find(association => 
        association.id !== id &&
        association.licenseTypeId === licenseTypeId &&
        association.executionOrder === body.executionOrder &&
        association.active
      );

      if (duplicateOrder) {
        return NextResponse.json(
          { error: 'An active process with this execution order already exists for this license type' },
          { status: 409 }
        );
      }
    }
    
    // Update association
    const updatedAssociation: ProcessTypeAssociationRecord = {
      ...mockProcessTypeAssociations[associationIndex],
      ...body,
      id, // Ensure ID doesn't change
      updatedAt: new Date().toISOString(),
      updatedBy: body.updatedBy || 'system'
    };
    
    mockProcessTypeAssociations[associationIndex] = updatedAssociation;
    
    return NextResponse.json(updatedAssociation);
  } catch (error) {
    console.error('Error updating process type association:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/dossier/process-types/[id] - Delete process type association by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    const associationIndex = mockProcessTypeAssociations.findIndex(a => a.id === id);
    
    if (associationIndex === -1) {
      return NextResponse.json(
        { error: 'Process type association not found' },
        { status: 404 }
      );
    }
    
    // Check if association has dependencies (this would be more complex in a real system)
    // For now, we'll just perform a soft delete by setting active to false
    const { searchParams } = new URL(request.url);
    const hardDelete = searchParams.get('hard') === 'true';
    
    if (hardDelete) {
      // Hard delete - remove from array
      const deletedAssociation = mockProcessTypeAssociations.splice(associationIndex, 1)[0];
      return NextResponse.json({
        message: 'Process type association permanently deleted',
        deletedAssociation
      });
    } else {
      // Soft delete - set active to false
      mockProcessTypeAssociations[associationIndex] = {
        ...mockProcessTypeAssociations[associationIndex],
        active: false,
        updatedAt: new Date().toISOString(),
        updatedBy: 'system'
      };
      
      return NextResponse.json({
        message: 'Process type association deactivated',
        association: mockProcessTypeAssociations[associationIndex]
      });
    }
  } catch (error) {
    console.error('Error deleting process type association:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
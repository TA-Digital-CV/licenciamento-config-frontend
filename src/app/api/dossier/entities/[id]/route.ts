import { NextRequest, NextResponse } from 'next/server';
import { mockEntities, EntityRecord } from '../_data';

// GET /api/dossier/entities/[id] - Get entity by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    const entity = mockEntities.find(e => e.id === id);
    
    if (!entity) {
      return NextResponse.json(
        { error: 'Entity not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(entity);
  } catch (error) {
    console.error('Error fetching entity:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/dossier/entities/[id] - Update entity by ID
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    
    const entityIndex = mockEntities.findIndex(e => e.id === id);
    
    if (entityIndex === -1) {
      return NextResponse.json(
        { error: 'Entity not found' },
        { status: 404 }
      );
    }
    
    // Validate enum values if provided
    const validEntityTypes = ['PUBLICA', 'PRIVADA', 'MISTA', 'ONG', 'INTERNACIONAL'];
    const validEntityCategories = ['REGULADORA', 'FISCALIZADORA', 'CONSULTIVA', 'EXECUTIVA', 'APOIO'];
    const validJurisdictions = ['NACIONAL', 'REGIONAL', 'LOCAL', 'INTERNACIONAL'];
    const validStatuses = ['ATIVA', 'INATIVA', 'SUSPENSA', 'EM_REESTRUTURACAO'];
    const validPriorities = ['ALTA', 'MEDIA', 'BAIXA'];

    if (body.entityType && !validEntityTypes.includes(body.entityType)) {
      return NextResponse.json(
        { error: `Invalid entityType. Must be one of: ${validEntityTypes.join(', ')}` },
        { status: 400 }
      );
    }

    if (body.entityCategory && !validEntityCategories.includes(body.entityCategory)) {
      return NextResponse.json(
        { error: `Invalid entityCategory. Must be one of: ${validEntityCategories.join(', ')}` },
        { status: 400 }
      );
    }

    if (body.jurisdiction && !validJurisdictions.includes(body.jurisdiction)) {
      return NextResponse.json(
        { error: `Invalid jurisdiction. Must be one of: ${validJurisdictions.join(', ')}` },
        { status: 400 }
      );
    }

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

    // Check for duplicate entity name within the same license type (excluding current entity)
    if (body.entityName) {
      const existingEntity = mockEntities.find(entity => 
        entity.id !== id &&
        entity.entityName.toLowerCase() === body.entityName.toLowerCase() &&
        entity.licenseTypeId === (body.licenseTypeId || mockEntities[entityIndex].licenseTypeId) &&
        entity.active
      );

      if (existingEntity) {
        return NextResponse.json(
          { error: 'An active entity with this name already exists for this license type' },
          { status: 409 }
        );
      }
    }
    
    // Update entity
    const updatedEntity: EntityRecord = {
      ...mockEntities[entityIndex],
      ...body,
      id, // Ensure ID doesn't change
      updatedAt: new Date().toISOString(),
      updatedBy: body.updatedBy || 'system'
    };
    
    mockEntities[entityIndex] = updatedEntity;
    
    return NextResponse.json(updatedEntity);
  } catch (error) {
    console.error('Error updating entity:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/dossier/entities/[id] - Delete entity by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    const entityIndex = mockEntities.findIndex(e => e.id === id);
    
    if (entityIndex === -1) {
      return NextResponse.json(
        { error: 'Entity not found' },
        { status: 404 }
      );
    }
    
    // Check if entity has dependencies (this would be more complex in a real system)
    // For now, we'll just perform a soft delete by setting active to false
    const { searchParams } = new URL(request.url);
    const hardDelete = searchParams.get('hard') === 'true';
    
    if (hardDelete) {
      // Hard delete - remove from array
      const deletedEntity = mockEntities.splice(entityIndex, 1)[0];
      return NextResponse.json({
        message: 'Entity permanently deleted',
        deletedEntity
      });
    } else {
      // Soft delete - set active to false
      mockEntities[entityIndex] = {
        ...mockEntities[entityIndex],
        active: false,
        updatedAt: new Date().toISOString(),
        updatedBy: 'system'
      };
      
      return NextResponse.json({
        message: 'Entity deactivated',
        entity: mockEntities[entityIndex]
      });
    }
  } catch (error) {
    console.error('Error deleting entity:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
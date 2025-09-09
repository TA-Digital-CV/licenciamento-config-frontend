import { NextRequest, NextResponse } from 'next/server';
import { mockEntities } from './_data';
import { EntityRecord } from '@/app/(myapp)/types/entities.types';

// GET /api/dossier/entities - List entities with filtering and pagination
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Extract query parameters
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const licenseTypeId = searchParams.get('licenseTypeId');
    const entityType = searchParams.get('entityType');
    const entityCategory = searchParams.get('entityCategory');
    const status = searchParams.get('status');
    const jurisdiction = searchParams.get('jurisdiction');
    const priority = searchParams.get('priority');
    const active = searchParams.get('active');
    const sortBy = searchParams.get('sortBy') || 'entityName';
    const sortOrder = searchParams.get('sortOrder') || 'asc';

    // Filter entities
    let filteredEntities = [...mockEntities];

    // Apply filters
    if (search) {
      const searchLower = search.toLowerCase();
      filteredEntities = filteredEntities.filter(
        (entity) =>
          entity.entityName.toLowerCase().includes(searchLower) ||
          entity.description?.toLowerCase().includes(searchLower) ||
          entity.responsiblePerson?.toLowerCase().includes(searchLower),
      );
    }

    if (licenseTypeId) {
      filteredEntities = filteredEntities.filter(
        (entity) => entity.licenseTypeId === licenseTypeId,
      );
    }

    if (entityType) {
      filteredEntities = filteredEntities.filter((entity) => entity.entityType === entityType);
    }

    if (entityCategory) {
      filteredEntities = filteredEntities.filter(
        (entity) => entity.entityCategory === entityCategory,
      );
    }

    if (status) {
      filteredEntities = filteredEntities.filter((entity) => entity.status === status);
    }

    if (jurisdiction) {
      filteredEntities = filteredEntities.filter((entity) => entity.jurisdiction === jurisdiction);
    }

    if (priority) {
      filteredEntities = filteredEntities.filter((entity) => entity.priority === priority);
    }

    if (active !== null && active !== undefined && active !== '') {
      const isActive = active === 'true';
      filteredEntities = filteredEntities.filter((entity) => entity.active === isActive);
    }

    // Sort entities
    filteredEntities.sort((a, b) => {
      let aValue: string | number = a[sortBy as keyof EntityRecord] as string | number;
      let bValue: string | number = b[sortBy as keyof EntityRecord] as string | number;

      // Handle special sorting cases
      if (sortBy === 'priority') {
        const priorityOrder = { ALTA: 3, MEDIA: 2, BAIXA: 1 };
        aValue = priorityOrder[aValue as keyof typeof priorityOrder] || 0;
        bValue = priorityOrder[bValue as keyof typeof priorityOrder] || 0;
      }

      if (sortBy === 'establishmentDate') {
        aValue = new Date((aValue as string) || '1900-01-01').getTime();
        bValue = new Date((bValue as string) || '1900-01-01').getTime();
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (sortOrder === 'desc') {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
      }
      return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
    });

    // Calculate pagination
    const total = filteredEntities.length;
    const totalPages = Math.ceil(total / limit);
    const offset = (page - 1) * limit;
    const paginatedEntities = filteredEntities.slice(offset, offset + limit);

    return NextResponse.json({
      data: paginatedEntities,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
      filters: {
        search,
        licenseTypeId,
        entityType,
        entityCategory,
        status,
        jurisdiction,
        priority,
        active,
        sortBy,
        sortOrder,
      },
    });
  } catch (error) {
    console.error('Error fetching entities:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/dossier/entities - Create new entity
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const requiredFields = [
      'licenseTypeId',
      'entityName',
      'entityType',
      'entityCategory',
      'jurisdiction',
    ];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ error: `Field '${field}' is required` }, { status: 400 });
      }
    }

    // Validate enum values
    const validEntityTypes = ['PUBLICA', 'PRIVADA', 'MISTA', 'ONG', 'INTERNACIONAL'];
    const validEntityCategories = [
      'REGULADORA',
      'FISCALIZADORA',
      'CONSULTIVA',
      'EXECUTIVA',
      'APOIO',
    ];
    const validJurisdictions = ['NACIONAL', 'REGIONAL', 'LOCAL', 'INTERNACIONAL'];
    const validStatuses = ['ATIVA', 'INATIVA', 'SUSPENSA', 'EM_REESTRUTURACAO'];
    const validPriorities = ['ALTA', 'MEDIA', 'BAIXA'];

    if (!validEntityTypes.includes(body.entityType)) {
      return NextResponse.json(
        { error: `Invalid entityType. Must be one of: ${validEntityTypes.join(', ')}` },
        { status: 400 },
      );
    }

    if (!validEntityCategories.includes(body.entityCategory)) {
      return NextResponse.json(
        { error: `Invalid entityCategory. Must be one of: ${validEntityCategories.join(', ')}` },
        { status: 400 },
      );
    }

    if (!validJurisdictions.includes(body.jurisdiction)) {
      return NextResponse.json(
        { error: `Invalid jurisdiction. Must be one of: ${validJurisdictions.join(', ')}` },
        { status: 400 },
      );
    }

    if (body.status && !validStatuses.includes(body.status)) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` },
        { status: 400 },
      );
    }

    if (body.priority && !validPriorities.includes(body.priority)) {
      return NextResponse.json(
        { error: `Invalid priority. Must be one of: ${validPriorities.join(', ')}` },
        { status: 400 },
      );
    }

    // Check for duplicate entity name within the same license type
    const existingEntity = mockEntities.find(
      (entity) =>
        entity.entityName.toLowerCase() === body.entityName.toLowerCase() &&
        entity.licenseTypeId === body.licenseTypeId &&
        entity.active,
    );

    if (existingEntity) {
      return NextResponse.json(
        { error: 'An active entity with this name already exists for this license type' },
        { status: 409 },
      );
    }

    // Generate new ID
    const newId = (Math.max(...mockEntities.map((e) => parseInt(e.id))) + 1).toString();

    // Create new entity
    const newEntity: EntityRecord = {
      id: newId,
      licenseTypeId: body.licenseTypeId,
      licenseTypeName: body.licenseTypeName || undefined,
      entityName: body.entityName,
      entityType: body.entityType,
      entityCategory: body.entityCategory,
      description: body.description || undefined,
      legalFramework: body.legalFramework || undefined,
      jurisdiction: body.jurisdiction,
      parentEntityId: body.parentEntityId || undefined,
      parentEntityName: body.parentEntityName || undefined,
      responsiblePerson: body.responsiblePerson || undefined,
      establishmentDate: body.establishmentDate || undefined,
      website: body.website || undefined,
      logoUrl: body.logoUrl || undefined,
      status: body.status || 'ATIVA',
      priority: body.priority || 'MEDIA',
      contacts: body.contacts || [],
      active: body.active !== undefined ? body.active : true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: body.createdBy || 'system',
      updatedBy: body.updatedBy || 'system',
    };

    // Add to mock data
    mockEntities.push(newEntity);

    return NextResponse.json(newEntity, { status: 201 });
  } catch (error) {
    console.error('Error creating entity:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

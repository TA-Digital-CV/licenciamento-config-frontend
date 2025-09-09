import { NextRequest, NextResponse } from 'next/server';
import { mockProcessTypeAssociations, ProcessTypeAssociationRecord } from './_data';

// GET /api/dossier/process-types - List process type associations with filtering and pagination
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Extract query parameters
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const licenseTypeId = searchParams.get('licenseTypeId');
    const processTypeId = searchParams.get('processTypeId');
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    const category = searchParams.get('category');
    const isRequired = searchParams.get('isRequired');
    const canBeParallel = searchParams.get('canBeParallel');
    const requiresApproval = searchParams.get('requiresApproval');
    const approvalLevel = searchParams.get('approvalLevel');
    const active = searchParams.get('active');
    const sortBy = searchParams.get('sortBy') || 'executionOrder';
    const sortOrder = searchParams.get('sortOrder') || 'asc';

    // Filter process type associations
    let filteredAssociations = [...mockProcessTypeAssociations];

    // Apply filters
    if (search) {
      const searchLower = search.toLowerCase();
      filteredAssociations = filteredAssociations.filter(
        (association) =>
          association.processTypeName.toLowerCase().includes(searchLower) ||
          association.processTypeCode?.toLowerCase().includes(searchLower) ||
          association.processTypeDescription?.toLowerCase().includes(searchLower) ||
          association.responsibleEntity?.toLowerCase().includes(searchLower),
      );
    }

    if (licenseTypeId) {
      filteredAssociations = filteredAssociations.filter(
        (association) => association.licenseTypeId === licenseTypeId,
      );
    }

    if (processTypeId) {
      filteredAssociations = filteredAssociations.filter(
        (association) => association.processTypeId === processTypeId,
      );
    }

    if (status) {
      filteredAssociations = filteredAssociations.filter(
        (association) => association.status === status,
      );
    }

    if (priority) {
      filteredAssociations = filteredAssociations.filter(
        (association) => association.priority === priority,
      );
    }

    if (category) {
      filteredAssociations = filteredAssociations.filter(
        (association) => association.category === category,
      );
    }

    if (isRequired !== null && isRequired !== undefined && isRequired !== '') {
      const required = isRequired === 'true';
      filteredAssociations = filteredAssociations.filter(
        (association) => association.isRequired === required,
      );
    }

    if (canBeParallel !== null && canBeParallel !== undefined && canBeParallel !== '') {
      const parallel = canBeParallel === 'true';
      filteredAssociations = filteredAssociations.filter(
        (association) => association.canBeParallel === parallel,
      );
    }

    if (requiresApproval !== null && requiresApproval !== undefined && requiresApproval !== '') {
      const approval = requiresApproval === 'true';
      filteredAssociations = filteredAssociations.filter(
        (association) => association.requiresApproval === approval,
      );
    }

    if (approvalLevel) {
      filteredAssociations = filteredAssociations.filter(
        (association) => association.approvalLevel === approvalLevel,
      );
    }

    if (active !== null && active !== undefined && active !== '') {
      const isActive = active === 'true';
      filteredAssociations = filteredAssociations.filter(
        (association) => association.active === isActive,
      );
    }

    // Sort associations
    filteredAssociations.sort((a, b) => {
      let aValue: string | number = a[sortBy as keyof ProcessTypeAssociationRecord] as string | number;
      let bValue: string | number = b[sortBy as keyof ProcessTypeAssociationRecord] as string | number;

      // Handle special sorting cases
      if (sortBy === 'priority') {
        const priorityOrder = { ALTA: 3, MEDIA: 2, BAIXA: 1 };
        aValue = priorityOrder[aValue as keyof typeof priorityOrder] || 0;
        bValue = priorityOrder[bValue as keyof typeof priorityOrder] || 0;
      }

      if (sortBy === 'validFrom' || sortBy === 'validUntil') {
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
    const total = filteredAssociations.length;
    const totalPages = Math.ceil(total / limit);
    const offset = (page - 1) * limit;
    const paginatedAssociations = filteredAssociations.slice(offset, offset + limit);

    return NextResponse.json({
      data: paginatedAssociations,
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
        processTypeId,
        status,
        priority,
        category,
        isRequired,
        canBeParallel,
        requiresApproval,
        approvalLevel,
        active,
        sortBy,
        sortOrder,
      },
    });
  } catch (error) {
    console.error('Error fetching process type associations:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/dossier/process-types - Create new process type association
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const requiredFields = ['licenseTypeId', 'processTypeId', 'processTypeName', 'executionOrder'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ error: `Field '${field}' is required` }, { status: 400 });
      }
    }

    // Validate enum values
    const validStatuses = ['ATIVO', 'INATIVO', 'SUSPENSO', 'EM_REVISAO'];
    const validPriorities = ['ALTA', 'MEDIA', 'BAIXA'];
    const validCategories = ['ADMINISTRATIVO', 'TECNICO', 'LEGAL', 'FINANCEIRO', 'OPERACIONAL'];
    const validDurationUnits = ['DIAS', 'SEMANAS', 'MESES', 'ANOS'];
    const validCurrencies = ['CVE', 'EUR', 'USD'];
    const validApprovalLevels = ['TECNICO', 'SUPERVISOR', 'DIRETOR', 'MINISTERIAL'];

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

    if (body.category && !validCategories.includes(body.category)) {
      return NextResponse.json(
        { error: `Invalid category. Must be one of: ${validCategories.join(', ')}` },
        { status: 400 },
      );
    }

    if (body.durationUnit && !validDurationUnits.includes(body.durationUnit)) {
      return NextResponse.json(
        { error: `Invalid durationUnit. Must be one of: ${validDurationUnits.join(', ')}` },
        { status: 400 },
      );
    }

    if (body.costCurrency && !validCurrencies.includes(body.costCurrency)) {
      return NextResponse.json(
        { error: `Invalid costCurrency. Must be one of: ${validCurrencies.join(', ')}` },
        { status: 400 },
      );
    }

    if (body.approvalLevel && !validApprovalLevels.includes(body.approvalLevel)) {
      return NextResponse.json(
        { error: `Invalid approvalLevel. Must be one of: ${validApprovalLevels.join(', ')}` },
        { status: 400 },
      );
    }

    // Check for duplicate association
    const existingAssociation = mockProcessTypeAssociations.find(
      (association) =>
        association.licenseTypeId === body.licenseTypeId &&
        association.processTypeId === body.processTypeId &&
        association.active,
    );

    if (existingAssociation) {
      return NextResponse.json(
        {
          error: 'An active association between this license type and process type already exists',
        },
        { status: 409 },
      );
    }

    // Check for duplicate execution order within the same license type
    const duplicateOrder = mockProcessTypeAssociations.find(
      (association) =>
        association.licenseTypeId === body.licenseTypeId &&
        association.executionOrder === body.executionOrder &&
        association.active,
    );

    if (duplicateOrder) {
      return NextResponse.json(
        {
          error: 'An active process with this execution order already exists for this license type',
        },
        { status: 409 },
      );
    }

    // Generate new ID
    const newId = (
      Math.max(...mockProcessTypeAssociations.map((a) => parseInt(a.id))) + 1
    ).toString();

    // Create new association
    const newAssociation: ProcessTypeAssociationRecord = {
      id: newId,
      licenseTypeId: body.licenseTypeId,
      licenseTypeName: body.licenseTypeName || undefined,
      processTypeId: body.processTypeId,
      processTypeName: body.processTypeName,
      processTypeCode: body.processTypeCode || undefined,
      processTypeDescription: body.processTypeDescription || undefined,
      isRequired: body.isRequired !== undefined ? body.isRequired : true,
      executionOrder: body.executionOrder,
      estimatedDuration: body.estimatedDuration || undefined,
      durationUnit: body.durationUnit || 'DIAS',
      prerequisites: body.prerequisites || undefined,
      requiredDocuments: body.requiredDocuments || [],
      responsibleEntity: body.responsibleEntity || undefined,
      cost: body.cost || undefined,
      costCurrency: body.costCurrency || 'CVE',
      status: body.status || 'ATIVO',
      priority: body.priority || 'MEDIA',
      category: body.category || 'ADMINISTRATIVO',
      canBeParallel: body.canBeParallel !== undefined ? body.canBeParallel : false,
      requiresApproval: body.requiresApproval !== undefined ? body.requiresApproval : true,
      approvalLevel: body.approvalLevel || 'TECNICO',
      validFrom: body.validFrom || undefined,
      validUntil: body.validUntil || undefined,
      notes: body.notes || undefined,
      active: body.active !== undefined ? body.active : true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: body.createdBy || 'system',
      updatedBy: body.updatedBy || 'system',
    };

    // Add to mock data
    mockProcessTypeAssociations.push(newAssociation);

    return NextResponse.json(newAssociation, { status: 201 });
  } catch (error) {
    console.error('Error creating process type association:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { apiClient } from '../../(myapp)/lib/api-client';
import {
  WrapperListLicenseProcessTypeDTO,
  LicenseProcessTypeRequestDTO,
  LicenseProcessTypeResponseDTO,
} from '../../(myapp)/types/license-process-types.types';

// GET /api/license-process-types - Lista tipos de processo de licença com filtros e paginação
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Parâmetros de paginação
    const pageNumber = searchParams.get('pageNumber') || '0';
    const pageSize = searchParams.get('pageSize') || '20';
    const sort = searchParams.get('sort') || 'processName,asc';

    // Parâmetros de filtro
    const processName = searchParams.get('processName');
    const processCode = searchParams.get('processCode');
    const processCategory = searchParams.get('processCategory');
    const licenseTypeId = searchParams.get('licenseTypeId');
    const priority = searchParams.get('priority');
    const active = searchParams.get('active') || 'true';

    // Construir query parameters
    const queryParams = new URLSearchParams({
      pageNumber,
      pageSize,
      sort,
      active,
    });

    // Adicionar filtros opcionais
    if (processName) queryParams.append('processName', processName);
    if (processCode) queryParams.append('processCode', processCode);
    if (processCategory) queryParams.append('processCategory', processCategory);
    if (licenseTypeId) queryParams.append('licenseTypeId', licenseTypeId);
    if (priority) queryParams.append('priority', priority);

    const response = await apiClient.get<WrapperListLicenseProcessTypeDTO>(
      `/license-process-types?${queryParams.toString()}`,
    );

    return NextResponse.json(response);
  } catch (error: any) {
    console.error('Error fetching license process types:', error);
    return NextResponse.json(
      { error: 'Failed to fetch license process types' },
      { status: error.status || 500 },
    );
  }
}

// POST /api/license-process-types - Criar novo tipo de processo de licença
export async function POST(request: NextRequest) {
  try {
    const body: LicenseProcessTypeRequestDTO = await request.json();

    // Validar campos obrigatórios
    if (!body.processName || !body.processCode || !body.licenseTypeId) {
      return NextResponse.json(
        { error: 'Missing required fields: processName, processCode, licenseTypeId' },
        { status: 400 },
      );
    }

    // Validar valores de enum
    const validCategories = [
      'INICIAL',
      'RENOVACAO',
      'ALTERACAO',
      'TRANSFERENCIA',
      'CANCELAMENTO',
      'SUSPENSAO',
    ];
    if (!validCategories.includes(body.processCategory)) {
      return NextResponse.json(
        { error: 'Invalid processCategory. Must be one of: ' + validCategories.join(', ') },
        { status: 400 },
      );
    }

    const validPriorities = ['ALTA', 'MEDIA', 'BAIXA'];
    if (!validPriorities.includes(body.priority)) {
      return NextResponse.json(
        { error: 'Invalid priority. Must be one of: ' + validPriorities.join(', ') },
        { status: 400 },
      );
    }

    const validDurationUnits = ['DIAS', 'SEMANAS', 'MESES'];
    if (!validDurationUnits.includes(body.durationUnit)) {
      return NextResponse.json(
        { error: 'Invalid durationUnit. Must be one of: ' + validDurationUnits.join(', ') },
        { status: 400 },
      );
    }

    if (body.validityUnit && !['DIAS', 'MESES', 'ANOS'].includes(body.validityUnit)) {
      return NextResponse.json(
        { error: 'Invalid validityUnit. Must be one of: DIAS, MESES, ANOS' },
        { status: 400 },
      );
    }

    // Validar valores numéricos
    if (body.estimatedDuration && body.estimatedDuration <= 0) {
      return NextResponse.json(
        { error: 'estimatedDuration must be greater than 0' },
        { status: 400 },
      );
    }

    if (body.validityPeriod && body.validityPeriod <= 0) {
      return NextResponse.json(
        { error: 'validityPeriod must be greater than 0' },
        { status: 400 },
      );
    }

    const response = await apiClient.post<LicenseProcessTypeResponseDTO>(
      '/license-process-types',
      body,
    );

    return NextResponse.json(response, { status: 201 });
  } catch (error: any) {
    console.error('Error creating license process type:', error);
    return NextResponse.json(
      { error: 'Failed to create license process type' },
      { status: error.status || 500 },
    );
  }
}
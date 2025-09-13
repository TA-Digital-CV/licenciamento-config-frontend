import { NextRequest, NextResponse } from 'next/server';
import { apiClient } from '../../../(myapp)/lib/api-client';
import {
  LicenseProcessTypeResponseDTO,
  LicenseProcessTypeRequestDTO,
} from '../../../(myapp)/types/license-process-types.types';

// GET /api/license-process-types/[id]
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: 'License process type ID is required' }, { status: 400 });
    }

    const response = await apiClient.get<LicenseProcessTypeResponseDTO>(
      `/license-process-types/${id}`,
    );

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching license process type:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar tipo de processo de licença' },
      { status: 500 },
    );
  }
}

// PUT /api/license-process-types/[id]
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body: LicenseProcessTypeRequestDTO = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'License process type ID is required' }, { status: 400 });
    }

    // Validate required fields
    if (!body.processName || !body.processCode || !body.licenseTypeId) {
      return NextResponse.json(
        { error: 'Missing required fields: processName, processCode, licenseTypeId' },
        { status: 400 },
      );
    }

    // Validate enum values
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

    const response = await apiClient.put<LicenseProcessTypeResponseDTO>(
      `/license-process-types/${id}`,
      body,
    );

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error updating license process type:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar tipo de processo de licença' },
      { status: 500 },
    );
  }
}

// DELETE /api/license-process-types/[id]
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: 'License process type ID is required' }, { status: 400 });
    }

    await apiClient.delete(`/license-process-types/${id}`);

    return NextResponse.json({ message: 'License process type deleted successfully' });
  } catch (error) {
    console.error('Error deleting license process type:', error);
    return NextResponse.json(
      { error: 'Erro ao excluir tipo de processo de licença' },
      { status: 500 },
    );
  }
}

// PATCH /api/license-process-types/[id]/activate
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    if (!id) {
      return NextResponse.json({ error: 'License process type ID is required' }, { status: 400 });
    }

    let endpoint = '';
    let successMessage = '';

    switch (action) {
      case 'activate':
        endpoint = `/license-process-types/${id}/ativar`;
        successMessage = 'License process type activated successfully';
        break;
      case 'deactivate':
        endpoint = `/license-process-types/${id}/desativar`;
        successMessage = 'License process type deactivated successfully';
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid action. Use ?action=activate or ?action=deactivate' },
          { status: 400 },
        );
    }

    await apiClient.patch(endpoint);

    // Fetch updated license process type
    const response = await apiClient.get<LicenseProcessTypeResponseDTO>(
      `/license-process-types/${id}`,
    );

    return NextResponse.json({
      message: successMessage,
      data: response,
    });
  } catch (error) {
    console.error('Error updating license process type status:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar status do tipo de processo de licença' },
      { status: 500 },
    );
  }
}

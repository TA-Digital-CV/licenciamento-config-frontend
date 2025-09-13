import { NextRequest, NextResponse } from 'next/server';
import { apiClient } from '../../../../(myapp)/lib/api-client';
import { LicenseTypeResponseDTO } from '../../../../(myapp)/types/licence-types.types';

// PATCH /api/licence-types/[id]/enable
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: 'License type ID is required' }, { status: 400 });
    }

    // Call backend to activate license type
    await apiClient.patch(`/license-types/${id}/ativar`);

    // Fetch updated license type
    const response = await apiClient.get<LicenseTypeResponseDTO>(`/license-types/${id}`);

    // Transform backend response to match frontend expectations
    const transformedResponse = {
      id: response.id,
      name: response.name,
      description: response.description,
      code: response.code,
      active: true, // Activated
      sortOrder: 0,
      categoryId: response.categoryId,
      categoryName: undefined, // Will be populated by frontend if needed
      licensingModel: response.licensingModel,
      validityPeriod: response.validityPeriod,
      validityUnit: response.validityUnit,
      renewable: response.renewable,
      autoRenewal: response.autoRenewal,
      requiresInspection: response.requiresInspection,
      requiresPublicConsultation: response.requiresPublicConsultation,
      maxProcessingDays: response.maxProcessingDays,
      hasFees: response.hasFees,
      baseFee: response.baseFee,
      currencyCode: response.currencyCode,
      metadata: response.metadata,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json(transformedResponse);
  } catch (error) {
    console.error('Error enabling license type:', error);
    return NextResponse.json({ error: 'Erro ao ativar tipo de licença' }, { status: 500 });
  }
}

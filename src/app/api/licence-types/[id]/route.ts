import { NextRequest, NextResponse } from 'next/server';
import { apiClient } from '../../../(myapp)/lib/api-client';
import {
  LicenseTypeResponseDTO,
  LicenseTypeRequestDTO,
} from '../../../(myapp)/types/licence-types.types';

// GET /api/licence-types/[id]
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const response = await apiClient.get<LicenseTypeResponseDTO>(`/license-types/${id}`);

    // Transform backend response to match frontend expectations
    const transformedResponse = {
      id: response.id,
      name: response.name,
      description: response.description,
      code: response.code,
      active: true,
      sortOrder: 0,
      categoryId: response.categoryId,
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
    console.error('Error fetching license type:', error);
    return NextResponse.json({ message: 'License type not found' }, { status: 404 });
  }
}

// PUT /api/licence-types/[id]
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Check if this is an activate/deactivate operation
    if (body.action === 'activate') {
      await apiClient.patch(`/license-types/${id}/ativar`);
      // Buscar o tipo de licença atualizado
      const response = await apiClient.get<LicenseTypeResponseDTO>(`/license-types/${id}`);
      return NextResponse.json({
        id: response.id,
        name: response.name,
        code: response.code,
        active: true, // Not available in backend DTO, default to true
        categoryId: response.categoryId,
        licensingModel: response.licensingModel,
        renewable: response.renewable,
        validityPeriod: response.validityPeriod,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    if (body.action === 'deactivate') {
      await apiClient.patch(`/license-types/${id}/desativar`);
      // Buscar o tipo de licença atualizado
      const response = await apiClient.get<LicenseTypeResponseDTO>(`/license-types/${id}`);
      return NextResponse.json({
        id: response.id,
        name: response.name,
        code: response.code,
        active: true, // Not available in backend DTO, default to true
        categoryId: response.categoryId,
        licensingModel: response.licensingModel,
        renewable: response.renewable,
        validityPeriod: response.validityPeriod,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    // Regular update operation
    const licenseTypeData: LicenseTypeRequestDTO = {
      name: body.name,
      description: body.description || undefined,
      code: body.code, // Note: code might be immutable on backend
      licensingModelKey: body.licensingModelKey,
      validityPeriod: body.validityPeriod || undefined,
      validityUnitKey: body.validityUnitKey || undefined,
      renewable: body.renewable,
      autoRenewal: body.autoRenewal,
      requiresInspection: body.requiresInspection,
      requiresPublicConsultation: body.requiresPublicConsultation,
      maxProcessingDays: body.maxProcessingDays || undefined,
      hasFees: body.hasFees,
      baseFee: body.baseFee || undefined,
      currencyCode: body.currencyCode || undefined,
      active: body.active,
      sortOrder: body.sortOrder || undefined,
      metadata: body.metadata || undefined,
      categoryId: body.categoryId,
    };

    const response = await apiClient.put<LicenseTypeResponseDTO>(
      `/license-types/${id}`,
      licenseTypeData,
    );

    // Transform backend response to match frontend expectations
    const transformedResponse = {
      id: response.id,
      name: response.name,
      description: response.description,
      code: response.code,
      active: true,
      sortOrder: 0,
      categoryId: response.categoryId,
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
    console.error('Error updating license type:', error);
    return NextResponse.json({ message: 'Failed to update license type' }, { status: 500 });
  }
}

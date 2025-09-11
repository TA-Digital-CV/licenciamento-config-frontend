import { NextRequest, NextResponse } from 'next/server';
import { apiClient, ApiResponse } from '../../(myapp)/lib/api-client';
import {
  LicenseTypeResponseDTO,
  LicenseTypeRequestDTO,
} from '@/app/(myapp)/types/licence-types.types';

// GET /api/licence-types
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const params: Record<string, string> = {};

    // Map query parameters
    if (searchParams.get('active') !== null) {
      params.active = searchParams.get('active')!;
    }
    if (searchParams.get('categoryId')) {
      params.categoryId = searchParams.get('categoryId')!;
    }
    if (searchParams.get('sectorId')) {
      params.sectorId = searchParams.get('sectorId')!;
    }
    if (searchParams.get('page')) {
      params.page = searchParams.get('page')!;
    }
    if (searchParams.get('size')) {
      params.size = searchParams.get('size')!;
    }

    const response = await apiClient.get<ApiResponse<LicenseTypeResponseDTO>>(
      '/license-types',
      params,
    );

    const transformedLicenseTypes = response.content.map((licenseType: LicenseTypeResponseDTO) => ({
      id: licenseType.id,
      name: licenseType.name,
      description: licenseType.description,
      code: licenseType.code,
      active: true,
      sortOrder: 0,
      categoryId: licenseType.categoryId,
      licensingModel: licenseType.licensingModel,
      validityPeriod: licenseType.validityPeriod,
      validityUnit: licenseType.validityUnit,
      renewable: licenseType.renewable,
      autoRenewal: licenseType.autoRenewal,
      requiresInspection: licenseType.requiresInspection,
      requiresPublicConsultation: licenseType.requiresPublicConsultation,
      maxProcessingDays: licenseType.maxProcessingDays,
      hasFees: licenseType.hasFees,
      baseFee: licenseType.baseFee,
      currencyCode: licenseType.currencyCode,
      metadata: licenseType.metadata,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));

    return NextResponse.json({
      content: transformedLicenseTypes,
      total: response.total,
    });
  } catch (error) {
    console.error('Error fetching license types:', error);
    return NextResponse.json({ message: 'Failed to fetch license types' }, { status: 500 });
  }
}

// POST /api/licence-types
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const licenseTypeData: LicenseTypeRequestDTO = {
      name: body.name,
      description: body.description || undefined,
      code: body.code,
      licensingModelKey: body.licensingModelKey,
      validityPeriod: body.validityPeriod || undefined,
      validityUnitKey: body.validityUnitKey || undefined,
      renewable: body.renewable !== false,
      autoRenewal: body.autoRenewal === true,
      requiresInspection: body.requiresInspection === true,
      requiresPublicConsultation: body.requiresPublicConsultation === true,
      maxProcessingDays: body.maxProcessingDays || undefined,
      hasFees: body.hasFees === true,
      baseFee: body.baseFee || undefined,
      currencyCode: body.currencyCode || undefined,
      active: body.active !== false,
      sortOrder: body.sortOrder || undefined,
      metadata: body.metadata || undefined,
      categoryId: body.categoryId,
    };

    const response = await apiClient.post<LicenseTypeResponseDTO>(
      '/license-types',
      licenseTypeData,
    );

    const transformedLicenseType = {
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

    return NextResponse.json(transformedLicenseType, { status: 201 });
  } catch (error) {
    console.error('Error creating license type:', error);
    return NextResponse.json({ message: 'Failed to create license type' }, { status: 500 });
  }
}

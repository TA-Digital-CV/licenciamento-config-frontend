import { NextRequest, NextResponse } from 'next/server';
import { mockProcessTypeFees, mockFeeCategories, ProcessTypeFeeRecord } from './_data';

// GET /api/dossier/fees - Get process type fees with filtering and pagination
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Pagination parameters
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;
    
    // Filter parameters
    const processTypeId = searchParams.get('processTypeId');
    const feeId = searchParams.get('feeId');
    const feeCategoryId = searchParams.get('feeCategoryId');
    const feeType = searchParams.get('feeType');
    const calculationMethod = searchParams.get('calculationMethod');
    const paymentTiming = searchParams.get('paymentTiming');
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    const isRequired = searchParams.get('isRequired');
    const isRefundable = searchParams.get('isRefundable');
    const currency = searchParams.get('currency');
    const active = searchParams.get('active');
    const search = searchParams.get('search');
    
    // Sorting parameters
    const sortBy = searchParams.get('sortBy') || 'priority';
    const sortOrder = searchParams.get('sortOrder') || 'asc';
    
    // Filter data
    let filteredFees = mockProcessTypeFees.filter(fee => {
      if (processTypeId && fee.processTypeId !== processTypeId) return false;
      if (feeId && fee.feeId !== feeId) return false;
      if (feeCategoryId && fee.feeCategoryId !== feeCategoryId) return false;
      if (feeType && fee.feeType !== feeType) return false;
      if (calculationMethod && fee.calculationMethod !== calculationMethod) return false;
      if (paymentTiming && fee.paymentTiming !== paymentTiming) return false;
      if (status && fee.status !== status) return false;
      if (priority && fee.priority !== priority) return false;
      if (isRequired !== null && fee.isRequired !== (isRequired === 'true')) return false;
      if (isRefundable !== null && fee.isRefundable !== (isRefundable === 'true')) return false;
      if (currency && fee.currency !== currency) return false;
      if (active !== null && fee.active !== (active === 'true')) return false;
      if (search) {
        const searchLower = search.toLowerCase();
        return (
          fee.feeName?.toLowerCase().includes(searchLower) ||
          fee.processTypeName?.toLowerCase().includes(searchLower) ||
          fee.feeCategoryName?.toLowerCase().includes(searchLower) ||
          fee.legalBasis?.toLowerCase().includes(searchLower) ||
          fee.observations?.toLowerCase().includes(searchLower)
        );
      }
      return true;
    });
    
    // Sort data
    filteredFees.sort((a, b) => {
      let aValue: any = a[sortBy as keyof ProcessTypeFeeRecord];
      let bValue: any = b[sortBy as keyof ProcessTypeFeeRecord];
      
      // Handle special sorting cases
      if (sortBy === 'priority') {
        const priorityOrder = { 'ALTA': 3, 'MEDIA': 2, 'BAIXA': 1 };
        aValue = priorityOrder[a.priority as keyof typeof priorityOrder] || 0;
        bValue = priorityOrder[b.priority as keyof typeof priorityOrder] || 0;
      } else if (sortBy === 'amount') {
        aValue = a.amount || 0;
        bValue = b.amount || 0;
      } else if (sortBy === 'effectiveDate') {
        aValue = new Date(a.effectiveDate).getTime();
        bValue = new Date(b.effectiveDate).getTime();
      }
      
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (sortOrder === 'desc') {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
      } else {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      }
    });
    
    // Apply pagination
    const total = filteredFees.length;
    const paginatedFees = filteredFees.slice(offset, offset + limit);
    
    return NextResponse.json({
      data: paginatedFees,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      },
      filters: {
        processTypeId,
        feeId,
        feeCategoryId,
        feeType,
        calculationMethod,
        paymentTiming,
        status,
        priority,
        isRequired,
        isRefundable,
        currency,
        active,
        search
      }
    });
  } catch (error) {
    console.error('Error fetching process type fees:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/dossier/fees - Create new process type fee
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = [
      'processTypeId',
      'feeId',
      'feeCategoryId',
      'amount',
      'currency',
      'feeType',
      'calculationMethod',
      'paymentTiming',
      'status',
      'priority',
      'effectiveDate'
    ];
    
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }
    
    // Validate enum values
    const validCurrencies = ['CVE', 'EUR', 'USD'];
    const validFeeTypes = ['FIXO', 'PERCENTUAL', 'VARIAVEL', 'CONDICIONAL'];
    const validCalculationMethods = ['VALOR_FIXO', 'PERCENTUAL_VALOR', 'POR_UNIDADE', 'ESCALONADO'];
    const validPaymentTimings = ['ANTECIPADO', 'POSTERIOR', 'PARCELADO', 'CONDICIONAL'];
    const validStatuses = ['ATIVO', 'INATIVO', 'SUSPENSO', 'EM_REVISAO'];
    const validPriorities = ['ALTA', 'MEDIA', 'BAIXA'];
    
    if (!validCurrencies.includes(body.currency)) {
      return NextResponse.json(
        { error: `Invalid currency. Must be one of: ${validCurrencies.join(', ')}` },
        { status: 400 }
      );
    }
    
    if (!validFeeTypes.includes(body.feeType)) {
      return NextResponse.json(
        { error: `Invalid feeType. Must be one of: ${validFeeTypes.join(', ')}` },
        { status: 400 }
      );
    }
    
    if (!validCalculationMethods.includes(body.calculationMethod)) {
      return NextResponse.json(
        { error: `Invalid calculationMethod. Must be one of: ${validCalculationMethods.join(', ')}` },
        { status: 400 }
      );
    }
    
    if (!validPaymentTimings.includes(body.paymentTiming)) {
      return NextResponse.json(
        { error: `Invalid paymentTiming. Must be one of: ${validPaymentTimings.join(', ')}` },
        { status: 400 }
      );
    }
    
    if (!validStatuses.includes(body.status)) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` },
        { status: 400 }
      );
    }
    
    if (!validPriorities.includes(body.priority)) {
      return NextResponse.json(
        { error: `Invalid priority. Must be one of: ${validPriorities.join(', ')}` },
        { status: 400 }
      );
    }
    
    // Validate numeric fields
    if (typeof body.amount !== 'number' || body.amount < 0) {
      return NextResponse.json(
        { error: 'Amount must be a positive number' },
        { status: 400 }
      );
    }
    
    // Validate percentage for PERCENTUAL fee type
    if (body.feeType === 'PERCENTUAL' && (!body.percentage || body.percentage <= 0 || body.percentage > 100)) {
      return NextResponse.json(
        { error: 'Percentage must be provided and between 0 and 100 for PERCENTUAL fee type' },
        { status: 400 }
      );
    }
    
    // Check for duplicate association
    const existingFee = mockProcessTypeFees.find(fee => 
      fee.processTypeId === body.processTypeId &&
      fee.feeId === body.feeId &&
      fee.active
    );
    
    if (existingFee) {
      return NextResponse.json(
        { error: 'An active fee association between this process type and fee already exists' },
        { status: 409 }
      );
    }
    
    // Validate fee category exists
    const feeCategory = mockFeeCategories.find(cat => cat.id === body.feeCategoryId && cat.active);
    if (!feeCategory) {
      return NextResponse.json(
        { error: 'Invalid fee category ID' },
        { status: 400 }
      );
    }
    
    // Create new process type fee
    const newFee: ProcessTypeFeeRecord = {
      id: `ptf-${Date.now()}`,
      processTypeId: body.processTypeId,
      processTypeName: body.processTypeName,
      feeId: body.feeId,
      feeName: body.feeName,
      feeCategoryId: body.feeCategoryId,
      feeCategoryName: feeCategory.name,
      amount: body.amount,
      currency: body.currency,
      feeType: body.feeType,
      calculationMethod: body.calculationMethod,
      minimumAmount: body.minimumAmount,
      maximumAmount: body.maximumAmount,
      percentage: body.percentage,
      unitValue: body.unitValue,
      isRequired: body.isRequired || false,
      isRefundable: body.isRefundable || false,
      paymentTiming: body.paymentTiming,
      dueDate: body.dueDate,
      gracePeriodDays: body.gracePeriodDays,
      penaltyRate: body.penaltyRate,
      discountRate: body.discountRate,
      discountConditions: body.discountConditions,
      exemptionCriteria: body.exemptionCriteria,
      status: body.status,
      priority: body.priority,
      effectiveDate: body.effectiveDate,
      expirationDate: body.expirationDate,
      legalBasis: body.legalBasis,
      observations: body.observations,
      active: body.active !== undefined ? body.active : true,
      metadata: body.metadata || {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: body.createdBy || 'system',
      updatedBy: body.updatedBy || 'system'
    };
    
    mockProcessTypeFees.push(newFee);
    
    return NextResponse.json(newFee, { status: 201 });
  } catch (error) {
    console.error('Error creating process type fee:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
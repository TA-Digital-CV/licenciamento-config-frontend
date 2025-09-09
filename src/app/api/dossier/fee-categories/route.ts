import { NextRequest, NextResponse } from 'next/server';
import { mockFeeCategories, FeeCategoryRecord } from '../fees/_data';

// GET /api/dossier/fee-categories - Get fee categories with filtering and pagination
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Pagination parameters
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    // Filter parameters
    const parentCategoryId = searchParams.get('parentCategoryId');
    const level = searchParams.get('level');
    const code = searchParams.get('code');
    const active = searchParams.get('active');
    const search = searchParams.get('search');

    // Sorting parameters
    const sortBy = searchParams.get('sortBy') || 'sortOrder';
    const sortOrder = searchParams.get('sortOrder') || 'asc';

    // Filter data
    const filteredCategories = mockFeeCategories.filter((category) => {
      if (parentCategoryId && category.parentCategoryId !== parentCategoryId) return false;
      if (level && category.level !== parseInt(level)) return false;
      if (code && category.code !== code) return false;
      if (active !== null && category.active !== (active === 'true')) return false;
      if (search) {
        const searchLower = search.toLowerCase();
        return (
          category.name.toLowerCase().includes(searchLower) ||
          category.description?.toLowerCase().includes(searchLower) ||
          category.code.toLowerCase().includes(searchLower)
        );
      }
      return true;
    });

    // Sort data
    filteredCategories.sort((a, b) => {
      let aValue: string | number = a[sortBy as keyof FeeCategoryRecord] as string | number;
      let bValue: string | number = b[sortBy as keyof FeeCategoryRecord] as string | number;

      if (typeof aValue === 'string' && typeof bValue === 'string') {
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
    const total = filteredCategories.length;
    const paginatedCategories = filteredCategories.slice(offset, offset + limit);

    return NextResponse.json({
      data: paginatedCategories,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      filters: {
        parentCategoryId,
        level,
        code,
        active,
        search,
      },
    });
  } catch (error) {
    console.error('Error fetching fee categories:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/dossier/fee-categories - Create new fee category
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const requiredFields = ['name', 'code', 'level'];

    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 });
      }
    }

    // Validate level is a positive integer
    if (typeof body.level !== 'number' || body.level < 1) {
      return NextResponse.json({ error: 'Level must be a positive integer' }, { status: 400 });
    }

    // Validate sortOrder is a positive integer if provided
    if (
      body.sortOrder !== undefined &&
      (typeof body.sortOrder !== 'number' || body.sortOrder < 0)
    ) {
      return NextResponse.json(
        { error: 'Sort order must be a non-negative integer' },
        { status: 400 },
      );
    }

    // Check for duplicate code
    const existingCategory = mockFeeCategories.find((cat) => cat.code === body.code && cat.active);

    if (existingCategory) {
      return NextResponse.json(
        { error: 'A fee category with this code already exists' },
        { status: 409 },
      );
    }

    // Validate parent category exists if provided
    if (body.parentCategoryId) {
      const parentCategory = mockFeeCategories.find(
        (cat) => cat.id === body.parentCategoryId && cat.active,
      );
      if (!parentCategory) {
        return NextResponse.json({ error: 'Invalid parent category ID' }, { status: 400 });
      }

      // Validate level is appropriate for parent relationship
      if (body.level <= parentCategory.level) {
        return NextResponse.json(
          { error: 'Child category level must be greater than parent category level' },
          { status: 400 },
        );
      }
    }

    // Generate sortOrder if not provided
    const sortOrder =
      body.sortOrder !== undefined
        ? body.sortOrder
        : Math.max(
            ...mockFeeCategories
              .filter(
                (cat) => cat.level === body.level && cat.parentCategoryId === body.parentCategoryId,
              )
              .map((cat) => cat.sortOrder),
            0,
          ) + 1;

    // Create new fee category
    const newCategory: FeeCategoryRecord = {
      id: `fc-${Date.now()}`,
      name: body.name,
      description: body.description,
      code: body.code,
      parentCategoryId: body.parentCategoryId,
      level: body.level,
      sortOrder,
      active: body.active !== undefined ? body.active : true,
      metadata: body.metadata || {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: body.createdBy || 'system',
      updatedBy: body.updatedBy || 'system',
    };

    mockFeeCategories.push(newCategory);

    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    console.error('Error creating fee category:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

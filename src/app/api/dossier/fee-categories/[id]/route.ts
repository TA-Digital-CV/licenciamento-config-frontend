import { NextRequest, NextResponse } from 'next/server';
import { mockFeeCategories, mockProcessTypeFees, FeeCategoryRecord } from '../../fees/_data';

// GET /api/dossier/fee-categories/[id] - Get specific fee category
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    const category = mockFeeCategories.find(c => c.id === id);
    
    if (!category) {
      return NextResponse.json(
        { error: 'Fee category not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(category);
  } catch (error) {
    console.error('Error fetching fee category:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/dossier/fee-categories/[id] - Update specific fee category
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    
    const categoryIndex = mockFeeCategories.findIndex(c => c.id === id);
    
    if (categoryIndex === -1) {
      return NextResponse.json(
        { error: 'Fee category not found' },
        { status: 404 }
      );
    }
    
    const currentCategory = mockFeeCategories[categoryIndex];
    
    // Validate level is a positive integer if provided
    if (body.level !== undefined && (typeof body.level !== 'number' || body.level < 1)) {
      return NextResponse.json(
        { error: 'Level must be a positive integer' },
        { status: 400 }
      );
    }
    
    // Validate sortOrder is a positive integer if provided
    if (body.sortOrder !== undefined && (typeof body.sortOrder !== 'number' || body.sortOrder < 0)) {
      return NextResponse.json(
        { error: 'Sort order must be a non-negative integer' },
        { status: 400 }
      );
    }
    
    // Check for duplicate code if code is being changed
    if (body.code && body.code !== currentCategory.code) {
      const existingCategory = mockFeeCategories.find(cat => 
        cat.id !== id && cat.code === body.code && cat.active
      );
      
      if (existingCategory) {
        return NextResponse.json(
          { error: 'A fee category with this code already exists' },
          { status: 409 }
        );
      }
    }
    
    // Validate parent category exists if being changed
    if (body.parentCategoryId && body.parentCategoryId !== currentCategory.parentCategoryId) {
      const parentCategory = mockFeeCategories.find(cat => 
        cat.id === body.parentCategoryId && cat.active
      );
      if (!parentCategory) {
        return NextResponse.json(
          { error: 'Invalid parent category ID' },
          { status: 400 }
        );
      }
      
      // Validate level is appropriate for parent relationship
      const newLevel = body.level || currentCategory.level;
      if (newLevel <= parentCategory.level) {
        return NextResponse.json(
          { error: 'Child category level must be greater than parent category level' },
          { status: 400 }
        );
      }
      
      // Check for circular reference
      let checkParent = parentCategory;
      while (checkParent.parentCategoryId) {
        if (checkParent.parentCategoryId === id) {
          return NextResponse.json(
            { error: 'Cannot set parent category - would create circular reference' },
            { status: 400 }
          );
        }
        checkParent = mockFeeCategories.find(cat => cat.id === checkParent.parentCategoryId)!;
        if (!checkParent) break;
      }
    }
    
    // Update the category
    const updatedCategory: FeeCategoryRecord = {
      ...currentCategory,
      ...body,
      id, // Ensure ID doesn't change
      updatedAt: new Date().toISOString(),
      updatedBy: body.updatedBy || 'system'
    };
    
    mockFeeCategories[categoryIndex] = updatedCategory;
    
    return NextResponse.json(updatedCategory);
  } catch (error) {
    console.error('Error updating fee category:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/dossier/fee-categories/[id] - Delete specific fee category
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { searchParams } = new URL(request.url);
    const hardDelete = searchParams.get('hardDelete') === 'true';
    
    const categoryIndex = mockFeeCategories.findIndex(c => c.id === id);
    
    if (categoryIndex === -1) {
      return NextResponse.json(
        { error: 'Fee category not found' },
        { status: 404 }
      );
    }
    
    // Check if category is being used by any fees
    const feesUsingCategory = mockProcessTypeFees.filter(fee => 
      fee.feeCategoryId === id && fee.active
    );
    
    if (feesUsingCategory.length > 0 && hardDelete) {
      return NextResponse.json(
        { 
          error: 'Cannot delete fee category - it is being used by active fees',
          usedByFees: feesUsingCategory.length
        },
        { status: 409 }
      );
    }
    
    // Check if category has child categories
    const childCategories = mockFeeCategories.filter(cat => 
      cat.parentCategoryId === id && cat.active
    );
    
    if (childCategories.length > 0 && hardDelete) {
      return NextResponse.json(
        { 
          error: 'Cannot delete fee category - it has active child categories',
          childCategories: childCategories.length
        },
        { status: 409 }
      );
    }
    
    if (hardDelete) {
      // Hard delete - remove from array
      const deletedCategory = mockFeeCategories.splice(categoryIndex, 1)[0];
      return NextResponse.json({
        message: 'Fee category permanently deleted',
        deletedCategory
      });
    } else {
      // Soft delete - mark as inactive
      mockFeeCategories[categoryIndex] = {
        ...mockFeeCategories[categoryIndex],
        active: false,
        updatedAt: new Date().toISOString(),
        updatedBy: 'system'
      };
      
      return NextResponse.json({
        message: 'Fee category deactivated',
        category: mockFeeCategories[categoryIndex]
      });
    }
  } catch (error) {
    console.error('Error deleting fee category:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
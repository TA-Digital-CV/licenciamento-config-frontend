/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { apiClient } from '@/app/(myapp)/lib/api-client';
import { FileResponseDTO, DocumentRequestDTO } from '@/app/(myapp)/types/documents.types';

// GET /api/documents/[id] - Busca documento por ID
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const response = await apiClient.get<FileResponseDTO>(`/documents/${id}`);
    return NextResponse.json(response);
  } catch (error: any) {
    console.error('Error fetching document:', error);
    return NextResponse.json(
      { error: 'Failed to fetch document' },
      { status: error.status || 500 },
    );
  }
}

// PUT /api/documents/[id] - Atualiza metadados do documento
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body: DocumentRequestDTO = await request.json();

    const response = await apiClient.put<FileResponseDTO>(`/documents/${id}`, body);

    return NextResponse.json(response);
  } catch (error: any) {
    console.error('Error updating document:', error);
    return NextResponse.json(
      { error: 'Failed to update document' },
      { status: error.status || 500 },
    );
  }
}

// DELETE /api/documents/[id] - Remove documento
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    await apiClient.delete(`/documents/${id}`);

    return NextResponse.json({
      message: 'Document deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting document:', error);
    return NextResponse.json(
      { error: 'Failed to delete document' },
      { status: error.status || 500 },
    );
  }
}

// PATCH /api/documents/[id] - Operações de ativação/desativação
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    if (action === 'activate') {
      await apiClient.patch(`/documents/${id}/activate`);
      return NextResponse.json({ message: 'Document activated successfully' });
    } else if (action === 'deactivate') {
      await apiClient.patch(`/documents/${id}/deactivate`);
      return NextResponse.json({ message: 'Document deactivated successfully' });
    } else {
      return NextResponse.json(
        { error: 'Invalid action. Use ?action=activate or ?action=deactivate' },
        { status: 400 },
      );
    }
  } catch (error: any) {
    console.error('Error updating document status:', error);
    return NextResponse.json(
      { error: 'Failed to update document status' },
      { status: error.status || 500 },
    );
  }
}

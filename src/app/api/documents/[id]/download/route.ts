/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { apiClient } from '@/app/(myapp)/lib/api-client';
import { FileUrlDTO } from '@/app/(myapp)/types/documents.types';

// GET /api/documents/[id]/download - Download de documento
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const preview = searchParams.get('preview') === 'true';

    // Primeiro, obter a URL de download do backend
    const response = await apiClient.get<FileUrlDTO>(
      `/documents/${id}/download${preview ? '?preview=true' : ''}`,
    );

    const { downloadUrl, fileName } = response;

    // Fazer o download do arquivo usando a URL fornecida
    const fileResponse = await fetch(downloadUrl);

    if (!fileResponse.ok) {
      throw new Error('Failed to download file from storage');
    }

    const fileBuffer = await fileResponse.arrayBuffer();

    // Configurar headers para download
    const headers = new Headers();
    headers.set('Content-Type', 'application/octet-stream');

    if (!preview) {
      headers.set('Content-Disposition', `attachment; filename="${fileName}"`);
    } else {
      headers.set('Content-Disposition', `inline; filename="${fileName}"`);
    }

    headers.set('Content-Length', fileBuffer.byteLength.toString());

    return new NextResponse(fileBuffer, {
      status: 200,
      headers,
    });
  } catch (error: any) {
    console.error('Error downloading document:', error);
    return NextResponse.json(
      { error: 'Failed to download document' },
      { status: error.status || 500 },
    );
  }
}

// HEAD /api/documents/[id]/download - Verificar se documento existe para download
export async function HEAD(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    // Verificar se o documento existe fazendo uma chamada GET para obter informações
    const response = await apiClient.get<FileUrlDTO>(`/documents/${id}/download`);

    return new NextResponse(null, {
      status: 200,
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Length': '0',
      },
    });
  } catch (error: any) {
    console.error('Error checking document availability:', error);
    return new NextResponse(null, {
      status: error.status || 404,
    });
  }
}

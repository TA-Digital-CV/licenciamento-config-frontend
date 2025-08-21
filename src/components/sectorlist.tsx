'use client'

/* THIS FILE WAS GENERATED AUTOMATICALLY BY iGRP STUDIO. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useMemo, useState } from 'react';
import { cn, useIGRPToast, IGRPDataTable, IGRPDataTableButtonLink } from '@igrp/igrp-framework-react-design-system';
import type { ColumnDef } from '@tanstack/react-table';

export type Sector = {
  id: string;
  name: string;
  description?: string;
  code: string;
  sectorType?: string;
  active: boolean;
  metadata?: any;
  sortOrder?: number;
  createdAt?: string;
  updatedAt?: string;
};

export default function Sectorlist({ sectorType }: { sectorType?: string }) {
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { igrpToast } = useIGRPToast();

  // New: filters state
  const [search, setSearch] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  useEffect(() => {
    const controller = new AbortController();

    async function fetchSectors() {
      try {
        setLoading(true);
        setError(null);
        const params = new URLSearchParams();
        if (statusFilter !== 'all') params.set('active', String(statusFilter === 'active'));
        if (sectorType) params.set('sectorType', sectorType);
        const query = params.toString();
        const res = await fetch(`/api/sectors${query ? `?${query}` : ''}`, {
          signal: controller.signal,
          headers: { 'Content-Type': 'application/json' },
        });
        if (!res.ok) throw new Error(`Erro ao carregar sectores: ${res.status}`);
        const data = await res.json();
        setSectors(data.content || []);
      } catch (err: any) {
        if (err.name === 'AbortError') return;
        const message = err?.message || 'Falha ao carregar sectores';
        setError(message);
        igrpToast({ title: 'Erro', description: message, type: 'default' });
      } finally {
        setLoading(false);
      }
    }

    fetchSectors();
    return () => controller.abort();
  }, [sectorType, statusFilter]);

  const columns: ColumnDef<Sector>[] = useMemo(() => [
    {
      accessorKey: 'name',
      header: 'Nome',
      cell: ({ row }) => <div className="font-medium">{row.getValue('name')}</div>,
    },
    {
      accessorKey: 'code',
      header: 'Código',
      cell: ({ row }) => <div className="font-mono text-sm">{row.getValue('code')}</div>,
    },
    {
      accessorKey: 'description',
      header: 'Descrição',
      cell: ({ row }) => (
        <div className="text-muted-foreground text-sm">{row.getValue('description') || 'Sem descrição'}</div>
      ),
    },
    {
      accessorKey: 'active',
      header: 'Estado',
      cell: ({ row }) => {
        const isActive = row.getValue('active') as boolean;
        return (
          <div
            className={cn(
              'text-xs px-2 py-1 rounded-full',
              isActive ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
            )}
          >
            {isActive ? 'Ativo' : 'Inativo'}
          </div>
        );
      },
    },
    {
      id: 'actions',
      header: 'Ações',
      cell: ({ row }) => (
        <IGRPDataTableButtonLink
          href={`/parametrizacao/sectors/${row.original.id}/editar`}
          labelTrigger="Editar"
          icon="Pencil"
          variant="ghost"
        />
      ),
    },
  ], []);

  // New: client-side search on name and code
  const filteredData = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return sectors;
    return sectors.filter((item) =>
      (item.name?.toLowerCase().includes(q)) || (item.code?.toLowerCase().includes(q))
    );
  }, [sectors, search]);

  if (loading) {
    return <div className="p-4 text-sm text-muted-foreground">A carregar sectores...</div>;
  }

  if (error) {
    return <div className="p-4 text-sm text-red-600">{error}</div>;
  }

  return (
    <div className={cn('component space-y-3')}>
      {/* Filters toolbar */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Pesquisar por nome ou código..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-64 rounded border px-2 py-1 text-sm bg-background"
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-muted-foreground">Estado</label>
          <select
            className="rounded border px-2 py-1 text-sm bg-background"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
          >
            <option value="all">Todos</option>
            <option value="active">Ativo</option>
            <option value="inactive">Inativo</option>
          </select>
        </div>
      </div>

      <IGRPDataTable
        columns={columns}
        data={filteredData}
        showPagination={true}
        pageSizePagination={[10, 25, 50]}
        notFoundLabel="Sem sectores encontrados."
      />
    </div>
  );
}
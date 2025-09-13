'use client';

/* THIS FILE WAS GENERATED AUTOMATICALLY BY iGRP STUDIO. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useMemo, useState } from 'react';
import {
  cn,
  useIGRPToast,
  IGRPDataTable,
  IGRPDataTableButtonLink,
} from '@igrp/igrp-framework-react-design-system';
import type { ColumnDef } from '@tanstack/react-table';
import { useSearchParams, useRouter } from 'next/navigation';
import { Power, PowerOff, Eye } from 'lucide-react';

export type Category = {
  id: string;
  name: string;
  description?: string;
  code: string;
  parentCategoryId?: string;
  parentCategoryName?: string;
  sectorId?: string; // New optional relation
  sectorName?: string; // New optional relation
  active: boolean;
  sortOrder?: number;
  metadata?: any;
  createdAt?: string;
  updatedAt?: string;
};

export default function Categorylist({ parentId }: { parentId?: string }) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { igrpToast } = useIGRPToast();

  const searchParams = useSearchParams();
  const router = useRouter();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('active');
  const [sectorFilter, setSectorFilter] = useState<string>(
    () => searchParams.get('sectorId') || '',
  );
  const [sectorOptions, setSectorOptions] = useState<{ value: string; label: string }[]>([]);
  const [pendingId, setPendingId] = useState<string | null>(null);

  // Sincroniza quando a query mudar (ex.: navegação programática do setor)
  useEffect(() => {
    const qp = searchParams.get('sectorId') || '';
    setSectorFilter(qp);
  }, [searchParams]);

  useEffect(() => {
    const controller = new AbortController();
    async function fetchSectors() {
      try {
        const res = await fetch('/api/sectors?active=true', { signal: controller.signal });
        const data = await res.json();
        const opts = (data.content || []).map((s: any) => ({ value: s.id, label: s.name }));
        setSectorOptions(opts);
      } catch (_) {}
    }
    fetchSectors();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchCategories() {
      try {
        setLoading(true);
        setError(null);
        const params = new URLSearchParams();
        if (statusFilter !== 'all') params.set('active', String(statusFilter === 'active'));
        if (parentId) params.set('parentId', parentId);
        if (sectorFilter) params.set('sectorId', sectorFilter);
        const query = params.toString();
        const res = await fetch(`/api/categories${query ? `?${query}` : ''}`, {
          signal: controller.signal,
          headers: { 'Content-Type': 'application/json' },
        });
        if (!res.ok) throw new Error(`Erro ao carregar categorias: ${res.status}`);
        const data = await res.json();
        setCategories(data.content || []);
      } catch (err: any) {
        if (err.name === 'AbortError') return;
        const message = err?.message || 'Falha ao carregar categorias';
        setError(message);
        igrpToast({ title: 'Erro', description: message, type: 'default' });
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
    return () => controller.abort();
  }, [parentId, statusFilter, sectorFilter]);

  // Toggle active/inactive for a row and keep list consistent with current filters
  const toggleActive = async (row: Category) => {
    try {
      setPendingId(row.id);
      const action = row.active ? 'disable' : 'enable';
      const res = await fetch(`/api/categories/${row.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });
      if (!res.ok) throw new Error(`Falha ao ${row.active ? 'desativar' : 'ativar'} a categoria`);
      const updated: Category = await res.json();

      setCategories((prev) => {
        const includeByStatus =
          statusFilter === 'all'
            ? true
            : statusFilter === 'active'
              ? updated.active === true
              : updated.active === false; // 'inactive'

        const includeBySector = sectorFilter ? updated.sectorId === sectorFilter : true;

        if (!includeByStatus || !includeBySector) {
          return prev.filter((c) => c.id !== row.id);
        }
        return prev.map((c) => (c.id === row.id ? updated : c));
      });

      igrpToast({
        title: 'Sucesso',
        description: `Categoria ${row.active ? 'desativada' : 'ativada'} com sucesso`,
        type: 'success',
      });
    } catch (err: any) {
      const message = err?.message || 'Operação falhou';
      igrpToast({ title: 'Erro', description: message, type: 'default' });
    } finally {
      setPendingId(null);
    }
  };

  const goToLicenceTypes = (row: Category) => {
    const url = `/parametrizacao?tab=licence-types&categoryId=${encodeURIComponent(
      row.id,
    )}&status=active`;
    router.push(url);
  };

  const columns: ColumnDef<Category>[] = useMemo(
    () => [
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
          <div className="text-muted-foreground text-sm">
            {row.getValue('description') || 'Sem descrição'}
          </div>
        ),
      },
      // New: Setor column using sectorName (if present)
      {
        id: 'sector',
        header: 'Setor',
        cell: ({ row }) => <div className="text-sm">{row.original.sectorName || '-'}</div>,
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
                isActive ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800',
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
        cell: ({ row }) => {
          const r = row.original as Category;
          const isPending = pendingId === r.id;
          return (
            <div className="flex items-center gap-1">
              {/* Ver tipos de licenças ativas da categoria */}
              <button
                type="button"
                onClick={() => goToLicenceTypes(r)}
                className={cn('rounded border p-1 text-muted-foreground hover:bg-accent')}
                aria-label="Ver tipos de licenças"
                title="Ver tipos de licenças"
              >
                <Eye size={16} />
              </button>

              <IGRPDataTableButtonLink
                href={`/parametrizacao/category/${r.id}/editar`}
                labelTrigger="Editar"
                icon="Pencil"
                variant="ghost"
              />
              <button
                type="button"
                onClick={() => toggleActive(r)}
                disabled={isPending}
                className={cn(
                  'rounded border p-1',
                  r.active
                    ? 'border-orange-300 text-orange-700 hover:bg-orange-50'
                    : 'border-green-300 text-green-700 hover:bg-green-50',
                  isPending && 'opacity-50 cursor-not-allowed',
                )}
                aria-label={r.active ? 'Desativar' : 'Ativar'}
                title={r.active ? 'Desativar' : 'Ativar'}
              >
                {r.active ? <PowerOff size={16} /> : <Power size={16} />}
              </button>
            </div>
          );
        },
      },
    ],
    [pendingId],
  );

  const filteredData = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return categories;
    return categories.filter(
      (item) => item.name?.toLowerCase().includes(q) || item.code?.toLowerCase().includes(q),
    );
  }, [categories, search]);

  if (loading) {
    return <div className="p-4 text-sm text-muted-foreground">A carregar categorias...</div>;
  }

  if (error) {
    return <div className="p-4 text-sm text-red-600">{error}</div>;
  }

  return (
    <div className={cn('component space-y-3')}>
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
          <label className="text-sm text-muted-foreground">Setor</label>
          <select
            className="rounded border px-2 py-1 text-sm bg-background"
            value={sectorFilter}
            onChange={(e) => setSectorFilter(e.target.value)}
          >
            <option value="">Todos</option>
            {sectorOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

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
        notFoundLabel="Sem categorias encontradas."
      />
    </div>
  );
}

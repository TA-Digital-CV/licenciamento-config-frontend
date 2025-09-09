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

export type LicenceType = {
  id: string;
  name: string;
  description?: string;
  code: string;
  categoryId?: string;
  categoryName?: string;
  active: boolean;
  metadata?: Record<string, any>;
  sortOrder?: number;
  createdAt?: string;
  updatedAt?: string;
};

export default function LicenceTypelist({ categoryId }: { categoryId?: string }) {
  const [licenceTypes, setLicenceTypes] = useState<LicenceType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { igrpToast } = useIGRPToast();

  // New: filters state
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  // New: category and dossier filters
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [dossierFilter, setDossierFilter] = useState<'all' | 'yes' | 'no'>('all');
  const [categoryOptions, setCategoryOptions] = useState<{ value: string; label: string }[]>([]);
  const [sectorFilter, setSectorFilter] = useState<string>('');
  const [sectorOptions, setSectorOptions] = useState<{ value: string; label: string }[]>([]);
  const [categoriesMap, setCategoriesMap] = useState<
    Record<string, { sectorId?: string; sectorName?: string }>
  >({});

  useEffect(() => {
    const controller = new AbortController();
    async function fetchCategories() {
      try {
        const res = await fetch('/api/categories?active=true', { signal: controller.signal });
        const data = await res.json();
        const opts = (data.content || []).map((c: any) => ({ value: c.id, label: c.name }));
        setCategoryOptions(opts);
        const map: Record<string, { sectorId?: string; sectorName?: string }> = {};
        (data.content || []).forEach((c: any) => {
          map[c.id] = { sectorId: c.sectorId, sectorName: c.sectorName };
        });
        setCategoriesMap(map);
      } catch (_) {}
    }
    fetchCategories();
    return () => controller.abort();
  }, []);

  // Fetch sectors for sector filter options
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

    async function fetchLicenceTypes() {
      try {
        setLoading(true);
        setError(null);
        const params = new URLSearchParams();
        if (statusFilter !== 'all') params.set('active', String(statusFilter === 'active'));
        if (categoryFilter) params.set('categoryId', categoryFilter);
        const query = params.toString();
        const res = await fetch(`/api/licence-types${query ? `?${query}` : ''}`, {
          signal: controller.signal,
          headers: { 'Content-Type': 'application/json' },
        });
        if (!res.ok) throw new Error(`Erro ao carregar tipos de licença: ${res.status}`);
        const data = await res.json();
        setLicenceTypes(data.content || []);
      } catch (err: any) {
        if (err.name === 'AbortError') return;
        const message = err?.message || 'Falha ao carregar tipos de licença';
        setError(message);
        igrpToast({ title: 'Erro', description: message, type: 'default' });
      } finally {
        setLoading(false);
      }
    }

    fetchLicenceTypes();
    return () => controller.abort();
  }, [categoryId, statusFilter, categoryFilter]);

  const columns: ColumnDef<LicenceType>[] = useMemo(
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
      {
        accessorKey: 'categoryName',
        header: 'Categoria',
        cell: ({ row }) => <div className="text-sm">{row.getValue('categoryName') || '-'}</div>,
      },
      // New: Setor placeholder column (awaiting backend support)
      {
        id: 'sector',
        header: 'Setor',
        cell: ({ row }) => {
          const catId = row.original.categoryId as string | undefined;
          const sectorName = (catId && categoriesMap[catId]?.sectorName) || '-';
          return <div className="text-sm">{sectorName}</div>;
        },
      },
      // New: Tem Dossier (from metadata.hasDossier)
      {
        id: 'hasDossier',
        header: 'Tem Dossier',
        cell: ({ row }) => {
          const has = Boolean((row.original?.metadata as any)?.hasDossier);
          return (
            <div
              className={cn(
                'text-xs px-2 py-1 rounded-full',
                has ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700',
              )}
            >
              {has ? 'Sim' : 'Não'}
            </div>
          );
        },
      },
      {
        accessorKey: 'sortOrder',
        header: 'Ordem',
        cell: ({ row }) => <div className="text-sm">{row.getValue('sortOrder') || '-'}</div>,
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
          const has = Boolean((row.original?.metadata as any)?.hasDossier);
          return (
            <div className="flex items-center gap-2">
              <IGRPDataTableButtonLink
                href={`/parametrizacao/licence-type/${row.original.id}/editar`}
                labelTrigger="Editar"
                icon="Pencil"
                variant="ghost"
              />
              <IGRPDataTableButtonLink
                href={`/parametrizacao/licence-type/${row.original.id}/dossier`}
                labelTrigger={has ? 'Dossier' : 'Definir Dossier'}
                icon="Folder"
                variant={has ? 'ghost' : 'secondary'}
              />
            </div>
          );
        },
      },
    ],
    [categoriesMap],
  );

  // New: client-side search on name and code
  // Removed duplicate filteredData useMemo that caused collision

  // Extend client-side filtering with dossierFilter
  // New: client-side search + dossier filter combined
  const filteredData = useMemo(() => {
    const q = search.trim().toLowerCase();
    let base = licenceTypes;
    if (q) {
      base = base.filter(
        (item: any) => item.name?.toLowerCase().includes(q) || item.code?.toLowerCase().includes(q),
      );
    }
    if (dossierFilter !== 'all') {
      const want = dossierFilter === 'yes';
      base = base.filter((item: any) => Boolean(item?.metadata?.hasDossier) === want);
    }
    if (sectorFilter) {
      base = base.filter((item: any) => {
        const catId = item.categoryId as string | undefined;
        const cat = catId ? categoriesMap[catId] : undefined;
        return (cat?.sectorId || '') === sectorFilter;
      });
    }
    return base;
  }, [licenceTypes, search, dossierFilter, sectorFilter, categoriesMap]);

  if (loading) {
    return <div className="p-4 text-sm text-muted-foreground">A carregar tipos de licença...</div>;
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

          <label className="text-sm text-muted-foreground">Categoria</label>
          <select
            className="rounded border px-2 py-1 text-sm bg-background"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">Todas</option>
            {categoryOptions.map((opt) => (
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

          <label className="text-sm text-muted-foreground">Possui Dossier</label>
          <select
            className="rounded border px-2 py-1 text-sm bg-background"
            value={dossierFilter}
            onChange={(e) => setDossierFilter(e.target.value as any)}
          >
            <option value="all">Todos</option>
            <option value="yes">Sim</option>
            <option value="no">Não</option>
          </select>
        </div>
      </div>

      <IGRPDataTable
        columns={columns}
        data={filteredData}
        showPagination={true}
        pageSizePagination={[10, 25, 50]}
        notFoundLabel="Sem tipos de licença encontrados."
      />
    </div>
  );
}

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
import { useSearchParams } from 'next/navigation';
import {
  loadActiveOptionsByCode,
  transformOptionsToSelectItems,
} from '@/app/(myapp)/functions/api.functions';
import { Power, PowerOff } from 'lucide-react';

// Constante para status
const STATUS = { ALL: 'all', ACTIVE: 'ACTIVE', INACTIVE: 'INACTIVE' } as const;

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
  const searchParams = useSearchParams();

  // Filters state
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>(STATUS.ACTIVE);
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [categoryOptions, setCategoryOptions] = useState<{ value: string; label: string }[]>([]);
  const [sectorFilter, setSectorFilter] = useState<string>('');
  const [sectorOptions, setSectorOptions] = useState<{ value: string; label: string }[]>([]);
  const [statusOptions, setStatusOptions] = useState<{ value: string; label: string }[]>([
    { value: STATUS.ACTIVE, label: 'Ativo' },
    { value: STATUS.INACTIVE, label: 'Inativo' },
  ]);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [categoriesMap, setCategoriesMap] = useState<
    Record<string, { sectorId?: string; sectorName?: string }>
  >({});
  const [loadingCategories, setLoadingCategories] = useState<boolean>(false);
  const [categoryError, setCategoryError] = useState<string | null>(null);

  // Mapa para exibir o nome da categoria de forma consistente
  const categoryLabelMap = useMemo(() => {
    const map: Record<string, string> = {};
    for (const opt of categoryOptions) map[opt.value] = opt.label;
    return map;
  }, [categoryOptions]);

  // Sync filters from URL query params (categoryId, status)
  useEffect(() => {
    const qpCategory = searchParams.get('categoryId') || '';
    const raw = searchParams.get('status') || '';
    const up = raw.toUpperCase();
    if (qpCategory) setCategoryFilter(qpCategory);
    if ([STATUS.ACTIVE, STATUS.INACTIVE].includes(up as any)) {
      setStatusFilter(up);
    } else if (up === 'ALL') {
      setStatusFilter(STATUS.ALL);
    }
  }, [searchParams]);

  // Also honor prop categoryId when provided/changed
  useEffect(() => {
    if (categoryId) setCategoryFilter(categoryId);
  }, [categoryId]);

  // Load STATUS options dynamically
  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      try {
        const data = await loadActiveOptionsByCode('STATUS', controller.signal);
        const mapped = transformOptionsToSelectItems(data).filter((o) =>
          [STATUS.ACTIVE, STATUS.INACTIVE].includes(String(o.value).toUpperCase() as any),
        );
        if (mapped.length) setStatusOptions(mapped);
      } catch (_) {
        // keep fallback options
      }
    })();
    return () => controller.abort();
  }, []);

  // Função auxiliar para carregar categorias baseadas no setor
  const loadCategoriesBySector = async (sectorId: string | null, signal?: AbortSignal) => {
    try {
      setLoadingCategories(true);
      setCategoryError(null);

      const params = new URLSearchParams();
      params.set('active', 'true');
      if (sectorId) {
        params.set('sectorId', sectorId);
      }

      const res = await fetch(`/api/categories?${params.toString()}`, { signal });
      if (!res.ok) {
        throw new Error(`Erro ao carregar categorias: ${res.status}`);
      }

      const data = await res.json();
      const opts = (data.content || []).map((c: any) => ({ value: c.id, label: c.name }));
      setCategoryOptions(opts);

      const map: Record<string, { sectorId?: string; sectorName?: string }> = {};
      (data.content || []).forEach((c: any) => {
        map[c.id] = { sectorId: c.sectorId, sectorName: c.sectorName };
      });
      setCategoriesMap(map);
    } catch (err: any) {
      if (err.name === 'AbortError') return;
      const message = err?.message || 'Erro ao carregar categorias';
      setCategoryError(message);
      setCategoryOptions([]);
      setCategoriesMap({});
    } finally {
      setLoadingCategories(false);
    }
  };

  // Carregar todas as categorias inicialmente
  useEffect(() => {
    const controller = new AbortController();
    loadCategoriesBySector(null, controller.signal);
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

  // Filtro contextualizado: carregar categorias quando o setor muda
  useEffect(() => {
    const controller = new AbortController();

    // Limpar filtro de categoria quando setor muda
    setCategoryFilter('');

    // Carregar categorias baseadas no setor selecionado
    if (sectorFilter) {
      loadCategoriesBySector(sectorFilter, controller.signal);
    } else {
      // Se nenhum setor selecionado, carregar todas as categorias
      loadCategoriesBySector(null, controller.signal);
    }

    return () => controller.abort();
  }, [sectorFilter]);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchLicenceTypes() {
      try {
        setLoading(true);
        setError(null);
        const params = new URLSearchParams();
        if (statusFilter !== STATUS.ALL)
          params.set('active', String(String(statusFilter).toUpperCase() === STATUS.ACTIVE));
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

  // Toggle active/inactive for a row and keep list consistent with current filters
  const toggleActive = async (row: LicenceType) => {
    try {
      setPendingId(row.id);
      const action = row.active ? 'disable' : 'enable';
      const res = await fetch(`/api/licence-types/${row.id}/${action}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok)
        throw new Error(`Erro ao ${action === 'enable' ? 'ativar' : 'desativar'} tipo de licença`);

      // Update local state
      setLicenceTypes((prev) =>
        prev.map((item) => (item.id === row.id ? { ...item, active: !item.active } : item)),
      );

      igrpToast({
        title: 'Sucesso',
        description: `Tipo de licença ${action === 'enable' ? 'ativado' : 'desativado'} com sucesso`,
        type: 'default',
      });
    } catch (err: any) {
      const message = err?.message || 'Erro ao alterar estado do tipo de licença';
      igrpToast({ title: 'Erro', description: message, type: 'default' });
    } finally {
      setPendingId(null);
    }
  };

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
        cell: ({ row }) => {
          const catId = row.original.categoryId as string | undefined;
          const label =
            (catId && categoryLabelMap[catId]) || (row.getValue('categoryName') as string) || '-';
          return <div className="text-sm">{label}</div>;
        },
      },
      {
        id: 'sector',
        header: 'Setor',
        cell: ({ row }) => {
          const catId = row.original.categoryId as string | undefined;
          const sectorName = (catId && categoriesMap[catId]?.sectorName) || '-';
          return <div className="text-sm">{sectorName}</div>;
        },
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
          const isActive = row.original.active;
          const isPending = pendingId === row.original.id;
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
              <button
                type="button"
                onClick={() => toggleActive(row.original)}
                disabled={isPending}
                className={cn(
                  'rounded border p-1',
                  isActive
                    ? 'border-orange-300 text-orange-700 hover:bg-orange-50'
                    : 'border-green-300 text-green-700 hover:bg-green-50',
                  isPending && 'opacity-50 cursor-not-allowed',
                )}
                aria-label={isActive ? 'Desativar' : 'Ativar'}
                title={isActive ? 'Desativar' : 'Ativar'}
              >
                {isActive ? <PowerOff size={16} /> : <Power size={16} />}
              </button>
            </div>
          );
        },
      },
    ],
    [categoriesMap, categoryLabelMap, pendingId, toggleActive],
  );

  // New: client-side search on name and code
  // Removed duplicate filteredData useMemo that caused collision

  // Client-side search and sector filtering
  const filteredData = useMemo(() => {
    const q = search.trim().toLowerCase();
    let base = licenceTypes;
    if (q) {
      base = base.filter(
        (item: any) => item.name?.toLowerCase().includes(q) || item.code?.toLowerCase().includes(q),
      );
    }
    if (sectorFilter) {
      base = base.filter((item: any) => {
        const catId = item.categoryId as string | undefined;
        const cat = catId ? categoriesMap[catId] : undefined;
        return (cat?.sectorId || '') === sectorFilter;
      });
    }
    return base;
  }, [licenceTypes, search, sectorFilter, categoriesMap]);

  // Ordenação alfabética por Setor > Categoria > Nome
  const sortedData = useMemo(() => {
    const getSectorNameFor = (item: any) => {
      const catId = item.categoryId as string | undefined;
      return (catId && categoriesMap[catId]?.sectorName) || '';
    };
    const getCategoryLabelFor = (item: any) => {
      const catId = item.categoryId as string | undefined;
      return (catId && categoryLabelMap[catId]) || item.categoryName || '';
    };
    return [...filteredData].sort((a: any, b: any) => {
      const sA = getSectorNameFor(a);
      const sB = getSectorNameFor(b);
      const cmpS = sA.localeCompare(sB, 'pt', { sensitivity: 'base' });
      if (cmpS !== 0) return cmpS;

      const cA = getCategoryLabelFor(a);
      const cB = getCategoryLabelFor(b);
      const cmpC = cA.localeCompare(cB, 'pt', { sensitivity: 'base' });
      if (cmpC !== 0) return cmpC;

      const nA = String(a.name || '');
      const nB = String(b.name || '');
      return nA.localeCompare(nB, 'pt', { sensitivity: 'base' });
    });
  }, [filteredData, categoriesMap, categoryLabelMap]);

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
            disabled={loadingCategories}
          >
            <option value="">
              {loadingCategories ? 'A carregar...' : sectorFilter ? 'Todas do setor' : 'Todas'}
            </option>
            {categoryOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {categoryError && <div className="text-xs text-red-600 mt-1">{categoryError}</div>}

          <label className="text-sm text-muted-foreground">Estado</label>
          <select
            className="rounded border px-2 py-1 text-sm bg-background"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value={STATUS.ALL}>Todos</option>
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <IGRPDataTable
        columns={columns}
        data={sortedData}
        showPagination={true}
        pageSizePagination={[10, 25, 50]}
        notFoundLabel="Sem tipos de licença encontrados."
      />
    </div>
  );
}

'use client';

/* THIS FILE WAS GENERATED AUTOMATICALLY BY iGRP STUDIO. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useMemo, useState } from 'react';
import {
  cn,
  useIGRPToast,
  IGRPDataTable,
  IGRPDataTableButtonLink,
} from '@igrp/igrp-framework-react-design-system';
import type { ColumnDef } from '@tanstack/react-table';
import {
  loadActiveOptionsByCode,
  transformOptionsToSelectItems,
} from '@/app/(myapp)/functions/api.functions';
import { Power, PowerOff, GitBranch } from 'lucide-react';
import { useRouter } from 'next/navigation';

export type Sector = {
  id: string;
  name: string;
  description?: string;
  code: string;
  sectorType?: string;
  sectorTypeKey?: string;
  sectorTypeValue?: string;
  active: boolean;
  metadata?: any;
  sortOrder?: number;
  createdAt?: string;
  updatedAt?: string;
};

// Helpers: estados e mapeamentos
const STATUS = { ALL: 'all', ACTIVE: 'ACTIVE', INACTIVE: 'INACTIVE' } as const;
type StatusFilter = (typeof STATUS)[keyof typeof STATUS];

function mapStatusFilterToActiveParam(status: string): string | null {
  const up = String(status).toUpperCase();
  if (up === STATUS.ACTIVE) return 'true';
  if (up === STATUS.INACTIVE) return 'false';
  return null; // all
}

function resolveEffectiveSectorType(typeFilter: string, propSectorType?: string): string {
  return typeFilter !== 'all' ? typeFilter : propSectorType || '';
}

function getSectorTypeRaw(s: Sector): string {
  return (s.sectorTypeKey || s.sectorTypeValue || s.sectorType || '') as string;
}

function getSectorTypeLabelFromOptions(raw: string, options: { value: string; label: string }[]) {
  const opt = options.find((o) => String(o.value) === String(raw));
  return opt?.label || raw || '';
}

function computeIncludeByType(updated: Sector, effectiveType: string): boolean {
  if (!effectiveType) return true;
  return String(getSectorTypeRaw(updated)) === String(effectiveType);
}

export default function Sectorlist({ sectorType }: { sectorType?: string }) {
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { igrpToast } = useIGRPToast();
  const router = useRouter();

  // New: filters state
  const [search, setSearch] = useState<string>('');
  // Default: show only active sectors initially
  const [statusFilter, setStatusFilter] = useState<StatusFilter>(STATUS.ACTIVE); // values: 'all' | 'ACTIVE' | 'INACTIVE'
  const [statusOptions, setStatusOptions] = useState<{ value: string; label: string }[]>([
    { value: 'ACTIVE', label: 'Ativo' },
    { value: 'INACTIVE', label: 'Inativo' },
  ]);
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [typeOptions, setTypeOptions] = useState<{ value: string; label: string }[]>([]);

  // Pending action control for row toggle
  const [pendingId, setPendingId] = useState<string | null>(null);

  // Navegar para categorias filtradas pelo setor
  const goToCategories = (s: Sector) => {
    const url = `/parametrizacao?tab=categories&sectorId=${encodeURIComponent(s.id)}`;
    router.push(url);
    setTimeout(() => {
      const el = document.getElementById('panel-categories');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 150);
  };

  // Load dynamic options for STATUS and SECTOR_TYPES
  useEffect(() => {
    let isMounted = true;
    async function loadFilters() {
      try {
        const [statusData, sectorTypeData] = await Promise.all([
          loadActiveOptionsByCode('STATUS').catch(() => []),
          loadActiveOptionsByCode('SECTOR_TYPES')
            .catch(() => loadActiveOptionsByCode('SECTOR_TYPE'))
            .catch(() => []),
        ]);
        const mappedStatus = transformOptionsToSelectItems(statusData).filter((o) =>
          ['ACTIVE', 'INACTIVE'].includes(String(o.value).toUpperCase()),
        );
        const mappedTypes = transformOptionsToSelectItems(sectorTypeData);
        if (isMounted) {
          setStatusOptions(
            mappedStatus.length
              ? mappedStatus
              : [
                  { value: 'ACTIVE', label: 'Ativo' },
                  { value: 'INACTIVE', label: 'Inativo' },
                ],
          );
          setTypeOptions(mappedTypes);
        }
      } catch (e) {
        if (isMounted) {
          setStatusOptions([
            { value: 'ACTIVE', label: 'Ativo' },
            { value: 'INACTIVE', label: 'Inativo' },
          ]);
          setTypeOptions([]);
        }
      }
    }
    loadFilters();
    return () => {
      isMounted = false;
    };
  }, []);

  // helper: compute sector type label from options
  const getSectorTypeLabel = (s: Sector) => {
    const raw = getSectorTypeRaw(s);
    return getSectorTypeLabelFromOptions(raw, typeOptions);
  };

  // Fetch with applied filters
  useEffect(() => {
    const controller = new AbortController();

    async function fetchSectors() {
      try {
        setLoading(true);
        setError(null);
        const params = new URLSearchParams();
        // Map statusFilter to boolean active param
        const activeParam = mapStatusFilterToActiveParam(statusFilter);
        if (activeParam !== null) {
          params.set('active', activeParam);
        }
        // Prefer explicit typeFilter; fallback to prop sectorType if provided
        const effectiveType = resolveEffectiveSectorType(typeFilter, sectorType);
        if (effectiveType) params.set('sectorType', effectiveType);
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
  }, [sectorType, statusFilter, typeFilter]);

  // Toggle active/inactive for a row and keep list consistent with current filters
  const toggleActive = async (row: Sector) => {
    try {
      setPendingId(row.id);
      const action = row.active ? 'disable' : 'enable';
      const res = await fetch(`/api/sectors/${row.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });
      if (!res.ok) throw new Error(`Falha ao ${row.active ? 'desativar' : 'ativar'} o setor`);
      const updated: Sector = await res.json();

      setSectors((prev) => {
        // Determine if updated row matches current status filter
        const includeByStatus =
          statusFilter === STATUS.ALL
            ? true
            : statusFilter === STATUS.ACTIVE
              ? updated.active === true
              : updated.active === false; // INACTIVE

        const effectiveType = resolveEffectiveSectorType(typeFilter, sectorType);
        const includeByType = computeIncludeByType(updated, effectiveType);

        if (!includeByStatus || !includeByType) {
          // Remove if it no longer matches filters
          return prev.filter((s) => s.id !== row.id);
        }
        // Otherwise replace in place
        return prev.map((s) => (s.id === row.id ? updated : s));
      });

      igrpToast({
        title: 'Sucesso',
        description: `Setor ${row.active ? 'desativado' : 'ativado'} com sucesso`,
        type: 'success',
      });
    } catch (err: any) {
      const message = err?.message || 'Operação falhou';
      igrpToast({ title: 'Erro', description: message, type: 'default' });
    } finally {
      setPendingId(null);
    }
  };

  // Columns definition (Tipo de Setor as the first column)
  const columns: ColumnDef<Sector>[] = useMemo(
    () => [
      // First: Sector Type
      {
        id: 'sectorType',
        header: 'Tipo de Setor',
        cell: ({ row }) => {
          const label = getSectorTypeLabel(row.original as Sector);
          return <div className="text-sm">{label || '-'}</div>;
        },
      },
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
          const r = row.original as Sector;
          const isPending = pendingId === r.id;
          return (
            <div className="flex items-center gap-1">
              {/* Nova ação: ir para Categorias filtradas por este setor */}
              <button
                type="button"
                onClick={() => goToCategories(r)}
                className={cn('rounded border p-1 text-muted-foreground hover:bg-accent')}
                aria-label="Ver categorias do setor"
                title="Ver categorias do setor"
              >
                <GitBranch size={16} />
              </button>

              <IGRPDataTableButtonLink
                href={`/parametrizacao/sectors/${r.id}/editar`}
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
    [pendingId, typeOptions],
  );

  // New: client-side search on name and code + default sort by sector type label, then name
  const filteredData = useMemo(() => {
    const q = search.trim().toLowerCase();
    const base = !q
      ? sectors
      : sectors.filter(
          (item) => item.name?.toLowerCase().includes(q) || item.code?.toLowerCase().includes(q),
        );

    const collator = new Intl.Collator(undefined, { sensitivity: 'base' });
    const sorted = base.slice().sort((a, b) => {
      const at = getSectorTypeLabel(a);
      const bt = getSectorTypeLabel(b);
      const byType = collator.compare(at, bt);
      if (byType !== 0) return byType;
      return collator.compare(a.name || '', b.name || '');
    });

    return sorted;
  }, [sectors, search, typeOptions]);

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
          {/* New: Tipo de Setor filter */}
          <label className="text-sm text-muted-foreground">Tipo de Setor</label>
          <select
            className="rounded border px-2 py-1 text-sm bg-background"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="all">Todos</option>
            {typeOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          <label className="text-sm text-muted-foreground">Estado</label>
          <select
            className="rounded border px-2 py-1 text-sm bg-background"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
          >
            <option value="all">Todos</option>
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
        data={filteredData}
        showPagination={true}
        pageSizePagination={[10, 25, 50]}
        notFoundLabel="Sem sectores encontrados."
      />
    </div>
  );
}

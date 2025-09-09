'use client';

/* THIS FILE WAS GENERATED AUTOMATICALLY BY iGRP STUDIO. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect, type ReactNode } from 'react';
import { cn, useIGRPToast } from '@igrp/igrp-framework-react-design-system';
import { useRouter } from 'next/navigation';
import type { WrapperListOptionsDTO, OptionResponseDTO } from '@/app/(myapp)/types/options.types';

// Simple card primitives using IGRP DS utility classes via cn
function Card({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div
      className={cn(
        'rounded-lg border border-border bg-card text-card-foreground shadow-sm',
        className,
      )}
    >
      {children}
    </div>
  );
}
function CardHeader({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn('p-4 border-b', className)}>{children}</div>;
}
function CardTitle({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <h3 className={cn('text-base font-semibold leading-none tracking-tight', className)}>
      {children}
    </h3>
  );
}
function CardContent({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn('p-4', className)}>{children}</div>;
}

export type OptionGroup = {
  code: string;
  locale: string;
  items: OptionResponseDTO[];
  count: number;
};

export default function Optionslist({ code }: { code?: string }) {
  const [options, setOptions] = useState<OptionResponseDTO[]>([]);
  const [groups, setGroups] = useState<Record<string, OptionGroup>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    pageNumber: 0,
    pageSize: 20,
    totalElements: 0,
    totalPages: 0,
  });
  const { igrpToast } = useIGRPToast();
  const router = useRouter();

  useEffect(() => {
    const controller = new AbortController();
    async function fetchOptions() {
      try {
        setLoading(true);
        setError(null);
        const params = new URLSearchParams({
          pageNumber: pagination.pageNumber.toString(),
          pageSize: pagination.pageSize.toString(),
          active: 'true',
        });
        if (code) params.set('ccode', code);

        const res = await fetch(`/api/options?${params.toString()}`, {
          signal: controller.signal,
          headers: { 'Content-Type': 'application/json' },
        });
        if (!res.ok) throw new Error(`Erro ao carregar opções: ${res.status}`);
        const data: WrapperListOptionsDTO = await res.json();

        setOptions(data.content || []);
        setPagination({
          pageNumber: data.pageNumber || 0,
          pageSize: data.pageSize || 20,
          totalElements: data.totalElements || 0,
          totalPages: data.totalPages || 0,
        });

        // Group options by ccode
        const groupedOptions: Record<string, OptionGroup> = {};
        (data.content || []).forEach((option) => {
          if (!groupedOptions[option.ccode]) {
            groupedOptions[option.ccode] = {
              code: option.ccode,
              locale: option.locale || 'pt-CV',
              items: [],
              count: 0,
            };
          }
          groupedOptions[option.ccode].items.push(option);
          groupedOptions[option.ccode].count++;
        });
        setGroups(groupedOptions);
      } catch (err: any) {
        if (err.name === 'AbortError') return;
        const message = err?.message || 'Falha ao carregar dados';
        setError(message);
        igrpToast({ title: 'Erro', description: message, type: 'default' });
      } finally {
        setLoading(false);
      }
    }
    fetchOptions();
    return () => controller.abort();
  }, [code, pagination.pageNumber, pagination.pageSize]);

  const groupList = Object.values(groups);

  // Handlers de paginação
  const canPrev = pagination.pageNumber > 0;
  const canNext = pagination.pageNumber + 1 < pagination.totalPages;
  const goPrev = () =>
    setPagination((p) => ({ ...p, pageNumber: Math.max(0, p.pageNumber - 1) }));
  const goNext = () =>
    setPagination((p) => ({ ...p, pageNumber: Math.min(Math.max(0, p.totalPages - 1), p.pageNumber + 1) }));
  const changePageSize = (size: number) =>
    setPagination((p) => ({ ...p, pageSize: size, pageNumber: 0 }));

  return (
    <div className={cn('component')}>
      {loading && <div className="p-4 text-sm text-muted-foreground">A carregar...</div>}
      {error && !loading && <div className="p-4 text-sm text-red-600">{error}</div>}

      {!loading && !error && (
        <>
          <div className="mb-3 flex items-center justify-between">
            <div className="text-xs text-muted-foreground">
              Página {pagination.totalPages > 0 ? pagination.pageNumber + 1 : 0} de {pagination.totalPages}
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-muted-foreground" htmlFor="page-size-select">
                Itens por página
              </label>
              <select
                id="page-size-select"
                className="rounded border px-2 py-1 text-xs"
                value={pagination.pageSize}
                onChange={(e) => changePageSize(parseInt(e.target.value, 10))}
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  className="inline-flex items-center rounded border px-2 py-1 text-xs hover:bg-accent disabled:opacity-50"
                  onClick={goPrev}
                  disabled={!canPrev}
                >
                  Anterior
                </button>
                <button
                  type="button"
                  className="inline-flex items-center rounded border px-2 py-1 text-xs hover:bg-accent disabled:opacity-50"
                  onClick={goNext}
                  disabled={!canNext}
                >
                  Próxima
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {groupList.length === 0 && (
              <div className="p-4 text-sm text-muted-foreground">Sem dados.</div>
            )}
            {groupList.map((group) => (
              <Card key={group.code}>
                <CardHeader className="flex items-center justify-between">
                  <CardTitle>{group.code}</CardTitle>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs text-muted-foreground">
                      {group.count} itens
                    </span>
                    <button
                      type="button"
                      className="inline-flex items-center rounded border px-2 py-0.5 text-xs hover:bg-accent"
                      onClick={() => router.push(`/options/${group.code}/editar`)}
                    >
                      <svg
                        className="mr-1 h-3.5 w-3.5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M12 20h9" />
                        <path d="M16.5 3.5a2.121 2.121 0 113 3L7 19l-4 1 1-4 12.5-12.5z" />
                      </svg>
                      Editar
                    </button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {group.items.slice(0, 5).map((item) => (
                      <div
                        key={`${group.code}-${item.ckey}`}
                        className="flex items-start justify-between gap-3"
                      >
                        <div>
                          <div className="text-sm font-medium">{item.ckey}</div>
                          <div className="text-sm text-muted-foreground">{item.cvalue}</div>
                        </div>
                        {typeof item.sort_order === 'number' && (
                          <div className="text-xs text-muted-foreground">
                            ordem: {item.sort_order}
                          </div>
                        )}
                      </div>
                    ))}
                    {group.items.length > 5 && (
                      <div className="text-xs text-muted-foreground">
                        + {group.items.length - 5} mais...
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-4 flex items-center justify-end gap-2">
            <button
              type="button"
              className="inline-flex items-center rounded border px-2 py-1 text-xs hover:bg-accent disabled:opacity-50"
              onClick={goPrev}
              disabled={!canPrev}
            >
              Anterior
            </button>
            <div className="text-xs text-muted-foreground">
              Página {pagination.totalPages > 0 ? pagination.pageNumber + 1 : 0} de {pagination.totalPages}
            </div>
            <button
              type="button"
              className="inline-flex items-center rounded border px-2 py-1 text-xs hover:bg-accent disabled:opacity-50"
              onClick={goNext}
              disabled={!canNext}
            >
              Próxima
            </button>
          </div>
        </>
      )}
    </div>
  );
}

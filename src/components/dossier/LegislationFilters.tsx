import React from 'react';

type Option = { value: string; label: string };

type Props = {
  legSearch: string;
  setLegSearch: (v: string) => void;
  legTypeFilter: string;
  setLegTypeFilter: (v: string) => void;
  legStatusFilter: string;
  setLegStatusFilter: (v: string) => void;
  legStartDate: string;
  setLegStartDate: (v: string) => void;
  legEndDate: string;
  setLegEndDate: (v: string) => void;
  legislationTypeOptions: Option[];
  legislationStatusOptions: Option[];
  onNew: () => void;
};

export default function LegislationFilters({
  legSearch,
  setLegSearch,
  legTypeFilter,
  setLegTypeFilter,
  legStatusFilter,
  setLegStatusFilter,
  legStartDate,
  setLegStartDate,
  legEndDate,
  setLegEndDate,
  legislationTypeOptions,
  legislationStatusOptions,
  onNew,
}: Props) {
  return (
    <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-end md:gap-3">
      <div className="flex flex-col">
        <label className="text-xs text-muted-foreground">Pesquisar por nome</label>
        <input
          type="text"
          value={legSearch}
          onChange={(e) => setLegSearch(e.target.value)}
          className="rounded border px-2 py-1 text-sm bg-background w-64"
          placeholder="Nome"
        />
      </div>
      <div className="flex flex-col">
        <label className="text-xs text-muted-foreground">Tipo</label>
        <select
          className="rounded border px-2 py-1 text-sm bg-background w-48"
          value={legTypeFilter}
          onChange={(e) => setLegTypeFilter(e.target.value)}
        >
          <option value="">Todos</option>
          {legislationTypeOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-col">
        <label className="text-xs text-muted-foreground">Status</label>
        <select
          className="rounded border px-2 py-1 text-sm bg-background w-40"
          value={legStatusFilter}
          onChange={(e) => setLegStatusFilter(e.target.value)}
        >
          <option value="">Todos</option>
          {legislationStatusOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
      <div className="flex items-end gap-2">
        <div className="flex flex-col">
          <label className="text-xs text-muted-foreground">Data início</label>
          <input
            type="date"
            className="rounded border px-2 py-1 text-sm bg-background"
            value={legStartDate}
            onChange={(e) => setLegStartDate(e.target.value)}
          />
        </div>
        <div className="flex flex-col">
          <label className="text-xs text-muted-foreground">Data fim</label>
          <input
            type="date"
            className="rounded border px-2 py-1 text-sm bg-background"
            value={legEndDate}
            onChange={(e) => setLegEndDate(e.target.value)}
          />
        </div>
      </div>
      <div className="flex-1" />
      <button
        type="button"
        className="inline-flex items-center rounded border px-3 py-1.5 text-sm hover:bg-accent"
        onClick={onNew}
      >
        Nova Legislação
      </button>
    </div>
  );
}
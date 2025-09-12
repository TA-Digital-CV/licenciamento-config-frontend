import React from 'react';
import {
  IGRPInputText,
  IGRPSelect,
  IGRPButton,
} from '@igrp/igrp-framework-react-design-system';

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
    <div className="mb-4 grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
      <div className="md:col-span-2">
        <IGRPInputText
          name="search"
          label="Pesquisar por título"
          value={legSearch}
          onChange={(e) => setLegSearch(e.target.value)}
          placeholder="Digite o título da legislação"
        />
      </div>
      
      <div>
        <IGRPSelect
          name="type"
          label="Tipo"
          value={legTypeFilter}
          onValueChange={(value) => setLegTypeFilter(value || 'all')}
          options={[{ value: 'all', label: 'Todos' }, ...legislationTypeOptions]}
          placeholder="Selecione o tipo"
        />
      </div>
      
      <div>
        <IGRPSelect
          name="status"
          label="Status"
          value={legStatusFilter}
          onValueChange={(value) => setLegStatusFilter(value || 'all')}
          options={[{ value: 'all', label: 'Todos' }, ...legislationStatusOptions]}
          placeholder="Selecione o status"
        />
      </div>
      
      <div>
        <IGRPInputText
          name="startDate"
          label="Data início"
          value={legStartDate}
          onChange={(e) => setLegStartDate(e.target.value)}
          placeholder="DD/MM/AAAA"
        />
      </div>
      
      <div>
        <IGRPInputText
          name="endDate"
          label="Data fim"
          value={legEndDate}
          onChange={(e) => setLegEndDate(e.target.value)}
          placeholder="DD/MM/AAAA"
        />
      </div>
      
      <div className="md:col-span-6 flex justify-end">
        <IGRPButton
          type="button"
          variant="default"
          onClick={onNew}
        >
          Nova Legislação
        </IGRPButton>
      </div>
    </div>
  );
}

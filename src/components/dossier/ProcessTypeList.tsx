/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo } from 'react';
import { IGRPDataTable } from '@igrp/igrp-framework-react-design-system';
import type { ColumnDef } from '@tanstack/react-table';

type Option = { value: string; label: string };

type Props = {
  processTypes: any[];
  categoryOptions: Option[];
  onEdit: (processType: any, index: number) => void;
  onRemove: (index: number) => void;
};

export default function ProcessTypeList({
  processTypes,
  categoryOptions,
  onEdit,
  onRemove,
}: Props) {
  const getOptionLabel = (options: Option[], value: string) => {
    const option = options.find((opt) => opt.value === value);
    return option ? option.label : value;
  };

  const tableData = processTypes.map((processType, index) => ({
    id: index,
    processName: processType.processName || '-',
    processCategory: getOptionLabel(categoryOptions, processType.processCategory),
    description: processType.description || '-',
    active: processType.active ? 'Sim' : 'Não',
    actions: (
      <div className="flex gap-2">
        <button
          onClick={() => onEdit(processType, index)}
          className="text-blue-600 hover:text-blue-800"
        >
          Editar
        </button>
        <button onClick={() => onRemove(index)} className="text-red-600 hover:text-red-800">
          Remover
        </button>
      </div>
    ),
  }));

  const columns: ColumnDef<any>[] = useMemo(
    () => [
      {
        accessorKey: 'processName',
        header: 'Nome do Processo',
        cell: ({ row }) => <div className="font-medium">{row.getValue('processName')}</div>,
      },
      {
        accessorKey: 'processCategory',
        header: 'Categoria',
        cell: ({ row }) => <div className="text-sm">{row.getValue('processCategory')}</div>,
      },
      {
        accessorKey: 'description',
        header: 'Descrição',
        cell: ({ row }) => (
          <div className="text-muted-foreground text-sm">{row.getValue('description') || '-'}</div>
        ),
      },
      {
        accessorKey: 'active',
        header: 'Ativo',
        cell: ({ row }) => <div className="text-sm">{row.getValue('active')}</div>,
      },
      {
        id: 'actions',
        header: 'Ações',
        cell: ({ row }) => (
          <div className="flex gap-2">
            <button
              onClick={() => onEdit(processTypes[row.original.id], row.original.id)}
              className="text-blue-600 hover:text-blue-800"
            >
              Editar
            </button>
            <button
              onClick={() => onRemove(row.original.id)}
              className="text-red-600 hover:text-red-800"
            >
              Remover
            </button>
          </div>
        ),
      },
    ],
    [onEdit, onRemove, processTypes],
  );

  return (
    <IGRPDataTable
      columns={columns}
      data={tableData}
      showPagination={false}
      notFoundLabel="Nenhum tipo de processo associado."
    />
  );
}

/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo } from 'react';
import { IGRPDataTable } from '@igrp/igrp-framework-react-design-system';
import type { ColumnDef } from '@tanstack/react-table';

type Option = { value: string; label: string };

type Props = {
  fees: any[];
  feeTypeOptions: Option[];
  feeCategoryOptions: Option[];
  licenseProcessTypeOptions: Option[];
  onEdit: (fee: any, index: number) => void;
  onRemove: (index: number) => void;
};

export default function FeeList({
  fees,
  feeTypeOptions,
  feeCategoryOptions,
  licenseProcessTypeOptions,
  onEdit,
  onRemove,
}: Props) {
  const getOptionLabel = (options: Option[], value: string) => {
    const option = options.find((opt) => opt.value === value);
    return option ? option.label : value;
  };

  const formatCurrency = (amount: number, currencyCode: string = 'EUR') => {
    return new Intl.NumberFormat('pt-PT', {
      style: 'currency',
      currency: currencyCode,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('pt-PT');
  };

  const tableData = fees.map((fee, index) => ({
    id: index,
    licenseProcessType: getOptionLabel(licenseProcessTypeOptions, fee.licenseProcessTypeId),
    feeCategory: getOptionLabel(feeCategoryOptions, fee.feeCategoryId),
    feeType: getOptionLabel(feeTypeOptions, fee.feeType),
    baseAmount: formatCurrency(fee.baseAmount, fee.currencyCode),
    validPeriod: `${formatDate(fee.validFrom)} - ${formatDate(fee.validUntil)}`,
    paymentTerm: `${fee.paymentTermDays || 0} dias`,
    priority: fee.priority || '-',
    active: fee.active ? 'Sim' : 'Não',
    refundable: fee.isRefundable ? 'Sim' : 'Não',
    actions: (
      <div className="flex gap-2">
        <button onClick={() => onEdit(fee, index)} className="text-blue-600 hover:text-blue-800">
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
        accessorKey: 'licenseProcessType',
        header: 'Tipo de Processo',
        cell: ({ row }) => <div className="font-medium">{row.getValue('licenseProcessType')}</div>,
      },
      {
        accessorKey: 'feeCategory',
        header: 'Categoria',
        cell: ({ row }) => <div className="text-sm">{row.getValue('feeCategory')}</div>,
      },
      {
        accessorKey: 'feeType',
        header: 'Tipo de Taxa',
        cell: ({ row }) => <div className="text-sm">{row.getValue('feeType')}</div>,
      },
      {
        accessorKey: 'baseAmount',
        header: 'Valor Base',
        cell: ({ row }) => <div className="font-medium">{row.getValue('baseAmount')}</div>,
      },
      {
        accessorKey: 'validPeriod',
        header: 'Período Válido',
        cell: ({ row }) => <div className="text-sm">{row.getValue('validPeriod')}</div>,
      },
      {
        accessorKey: 'paymentTerm',
        header: 'Prazo Pagamento',
        cell: ({ row }) => <div className="text-sm">{row.getValue('paymentTerm')}</div>,
      },
      {
        accessorKey: 'priority',
        header: 'Prioridade',
        cell: ({ row }) => <div className="text-sm">{row.getValue('priority')}</div>,
      },
      {
        accessorKey: 'active',
        header: 'Ativo',
        cell: ({ row }) => <div className="text-sm">{row.getValue('active')}</div>,
      },
      {
        accessorKey: 'refundable',
        header: 'Reembolsável',
        cell: ({ row }) => <div className="text-sm">{row.getValue('refundable')}</div>,
      },
      {
        id: 'actions',
        header: 'Ações',
        cell: ({ row }) => (
          <div className="flex gap-2">
            <button
              onClick={() => onEdit(fees[row.original.id], row.original.id)}
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
    [onEdit, onRemove, fees],
  );

  return (
    <IGRPDataTable
      columns={columns}
      data={tableData}
      showPagination={false}
      notFoundLabel="Nenhuma taxa configurada."
    />
  );
}

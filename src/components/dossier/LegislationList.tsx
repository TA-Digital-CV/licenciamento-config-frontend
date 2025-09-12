/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo } from 'react';
import { IGRPDataTable } from '@igrp/igrp-framework-react-design-system';
import { ColumnDef } from '@tanstack/react-table';
import { LegislationResponseDTO } from '@/app/(myapp)/types/legislations.types';

// Tipo para opções de select
type Option = { value: string; label: string };

interface LegislationListProps {
  legislations: LegislationResponseDTO[];
  legislationTypeOptions?: Option[];
  legislationStatusOptions?: Option[];
  onEdit?: (legislation: LegislationResponseDTO) => void;
  onDelete?: (legislation: LegislationResponseDTO) => void;
  onViewDocument?: (legislation: LegislationResponseDTO) => void;
}

// Helper para valores seguros
const safe = (value: any): string => {
  if (value === null || value === undefined) return '';
  return String(value);
};

// Validação de legislação
const isValidLegislation = (legislation: any): legislation is LegislationResponseDTO => {
  return legislation && 
         typeof legislation === 'object' && 
         legislation.title !== undefined && 
         legislation.title !== null;
};

export const LegislationList: React.FC<LegislationListProps> = ({
  legislations,
  legislationTypeOptions,
  legislationStatusOptions,
  onEdit,
  onDelete,
  onViewDocument,
}) => {
  // Filtrar apenas legislações válidas
  const validLegislations = legislations.filter(isValidLegislation);

  // Funções helper para labels
  const getTypeLabel = (typeValue: string) => {
    const option = (legislationTypeOptions || []).find(opt => opt.value === typeValue);
    return option ? option.label : safe(typeValue);
  };

  const getStatusLabel = (statusValue: string) => {
    const option = (legislationStatusOptions || []).find(opt => opt.value === statusValue);
    return option ? option.label : safe(statusValue);
  };

  // Preparar dados com fallbacks seguros
  const rows = validLegislations.map(legislation => ({
    nome: safe(legislation.title),
    tipo: getTypeLabel(legislation.legislationType),
    dataPublicacao: safe(legislation.publicationDate),
    status: getStatusLabel(legislation.status),
    documento: legislation.documentUrl ? 'Disponível' : 'Não disponível',
    acoes: legislation,
  }));

  // Definir colunas usando o padrão do TanStack Table
  const columns = useMemo<ColumnDef<any>[]>(() => [
    {
      accessorKey: 'nome',
      header: 'Nome',
    },
    {
      accessorKey: 'tipo',
      header: 'Tipo',
    },
    {
      accessorKey: 'dataPublicacao',
      header: 'Data Publicação',
    },
    {
      accessorKey: 'status',
      header: 'Status',
    },
    {
      accessorKey: 'documento',
      header: 'Documento',
      cell: ({ row }) => {
        const legislation = row.original.acoes;
        return (
          <div>
            {legislation.documentUrl ? (
              <button
                onClick={() => onViewDocument?.(legislation)}
                className="text-blue-600 hover:text-blue-800"
              >
                Ver Documento
              </button>
            ) : (
              <span className="text-gray-500">Não disponível</span>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: 'acoes',
      header: 'Ações',
      cell: ({ row }) => {
        const legislation = row.original.acoes;
        return (
          <div className="flex gap-2">
            <button
              onClick={() => onEdit?.(legislation)}
              className="text-blue-600 hover:text-blue-800"
            >
              Editar
            </button>
            <button
              onClick={() => onDelete?.(legislation)}
              disabled={!legislation.id}
              className="text-red-600 hover:text-red-800 disabled:text-gray-400"
            >
              Excluir
            </button>
          </div>
        );
      },
    },
  ], [onEdit, onDelete, onViewDocument]);

  return (
    <IGRPDataTable
      columns={columns}
      data={rows}
      showPagination={true}
      pageSizePagination={[10, 25, 50]}
      notFoundLabel="Sem legislações associadas."
    />
  );
};

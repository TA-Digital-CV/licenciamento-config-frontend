/* eslint-disable @typescript-eslint/no-explicit-any */

import React from 'react';

type Option = { value: string; label: string };

type Props = {
  filteredLegislations: any[];
  legislations: any[];
  legislationTypeOptions: Option[];
  legislationStatusOptions: Option[];
  onEdit: (originalIndex: number) => void;
  onDelete: (originalIndex: number) => void;
};

export default function LegislationList({
  filteredLegislations,
  legislations,
  legislationTypeOptions,
  legislationStatusOptions,
  onEdit,
  onDelete,
}: Props) {
  return (
    <div className="overflow-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="border-b bg-muted/30">
            <th className="text-left p-2">Nome</th>
            <th className="text-left p-2">Tipo</th>
            <th className="text-left p-2">Data Publicação</th>
            <th className="text-left p-2">Status</th>
            <th className="text-left p-2">Documento</th>
            <th className="text-left p-2">Ações</th>
          </tr>
        </thead>
        <tbody>
          {filteredLegislations.length === 0 ? (
            <tr>
              <td className="p-3 text-muted-foreground" colSpan={6}>
                Sem legislações associadas.
              </td>
            </tr>
          ) : (
            filteredLegislations.map((l, idx) => {
              const typeLabel =
                legislationTypeOptions.find((o) => o.value === l.legislationType)?.label ||
                l.legislationType;
              const statusLabel =
                legislationStatusOptions.find((o) => o.value === l.status)?.label ||
                l.status ||
                '-';
              let originalIndex = -1;
              if (l && l.id != null) originalIndex = legislations.findIndex((x) => x.id === l.id);
              if (originalIndex === -1) originalIndex = legislations.findIndex((x) => x === l);

              return (
                <tr key={l.id || idx} className="border-b hover:bg-muted/20">
                  <td className="p-2">{l.name}</td>
                  <td className="p-2">{typeLabel}</td>
                  <td className="p-2">{l.publicationDate || '-'}</td>
                  <td className="p-2">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        l.status === 'ACTIVE'
                          ? 'bg-green-100 text-green-800'
                          : l.status === 'INACTIVE'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {statusLabel}
                    </span>
                  </td>
                  <td className="p-2">
                    {l.documentUrl ? (
                      <a href={l.documentUrl} target="_blank" className="text-primary underline">
                        Abrir
                      </a>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td className="p-2">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        className="text-sm underline"
                        onClick={() => onEdit(originalIndex)}
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        className="text-sm underline text-red-600"
                        onClick={() => onDelete(originalIndex)}
                      >
                        Remover
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';

type Option = { value: string; label: string };

type Props = {
  processTypes: any[];
  processTypeOptions: Option[];
  onEdit: (originalIndex: number) => void;
  onDelete: (originalIndex: number) => void;
};

export default function ProcessTypeList({ processTypes, processTypeOptions, onEdit, onDelete }: Props) {
  const labelFor = (value: string) => processTypeOptions.find((o) => o.value === value)?.label || value || '';

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="text-left border-b">
            <th className="py-2 pr-3">Tipo de Processo</th>
            <th className="py-2 pr-3">Ativo</th>
            <th className="py-2 pr-3">Ações</th>
          </tr>
        </thead>
        <tbody>
          {processTypes.length === 0 ? (
            <tr>
              <td colSpan={3} className="py-4 text-muted-foreground">Nenhum tipo de processo associado.</td>
            </tr>
          ) : (
            processTypes.map((p, idx) => (
              <tr key={p.id || idx} className="border-b">
                <td className="py-2 pr-3">{labelFor(p.processType)}</td>
                <td className="py-2 pr-3">
                  <span className={`px-2 py-1 rounded text-xs ${p.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {p.active ? 'Ativo' : 'Inativo'}
                  </span>
                </td>
                <td className="py-2 pr-3">
                  <div className="flex gap-2">
                    <button type="button" className="text-blue-600 hover:underline" onClick={() => onEdit(idx)}>
                      Editar
                    </button>
                    <button type="button" className="text-red-600 hover:underline" onClick={() => onDelete(idx)}>
                      Remover
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
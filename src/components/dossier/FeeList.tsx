/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';

type Option = { value: string; label: string };

type Props = {
  fees: any[];
  feeTypeOptions: Option[];
  onEdit: (originalIndex: number) => void;
  onDelete: (originalIndex: number) => void;
};

export default function FeeList({ fees, feeTypeOptions, onEdit, onDelete }: Props) {
  const labelFor = (value: string) =>
    feeTypeOptions.find((o) => o.value === value)?.label || value || '';

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="text-left border-b">
            <th className="py-2 pr-3">Tipo de Taxa</th>
            <th className="py-2 pr-3">Valor</th>
            <th className="py-2 pr-3">Ativo</th>
            <th className="py-2 pr-3">Ações</th>
          </tr>
        </thead>
        <tbody>
          {fees.length === 0 ? (
            <tr>
              <td colSpan={4} className="py-4 text-muted-foreground">
                Nenhuma taxa configurada.
              </td>
            </tr>
          ) : (
            fees.map((f, idx) => (
              <tr key={f.id || idx} className="border-b">
                <td className="py-2 pr-3">{labelFor(f.feeType)}</td>
                <td className="py-2 pr-3">{typeof f.amount === 'number' ? f.amount : ''}</td>
                <td className="py-2 pr-3">
                  <span
                    className={`px-2 py-1 rounded text-xs ${f.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                  >
                    {f.active ? 'Ativo' : 'Inativo'}
                  </span>
                </td>
                <td className="py-2 pr-3">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="text-blue-600 hover:underline"
                      onClick={() => onEdit(idx)}
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      className="text-red-600 hover:underline"
                      onClick={() => onDelete(idx)}
                    >
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

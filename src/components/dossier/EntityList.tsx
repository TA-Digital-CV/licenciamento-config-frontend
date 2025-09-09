/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';

type Option = { value: string; label: string };

type Props = {
  entities: any[];
  entityTypeOptions: Option[];
  onEdit: (originalIndex: number) => void;
  onDelete: (originalIndex: number) => void;
};

export default function EntityList({ entities, entityTypeOptions, onEdit, onDelete }: Props) {
  const labelFor = (value: string) =>
    entityTypeOptions.find((o) => o.value === value)?.label || value || '';

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="text-left border-b">
            <th className="py-2 pr-3">Tipo</th>
            <th className="py-2 pr-3">Nome</th>
            <th className="py-2 pr-3">Ativo</th>
            <th className="py-2 pr-3">Ações</th>
          </tr>
        </thead>
        <tbody>
          {entities.length === 0 ? (
            <tr>
              <td colSpan={4} className="py-4 text-muted-foreground">
                Nenhuma entidade adicionada.
              </td>
            </tr>
          ) : (
            entities.map((e, idx) => (
              <tr key={e.id || idx} className="border-b">
                <td className="py-2 pr-3">{labelFor(e.entityType)}</td>
                <td className="py-2 pr-3">{e.name}</td>
                <td className="py-2 pr-3">
                  <span
                    className={`px-2 py-1 rounded text-xs ${e.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                  >
                    {e.active ? 'Ativo' : 'Inativo'}
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

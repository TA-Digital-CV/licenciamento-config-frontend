/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { IGRPForm, IGRPSelect, IGRPTextarea, IGRPSwitch } from '@igrp/igrp-framework-react-design-system';

type Option = { value: string; label: string };

type Props = {
  processAssocSchema: any;
  editingInitial: any;
  editingIndex: number;
  processTypeOptions: Option[];
  savingProcess: boolean;
  onSubmit: (values: any) => void | Promise<void>;
  onCancel: () => void;
};

export default function ProcessTypeForm({ processAssocSchema, editingInitial, editingIndex, processTypeOptions, savingProcess, onSubmit, onCancel }: Props) {
  const formRef = React.createRef<any>();
  return (
    <div className="mt-4 rounded border p-4">
      <h4 className="font-medium mb-3">{editingIndex >= 0 ? 'Editar Associação' : 'Nova Associação'}</h4>
      <IGRPForm schema={processAssocSchema} defaultValues={editingInitial} onSubmit={onSubmit} className="space-y-3" key={`proc-${editingInitial?.id || 'new'}`} formRef={formRef} >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <IGRPSelect name="processType" label="Tipo de Processo" placeholder="Selecione..." options={processTypeOptions} required />
        </div>
        <IGRPTextarea name="notes" label="Notas" placeholder="Observações adicionais" />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <IGRPSwitch name="active" checked={editingInitial?.active ?? true} label="Ativo" />
          </div>
          <div className="flex items-center gap-2">
            <button type="button" className="inline-flex items-center rounded border px-3 py-1.5 text-sm hover:bg-accent" onClick={onCancel} disabled={savingProcess}>
              Cancelar
            </button>
            <button type="submit" className="inline-flex items-center rounded bg-primary text-primary-foreground px-3 py-1.5 text-sm disabled:opacity-50" disabled={savingProcess}>
              {savingProcess ? 'A guardar...' : 'Guardar'}
            </button>
          </div>
        </div>
      </IGRPForm>
    </div>
  );
}
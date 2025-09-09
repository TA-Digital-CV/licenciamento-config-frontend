/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import {
  IGRPForm,
  IGRPSelect,
  IGRPInputNumber,
  IGRPTextarea,
  IGRPSwitch,
} from '@igrp/igrp-framework-react-design-system';

type Option = { value: string; label: string };

type Props = {
  feeSchema: any;
  editingInitial: any;
  editingIndex: number;
  feeTypeOptions: Option[];
  savingFee: boolean;
  onSubmit: (values: any) => void | Promise<void>;
  onCancel: () => void;
};

export default function FeeForm({
  feeSchema,
  editingInitial,
  editingIndex,
  feeTypeOptions,
  savingFee,
  onSubmit,
  onCancel,
}: Props) {
  const formRef = React.createRef<any>();
  return (
    <div className="mt-4 rounded border p-4">
      <h4 className="font-medium mb-3">{editingIndex >= 0 ? 'Editar Taxa' : 'Nova Taxa'}</h4>
      <IGRPForm
        schema={feeSchema}
        defaultValues={editingInitial}
        onSubmit={onSubmit}
        className="space-y-3"
        key={`fee-${editingInitial?.id || 'new'}`}
        formRef={formRef}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <IGRPSelect
            name="feeType"
            label="Tipo de Taxa"
            placeholder="Selecione..."
            options={feeTypeOptions}
            required
          />
          <IGRPInputNumber name="amount" label="Valor" placeholder="0" required />
        </div>
        <IGRPTextarea name="notes" label="Notas" placeholder="Observações adicionais" />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <IGRPSwitch name="active" checked={editingInitial?.active ?? true} label="Ativo" />
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="inline-flex items-center rounded border px-3 py-1.5 text-sm hover:bg-accent"
              onClick={onCancel}
              disabled={savingFee}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="inline-flex items-center rounded bg-primary text-primary-foreground px-3 py-1.5 text-sm disabled:opacity-50"
              disabled={savingFee}
            >
              {savingFee ? 'A guardar...' : 'Guardar'}
            </button>
          </div>
        </div>
      </IGRPForm>
    </div>
  );
}

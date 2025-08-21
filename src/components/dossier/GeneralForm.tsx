/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { MutableRefObject } from 'react';
import { IGRPForm, IGRPInputNumber, IGRPSelect, IGRPSwitch, IGRPTextarea } from '@igrp/igrp-framework-react-design-system';

export type Option = { value: string; label: string };

type Props = {
  id: string;
  generalSchema: any;
  defaultValues: any;
  licensingModelOptions: Option[];
  validityUnitOptions: Option[];
  submitting: boolean;
  onSubmit: (values: any) => void | Promise<void>;
  formRef?: MutableRefObject<any | null> | null;
};

export default function GeneralForm({
  id,
  generalSchema,
  defaultValues,
  licensingModelOptions,
  validityUnitOptions,
  submitting,
  onSubmit,
  formRef,
}: Props) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <h3 className="text-base font-semibold mb-2">Dados Gerais</h3>
      <p className="mb-4 text-sm text-muted-foreground">
        Configure parâmetros gerais do dossier deste tipo de licença.
      </p>

      <IGRPForm
        schema={generalSchema}
        defaultValues={defaultValues}
        validationMode="onSubmit"
        onSubmit={onSubmit}
        resetAfterSubmit={false}
        formRef={formRef as any}
        className="space-y-4"
        gridClassName="grid-cols-1 md:grid-cols-2"
        key={`general-${id}-${JSON.stringify(defaultValues)}`}
      >
        <IGRPSelect
          name="licensingModel"
          label="Modelo de Licenciamento"
          placeholder="Selecione um modelo"
          options={licensingModelOptions}
        />
        <IGRPInputNumber name="validityValue" label="Validade" />
        <IGRPSelect
          name="validityUnit"
          label="Unidade de Validade"
          placeholder="Selecione a unidade"
          options={validityUnitOptions}
        />
        <IGRPSwitch name="allowRenewal" label="Permite Renovação" />
        <IGRPInputNumber name="renewalDays" label="Dias antes da expiração para renovação" />
        <IGRPTextarea name="notes" label="Observações" rows={3} className="md:col-span-2" />

        <div className="flex items-center gap-2 md:col-span-2">
          <button
            type="submit"
            disabled={submitting}
            aria-busy={submitting}
            className="inline-flex items-center rounded border px-3 py-1.5 text-sm hover:bg-accent disabled:opacity-50"
          >
            {submitting ? 'A guardar…' : 'Guardar Dados Gerais'}
          </button>
        </div>
      </IGRPForm>
    </div>
  );
}
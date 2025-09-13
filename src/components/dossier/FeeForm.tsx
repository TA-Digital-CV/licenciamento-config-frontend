/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import {
  IGRPForm,
  IGRPSelect,
  IGRPInputNumber,
  IGRPInputText,
  IGRPTextarea,
  IGRPSwitch,
  IGRPDatePicker,
} from '@igrp/igrp-framework-react-design-system';

type Option = { value: string; label: string };

type Props = {
  feeSchema: any;
  editingInitial: any;
  editingIndex: number;
  feeTypeOptions: Option[];
  feeCategoryOptions: Option[];
  licenseProcessTypeOptions: Option[];
  savingFee: boolean;
  onSubmit: (values: any) => void | Promise<void>;
  onCancel: () => void;
};

export default function FeeForm({
  feeSchema,
  editingInitial,
  editingIndex,
  feeTypeOptions,
  feeCategoryOptions,
  licenseProcessTypeOptions,
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <IGRPSelect
            name="licenseProcessTypeId"
            label="Tipo de Processo de Licença"
            placeholder="Selecione..."
            options={licenseProcessTypeOptions}
            required
          />
          <IGRPSelect
            name="feeCategoryId"
            label="Categoria da Taxa"
            placeholder="Selecione..."
            options={feeCategoryOptions}
            required
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <IGRPSelect
            name="feeType"
            label="Tipo de Taxa"
            placeholder="Selecione..."
            options={feeTypeOptions}
            required
          />
          <IGRPInputNumber name="baseAmount" label="Valor Base" placeholder="0" required />
          <IGRPInputText name="currencyCode" label="Código da Moeda" placeholder="EUR" required />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <IGRPInputNumber name="minimumAmount" label="Valor Mínimo" placeholder="0" />
          <IGRPInputNumber name="maximumAmount" label="Valor Máximo" placeholder="0" />
          <IGRPInputNumber
            name="paymentTermDays"
            label="Prazo de Pagamento (dias)"
            placeholder="30"
            required
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <IGRPDatePicker id="validFrom" name="validFrom" label="Válido Desde" required />
          <IGRPDatePicker id="validUntil" name="validUntil" label="Válido Até" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <IGRPInputNumber name="taxRate" label="Taxa de Imposto (%)" placeholder="0" />
          <IGRPInputNumber name="discountRate" label="Taxa de Desconto (%)" placeholder="0" />
        </div>
        <IGRPTextarea
          name="calculationFormula"
          label="Fórmula de Cálculo"
          placeholder="Fórmula para cálculo automático"
        />
        <IGRPTextarea
          name="refundConditions"
          label="Condições de Reembolso"
          placeholder="Condições para reembolso"
        />
        <IGRPTextarea
          name="exemptionCriteria"
          label="Critérios de Isenção"
          placeholder="Critérios para isenção da taxa"
        />
        <IGRPInputNumber name="priority" label="Prioridade" placeholder="1" required />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <IGRPSwitch name="active" checked={editingInitial?.active ?? true} label="Ativo" />
            <IGRPSwitch
              name="isRefundable"
              checked={editingInitial?.isRefundable ?? false}
              label="Reembolsável"
            />
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

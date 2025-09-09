'use client';

/* THIS FILE WAS GENERATED AUTOMATICALLY BY iGRP STUDIO. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  IGRPForm,
  IGRPInputText,
  IGRPInputNumber,
  IGRPSwitch,
  IGRPTextarea,
  IGRPSelect,
} from '@igrp/igrp-framework-react-design-system';
import { useLicenseTypesActions } from '@/app/(myapp)/actions/licensetypes.actions';
import { licenceTypeFormSchema } from '@/app/(myapp)/functions/validation.functions';

// Schema is now imported from validation.functions.ts

export default function LicenceTypeForm({ id }: { id?: string }) {
  const router = useRouter();
  
  // Use the license types actions hook
  const {
    loading,
    submitting,
    initialValues,
    categories,
    licensingModels,
    isEditing,
    actionsDisabled,
    handleSubmit,
  } = useLicenseTypesActions(id);

  // Convert categories and licensing models to options format
  const categoryOptions = categories.map(cat => ({ value: cat.id, label: cat.name }));
  const licensingModelOptions = licensingModels;

  const formRef = useRef<any | null>(null);

  // Options loading is now handled by the actions hook

  // Data loading is now handled by the actions hook

  // Form submission is now handled by the actions hook

  // State is now managed by the actions hook

  return (
    <div
      className="space-y-4"
      onKeyDownCapture={(e) => {
        const tag = (e.target as HTMLElement).tagName;
        if (e.key === 'Enter' && (tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA')) {
          e.preventDefault();
        }
      }}
    >
      <IGRPForm
        schema={licenceTypeFormSchema}
        defaultValues={initialValues}
        validationMode="onSubmit"
        onSubmit={handleSubmit}
        resetAfterSubmit={false}
        formRef={formRef}
        className="space-y-4"
        gridClassName="grid-cols-1 md:grid-cols-2"
        key={isEditing ? `edit-${id}-${initialValues.code ?? ''}` : 'create'}
      >
        <IGRPInputText name="name" label="Nome" required />
        <IGRPInputText name="code" label="Código" required disabled={isEditing} />
        <IGRPSelect
          name="categoryId"
          label="Categoria"
          required
          placeholder="Selecione uma categoria"
          options={categoryOptions}
        />
        <IGRPSelect
          name="licensingModelKey"
          label="Modelo de Licenciamento"
          required
          placeholder="Selecione o modelo"
          options={licensingModelOptions}
        />
        <IGRPInputNumber name="validityPeriod" label="Período de Validade" required />
        <IGRPInputText name="validityUnitKey" label="Unidade de Validade" required />
        <IGRPSwitch name="renewable" label="Renovável" />
        <IGRPSwitch name="autoRenewal" label="Renovação Automática" />
        <IGRPSwitch name="requiresInspection" label="Requer Inspeção" />
        <IGRPSwitch name="requiresPublicConsultation" label="Requer Consulta Pública" />
        <IGRPInputNumber name="maxProcessingDays" label="Prazo Máximo (dias)" />
        <IGRPSwitch name="hasFees" label="Possui Taxas" />
        <IGRPInputNumber name="baseFee" label="Taxa Base" />
        <IGRPInputText name="currencyCode" label="Código da Moeda" />
        <IGRPInputNumber name="sortOrder" label="Ordenação" />
        <IGRPSwitch name="active" label="Ativo" />
        <IGRPTextarea name="description" label="Descrição" rows={3} className="md:col-span-2" />
        <IGRPTextarea name="metadata" label="Metadata" rows={3} className="md:col-span-2" />

        <div className="flex items-center gap-2 md:col-span-2">
          <button
            type="button"
            onClick={() => formRef.current?.submit()}
            disabled={actionsDisabled}
            aria-busy={submitting}
            className="inline-flex items-center rounded border px-3 py-1.5 text-sm hover:bg-accent disabled:opacity-50 disabled:pointer-events-none"
          >
            {submitting ? 'A guardar…' : 'Guardar'}
          </button>
          <button
            type="button"
            onClick={() => router.push('/parametrizacao?tab=licence-types')}
            disabled={actionsDisabled}
            className="inline-flex items-center rounded border px-3 py-1.5 text-sm hover:bg-accent disabled:opacity-50 disabled:pointer-events-none"
          >
            Cancelar
          </button>
        </div>
      </IGRPForm>
    </div>
  );
}

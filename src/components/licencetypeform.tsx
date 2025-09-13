'use client';

/* THIS FILE WAS GENERATED AUTOMATICALLY BY iGRP STUDIO. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useRef, useState, useEffect } from 'react';
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
    validityUnits,
    isEditing,
    actionsDisabled,
    handleSubmit,
  } = useLicenseTypesActions(id);

  // Estado para carregar moedas
  const [currencies, setCurrencies] = useState<Array<{ value: string; label: string }>>([]);

  // Convert categories and licensing models to options format
  const categoryOptions = categories.map((cat) => ({ value: cat.id, label: cat.name }));
  const licensingModelOptions = licensingModels;
  const validityUnitOptions = validityUnits;
  const currencyOptions = currencies;

  const formRef = useRef<any | null>(null);

  // Estado para controlar o modelo de licenciamento selecionado
  const [selectedLicensingModel, setSelectedLicensingModel] = useState<string>(
    initialValues.licensingModelKey || '',
  );

  // Estados para controlar os switches
  const [isRenewable, setIsRenewable] = useState<boolean>(initialValues.renewable ?? true);
  const [hasFees, setHasFees] = useState<boolean>(initialValues.hasFees ?? false);
  const [autoRenewal, setAutoRenewal] = useState<boolean>(false);

  // Função utilitária para normalizar valor de switches (boolean ou evento)
  const toBoolean = (arg: unknown): boolean => {
    if (typeof arg === 'boolean') return arg;
    const event = arg as any;
    if (event && typeof event === 'object') {
      if ('checked' in event) return !!(event as any).checked;
      if (event.target && typeof event.target.checked !== 'undefined')
        return !!event.target.checked;
      if ('detail' in event && typeof (event as any).detail === 'boolean')
        return !!(event as any).detail;
    }
    return Boolean(arg);
  };

  // Handlers sincronizados com o form
  const handleRenewableChange = (value: unknown) => {
    const checked = toBoolean(value);
    setIsRenewable(checked);
    formRef.current?.setValue?.('renewable', checked, { shouldDirty: true, shouldValidate: true });
    if (!checked) {
      // Se não for renovável, forçar autoRenewal = false
      setAutoRenewal(false);
      formRef.current?.setValue?.('autoRenewal', false, {
        shouldDirty: true,
        shouldValidate: true,
      });
    }
  };

  const handleAutoRenewalChange = (value: unknown) => {
    const checked = toBoolean(value);
    setAutoRenewal(checked);
    formRef.current?.setValue?.('autoRenewal', checked, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const handleHasFeesChange = (value: unknown) => {
    const checked = toBoolean(value);
    setHasFees(checked);
    formRef.current?.setValue?.('hasFees', checked, { shouldDirty: true, shouldValidate: true });
    if (!checked) {
      // Limpar valores de taxas quando desativado
      formRef.current?.setValue?.('baseFee', undefined, {
        shouldDirty: true,
        shouldValidate: true,
      });
      formRef.current?.setValue?.('currencyCode', undefined, {
        shouldDirty: true,
        shouldValidate: true,
      });
    }
  };

  // Atualizar os estados quando initialValues mudar
  useEffect(() => {
    setSelectedLicensingModel(initialValues.licensingModelKey || '');
    setIsRenewable(initialValues.renewable ?? true);
    setHasFees(initialValues.hasFees ?? false);
    setAutoRenewal(initialValues.autoRenewal ?? false);
  }, [initialValues]);

  // Sincronizar estado local com valores do formulário (watch), quando disponível
  useEffect(() => {
    const unsub = formRef.current?.watch?.((values: any, info: any) => {
      if (!values) return;
      if (info?.name === 'renewable' || typeof values.renewable !== 'undefined') {
        setIsRenewable(Boolean(values.renewable));
      }
      if (info?.name === 'hasFees' || typeof values.hasFees !== 'undefined') {
        setHasFees(Boolean(values.hasFees));
      }
      if (info?.name === 'autoRenewal' || typeof values.autoRenewal !== 'undefined') {
        setAutoRenewal(Boolean(values.autoRenewal));
      }
      if (info?.name === 'licensingModelKey' || typeof values.licensingModelKey !== 'undefined') {
        setSelectedLicensingModel(values.licensingModelKey || '');
      }
    });
    return () => {
      if (typeof unsub === 'function') unsub();
    };
  }, []);

  // Carregar moedas das opções CURRENCY
  useEffect(() => {
    const loadCurrencies = async () => {
      try {
        const response = await fetch('/api/options/by-code/CURRENCY?active=true');
        if (response.ok) {
          const data = await response.json();
          const list = Array.isArray(data)
            ? data
            : Array.isArray((data as any)?.content)
              ? (data as any).content
              : [];
          if (!Array.isArray(list)) {
            console.warn('Formato inesperado de moedas:', data);
          }
          const currencyOpts = list.map((currency: any) => ({
            value: currency.ckey,
            label: `${currency.cvalue} (${currency.ckey})`,
          }));
          setCurrencies(currencyOpts);
        } else {
          console.error('Resposta inválida ao carregar moedas:', response.status);
        }
      } catch (error) {
        console.error('Erro ao carregar moedas:', error);
      }
    };
    loadCurrencies();
  }, []);

  // Normalizar chave de modelo de licenciamento (suporte PT/EN)
  const normalizeLicensingModelKey = (
    key: string | undefined | null,
  ): 'TEMPORARY' | 'PERMANENT' | 'HYBRID' | '' => {
    const k = (key || '').toUpperCase();
    if (k === 'TEMPORARY' || k === 'PROVISORIO' || k === 'PROVISÓRIO') return 'TEMPORARY';
    if (k === 'PERMANENT' || k === 'DEFINITIVO' || k === 'PERMANENTE') return 'PERMANENT';
    if (k === 'HYBRID' || k === 'HIBRIDO' || k === 'HÍBRIDO') return 'HYBRID';
    return '';
  };

  const normalizedModel = normalizeLicensingModelKey(selectedLicensingModel);

  // Determinar regras baseadas no modelo de licenciamento
  const isTemporary = normalizedModel === 'TEMPORARY';
  const isPermanent = normalizedModel === 'PERMANENT';
  const isHybrid = normalizedModel === 'HYBRID';

  // Campos obrigatórios por modelo
  const isValidityPeriodRequired = isTemporary || isHybrid;
  const isValidityUnitRequired = isTemporary || isHybrid;
  const isMaxProcessingDaysRequired = true; // Campo sempre obrigatório, funcionando independentemente
  const isRenewableRequired = isTemporary;

  // Campos habilitados/desabilitados por modelo
  const isValidityPeriodDisabled = isPermanent;
  const isValidityUnitDisabled = isPermanent;
  const isRenewableDisabled = isPermanent;
  const isAutoRenewalDisabled = isPermanent || !isRenewable;

  // Renovação automática permitida quando renovável está ativo (exceto PERMANENT)
  const isAutoRenewalAllowed = !isPermanent && isRenewable;

  // Ao alterar para PERMANENT, garantir que renovação esteja desativada
  useEffect(() => {
    if (isPermanent) {
      if (isRenewable) {
        setIsRenewable(false);
        formRef.current?.setValue?.('renewable', false, {
          shouldDirty: true,
          shouldValidate: true,
        });
      }
      if (autoRenewal) {
        setAutoRenewal(false);
        formRef.current?.setValue?.('autoRenewal', false, {
          shouldDirty: true,
          shouldValidate: true,
        });
      }
    }
  }, [isPermanent]);

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
          onValueChange={(value) => setSelectedLicensingModel(value as string)}
        />
        <IGRPInputNumber
          name="validityPeriod"
          label="Período de Validade"
          required={isValidityPeriodRequired}
          disabled={isValidityPeriodDisabled}
          helperText={isPermanent ? 'Opcional para licenças permanentes' : undefined}
        />
        <IGRPSelect
          name="validityUnitKey"
          label="Unidade de Validade"
          required={isValidityUnitRequired}
          disabled={isValidityUnitDisabled}
          placeholder="Selecione a unidade"
          options={validityUnitOptions}
          helperText={isPermanent ? 'Opcional para licenças permanentes' : undefined}
        />
        <IGRPSwitch
          name="renewable"
          label="Renovável"
          disabled={isRenewableDisabled}
          onChange={handleRenewableChange}
        />
        <IGRPSwitch
          name="autoRenewal"
          label="Renovação Automática"
          disabled={isAutoRenewalDisabled}
          helperText={
            !isAutoRenewalAllowed ? 'Disponível quando a renovação está ativada' : undefined
          }
          onChange={handleAutoRenewalChange}
        />
        <IGRPSwitch name="requiresInspection" label="Requer Inspeção" />
        <IGRPSwitch name="requiresPublicConsultation" label="Requer Consulta Pública" />
        <IGRPInputNumber
          name="maxProcessingDays"
          label="Prazo Máximo (dias)"
          required={isMaxProcessingDaysRequired}
          helperText="Prazo máximo para processamento da licença"
        />
        <IGRPSwitch name="hasFees" label="Possui Taxas" onChange={handleHasFeesChange} />
        {hasFees && (
          <>
            <IGRPInputNumber
              name="baseFee"
              label="Valor Base"
              required
              helperText="Valor base da taxa em formato decimal"
            />
            <IGRPSelect
              name="currencyCode"
              label="Moeda"
              required
              placeholder="Selecione a moeda"
              options={currencyOptions}
              helperText="Moeda utilizada para o cálculo das taxas"
            />
          </>
        )}
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

'use client';

/* THIS FILE WAS GENERATED AUTOMATICALLY BY iGRP STUDIO. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  IGRPForm,
  IGRPFormList,
  IGRPInputText,
  IGRPInputNumber,
  IGRPSwitch,
  IGRPTextarea,
} from '@igrp/igrp-framework-react-design-system';
import { useOptionsActions } from '@/app/(myapp)/actions/options.actions';
import {
  transformOptionToFormItem,
  loadOptionById,
  updateOptionById,
} from '@/app/(myapp)/functions/api.functions';
import { optionFormSchema } from '@/app/(myapp)/functions/validation.functions';
import { OptionResponseDTO, OptionRequestDTO } from '@/app/(myapp)/types/options.types';

// Helper function to safely stringify objects with circular references
const safeStringify = (obj: any): string => {
  try {
    return JSON.stringify(obj, null, 2);
  } catch (error) {
    return '[Object with circular reference]';
  }
};

export default function Optionform({
  id,
  ccode,
  mode,
}: {
  id?: string;
  ccode?: string;
  mode?: 'create' | 'edit';
}) {
  const router = useRouter();
  const effectiveCode = ccode || id;
  if (process.env.NODE_ENV !== 'production') {
    console.log('🚀 OPTIONFORM: Component function called with:', {
      id,
      ccode,
      effectiveCode,
      mode,
    });
  }

  const isCreateMode = mode === 'create' || (!id && !ccode);

  // Use the options actions hook
  const {
    loading,
    submitting,
    initialValues,
    defaultItem,
    isEditing,
    actionsDisabled,
    loadOptions,
    handleSubmit,
  } = useOptionsActions(effectiveCode);

  const formRef = useRef<any | null>(null);

  // Debug: Log initial values changes (simplified) - usando dependências específicas
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      console.log('🔍 OPTIONFORM: initialValues changed:', {
        ccode: initialValues.ccode,
        optionsCount: initialValues.options?.length || 0,
      });
    }
  }, [initialValues.ccode, initialValues.options?.length]); // Dependências específicas para evitar re-renders desnecessários

  // Debug: Log when component mounts
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      console.log('🎯 OPTIONFORM: Component mounted with:', { id, ccode, effectiveCode, mode });
    }
  }, [id, ccode, effectiveCode, mode]);

  // Load options when component mounts with code (ONLY for editing, not for creation)
  useEffect(() => {
    // Only load options if we have an effectiveCode AND we're in editing mode
    // For new options (id and ccode are undefined), we should NOT load existing options
    if (isCreateMode || !effectiveCode) return;

    const timeoutId = setTimeout(() => {
      loadOptions(effectiveCode);
    }, 300); // Debounce de 300ms

    return () => clearTimeout(timeoutId);
  }, [effectiveCode, isCreateMode, loadOptions]); // garantir dependências estáveis

  // Normaliza dados antes do submit e delega para o handleSubmit do hook
  const onSubmit = useCallback(
    (data: any) => {
      const normalized = {
        ...data,
        ccode: String(data?.ccode ?? '')
          .trim()
          .toUpperCase(),
        options: Array.isArray(data?.options)
          ? data.options.map((opt: any) => ({
              ckey: String(opt?.ckey ?? '').trim(),
              cvalue: String(opt?.cvalue ?? '').trim(),
              locale: opt?.locale ? String(opt.locale).trim() : undefined,
              sortOrder:
                typeof opt?.sortOrder === 'number'
                  ? opt.sortOrder
                  : opt?.sortOrder
                    ? Number(opt.sortOrder)
                    : undefined,
              active: Boolean(opt?.active),
              description: typeof opt?.description === 'string' ? opt.description : '',
              metadata: typeof opt?.metadata === 'string' ? opt.metadata : '',
            }))
          : [],
      } as any;

      return handleSubmit(normalized);
    },
    [handleSubmit],
  );

  // Form submission is now handled by the actions hook

  // State is now managed by the actions hook

  // Debug: Log render information
  if (process.env.NODE_ENV !== 'production') {
    console.log('🎨 OPTIONFORM RENDER:', {
      id,
      ccode,
      effectiveCode,
      mode,
      timestamp: new Date().toISOString(),
      loading,
      submitting,
    });
  }

  return (
    <div
      className="space-y-4"
      onKeyDownCapture={(e) => {
        const target = e.target as HTMLElement;
        const tag = target.tagName?.toLowerCase();
        // Evita submit nativo do browser ao pressionar Enter em inputs de texto
        if (e.key === 'Enter' && !e.shiftKey && (tag === 'input' || tag === 'select')) {
          e.preventDefault();
        }
      }}
    >
      <IGRPForm
        schema={optionFormSchema}
        defaultValues={initialValues}
        validationMode="onSubmit"
        onSubmit={onSubmit}
        resetAfterSubmit={false}
        formRef={formRef}
        className="space-y-4"
        gridClassName="grid-cols-1"
        key={
          isEditing ? `edit-${initialValues.ccode}-${initialValues.options?.length ?? 0}` : 'create'
        }
      >
        <IGRPInputText name="ccode" label="Código Principal" required disabled={isEditing} />

        <IGRPFormList
          id="options-list"
          name="options"
          label="Opções"
          description="Introduza os valores associados ao código principal"
          defaultItem={defaultItem}
          computeLabel={(item: any, index: number) => {
            const key = (item?.ckey ?? '').toString();
            const value = (item?.cvalue ?? '').toString();
            if (value && value.trim().length > 0) {
              return key ? `${key} — ${value}` : value;
            }
            return key || (item?.locale ?? '') || `Valor ${index + 1}`;
          }}
          addButtonLabel="Adicionar Opção"
          addButtonIconName="Plus"
          renderItem={(item: any, index: number) => {
            if (process.env.NODE_ENV !== 'production') {
              console.log(`🎨 IGRPFormList renderItem called:`, {
                index,
                item: safeStringify(item),
                timestamp: new Date().toISOString(),
              });
            }
            return (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <IGRPInputText name={`options.${index}.ckey`} label="Chave" required />
                <IGRPInputText name={`options.${index}.cvalue`} label="Valor" required />
                <IGRPInputText name={`options.${index}.locale`} label="Locale" />
                <IGRPInputNumber name={`options.${index}.sortOrder`} label="Ordenação" />
                <IGRPSwitch name={`options.${index}.active`} label="Ativo" />
                <IGRPTextarea name={`options.${index}.description`} label="Descrição" rows={3} />
                <IGRPTextarea name={`options.${index}.metadata`} label="Metadata" rows={3} />
              </div>
            );
          }}
        />

        {/* Actions */}
        <div className="flex items-center gap-2">
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
            onClick={() => router.push('/options')}
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

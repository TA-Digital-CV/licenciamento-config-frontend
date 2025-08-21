'use client'

/* THIS FILE WAS GENERATED AUTOMATICALLY BY iGRP STUDIO. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useMemo, useRef, useState } from 'react';
import { z } from 'zod';
import {
  IGRPForm,
  IGRPFormList,
  IGRPInputText,
  IGRPInputNumber,
  IGRPSwitch,
  IGRPTextarea,
  useIGRPToast,
} from '@igrp/igrp-framework-react-design-system';
import { useRouter } from 'next/navigation';

// Schema definitions
const optionItemSchema = z.object({
  ckey: z.string().min(1, 'Chave é obrigatória'),
  cvalue: z.string().min(1, 'Valor é obrigatório'),
  locale: z.string().optional().default(''),
  sort_order: z.coerce.number().int().min(0, 'Ordenação inválida').default(0),
  active: z.boolean().default(true),
  metadata: z.string().optional().default(''),
  description: z.string().optional().default(''),
});

const formSchema = z
  .object({
    ccode: z.string().min(1, 'Código é obrigatório'),
    options: z.array(optionItemSchema).min(1, 'Adicione pelo menos um valor'),
  })
  .superRefine((val, ctx) => {
    // Validar ckey único por locale dentro do mesmo code
    const seen = new Set<string>();
    val.options.forEach((item, index) => {
      const key = (item.ckey || '').trim();
      const loc = (item.locale || '').trim();
      if (!key) return; // handled by required rule
      const composite = `${key}::${loc}`; // locale em branco conta como um escopo próprio
      if (seen.has(composite)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Chave duplicada para o mesmo locale',
          path: ['options', index, 'ckey'],
        });
      } else {
        seen.add(composite);
      }
    });
  });

export default function Optionform({ id } : { id?: string }) {
  const formRef = useRef<any | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [initialValues, setInitialValues] = useState<{ ccode: string; options: any[] }>({ ccode: id ?? '', options: [] });
  const router = useRouter();
  const { igrpToast } = useIGRPToast();

  const defaultItem = {
    ckey: '',
    cvalue: '',
    locale: '',
    sort_order: 0,
    active: true,
    metadata: '',
    description: '',
  };

  useEffect(() => {
    let active = true;
    async function load() {
      if (!id) return;
      setLoading(true);
      try {
        const res = await fetch(`/api/options/${id}`);
        if (!res.ok) throw new Error('Falha ao carregar opções');
        const data = await res.json();
        const items = (data?.items || []).map((it: any) => ({
          ckey: it.key ?? '',
          cvalue: it.value ?? '',
          locale: data?.locale ?? '',
          sort_order: it.sortOrder ?? 0,
          active: it.active !== false,
          metadata: typeof it.metadata === 'string' ? it.metadata : JSON.stringify(it.metadata ?? ''),
          description: it.description ?? '',
        }));
        if (active) setInitialValues({ ccode: data?.code ?? id, options: items });
      } catch (e: any) {
        console.error(e);
        const msg = e?.message || 'Falha ao carregar opções';
        igrpToast({ title: 'Erro', description: msg, type: 'default' });
      } finally {
        setLoading(false);
      }
    }
    load();
    return () => { active = false; };
  }, [id]);

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setSubmitting(true);
    try {
      const payloadCreate = values.options.map((item) => ({
        code: values.ccode,
        key: item.ckey,
        value: item.cvalue,
        locale: item.locale || 'pt-CV',
        sortOrder: item.sort_order ?? 0,
        active: item.active !== false,
        description: item.description || '',
        // Try to parse metadata back to JSON if possible
        metadata: (() => { try { return item.metadata ? JSON.parse(item.metadata) : null; } catch { return item.metadata || null; } })(),
      }));

      if (!id) {
        // Create: POST one by one to /api/options
        for (const record of payloadCreate) {
          const res = await fetch('/api/options', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(record),
          });
          if (!res.ok) throw new Error('Falha ao criar opção');
        }
      } else {
        // Update: PUT the whole set
        const res = await fetch(`/api/options/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code: values.ccode, locale: payloadCreate[0]?.locale || 'pt-CV', items: payloadCreate.map(r => ({ key: r.key, value: r.value, sortOrder: r.sortOrder, description: r.description, metadata: r.metadata, active: r.active })) }),
        });
        if (!res.ok) throw new Error('Falha ao atualizar opção');
      }

      igrpToast({ title: 'Sucesso', description: 'Parametrização guardada com sucesso', type: 'default' });
      // Navigate back to list after success
      router.push('/options');
    } catch (e) {
      console.error(e);
      const msg = (e as Error).message || 'Erro ao submeter o formulário';
      igrpToast({ title: 'Erro', description: msg, type: 'default' });
    } finally {
      setSubmitting(false);
    }
  };

  const isEditing = Boolean(id);
  const actionsDisabled = loading || submitting;

  return (
    <div className="space-y-4">
      <IGRPForm
        schema={formSchema}
        defaultValues={initialValues}
        validationMode="onSubmit"
        onSubmit={handleSubmit}
        resetAfterSubmit={false}
        formRef={formRef}
        className="space-y-4"
        gridClassName="grid-cols-1"
        key={isEditing ? `edit-${initialValues.ccode}-${initialValues.options?.length ?? 0}` : 'create'}
      >
        <IGRPInputText name="ccode" label="Código Principal" required disabled={isEditing} />

        <IGRPFormList
          id="options-list"
          name="options"
          label="Valores"
          description="Introduza os valores associados ao código principal"
          defaultItem={defaultItem}
          computeLabel={(item: any, index: number) => item?.ckey || item?.locale || `Valor ${index + 1}`}
          addButtonLabel="Adicionar"
          addButtonIconName="Plus"
        
          renderItem={(item: any, index: number) => (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <IGRPInputText name={`options.${index}.ckey`} label="Chave" required />
              <IGRPInputText name={`options.${index}.cvalue`} label="Valor" required />
              <IGRPInputText name={`options.${index}.locale`} label="Locale" />
              <IGRPInputNumber name={`options.${index}.sort_order`} label="Ordenação" />
              <IGRPSwitch name={`options.${index}.active`} label="Ativo" />
              <IGRPTextarea name={`options.${index}.description`} label="Descrição" rows={3} />
              <IGRPTextarea name={`options.${index}.metadata`} label="Metadata" rows={3} />
            </div>
          )}
        />

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            type="submit"
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
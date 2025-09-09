'use client';

/* THIS FILE WAS GENERATED AUTOMATICALLY BY iGRP STUDIO. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useRef, useState } from 'react';
import { z } from 'zod';
import {
  IGRPForm,
  IGRPInputText,
  IGRPInputNumber,
  IGRPSwitch,
  IGRPTextarea,
  IGRPSelect,
  useIGRPToast,
} from '@igrp/igrp-framework-react-design-system';
import { useRouter } from 'next/navigation';

const formSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  description: z.string().optional().default(''),
  code: z.string().min(1, 'Código é obrigatório'),
  sectorId: z.string().min(1, 'Setor é obrigatório'),
  parentCategoryId: z.string().optional(),
  sortOrder: z.coerce.number().int().optional(),
  active: z.boolean().default(true),
  metadata: z.string().optional().default(''),
});

export default function CategoryForm({ id }: { id?: string }) {
  const formRef = useRef<any | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [initialValues, setInitialValues] = useState<any>({
    name: '',
    description: '',
    code: '',
    sectorId: '',
    parentCategoryId: undefined,
    sortOrder: undefined,
    active: true,
    metadata: '',
  });
  const [sectorOptions, setSectorOptions] = useState<{ value: string; label: string }[]>([]);
  const router = useRouter();
  const { igrpToast } = useIGRPToast();

  useEffect(() => {
    const controller = new AbortController();
    async function fetchSectors() {
      try {
        const res = await fetch('/api/sectors?active=true', { signal: controller.signal });
        const data = await res.json();
        const opts = (data.content || []).map((s: any) => ({ value: s.id, label: s.name }));
        setSectorOptions(opts);
      } catch (_) {}
    }
    fetchSectors();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    let mounted = true;
    async function load() {
      if (!id) return;
      setLoading(true);
      try {
        const res = await fetch(`/api/categories/${id}`);
        if (!res.ok) throw new Error('Falha ao carregar categoria');
        const data = await res.json();
        const mapped = {
          name: data.name ?? '',
          description: data.description ?? '',
          code: data.code ?? '',
          sectorId: data.sectorId ?? '',
          parentCategoryId: data.parentCategoryId ?? undefined,
          sortOrder: data.sortOrder ?? undefined,
          active: data.active !== false,
          metadata:
            typeof data.metadata === 'string' ? data.metadata : JSON.stringify(data.metadata ?? ''),
        };
        if (mounted) setInitialValues(mapped);
      } catch (e: any) {
        console.error(e);
        igrpToast({
          title: 'Erro',
          description: e?.message || 'Falha ao carregar categoria',
          type: 'default',
        });
      } finally {
        setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [id]);

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setSubmitting(true);
    try {
      const payload = {
        name: values.name,
        description: values.description || '',
        code: values.code,
        sectorId: values.sectorId,
        parentCategoryId: values.parentCategoryId,
        sortOrder: values.sortOrder,
        active: values.active !== false,
        metadata: (() => {
          try {
            return values.metadata ? JSON.parse(values.metadata) : null;
          } catch {
            return values.metadata || null;
          }
        })(),
      };

      if (!id) {
        const res = await fetch('/api/categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error('Falha ao criar categoria');
      } else {
        const res = await fetch(`/api/categories/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error('Falha ao atualizar categoria');
      }

      igrpToast({
        title: 'Sucesso',
        description: 'Categoria guardada com sucesso',
        type: 'default',
      });
      router.push('/parametrizacao');
    } catch (e: any) {
      console.error(e);
      igrpToast({ title: 'Erro', description: e?.message || 'Erro ao submeter', type: 'default' });
    } finally {
      setSubmitting(false);
    }
  };

  const actionsDisabled = loading || submitting;
  const isEditing = Boolean(id);

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
        schema={formSchema}
        defaultValues={initialValues}
        validationMode="onSubmit"
        onSubmit={handleSubmit}
        resetAfterSubmit={false}
        formRef={formRef}
        className="space-y-4"
        gridClassName="grid-cols-1 md:grid-cols-2"
        key={isEditing ? `edit-${id}-${JSON.stringify(initialValues)}` : 'create'}
      >
        <IGRPInputText name="name" label="Nome" required />
        <IGRPInputText name="code" label="Código" required disabled={isEditing} />
        <IGRPSelect
          name="sectorId"
          label="Setor"
          required
          placeholder="Selecione um setor"
          options={sectorOptions}
        />
        <IGRPInputText name="parentCategoryId" label="Categoria Pai (Id)" />
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
            onClick={() => router.push('/parametrizacao')}
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

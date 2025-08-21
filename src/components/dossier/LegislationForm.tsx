/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useEffect, useRef, useState } from 'react';
import { IGRPForm, IGRPInputText, IGRPSelect, IGRPTextarea } from '@igrp/igrp-framework-react-design-system';

type Option = { value: string; label: string };

type Props = {
  id: string;
  legislationSchema: any; // zod schema passed from parent
  editingInitial: any;
  editingIndex: number;
  legislationTypeOptions: Option[];
  legislationStatusOptions: Option[];
  savingLegislation: boolean;
  onSubmit: (values: any) => void | Promise<void>;
  onCancel: () => void;
};

export default function LegislationForm({
  id,
  legislationSchema,
  editingInitial,
  editingIndex,
  legislationTypeOptions,
  legislationStatusOptions,
  savingLegislation,
  onSubmit,
  onCancel,
}: Props) {
  const formRef = useRef<any | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    // Garantir que o URL existente (edição) respeita o schema (URL absoluto)
    const current = editingInitial?.documentUrl as string | undefined;
    if (current && formRef.current?.setValue) {
      const absolute = current.startsWith('http') ? current : (typeof window !== 'undefined' ? new URL(current, window.location.origin).toString() : current);
      formRef.current.setValue('documentUrl', absolute, { shouldDirty: false });
    }
  }, [editingInitial?.documentUrl]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      if (!res.ok) {
        const msg = (await res.text()) || 'Falha ao carregar documento';
        throw new Error(msg);
      }
      const data = await res.json();
      const returned = (data?.url as string) || '';
      const absolute = typeof window !== 'undefined' && returned
        ? new URL(returned, window.location.origin).toString()
        : returned;
      if (absolute && formRef.current?.setValue) {
        formRef.current.setValue('documentUrl', absolute, { shouldValidate: true, shouldDirty: true });
      }
    } catch (err: any) {
      setUploadError(err?.message || 'Erro no upload');
    } finally {
      setUploading(false);
      // limpar o valor do input para permitir novo upload do mesmo ficheiro
      e.target.value = '';
    }
  };

  return (
    <div className="mt-6 rounded border p-4 bg-background">
      <h4 className="font-medium mb-3">{editingIndex >= 0 ? 'Editar Legislação' : 'Nova Legislação'}</h4>
      <IGRPForm
        schema={legislationSchema}
        defaultValues={editingInitial}
        validationMode="onSubmit"
        onSubmit={onSubmit}
        resetAfterSubmit={false}
        className="space-y-4"
        gridClassName="grid-cols-1 md:grid-cols-2"
        key={`leg-${id}-${editingInitial?.id || 'new'}`}
        formRef={formRef}
      >
        <IGRPInputText name="name" label="Nome" required />
        <IGRPSelect name="legislationType" label="Tipo" placeholder="Selecione" options={legislationTypeOptions} />
        <IGRPInputText name="publicationDate" label="Data de Publicação" required placeholder="YYYY-MM-DD" />
        <IGRPInputText name="republicBulletin" label="Número oficial" />
        <IGRPSelect name="status" label="Status" placeholder="Selecione" options={legislationStatusOptions} />

        {/* Upload de Documento */}
        <div className="md:col-span-2 space-y-2">
          <label className="text-sm font-medium">Documento</label>
          <div className="flex items-center gap-3">
            <input
              type="file"
              accept="application/pdf,.pdf,application/msword,.doc,application/vnd.openxmlformats-officedocument.wordprocessingml.document,.docx,image/*"
              onChange={handleFileChange}
              disabled={uploading || savingLegislation}
            />
            {uploading && <span className="text-sm text-muted-foreground">A carregar…</span>}
          </div>
          {uploadError && (
            <div className="text-sm text-destructive">{uploadError}</div>
          )}
          <IGRPInputText name="documentUrl" label="URL (gerado)" readOnly />
        </div>

        <IGRPTextarea name="description" label="Resumo/Descrição" rows={3} className="md:col-span-2" />

        <div className="flex items-center gap-2 md:col-span-2">
          <button
            type="submit"
            disabled={savingLegislation}
            aria-busy={savingLegislation}
            className="inline-flex items-center rounded border px-3 py-1.5 text-sm hover:bg-accent disabled:opacity-50"
          >
            {savingLegislation ? 'A guardar…' : 'Guardar Legislação'}
          </button>
          <button
            type="button"
            className="inline-flex items-center rounded border px-3 py-1.5 text-sm hover:bg-accent"
            onClick={onCancel}
          >
            Cancelar
          </button>
        </div>
      </IGRPForm>
    </div>
  );
}
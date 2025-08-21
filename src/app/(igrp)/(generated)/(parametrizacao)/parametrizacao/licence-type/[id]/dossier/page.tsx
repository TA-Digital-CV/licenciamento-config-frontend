'use client'

/* THIS FILE WAS GENERATED AUTOMATICALLY BY iGRP STUDIO. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useRef, useState, use } from 'react';
import Link from 'next/link';
import { IGRPForm, IGRPInputNumber, IGRPSelect, IGRPSwitch, IGRPTextarea, useIGRPToast, IGRPInputText } from '@igrp/igrp-framework-react-design-system';
import LegislationFilters from '@/components/dossier/LegislationFilters';
import LegislationList from '@/components/dossier/LegislationList';
import LegislationForm from '@/components/dossier/LegislationForm';
import GeneralForm from '@/components/dossier/GeneralForm';
import { z } from 'zod';
import EntityList from '@/components/dossier/EntityList';
import EntityForm from '@/components/dossier/EntityForm';
import ProcessTypeList from '@/components/dossier/ProcessTypeList';
import ProcessTypeForm from '@/components/dossier/ProcessTypeForm';
import FeeList from '@/components/dossier/FeeList';
import FeeForm from '@/components/dossier/FeeForm';

const TABS = [
  { id: 'general', label: 'Dados Gerais' },
  { id: 'legislation', label: 'Legislações' },
  { id: 'entities', label: 'Entidades' },
  { id: 'process-types', label: 'Associação Tipos de Processo' },
  { id: 'fees', label: 'Taxas' },
] as const;

type TabId = typeof TABS[number]['id'];

const generalSchema = z.object({
  licensingModel: z.string().optional().default(''),
  validityValue: z.coerce.number().int().min(0, 'Valor inválido').optional(),
  validityUnit: z.string().optional().default(''),
  allowRenewal: z.boolean().default(false),
  renewalDays: z.coerce.number().int().min(0, 'Valor inválido').optional(),
  notes: z.string().optional().default(''),
});

const legislationSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Nome é obrigatório'),
  legislationType: z.string().min(1, 'Tipo é obrigatório'),
  publicationDate: z.string().min(1, 'Data de publicação é obrigatória'),
  republicBulletin: z.string().optional(),
  description: z.string().optional(),
  documentUrl: z.string().url('URL inválida').optional().or(z.literal('')),
  status: z.string().default('ACTIVE'),
});

// Schema: Entidades
const entitySchema = z.object({
  id: z.string().optional(),
  entityType: z.string().min(1, 'Tipo de Entidade é obrigatório'),
  name: z.string().min(1, 'Nome é obrigatório'),
  notes: z.string().optional().default(''),
  active: z.boolean().default(true),
});

// Schema: Associação Tipos de Processo
const processAssocSchema = z.object({
  id: z.string().optional(),
  processType: z.string().min(1, 'Tipo de Processo é obrigatório'),
  notes: z.string().optional().default(''),
  active: z.boolean().default(true),
});

// Schema: Taxas
const feeSchema = z.object({
  id: z.string().optional(),
  feeType: z.string().min(1, 'Tipo de Taxa é obrigatório'),
  amount: z.coerce.number().min(0, 'Valor inválido'),
  notes: z.string().optional().default(''),
  active: z.boolean().default(true),
});

export default function PageDossierLicenceTypeComponent({ params } : { params: Promise<{ id: string }> } ) {
  const { id } = use(params);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [licenceType, setLicenceType] = useState<any>(null);
  const [hasDossier, setHasDossier] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>('general');
  const { igrpToast } = useIGRPToast();

  // Options for selects (from Options API)
  const [validityUnitOptions, setValidityUnitOptions] = useState<{ value: string; label: string }[]>([]);
  const [licensingModelOptions, setLicensingModelOptions] = useState<{ value: string; label: string }[]>([]);
  const [legislationTypeOptions, setLegislationTypeOptions] = useState<{ value: string; label: string }[]>([]);
  const [legislationStatusOptions, setLegislationStatusOptions] = useState<{ value: string; label: string }[]>([]);
  const [entityTypeOptions, setEntityTypeOptions] = useState<{ value: string; label: string }[]>([]);
  const [processTypeOptions, setProcessTypeOptions] = useState<{ value: string; label: string }[]>([]);
  const [feeTypeOptions, setFeeTypeOptions] = useState<{ value: string; label: string }[]>([]);

  // Estados: Legislações
  const [legislations, setLegislations] = useState<any[]>([]);
  const [legSearch, setLegSearch] = useState('');
  const [legTypeFilter, setLegTypeFilter] = useState('');
  const [legStatusFilter, setLegStatusFilter] = useState('');
  const [legStartDate, setLegStartDate] = useState('');
  const [legEndDate, setLegEndDate] = useState('');
  const [editingIndex, setEditingIndex] = useState<number>(-1);
  const [editingInitial, setEditingInitial] = useState<any | null>(null);
  const [savingLegislation, setSavingLegislation] = useState(false);

  // Estados: Entidades
  const [entities, setEntities] = useState<any[]>([]);
  const [entityEditingIndex, setEntityEditingIndex] = useState<number>(-1);
  const [entityEditingInitial, setEntityEditingInitial] = useState<any | null>(null);
  const [savingEntity, setSavingEntity] = useState(false);
  const [processTypes, setProcessTypes] = useState<any[]>([]);
  const [fees, setFees] = useState<any[]>([]);
  // Estados: Associações de Tipos de Processo
  const [processEditingIndex, setProcessEditingIndex] = useState<number>(-1);
  const [processEditingInitial, setProcessEditingInitial] = useState<any | null>(null);
  const [savingProcess, setSavingProcess] = useState(false);
  // Estados: Taxas
  const [feeEditingIndex, setFeeEditingIndex] = useState<number>(-1);
  const [feeEditingInitial, setFeeEditingInitial] = useState<any | null>(null);
  const [savingFee, setSavingFee] = useState(false);

  const filteredLegislations = legislations.filter((l) => {
    const nameMatch = !legSearch || (l?.name || '').toLowerCase().includes(legSearch.toLowerCase());
    const typeMatch = !legTypeFilter || l?.legislationType === legTypeFilter;
    const statusMatch = !legStatusFilter || (l?.status || '') === legStatusFilter;
    const date = l?.publicationDate || '';
    const startOk = !legStartDate || (date && date >= legStartDate);
    const endOk = !legEndDate || (date && date <= legEndDate);
    return nameMatch && typeMatch && statusMatch && startOk && endOk;
  });

  // General tab form
  const formRef = useRef<any | null>(null);
  const [initialGeneral, setInitialGeneral] = useState<any>({
    licensingModel: '',
    validityValue: undefined,
    validityUnit: '',
    allowRenewal: false,
    renewalDays: undefined,
    notes: '',
  });
  const [submittingGeneral, setSubmittingGeneral] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const res = await fetch(`/api/licence-types/${id}`);
        if (!res.ok) throw new Error('Falha ao carregar tipo de licença');
        const data = await res.json();
        if (mounted) {
          setLicenceType(data);
          setHasDossier(Boolean(data.metadata?.hasDossier));
          const general = data?.metadata?.dossier?.general || {};
          setInitialGeneral({
            licensingModel: general.licensingModel || '',
            validityValue: general.validityValue ?? undefined,
            validityUnit: general.validityUnit || '',
            allowRenewal: general.allowRenewal === true,
            renewalDays: general.renewalDays ?? undefined,
            notes: general.notes || '',
          });
          const leg = Array.isArray(data?.metadata?.dossier?.legislations) ? data.metadata.dossier.legislations : [];
          setLegislations(leg);
          const ents = Array.isArray(data?.metadata?.dossier?.entities) ? data.metadata.dossier.entities : [];
          setEntities(ents);
          const procs = Array.isArray(data?.metadata?.dossier?.processTypes) ? data.metadata.dossier.processTypes : [];
          setProcessTypes(procs);
          const fs = Array.isArray(data?.metadata?.dossier?.fees) ? data.metadata.dossier.fees : [];
          setFees(fs);
        }
      } catch (e: any) {
        console.error(e);
        igrpToast({ title: 'Erro', description: e?.message || 'Falha ao carregar tipo de licença', type: 'default' });
      } finally {
        setLoading(false);
      }
    }
    load();
    return () => { mounted = false };
  }, [id]);

  useEffect(() => {
    const controller = new AbortController();
    async function loadOptions() {
      try {
        const res = await fetch(`/api/options?codes=VALIDITY_UNIT,LICENSING_MODEL,TPLEG,LEGISLATION_STATUS,ENTITY_TYPE,PROCESS_TYPE,FEE_TYPE`, { signal: controller.signal });
        if (!res.ok) throw new Error('Falha ao carregar opções');
        const data = await res.json();
        const sets = data?.optionSets || {};
        const validity = (sets?.VALIDITY_UNIT?.items || []).map((it: any) => ({ value: it.key, label: it.value }));
        const models = (sets?.LICENSING_MODEL?.items || []).map((it: any) => ({ value: it.key, label: it.value }));
        const legTypes = (sets?.TPLEG?.items || []).map((it: any) => ({ value: it.key, label: it.value }));
        const legStatus = (sets?.LEGISLATION_STATUS?.items || []).map((it: any) => ({ value: it.key, label: it.value }));
        const entityTypes = (sets?.ENTITY_TYPE?.items || []).map((it: any) => ({ value: it.key, label: it.value }));
        const processTypes = (sets?.PROCESS_TYPE?.items || []).map((it: any) => ({ value: it.key, label: it.value }));
        const feeTypes = (sets?.FEE_TYPE?.items || []).map((it: any) => ({ value: it.key, label: it.value }));
        setValidityUnitOptions(validity);
        setLicensingModelOptions(models);
        setLegislationTypeOptions(legTypes);
        setLegislationStatusOptions(legStatus);
        setEntityTypeOptions(entityTypes);
        setProcessTypeOptions(processTypes);
        setFeeTypeOptions(feeTypes);
      } catch (_) {}
    }
    loadOptions();
    return () => controller.abort();
  }, []);

  const handleToggleDossier = async (enabled: boolean) => {
    setSaving(true);
    try {
      const metadata = {
        ...licenceType?.metadata,
        hasDossier: enabled,
      };

      const payload = {
        ...licenceType,
        metadata,
      };

      const res = await fetch(`/api/licence-types/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Falha ao atualizar dossier');

      setHasDossier(enabled);
      setLicenceType((prev: any) => ({ ...prev, metadata }));
      igrpToast({
        title: 'Sucesso',
        description: `Dossier ${enabled ? 'ativado' : 'desativado'} com sucesso`,
        type: 'default',
      });
    } catch (e: any) {
      console.error(e);
      igrpToast({ title: 'Erro', description: e?.message || 'Erro ao atualizar dossier', type: 'default' });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveGeneral = async (values: z.infer<typeof generalSchema>) => {
    setSubmittingGeneral(true);
    try {
      const newGeneral = {
        licensingModel: values.licensingModel || '',
        validityValue: values.validityValue ?? undefined,
        validityUnit: values.validityUnit || '',
        allowRenewal: values.allowRenewal === true,
        renewalDays: values.renewalDays ?? undefined,
        notes: values.notes || '',
      };

      const newMetadata = {
        ...(licenceType?.metadata || {}),
        hasDossier: true,
        dossier: {
          ...(licenceType?.metadata?.dossier || {}),
          general: newGeneral,
        },
      };

      const res = await fetch(`/api/licence-types/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...licenceType, metadata: newMetadata }),
      });
      if (!res.ok) throw new Error('Falha ao guardar Dados Gerais');

      setLicenceType((prev: any) => ({ ...prev, metadata: newMetadata }));
      igrpToast({ title: 'Sucesso', description: 'Dados Gerais guardados com sucesso', type: 'default' });
    } catch (e: any) {
      console.error(e);
      igrpToast({ title: 'Erro', description: e?.message || 'Erro ao guardar Dados Gerais', type: 'default' });
    } finally {
      setSubmittingGeneral(false);
    }
  };

  // Handlers de Legislação
  const handleSaveLegislation = async (values: z.infer<typeof legislationSchema>) => {
    setSavingLegislation(true);
    try {
      const item = {
        id: values.id || undefined,
        name: values.name,
        legislationType: values.legislationType,
        publicationDate: values.publicationDate,
        republicBulletin: values.republicBulletin || '',
        description: values.description || '',
        documentUrl: values.documentUrl || '',
        status: values.status || 'ACTIVE',
      };

      const nextLegs = [...legislations];
      if (editingIndex >= 0) {
        nextLegs[editingIndex] = { ...nextLegs[editingIndex], ...item };
      } else {
        nextLegs.push({ ...item, id: item.id || String(Date.now()) });
      }

      const newMetadata = {
        ...(licenceType?.metadata || {}),
        hasDossier: true,
        dossier: {
          ...(licenceType?.metadata?.dossier || {}),
          general: {
            ...(licenceType?.metadata?.dossier?.general || {}),
          },
          legislations: nextLegs,
        },
      };

      const res = await fetch(`/api/licence-types/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...licenceType, metadata: newMetadata }),
      });
      if (!res.ok) throw new Error('Falha ao guardar Legislação');

      setLicenceType((prev: any) => ({ ...prev, metadata: newMetadata }));
      setLegislations(nextLegs);
      setEditingIndex(-1);
      setEditingInitial(null);
      igrpToast({ title: 'Sucesso', description: 'Legislação guardada com sucesso', type: 'default' });
    } catch (e: any) {
      console.error(e);
      igrpToast({ title: 'Erro', description: e?.message || 'Erro ao guardar Legislação', type: 'default' });
    } finally {
      setSavingLegislation(false);
    }
  };

  const handleDeleteLegislation = async (originalIndex: number) => {
    if (originalIndex < 0) return;
    setSavingLegislation(true);
    try {
      const nextLegs = legislations.filter((_, idx) => idx !== originalIndex);

      const newMetadata = {
        ...(licenceType?.metadata || {}),
        hasDossier: true,
        dossier: {
          ...(licenceType?.metadata?.dossier || {}),
          general: {
            ...(licenceType?.metadata?.dossier?.general || {}),
          },
          legislations: nextLegs,
        },
      };

      const res = await fetch(`/api/licence-types/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...licenceType, metadata: newMetadata }),
      });
      if (!res.ok) throw new Error('Falha ao remover Legislação');

      setLicenceType((prev: any) => ({ ...prev, metadata: newMetadata }));
      setLegislations(nextLegs);
      igrpToast({ title: 'Sucesso', description: 'Legislação removida com sucesso', type: 'default' });
    } catch (e: any) {
      console.error(e);
      igrpToast({ title: 'Erro', description: e?.message || 'Erro ao remover Legislação', type: 'default' });
    } finally {
      setSavingLegislation(false);
    }
  };

  // Helpers de label
  const labelForEntityType = (value: string) => {
    const opt = entityTypeOptions.find((o) => o.value === value);
    return opt?.label || value || '';
  };
  const labelForProcessType = (value: string) => {
    const opt = processTypeOptions.find((o) => o.value === value);
    return opt?.label || value || '';
  };
  const labelForFeeType = (value: string) => {
    const opt = feeTypeOptions.find((o) => o.value === value);
    return opt?.label || value || '';
  };

  // Handlers: Entidades
  const handleSaveEntity = async (values: z.infer<typeof entitySchema>) => {
    setSavingEntity(true);
    try {
      const item = {
        id: values.id || undefined,
        entityType: values.entityType,
        name: values.name,
        notes: values.notes || '',
        active: values.active === true,
      };

      const next = [...entities];
      if (entityEditingIndex >= 0) {
        next[entityEditingIndex] = { ...next[entityEditingIndex], ...item };
      } else {
        next.push({ ...item, id: item.id || String(Date.now()) });
      }

      const newMetadata = {
        ...(licenceType?.metadata || {}),
        hasDossier: true,
        dossier: {
          ...(licenceType?.metadata?.dossier || {}),
          entities: next,
        },
      };

      const res = await fetch(`/api/licence-types/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...licenceType, metadata: newMetadata }),
      });
      if (!res.ok) throw new Error('Falha ao guardar Entidade');

      setLicenceType((prev: any) => ({ ...prev, metadata: newMetadata }));
      setEntities(next);
      setEntityEditingIndex(-1);
      setEntityEditingInitial(null);
      igrpToast({ title: 'Sucesso', description: 'Entidade guardada com sucesso', type: 'default' });
    } catch (e: any) {
      console.error(e);
      igrpToast({ title: 'Erro', description: e?.message || 'Erro ao guardar Entidade', type: 'default' });
    } finally {
      setSavingEntity(false);
    }
  };

  const handleDeleteEntity = async (originalIndex: number) => {
    if (originalIndex < 0) return;
    setSavingEntity(true);
    try {
      const next = entities.filter((_, idx) => idx !== originalIndex);

      const newMetadata = {
        ...(licenceType?.metadata || {}),
        hasDossier: true,
        dossier: {
          ...(licenceType?.metadata?.dossier || {}),
          entities: next,
        },
      };

      const res = await fetch(`/api/licence-types/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...licenceType, metadata: newMetadata }),
      });
      if (!res.ok) throw new Error('Falha ao remover Entidade');

      setLicenceType((prev: any) => ({ ...prev, metadata: newMetadata }));
      setEntities(next);
      igrpToast({ title: 'Sucesso', description: 'Entidade removida com sucesso', type: 'default' });
    } catch (e: any) {
      console.error(e);
      igrpToast({ title: 'Erro', description: e?.message || 'Erro ao remover Entidade', type: 'default' });
    } finally {
      setSavingEntity(false);
    }
  };

  // Handlers: Tipos de Processo
  const handleSaveProcessType = async (values: z.infer<typeof processAssocSchema>) => {
    setSavingProcess(true);
    try {
      const item = {
        id: values.id || undefined,
        processType: values.processType,
        notes: values.notes || '',
        active: values.active === true,
      };

      const next = [...processTypes];
      if (processEditingIndex >= 0) {
        next[processEditingIndex] = { ...next[processEditingIndex], ...item };
      } else {
        next.push({ ...item, id: item.id || String(Date.now()) });
      }

      const newMetadata = {
        ...(licenceType?.metadata || {}),
        hasDossier: true,
        dossier: {
          ...(licenceType?.metadata?.dossier || {}),
          processTypes: next,
          // manter outras secções
          entities: [...entities],
          legislations: [...legislations],
          fees: [...fees],
        },
      };

      const res = await fetch(`/api/licence-types/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...licenceType, metadata: newMetadata }),
      });
      if (!res.ok) throw new Error('Falha ao guardar Associação de Tipo de Processo');

      setLicenceType((prev: any) => ({ ...prev, metadata: newMetadata }));
      setProcessTypes(next);
      setProcessEditingIndex(-1);
      setProcessEditingInitial(null);
      igrpToast({ title: 'Sucesso', description: 'Associação guardada com sucesso', type: 'default' });
    } catch (e: any) {
      console.error(e);
      igrpToast({ title: 'Erro', description: e?.message || 'Erro ao guardar Associação', type: 'default' });
    } finally {
      setSavingProcess(false);
    }
  };

  const handleDeleteProcessType = async (originalIndex: number) => {
    if (originalIndex < 0) return;
    setSavingProcess(true);
    try {
      const next = processTypes.filter((_, idx) => idx !== originalIndex);

      const newMetadata = {
        ...(licenceType?.metadata || {}),
        hasDossier: true,
        dossier: {
          ...(licenceType?.metadata?.dossier || {}),
          processTypes: next,
          entities: [...entities],
          legislations: [...legislations],
          fees: [...fees],
        },
      };

      const res = await fetch(`/api/licence-types/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...licenceType, metadata: newMetadata }),
      });
      if (!res.ok) throw new Error('Falha ao remover Associação');

      setLicenceType((prev: any) => ({ ...prev, metadata: newMetadata }));
      setProcessTypes(next);
      igrpToast({ title: 'Sucesso', description: 'Associação removida com sucesso', type: 'default' });
    } catch (e: any) {
      console.error(e);
      igrpToast({ title: 'Erro', description: e?.message || 'Erro ao remover Associação', type: 'default' });
    } finally {
      setSavingProcess(false);
    }
  };

  // Handlers: Taxas
  const handleSaveFee = async (values: z.infer<typeof feeSchema>) => {
    setSavingFee(true);
    try {
      const item = {
        id: values.id || undefined,
        feeType: values.feeType,
        amount: values.amount,
        notes: values.notes || '',
        active: values.active === true,
      };

      const next = [...fees];
      if (feeEditingIndex >= 0) {
        next[feeEditingIndex] = { ...next[feeEditingIndex], ...item };
      } else {
        next.push({ ...item, id: item.id || String(Date.now()) });
      }

      const newMetadata = {
        ...(licenceType?.metadata || {}),
        hasDossier: true,
        dossier: {
          ...(licenceType?.metadata?.dossier || {}),
          fees: next,
          entities: [...entities],
          legislations: [...legislations],
          processTypes: [...processTypes],
        },
      };

      const res = await fetch(`/api/licence-types/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...licenceType, metadata: newMetadata }),
      });
      if (!res.ok) throw new Error('Falha ao guardar Taxa');

      setLicenceType((prev: any) => ({ ...prev, metadata: newMetadata }));
      setFees(next);
      setFeeEditingIndex(-1);
      setFeeEditingInitial(null);
      igrpToast({ title: 'Sucesso', description: 'Taxa guardada com sucesso', type: 'default' });
    } catch (e: any) {
      console.error(e);
      igrpToast({ title: 'Erro', description: e?.message || 'Erro ao guardar Taxa', type: 'default' });
    } finally {
      setSavingFee(false);
    }
  };

  const handleDeleteFee = async (originalIndex: number) => {
    if (originalIndex < 0) return;
    setSavingFee(true);
    try {
      const next = fees.filter((_, idx) => idx !== originalIndex);

      const newMetadata = {
        ...(licenceType?.metadata || {}),
        hasDossier: true,
        dossier: {
          ...(licenceType?.metadata?.dossier || {}),
          fees: next,
          entities: [...entities],
          legislations: [...legislations],
          processTypes: [...processTypes],
        },
      };

      const res = await fetch(`/api/licence-types/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...licenceType, metadata: newMetadata }),
      });
      if (!res.ok) throw new Error('Falha ao remover Taxa');

      setLicenceType((prev: any) => ({ ...prev, metadata: newMetadata }));
      setFees(next);
      igrpToast({ title: 'Sucesso', description: 'Taxa removida com sucesso', type: 'default' });
    } catch (e: any) {
      console.error(e);
      igrpToast({ title: 'Erro', description: e?.message || 'Erro ao remover Taxa', type: 'default' });
    } finally {
      setSavingFee(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4">
        <div className="text-sm text-muted-foreground">A carregar...</div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link
            href="/parametrizacao"
            className="inline-flex items-center rounded border px-2 py-1 text-sm hover:bg-accent"
          >
            ← Voltar
          </Link>
          <h1 className="text-xl font-semibold">Dossier - {licenceType?.name}</h1>
        </div>
      </div>

      <div className="space-y-6">
        {/* Informações do Tipo de Licença */}
        <div className="rounded-lg border border-border bg-card p-4">
          <h2 className="text-base font-semibold mb-3">Informações do Tipo de Licença</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Nome:</span> {licenceType?.name}
            </div>
            <div>
              <span className="font-medium">Código:</span> {licenceType?.code}
            </div>
            <div>
              <span className="font-medium">Categoria:</span> {licenceType?.categoryName || 'N/A'}
            </div>
            <div>
              <span className="font-medium">Status:</span>
              <span className={`ml-2 px-2 py-1 rounded text-xs ${
                licenceType?.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {licenceType?.active ? 'Ativo' : 'Inativo'}
              </span>
            </div>
          </div>
        </div>

        {/* Configuração do Dossier */}
        <div className="rounded-lg border border-border bg-card p-4">
          <h2 className="text-base font-semibold mb-3">Configuração do Dossier</h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Ativar Dossier</div>
                <div className="text-sm text-muted-foreground">
                  Ative esta opção para habilitar a gestão de dossier para este tipo de licença.
                </div>
              </div>
              <IGRPSwitch
                checked={hasDossier}
                onCheckedChange={handleToggleDossier}
                disabled={saving}
                name={''}
              />
            </div>

            {hasDossier ? (
              <div className="mt-4">
                {/* Tabs */}
                <div role="tablist" aria-label="Dossier - Tabs" className="border-b">
                  <div className="flex items-center gap-1">
                    {TABS.map((tab) => (
                      <button
                        key={tab.id}
                        role="tab"
                        aria-selected={activeTab === tab.id}
                        aria-controls={`panel-${tab.id}`}
                        id={`tab-${tab.id}`}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-3 py-2 text-sm border-b-2 -mb-px ${activeTab === tab.id ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                        type="button"
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Panels */}
                <div className="mt-4">
                  {/* Dados Gerais */}
                  <section
                    id="panel-general"
                    role="tabpanel"
                    aria-labelledby="tab-general"
                    hidden={activeTab !== 'general'}
                  >
                    <GeneralForm
                      id={id}
                      generalSchema={generalSchema}
                      defaultValues={initialGeneral}
                      licensingModelOptions={licensingModelOptions}
                      validityUnitOptions={validityUnitOptions}
                      submitting={submittingGeneral}
                      onSubmit={handleSaveGeneral}
                      formRef={formRef}
                    />
                  </section>

                  {/* Legislações */}
                  <section
                    id="panel-legislation"
                    role="tabpanel"
                    aria-labelledby="tab-legislation"
                    hidden={activeTab !== 'legislation'}
                  >
                    <div className="rounded-lg border border-border bg-card p-4">
                      <h3 className="text-base font-semibold mb-2">Legislações</h3>
                      <div className="mb-3 text-sm text-muted-foreground">Gestão de legislações associadas a este tipo de licença.</div>

                      {/* Filtros */}
                      <LegislationFilters
                        legSearch={legSearch}
                        setLegSearch={setLegSearch}
                        legTypeFilter={legTypeFilter}
                        setLegTypeFilter={setLegTypeFilter}
                        legStatusFilter={legStatusFilter}
                        setLegStatusFilter={setLegStatusFilter}
                        legStartDate={legStartDate}
                        setLegStartDate={setLegStartDate}
                        legEndDate={legEndDate}
                        setLegEndDate={setLegEndDate}
                        legislationTypeOptions={legislationTypeOptions}
                        legislationStatusOptions={legislationStatusOptions}
                        onNew={() => { setEditingIndex(-1); setEditingInitial({ name: '', legislationType: '', publicationDate: '', republicBulletin: '', description: '', documentUrl: '', status: 'ACTIVE' }); }}
                      />

                      {/* Lista */}
                      <LegislationList
                        filteredLegislations={filteredLegislations}
                        legislations={legislations}
                        legislationTypeOptions={legislationTypeOptions}
                        legislationStatusOptions={legislationStatusOptions}
                        onEdit={(originalIndex) => { setEditingIndex(originalIndex); setEditingInitial({ ...legislations[originalIndex] }); }}
                        onDelete={handleDeleteLegislation}
                      />

                      {/* Formulário de criação/edição */}
                      {editingInitial && (
                        <LegislationForm
                          id={id}
                          legislationSchema={legislationSchema}
                          editingInitial={editingInitial}
                          editingIndex={editingIndex}
                          legislationTypeOptions={legislationTypeOptions}
                          legislationStatusOptions={legislationStatusOptions}
                          savingLegislation={savingLegislation}
                          onSubmit={handleSaveLegislation}
                          onCancel={() => { setEditingIndex(-1); setEditingInitial(null); }}
                        />
                      )}
                    </div>
                  </section>

                  {/* Entidades */}
                  <section
                    id="panel-entities"
                    role="tabpanel"
                    aria-labelledby="tab-entities"
                    hidden={activeTab !== 'entities'}
                  >
                    <div className="rounded-lg border border-border bg-card p-4">
                      <h3 className="text-base font-semibold mb-2">Entidades</h3>
                      <div className="mb-3 text-sm text-muted-foreground">Gestão de entidades relacionadas a este tipo de licença.</div>

                      <div className="mb-3">
                        <button
                          type="button"
                          className="inline-flex items-center rounded border px-3 py-1.5 text-sm hover:bg-accent"
                          onClick={() => { setEntityEditingIndex(-1); setEntityEditingInitial({ entityType: '', name: '', notes: '', active: true }); }}
                        >
                          + Nova Entidade
                        </button>
                      </div>

                      {/* Lista de Entidades */}
                      <EntityList
                        entities={entities}
                        entityTypeOptions={entityTypeOptions}
                        onEdit={(idx) => { setEntityEditingIndex(idx); setEntityEditingInitial({ ...entities[idx] }); }}
                        onDelete={handleDeleteEntity}
                      />

                      {/* Formulário de criação/edição */}
                      {entityEditingInitial && (
                        <EntityForm
                          entitySchema={entitySchema}
                          editingInitial={entityEditingInitial}
                          editingIndex={entityEditingIndex}
                          entityTypeOptions={entityTypeOptions}
                          savingEntity={savingEntity}
                          onSubmit={handleSaveEntity}
                          onCancel={() => { setEntityEditingIndex(-1); setEntityEditingInitial(null); }}
                        />
                      )}
                    </div>
                  </section>

                  {/* Associação Tipos de Processo */}
                  <section
                    id="panel-process-types"
                    role="tabpanel"
                    aria-labelledby="tab-process-types"
                    hidden={activeTab !== 'process-types'}
                  >
                    <div className="rounded-lg border border-border bg-card p-4">
                      <h3 className="text-base font-semibold mb-2">Associação de Tipos de Processo</h3>
                      <div className="mb-3 text-sm text-muted-foreground">Associe tipos de processo a este tipo de licença.</div>

                      <div className="mb-3">
                        <button
                          type="button"
                          className="inline-flex items-center rounded border px-3 py-1.5 text-sm hover:bg-accent"
                          onClick={() => { setProcessEditingIndex(-1); setProcessEditingInitial({ processType: '', notes: '', active: true }); }}
                        >
                          + Associar Tipo de Processo
                        </button>
                      </div>

                      <ProcessTypeList
                        processTypes={processTypes}
                        processTypeOptions={processTypeOptions}
                        onEdit={(idx) => { setProcessEditingIndex(idx); setProcessEditingInitial({ ...processTypes[idx] }); }}
                        onDelete={handleDeleteProcessType}
                      />

                      {processEditingInitial && (
                        <ProcessTypeForm
                          processAssocSchema={processAssocSchema}
                          editingInitial={processEditingInitial}
                          editingIndex={processEditingIndex}
                          processTypeOptions={processTypeOptions}
                          savingProcess={savingProcess}
                          onSubmit={handleSaveProcessType}
                          onCancel={() => { setProcessEditingIndex(-1); setProcessEditingInitial(null); }}
                        />
                      )}
                    </div>
                  </section>

                  {/* Taxas */}
                  <section
                    id="panel-fees"
                    role="tabpanel"
                    aria-labelledby="tab-fees"
                    hidden={activeTab !== 'fees'}
                  >
                    <div className="rounded-lg border border-border bg-card p-4">
                      <h3 className="text-base font-semibold mb-2">Taxas</h3>
                      <div className="mb-3 text-sm text-muted-foreground">Configuração de taxas por tipo de processo.</div>

                      <div className="mb-3">
                        <button
                          type="button"
                          className="inline-flex items-center rounded border px-3 py-1.5 text-sm hover:bg-accent"
                          onClick={() => { setFeeEditingIndex(-1); setFeeEditingInitial({ feeType: '', amount: 0, notes: '', active: true }); }}
                        >
                          + Nova Taxa
                        </button>
                      </div>

                      <FeeList
                        fees={fees}
                        feeTypeOptions={feeTypeOptions}
                        onEdit={(idx) => { setFeeEditingIndex(idx); setFeeEditingInitial({ ...fees[idx] }); }}
                        onDelete={handleDeleteFee}
                      />

                      {feeEditingInitial && (
                        <FeeForm
                          feeSchema={feeSchema}
                          editingInitial={feeEditingInitial}
                          editingIndex={feeEditingIndex}
                          feeTypeOptions={feeTypeOptions}
                          savingFee={savingFee}
                          onSubmit={handleSaveFee}
                          onCancel={() => { setFeeEditingIndex(-1); setFeeEditingInitial(null); }}
                        />
                      )}
                    </div>
                  </section>
                </div>
              </div>
            ) : (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-700 mb-2">Dossier Desativado</h3>
                <p className="text-sm text-gray-600">
                  O dossier não está ativo para este tipo de licença. Ative a opção acima para habilitar a gestão de dossier.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
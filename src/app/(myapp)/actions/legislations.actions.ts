/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useIGRPToast } from '@igrp/igrp-framework-react-design-system';
import {
  LegislationResponseDTO,
  LegislationRequestDTO,
  WrapperListLegislationDTO,
} from '../types/legislations.types';

// Interfaces para dados de opções
interface SelectOption {
  value: string;
  label: string;
}

// Dados do formulário de legislação
export interface LegislationFormData {
  title: string;
  description?: string;
  legislationType: string;
  publicationDate: string;
  effectiveDate: string;
  expirationDate?: string;
  documentNumber: string;
  issuingAuthority: string;
  legalFramework?: string;
  scope: string;
  status: 'VIGENTE' | 'REVOGADA' | 'SUSPENSA' | 'EM_TRAMITACAO';
  priority: 'ALTA' | 'MEDIA' | 'BAIXA';
  documentUrl?: string;
  relatedLegislationIds?: string[];
  tags?: string[];
  metadata?: Record<string, unknown>;
}

// Estado para gerenciamento de legislações
export interface LegislationsState {
  loading: boolean;
  submitting: boolean;
  loadingOptions: boolean;
  legislationTypes: SelectOption[];
  statusOptions: SelectOption[];
  priorityOptions: SelectOption[];
  initialValues: LegislationFormData;
  legislations: LegislationResponseDTO[];
  pagination: {
    pageNumber: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
    last: boolean;
    first: boolean;
  };
}

// Hook personalizado para gerenciar legislações
export const useLegislationsActions = (id?: string) => {
  const router = useRouter();
  const { igrpToast } = useIGRPToast();

  // Valores padrão para o formulário
  const defaultValues: LegislationFormData = {
    title: '',
    description: '',
    legislationType: '',
    publicationDate: '',
    effectiveDate: '',
    expirationDate: '',
    documentNumber: '',
    issuingAuthority: '',
    legalFramework: '',
    scope: '',
    status: 'VIGENTE',
    priority: 'MEDIA',
    documentUrl: '',
    relatedLegislationIds: [],
    tags: [],
    metadata: {},
  };

  // Estado do componente
  const [state, setState] = useState<LegislationsState>({
    loading: false,
    submitting: false,
    loadingOptions: false,
    legislationTypes: [],
    statusOptions: [
      { value: 'VIGENTE', label: 'Vigente' },
      { value: 'REVOGADA', label: 'Revogada' },
      { value: 'SUSPENSA', label: 'Suspensa' },
      { value: 'EM_TRAMITACAO', label: 'Em Tramitação' },
    ],
    priorityOptions: [
      { value: 'ALTA', label: 'Alta' },
      { value: 'MEDIA', label: 'Média' },
      { value: 'BAIXA', label: 'Baixa' },
    ],
    initialValues: defaultValues,
    legislations: [],
    pagination: {
      pageNumber: 0,
      pageSize: 10,
      totalElements: 0,
      totalPages: 0,
      last: true,
      first: true,
    },
  });

  // Função para carregar legislações com paginação
  const loadLegislations = useCallback(
    async (params?: {
      pageNumber?: number;
      pageSize?: number;
      active?: boolean;
      title?: string;
      legislationType?: string;
      status?: string;
    }) => {
      console.log('🚀 LOADING LEGISLATIONS:', params);

      setState((prev) => ({ ...prev, loading: true }));

      try {
        const searchParams = new URLSearchParams();
        if (params?.pageNumber !== undefined) searchParams.set('pageNumber', params.pageNumber.toString());
        if (params?.pageSize !== undefined) searchParams.set('pageSize', params.pageSize.toString());
        if (params?.active !== undefined) searchParams.set('active', params.active.toString());
        if (params?.title) searchParams.set('title', params.title);
        if (params?.legislationType) searchParams.set('legislationType', params.legislationType);
        if (params?.status) searchParams.set('status', params.status);

        const response = await fetch(`/api/legislations?${searchParams.toString()}`);
        
        if (!response.ok) {
          throw new Error(`Erro ao carregar legislações: ${response.status}`);
        }

        const data: WrapperListLegislationDTO = await response.json();

        setState((prev) => ({
          ...prev,
          loading: false,
          legislations: data.content,
          pagination: {
            pageNumber: data.pageNumber,
            pageSize: data.pageSize,
            totalElements: data.totalElements,
            totalPages: data.totalPages,
            last: data.last,
            first: data.first,
          },
        }));

        console.log('✅ LEGISLATIONS LOADED:', data.content.length);
      } catch (error: unknown) {
        console.error('❌ Error loading legislations:', error);
        const message = error instanceof Error ? error.message : 'Falha ao carregar legislações';

        igrpToast({
          title: 'Erro',
          description: message,
          type: 'error',
        });

        setState((prev) => ({ ...prev, loading: false }));
      }
    },
    [igrpToast],
  );

  // Função para carregar legislação por ID
  const loadLegislationById = useCallback(
    async (legislationId: string) => {
      console.log('🚀 LOADING LEGISLATION:', legislationId);

      setState((prev) => ({ ...prev, loading: true }));

      try {
        const response = await fetch(`/api/legislations/${legislationId}`);
        
        if (!response.ok) {
          throw new Error(`Erro ao carregar legislação: ${response.status}`);
        }

        const data: LegislationResponseDTO = await response.json();

        setState((prev) => ({
          ...prev,
          loading: false,
          initialValues: {
            title: data.title || '',
            description: data.description || '',
            legislationType: data.legislationType || '',
            publicationDate: data.publicationDate || '',
            effectiveDate: data.effectiveDate || '',
            expirationDate: data.expirationDate || '',
            documentNumber: data.documentNumber || '',
            issuingAuthority: data.issuingAuthority || '',
            legalFramework: data.legalFramework || '',
            scope: data.scope || '',
            status: data.status || 'VIGENTE',
            priority: data.priority || 'MEDIA',
            documentUrl: data.documentUrl || '',
            relatedLegislationIds: data.relatedLegislationIds || [],
            tags: data.tags || [],
            metadata: data.metadata || {},
          },
        }));

        console.log('✅ LEGISLATION LOADED:', { id: legislationId, title: data.title });
      } catch (error: unknown) {
        console.error('❌ Error loading legislation:', error);
        const message = error instanceof Error ? error.message : 'Falha ao carregar legislação';

        igrpToast({
          title: 'Erro',
          description: message,
          type: 'error',
        });

        setState((prev) => ({ ...prev, loading: false }));
      }
    },
    [igrpToast],
  );

  // Função para validar dados do formulário
  const validateFormData = (values: unknown): LegislationFormData => {
    const data = values as LegislationFormData;
    
    if (!data.title?.trim()) {
      throw new Error('Título é obrigatório');
    }
    
    if (!data.legislationType?.trim()) {
      throw new Error('Tipo de legislação é obrigatório');
    }
    
    if (!data.publicationDate) {
      throw new Error('Data de publicação é obrigatória');
    }
    
    if (!data.effectiveDate) {
      throw new Error('Data de vigência é obrigatória');
    }
    
    if (!data.documentNumber?.trim()) {
      throw new Error('Número do documento é obrigatório');
    }
    
    if (!data.issuingAuthority?.trim()) {
      throw new Error('Autoridade emissora é obrigatória');
    }
    
    if (!data.scope?.trim()) {
      throw new Error('Âmbito é obrigatório');
    }

    return data;
  };

  // Função para criar nova legislação
  const createLegislation = async (values: LegislationFormData) => {
    console.log('🚀 CREATING LEGISLATION:', values.title);

    const response = await fetch('/api/legislations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Erro ao criar legislação: ${response.status}`);
    }

    const result = await response.json();
    console.log('✅ LEGISLATION CREATED:', { id: result.id, title: values.title });
    return result;
  };

  // Função para atualizar legislação existente
  const updateLegislation = async (legislationId: string, values: LegislationFormData) => {
    console.log('🚀 UPDATING LEGISLATION:', { id: legislationId, title: values.title });

    const response = await fetch(`/api/legislations/${legislationId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Erro ao atualizar legislação: ${response.status}`);
    }

    const result = await response.json();
    console.log('✅ LEGISLATION UPDATED:', { id: legislationId, title: values.title });
    return result;
  };

  // Função para deletar legislação
  const deleteLegislation = async (legislationId: string) => {
    console.log('🚀 DELETING LEGISLATION:', legislationId);

    const response = await fetch(`/api/legislations/${legislationId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Erro ao deletar legislação: ${response.status}`);
    }

    console.log('✅ LEGISLATION DELETED:', legislationId);
    return true;
  };

  // Função para alternar status da legislação
  const toggleLegislationStatus = async (legislationId: string, active: boolean) => {
    console.log('🚀 TOGGLING LEGISLATION STATUS:', { id: legislationId, active });

    const response = await fetch(`/api/legislations/${legislationId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ active }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Erro ao alterar status da legislação: ${response.status}`);
    }

    const result = await response.json();
    console.log('✅ LEGISLATION STATUS TOGGLED:', { id: legislationId, active });
    return result;
  };

  // Função principal para submeter o formulário
  const handleSubmit = async (values: unknown) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] 🚀 LEGISLATION FORM SUBMISSION STARTED`);
    console.log(`[${timestamp}] 📋 Form Analysis:`, {
      title: (values as any)?.title,
      legislationType: (values as any)?.legislationType,
      isEditing: Boolean(id),
      formId: id || 'NEW',
    });

    setState((prev) => ({ ...prev, submitting: true }));

    try {
      // Validar dados do formulário
      const validatedData = validateFormData(values);

      let result;

      // Criar ou atualizar conforme necessário
      if (!id) {
        result = await createLegislation(validatedData);
        igrpToast({
          title: 'Legislação criada',
          description: 'A legislação foi criada com sucesso.',
          type: 'success',
        });
      } else {
        result = await updateLegislation(id, validatedData);
        igrpToast({
          title: 'Legislação atualizada',
          description: 'A legislação foi atualizada com sucesso.',
          type: 'success',
        });
      }

      // Navegar para página de edição ou lista
      const targetId = result?.id || id;
      if (targetId) {
        router.push(`/dossier/legislations/${targetId}/editar`);
      } else {
        router.push('/dossier/legislations');
      }
    } catch (error: unknown) {
      console.error('❌ Error submitting legislation form:', error);
      const message = error instanceof Error ? error.message : 'Ocorreu um erro inesperado.';

      igrpToast({
        title: 'Erro',
        description: message,
        type: 'error',
      });
    } finally {
      setState((prev) => ({ ...prev, submitting: false }));
    }
  };

  // Função para resetar o estado
  const resetState = () => {
    setState({
      loading: false,
      submitting: false,
      loadingOptions: false,
      legislationTypes: [],
      statusOptions: [
        { value: 'VIGENTE', label: 'Vigente' },
        { value: 'REVOGADA', label: 'Revogada' },
        { value: 'SUSPENSA', label: 'Suspensa' },
        { value: 'EM_TRAMITACAO', label: 'Em Tramitação' },
      ],
      priorityOptions: [
        { value: 'ALTA', label: 'Alta' },
        { value: 'MEDIA', label: 'Média' },
        { value: 'BAIXA', label: 'Baixa' },
      ],
      initialValues: defaultValues,
      legislations: [],
      pagination: {
        pageNumber: 0,
        pageSize: 10,
        totalElements: 0,
        totalPages: 0,
        last: true,
        first: true,
      },
    });
  };

  // Efeito para carregar dados iniciais
  useEffect(() => {
    if (id) {
      loadLegislationById(id);
    }
  }, [id, loadLegislationById]);

  return {
    // Estado
    ...state,
    defaultValues,
    isEditing: Boolean(id),
    actionsDisabled: state.loading || state.submitting || state.loadingOptions,

    // Ações
    loadLegislations,
    loadLegislationById,
    createLegislation,
    updateLegislation,
    deleteLegislation,
    toggleLegislationStatus,
    handleSubmit,
    resetState,

    // Utilitários
    validateFormData,
  };
};

// Action creators para uso direto (sem hook)
export const legislationsActions = {
  async loadLegislations(params?: {
    pageNumber?: number;
    pageSize?: number;
    active?: boolean;
    title?: string;
    legislationType?: string;
    status?: string;
  }) {
    const searchParams = new URLSearchParams();
    if (params?.pageNumber !== undefined) searchParams.set('pageNumber', params.pageNumber.toString());
    if (params?.pageSize !== undefined) searchParams.set('pageSize', params.pageSize.toString());
    if (params?.active !== undefined) searchParams.set('active', params.active.toString());
    if (params?.title) searchParams.set('title', params.title);
    if (params?.legislationType) searchParams.set('legislationType', params.legislationType);
    if (params?.status) searchParams.set('status', params.status);

    const response = await fetch(`/api/legislations?${searchParams.toString()}`);
    
    if (!response.ok) {
      throw new Error(`Erro ao carregar legislações: ${response.status}`);
    }

    return response.json();
  },

  async loadLegislationById(id: string) {
    const response = await fetch(`/api/legislations/${id}`);
    
    if (!response.ok) {
      throw new Error(`Erro ao carregar legislação: ${response.status}`);
    }

    return response.json();
  },

  async createLegislation(data: LegislationFormData) {
    const response = await fetch('/api/legislations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Erro ao criar legislação: ${response.status}`);
    }

    return response.json();
  },

  async updateLegislation(id: string, data: LegislationFormData) {
    const response = await fetch(`/api/legislations/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Erro ao atualizar legislação: ${response.status}`);
    }

    return response.json();
  },

  async deleteLegislation(id: string) {
    const response = await fetch(`/api/legislations/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Erro ao deletar legislação: ${response.status}`);
    }

    return true;
  },

  async toggleLegislationStatus(id: string, active: boolean) {
    const response = await fetch(`/api/legislations/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ active }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Erro ao alterar status da legislação: ${response.status}`);
    }

    return response.json();
  },
};
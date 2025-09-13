/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useIGRPToast } from '@igrp/igrp-framework-react-design-system';
import {
  loadLicenseProcessTypeById,
  createLicenseProcessType,
  updateLicenseProcessType,
  deleteLicenseProcessType,
  activateLicenseProcessType,
  deactivateLicenseProcessType,
} from '../functions/api.functions';
import { LicenseProcessTypeFormData, validateLicenseProcessTypeForm, parseMetadata } from '../functions/validation.functions';
import { LicenseProcessTypeRequestDTO } from '@/app/(myapp)/types/license-process-types.types';

// Interfaces para dados de opções
export interface SelectOption {
  value: string;
  label: string;
}

// Função para fazer parse seguro do metadata
const parseMetadataSafely = (metadata: string): Record<string, unknown> | undefined => {
  try {
    const parsed = parseMetadata(metadata);
    return parsed && typeof parsed === 'object' ? parsed as Record<string, unknown> : undefined;
  } catch {
    return undefined;
  }
};

// Função para transformar dados do formulário para API
const transformFormDataToAPI = (formData: LicenseProcessTypeFormData): LicenseProcessTypeRequestDTO => {
  return {
    licenseTypeId: formData.licenseTypeId,
    processName: formData.name,
    processCode: formData.code,
    description: formData.description || '',
    processCategory: (formData.processType as 'INICIAL' | 'RENOVACAO' | 'ALTERACAO' | 'TRANSFERENCIA' | 'CANCELAMENTO' | 'SUSPENSAO') || 'INICIAL',
    requiredDocuments: formData.requiredDocuments || [],
    estimatedDuration: formData.estimatedDays || 30,
    durationUnit: 'DIAS',
    maxProcessingDays: (formData.estimatedDays || 30) * 2,
    requiresInspection: false,
    requiresPublicConsultation: false,
    requiresEnvironmentalLicense: false,
    automaticApproval: false,
    priority: 'MEDIA',
    legalFramework: '',
    processFlow: formData.metadata ? parseMetadataSafely(formData.metadata) : undefined,
    validityPeriod: undefined,
    validityUnit: undefined,
    renewable: true,
    maxRenewals: undefined,
    metadata: formData.metadata ? parseMetadataSafely(formData.metadata) : undefined,
  };
};

// Estado para gerenciamento de license process types
export interface LicenseProcessTypesState {
  loading: boolean;
  submitting: boolean;
  loadingOptions: boolean;
  categories: SelectOption[];
  validityUnits: SelectOption[];
  error: string | null;
}

// Hook personalizado para gerenciar license process types
export const useLicenseProcessTypesActions = (id?: string) => {
  const router = useRouter();
  const { igrpToast } = useIGRPToast();

  // Valores padrão para o formulário
  const defaultValues: LicenseProcessTypeFormData = {
    name: '',
    code: '',
    description: '',
    licenseTypeId: '',
    processType: 'INICIAL',
    requiredDocuments: [],
    estimatedDays: undefined,
    fee: undefined,
    active: true,
    sortOrder: undefined,
    metadata: '',
  };

  // Estado inicial
  const [state, setState] = useState<LicenseProcessTypesState>({
    loading: false,
    submitting: false,
    loadingOptions: false,
    categories: [],
    validityUnits: [],
    error: null,
  });

  // Função para exibir erro
  const showError = useCallback((error: unknown, defaultMessage: string) => {
    const message =
      error instanceof Error ? error.message : defaultMessage;

    igrpToast({
      title: 'Erro',
      description: message,
      type: 'error',
    });
  }, [igrpToast]);



  // Função para carregar unidades de validade
  const loadValidityUnits = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, loadingOptions: true }));
      
      // Simulando opções de unidade de validade
      const validityUnits = [
        { value: 'DAY', label: 'Dia(s)' },
        { value: 'WEEK', label: 'Semana(s)' },
        { value: 'MONTH', label: 'Mês(es)' },
        { value: 'YEAR', label: 'Ano(s)' },
      ];

      setState((prev) => ({
        ...prev,
        validityUnits,
        loadingOptions: false,
      }));
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Falha ao carregar unidades de validade';

      igrpToast({
        title: 'Erro',
        description: message,
        type: 'error',
      });

      setState((prev) => ({
        ...prev,
        loadingOptions: false,
        error: message,
      }));
    }
  }, [igrpToast]);

  // Função para carregar dados do tipo de processo por ID
  const loadLicenseProcessType = useCallback(
    async (licenseProcessTypeId: string) => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));
        
        const data = await loadLicenseProcessTypeById(licenseProcessTypeId);
        
        setState((prev) => ({ ...prev, loading: false }));
        return data;
      } catch (error: unknown) {
        const message =
          error instanceof Error ? error.message : 'Falha ao carregar tipo de processo';

        setState((prev) => ({
          ...prev,
          loading: false,
          error: message,
        }));

        showError(error, 'Falha ao carregar tipo de processo');
        throw error;
      }
    },
    [showError]
  );

  // Função para transformar dados do formulário
  const transformFormData = (data: LicenseProcessTypeFormData): LicenseProcessTypeFormData => {
    return {
      ...data,
      name: data.name.trim(),
      code: data.code.trim().toUpperCase(),
      description: data.description || '',
      processType: data.processType || 'INICIAL',
      requiredDocuments: data.requiredDocuments || [],
      estimatedDays: data.estimatedDays || undefined,
      fee: data.fee || undefined,
      active: data.active !== undefined ? data.active : true,
      sortOrder: data.sortOrder || undefined,
      metadata: data.metadata || '',
    };
  };

  // Função para validar dados do formulário
  const validateFormData = (values: unknown): LicenseProcessTypeFormData => {
    try {
      return validateLicenseProcessTypeForm(values);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Erro desconhecido';
      throw new Error('Dados do formulário inválidos: ' + message);
    }
  };

  // Função para criar novo tipo de processo
  const createNewLicenseProcessType = async (values: LicenseProcessTypeFormData) => {
    console.log('🚀 CREATING LICENSE PROCESS TYPE:', values.name);

    const transformedData = transformFormDataToAPI(values);
    const result = await createLicenseProcessType(transformedData);

    console.log('✅ LICENSE PROCESS TYPE CREATED:', { id: result.id, name: values.name });
    return result;
  };

  // Função para atualizar tipo de processo existente
  const updateExistingLicenseProcessType = async (licenseProcessTypeId: string, values: LicenseProcessTypeFormData) => {
    console.log('🚀 UPDATING LICENSE PROCESS TYPE:', { id: licenseProcessTypeId, name: values.name });

    const transformedData = transformFormDataToAPI(values);
    const result = await updateLicenseProcessType(licenseProcessTypeId, transformedData);

    console.log('✅ LICENSE PROCESS TYPE UPDATED:', { id: licenseProcessTypeId, name: values.name });
    return result;
  };

  // Função principal para submeter o formulário
  const handleSubmit = async (values: unknown) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] 🚀 LICENSE PROCESS TYPE FORM SUBMISSION STARTED`);
    console.log(`[${timestamp}] 📋 Form Analysis:`, {
      name: (values as any)?.name,
      code: (values as any)?.code,
      isEditing: Boolean(id),
      formId: id || 'NEW',
    });

    setState((prev) => ({ ...prev, submitting: true }));

    try {
      // Validar dados do formulário
      const validatedData = validateFormData(values);
      const transformedData = transformFormData(validatedData);

      let result;
      if (id) {
        // Atualizar tipo de processo existente
        result = await updateExistingLicenseProcessType(id, transformedData);
      } else {
        // Criar novo tipo de processo
        result = await createNewLicenseProcessType(transformedData);
      }

      // Sucesso
      igrpToast({
        title: 'Sucesso',
        description: id
          ? 'Tipo de processo atualizado com sucesso!'
          : 'Tipo de processo criado com sucesso!',
        type: 'success',
      });

      // Redirecionar após sucesso
      router.push('/license-process-types');
      return result;
    } catch (error: unknown) {
      console.error('❌ Error submitting license process type form:', error);
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

  // Função para deletar tipo de processo
  const handleDelete = async (licenseProcessTypeId: string) => {
    try {
      setState((prev) => ({ ...prev, submitting: true }));
      
      await deleteLicenseProcessType(licenseProcessTypeId);
      
      igrpToast({
        title: 'Sucesso',
        description: 'Tipo de processo deletado com sucesso!',
        type: 'success',
      });
      
      router.push('/license-process-types');
    } catch (error: unknown) {
      showError(error, 'Falha ao deletar tipo de processo');
    } finally {
      setState((prev) => ({ ...prev, submitting: false }));
    }
  };

  // Função para ativar tipo de processo
  const handleActivate = async (licenseProcessTypeId: string) => {
    try {
      setState((prev) => ({ ...prev, submitting: true }));
      
      await activateLicenseProcessType(licenseProcessTypeId);
      
      igrpToast({
        title: 'Sucesso',
        description: 'Tipo de processo ativado com sucesso!',
        type: 'success',
      });
    } catch (error: unknown) {
      showError(error, 'Falha ao ativar tipo de processo');
    } finally {
      setState((prev) => ({ ...prev, submitting: false }));
    }
  };

  // Função para desativar tipo de processo
  const handleDeactivate = async (licenseProcessTypeId: string) => {
    try {
      setState((prev) => ({ ...prev, submitting: true }));
      
      await deactivateLicenseProcessType(licenseProcessTypeId);
      
      igrpToast({
        title: 'Sucesso',
        description: 'Tipo de processo desativado com sucesso!',
        type: 'success',
      });
    } catch (error: unknown) {
      showError(error, 'Falha ao desativar tipo de processo');
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
      categories: [],
      validityUnits: [],
      error: null,
    });
  };

  // Carregar dados iniciais
  useEffect(() => {
    loadValidityUnits();
  }, [loadValidityUnits]);

  return {
    // Estado
    ...state,
    defaultValues,
    
    // Funções
    loadLicenseProcessType,
    loadValidityUnits,
    handleSubmit,
    handleDelete,
    handleActivate,
    handleDeactivate,
    resetState,
  };
};

// Action creators para uso direto (sem hook)
export const licenseProcessTypesActions = {
  async loadLicenseProcessType(id: string) {
    return loadLicenseProcessTypeById(id);
  },

  async createLicenseProcessType(data: LicenseProcessTypeFormData) {
    const transformedData = transformFormDataToAPI(data);
    return createLicenseProcessType(transformedData);
  },

  async updateLicenseProcessType(id: string, data: LicenseProcessTypeFormData) {
    const transformedData = transformFormDataToAPI(data);
    return updateLicenseProcessType(id, transformedData);
  },

  async deleteLicenseProcessType(id: string) {
    return deleteLicenseProcessType(id);
  },

  async activateLicenseProcessType(id: string) {
    return activateLicenseProcessType(id);
  },

  async deactivateLicenseProcessType(id: string) {
    return deactivateLicenseProcessType(id);
  },
};
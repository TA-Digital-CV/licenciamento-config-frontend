/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useIGRPToast } from '@igrp/igrp-framework-react-design-system';
import {
  loadActiveCategories,
  loadActiveOptionsByCode,
  loadLicenceTypeById,
  createLicenceType,
  updateLicenceType,
} from '../functions/api.functions';
import { LicenceTypeFormData, validateLicenceTypeForm } from '../functions/validation.functions';

// Interfaces para dados de opções
interface SelectOption {
  value: string;
  label: string;
}

interface Category {
  id: string;
  name: string;
  active: boolean;
}

// Estado para gerenciamento de license types
export interface LicenseTypesState {
  loading: boolean;
  submitting: boolean;
  loadingOptions: boolean;
  categories: Category[];
  licensingModels: SelectOption[];
  validityUnits: SelectOption[];
  initialValues: LicenceTypeFormData;
}

// Hook personalizado para gerenciar license types
export const useLicenseTypesActions = (id?: string) => {
  const router = useRouter();
  const { igrpToast } = useIGRPToast();

  // Valores padrão para o formulário
  const defaultValues: LicenceTypeFormData = {
    name: '',
    code: '',
    categoryId: '',
    licensingModelKey: '',
    validityPeriod: 1,
    validityUnitKey: '',
    description: '',
    renewable: true,
    autoRenewal: false,
    requiresInspection: false,
    requiresPublicConsultation: false,
    hasFees: false,
    currencyCode: 'CVE',
    active: true,
    metadata: '',
    maxProcessingDays: 1,
  };

  // Estado do componente
  const [state, setState] = useState<LicenseTypesState>({
    loading: false,
    submitting: false,
    loadingOptions: false,
    categories: [],
    licensingModels: [],
    validityUnits: [],
    initialValues: defaultValues,
  });

  // Função para carregar categorias
  const loadCategoriesData = useCallback(async () => {
    try {
      const data = await loadActiveCategories();
      const categories: Category[] = data.map((item) => ({
        id: item.value,
        name: item.label,
        active: true,
      }));
      setState((prev) => ({ ...prev, categories }));
      console.log('✅ CATEGORIES LOADED:', data.length);
    } catch (error: unknown) {
      console.error('❌ Error loading categories:', error);
      const message = error instanceof Error ? error.message : 'Falha ao carregar categorias';

      igrpToast({
        title: 'Erro',
        description: message,
        type: 'error',
      });
    }
  }, [igrpToast]);

  // Função para carregar modelos de licenciamento
  const loadLicensingModels = useCallback(async () => {
    try {
      const data = await loadActiveOptionsByCode('LICENSING_MODEL');
      const licensingModels: SelectOption[] = data.map((item) => ({
        value: item.ckey || '',
        label: item.cvalue || '',
      }));
      setState((prev) => ({ ...prev, licensingModels }));
      console.log('✅ LICENSING MODELS LOADED:', data.length);
    } catch (error: unknown) {
      console.error('❌ Error loading licensing models:', error);
      const message =
        error instanceof Error ? error.message : 'Falha ao carregar modelos de licenciamento';

      igrpToast({
        title: 'Erro',
        description: message,
        type: 'error',
      });
    }
  }, [igrpToast]);

  // Função para carregar unidades de validade
  const loadValidityUnits = useCallback(async () => {
    try {
      const data = await loadActiveOptionsByCode('VALIDITY_UNIT');
      const validityUnits: SelectOption[] = data.map((item) => ({
        value: item.ckey || '',
        label: item.cvalue || '',
      }));
      setState((prev) => ({ ...prev, validityUnits }));
      console.log('✅ VALIDITY UNITS LOADED:', data.length);
    } catch (error: unknown) {
      console.error('❌ Error loading validity units:', error);
      const message =
        error instanceof Error ? error.message : 'Falha ao carregar unidades de validade';

      igrpToast({
        title: 'Erro',
        description: message,
        type: 'error',
      });
    }
  }, [igrpToast]);

  // Função para carregar todas as opções necessárias
  const loadAllOptions = useCallback(async () => {
    setState((prev) => ({ ...prev, loadingOptions: true }));

    try {
      await Promise.all([loadCategoriesData(), loadLicensingModels(), loadValidityUnits()]);
    } finally {
      setState((prev) => ({ ...prev, loadingOptions: false }));
    }
  }, [loadCategoriesData, loadLicensingModels, loadValidityUnits]);

  // Função para carregar tipo de licença por ID
  const loadLicenseType = useCallback(
    async (licenseTypeId: string) => {
      console.log('🚀 LOADING LICENSE TYPE:', licenseTypeId);

      setState((prev) => ({ ...prev, loading: true }));

      try {
        const data = await loadLicenceTypeById(licenseTypeId);

        setState((prev) => ({
          ...prev,
          loading: false,
          initialValues: {
            name: data.name || '',
            code: data.code || '',
            categoryId: data.categoryId || '',
            licensingModelKey: data.licensingModelKey || '',
            validityPeriod: data.validityPeriod || 1,
            validityUnitKey: data.validityUnitKey || '',
            description: data.description || '',
            renewable: data.renewable !== undefined ? data.renewable : true,
            autoRenewal: data.autoRenewal !== undefined ? data.autoRenewal : false,
            requiresInspection:
              data.requiresInspection !== undefined ? data.requiresInspection : false,
            requiresPublicConsultation:
              data.requiresPublicConsultation !== undefined
                ? data.requiresPublicConsultation
                : false,
            maxProcessingDays: data.maxProcessingDays,
            hasFees: data.hasFees !== undefined ? data.hasFees : false,
            baseFee: data.baseFee,
            currencyCode: data.currencyCode || 'CVE',
            sortOrder: data.sortOrder,
            active: data.active !== undefined ? data.active : true,
            metadata: data.metadata || '',
          },
        }));

        console.log('✅ LICENSE TYPE LOADED:', { id: licenseTypeId, name: data.name });
      } catch (error: unknown) {
        console.error('❌ Error loading license type:', error);
        const message =
          error instanceof Error ? error.message : 'Falha ao carregar tipo de licença';

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
  const validateFormData = (values: unknown): LicenceTypeFormData => {
    try {
      return validateLicenceTypeForm(values);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Erro desconhecido';
      throw new Error('Dados do formulário inválidos: ' + message);
    }
  };

  // Função para criar novo tipo de licença
  const createNewLicenseType = async (values: LicenceTypeFormData) => {
    console.log('🚀 CREATING LICENSE TYPE:', values.name);

    const result = await createLicenceType(values);

    console.log('✅ LICENSE TYPE CREATED:', { id: result.id, name: values.name });
    return result;
  };

  // Função para atualizar tipo de licença existente
  const updateExistingLicenseType = async (licenseTypeId: string, values: LicenceTypeFormData) => {
    console.log('🚀 UPDATING LICENSE TYPE:', { id: licenseTypeId, name: values.name });

    const result = await updateLicenceType(licenseTypeId, values);

    console.log('✅ LICENSE TYPE UPDATED:', { id: licenseTypeId, name: values.name });
    return result;
  };

  // Função principal para submeter o formulário
  const handleSubmit = async (values: unknown) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] 🚀 LICENSE TYPE FORM SUBMISSION STARTED`);
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

      let result;

      // Criar ou atualizar conforme necessário
      if (!id) {
        result = await createNewLicenseType(validatedData);
        igrpToast({
          title: 'Tipo de licença criado',
          description: 'O tipo de licença foi criado com sucesso.',
          type: 'success',
        });
      } else {
        result = await updateExistingLicenseType(id, validatedData);
        igrpToast({
          title: 'Tipo de licença atualizado',
          description: 'O tipo de licença foi atualizado com sucesso.',
          type: 'success',
        });
      }

      // Navegar para página de edição
      const targetId = result?.id || id;
      if (targetId) {
        router.push(`/parametrizacao/licence-type/${targetId}/editar`);
      } else {
        router.push('/parametrizacao?tab=licence-types');
      }
    } catch (error: unknown) {
      console.error('❌ Error submitting license type form:', error);
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
      categories: [],
      licensingModels: [],
      validityUnits: [],
      initialValues: defaultValues,
    });
  };

  // Efeito para carregar dados iniciais
  useEffect(() => {
    loadAllOptions();

    if (id) {
      loadLicenseType(id);
    }
  }, [id]);

  return {
    // Estado
    ...state,
    defaultValues,
    isEditing: Boolean(id),
    actionsDisabled: state.loading || state.submitting || state.loadingOptions,

    // Ações
    loadLicenseType,
    loadAllOptions,
    handleSubmit,
    resetState,

    // Utilitários
    validateFormData,

    // Carregadores específicos
    loadCategoriesData,
    loadLicensingModels,
    loadValidityUnits,
  };
};

// Action creators para uso direto (sem hook)
export const licenseTypesActions = {
  async loadLicenseType(id: string) {
    return loadLicenceTypeById(id);
  },

  async loadCategories() {
    return loadActiveCategories();
  },

  async loadLicensingModels() {
    // Retorna os novos modelos de licenciamento
    return [
      { value: 'PROVISORIO', label: 'Provisório' },
      { value: 'DEFINITIVO', label: 'Definitivo' },
      { value: 'HIBRIDO', label: 'Híbrido' },
    ];
  },

  async loadValidityUnits() {
    return loadActiveOptionsByCode('VALIDITY_UNIT');
  },

  async createLicenseType(data: LicenceTypeFormData) {
    return createLicenceType(data);
  },

  async updateLicenseType(id: string, data: LicenceTypeFormData) {
    return updateLicenceType(id, data);
  },
};

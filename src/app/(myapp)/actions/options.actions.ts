'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useIGRPToast } from '@igrp/igrp-framework-react-design-system';
import {
  loadOptionsByCode,
  checkOptionCodeExists,
  createMultipleOptions,
  updateOptionsByCode,
  transformOptionToFormItem,
  transformFormItemToOption,
} from '../functions/api.functions';
import { OptionFormData, OptionItem, validateOptionForm } from '../functions/validation.functions';

// Estado para gerenciamento de options
export interface OptionsState {
  loading: boolean;
  submitting: boolean;
  initialValues: {
    ccode: string;
    options: OptionItem[];
  };
}

// Hook personalizado para gerenciar options
export const useOptionsActions = (id?: string) => {
  const router = useRouter();
  const { igrpToast } = useIGRPToast();

  // Item padrão para novas opções
  const defaultItem = {
    ckey: '',
    cvalue: '',
    locale: 'pt-CV',
    sortOrder: 1,
    active: true,
    metadata: '',
    description: '',
  };

  // Estado do componente
  const [state, setState] = useState<OptionsState>({
    loading: false,
    submitting: false,
    initialValues: {
      ccode: id || '',
      options: id ? [] : [{ ...defaultItem }],
    },
  });

  // Função para carregar opções por código
  const loadOptions = useCallback(
    async (ccode: string) => {
      console.log('🚀 LOADING OPTIONS:', ccode);

      setState((prev) => ({ ...prev, loading: true }));

      try {
        const data = await loadOptionsByCode(ccode);
        const items = data.map(transformOptionToFormItem);

        // Sempre inicializa o formulário; se vier vazio, cria um item padrão
        const defaultItemStatic = {
          ckey: '',
          cvalue: '',
          locale: 'pt-CV',
          sortOrder: 1,
          active: true,
          metadata: '',
          description: '',
        };

        setState((prev) => ({
          ...prev,
          loading: false,
          initialValues: {
            ccode: ccode,
            options: items.length > 0 ? items : [{ ...defaultItemStatic }],
          },
        }));

        console.log('✅ OPTIONS LOADED:', { ccode, count: items.length });
      } catch (error: unknown) {
        console.error('❌ Error loading options:', error);
        const message = error instanceof Error ? error.message : 'Falha ao carregar opções';

        // Usar igrpToast diretamente sem dependência no useCallback
        igrpToast({
          title: 'Erro',
          description: message,
          type: 'default',
        });

        setState((prev) => ({ ...prev, loading: false }));
      }
    },
    [], // Removida dependência igrpToast para evitar ciclo infinito
  );

  // Função para validar dados do formulário
  const validateFormData = (values: unknown): OptionFormData => {
    try {
      return validateOptionForm(values);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Erro desconhecido';
      throw new Error('Dados do formulário inválidos: ' + message);
    }
  };

  // Função para filtrar opções válidas
  const filterValidOptions = (options: OptionItem[]) => {
    if (!options || !Array.isArray(options) || options.length === 0) {
      throw new Error('É necessário adicionar pelo menos uma opção');
    }

    const validOptions = options.filter(
      (option) =>
        option &&
        typeof option.ckey === 'string' &&
        option.ckey.trim().length > 0 &&
        typeof option.cvalue === 'string' &&
        option.cvalue.trim().length > 0,
    );

    if (validOptions.length === 0) {
      throw new Error('É necessário preencher pelo menos uma opção com chave e valor');
    }

    return validOptions;
  };

  // Função para criar novas opções
  const createOptions = async (values: OptionFormData) => {
    console.log('🚀 CREATING OPTIONS:', values.ccode);

    // Validação de unicidade temporariamente suspensa até correção no backend
    // if (!id) {
    //   const existsResult = await checkOptionCodeExists(values.ccode);
    //   if (existsResult.exists) {
    //     throw new Error(`O código principal '${values.ccode}' já existe. Use um código único.`);
    //   }
    // }

    // Filtrar opções válidas
    const validOptions = filterValidOptions(values.options);

    // Transformar para formato da API
    const optionsToCreate = validOptions.map((item) =>
      transformFormItemToOption(item, values.ccode),
    );

    // Criar opções
    await createMultipleOptions(optionsToCreate);

    console.log('✅ OPTIONS CREATED:', { ccode: values.ccode, count: optionsToCreate.length });
  };

  // Função para atualizar opções existentes
  const updateOptions = async (values: OptionFormData) => {
    console.log('🚀 UPDATING OPTIONS:', values.ccode);

    // Filtrar opções válidas
    const validOptions = filterValidOptions(values.options);

    // Transformar para formato da API
    const optionsToUpdate = validOptions.map((item) =>
      transformFormItemToOption(item, values.ccode),
    );

    // Atualizar opções
    await updateOptionsByCode(values.ccode, optionsToUpdate);

    console.log('✅ OPTIONS UPDATED:', { ccode: values.ccode, count: optionsToUpdate.length });
  };

  // Função principal para submeter o formulário
  const handleSubmit = async (values: unknown) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] 🚀 FORM SUBMISSION STARTED`);
    console.log(`[${timestamp}] 📋 Form Analysis:`, {
      ccode: (values as { ccode?: string })?.ccode,
      optionsCount: (values as { options?: unknown[] })?.options?.length || 0,
      isEditing: Boolean(id),
      formId: id || 'NEW',
    });

    setState((prev) => ({ ...prev, submitting: true }));

    try {
      // Validar dados do formulário
      const validatedData = validateFormData(values);

      // Criar ou atualizar conforme necessário
      if (!id) {
        await createOptions(validatedData);
        igrpToast({
          title: 'Opções criadas',
          description: 'As opções foram criadas com sucesso.',
          type: 'success',
        });
      } else {
        await updateOptions(validatedData);
        igrpToast({
          title: 'Opções atualizadas',
          description: 'As opções foram atualizadas com sucesso.',
          type: 'success',
        });
      }

      // Navegar para página de edição usando código principal
      setTimeout(() => {
        router.replace(`/options/${encodeURIComponent(validatedData.ccode)}/editar`);
      }, 100);
    } catch (error: unknown) {
      console.error('❌ Error submitting form:', error);
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
      initialValues: {
        ccode: id || '',
        options: id ? [] : [{ ...defaultItem }],
      },
    });
  };

  return {
    // Estado
    ...state,
    defaultItem,
    isEditing: Boolean(id),
    actionsDisabled: state.loading || state.submitting,

    // Ações
    loadOptions,
    handleSubmit,
    resetState,

    // Utilitários
    validateFormData,
    filterValidOptions,
  };
};

// Action creators para uso direto (sem hook)
export const optionsActions = {
  async loadOptions(ccode: string) {
    const data = await loadOptionsByCode(ccode);
    return data.map(transformOptionToFormItem);
  },

  async checkCodeExists(ccode: string) {
    const result = await checkOptionCodeExists(ccode);
    return result.exists;
  },

  async createOptions(ccode: string, options: OptionItem[]) {
    const optionsToCreate = options.map((item) => transformFormItemToOption(item, ccode));
    return createMultipleOptions(optionsToCreate);
  },

  async updateOptions(ccode: string, options: OptionItem[]) {
    const optionsToUpdate = options.map((item) => transformFormItemToOption(item, ccode));
    return updateOptionsByCode(ccode, optionsToUpdate);
  },
};

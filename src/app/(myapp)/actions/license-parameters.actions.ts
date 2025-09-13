'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useIGRPToast } from '@igrp/igrp-framework-react-design-system';
import {
  LicenseParameterResponseDTO,
  LicenseParameterRequestDTO,
} from '../types/license-parameters.types';

// Estado para gerenciamento de license parameters
export interface LicenseParametersState {
  loading: boolean;
  submitting: boolean;
  licenseParameters: LicenseParameterResponseDTO[];
  selectedLicenseParameter: LicenseParameterResponseDTO | null;
}

// Hook personalizado para gerenciar license parameters
export const useLicenseParametersActions = () => {
  const router = useRouter();
  const { igrpToast } = useIGRPToast();

  // Estado do componente
  const [state, setState] = useState<LicenseParametersState>({
    loading: false,
    submitting: false,
    licenseParameters: [],
    selectedLicenseParameter: null,
  });

  // Função para carregar parâmetros de licença
  const loadLicenseParameters = useCallback(
    async (params?: {
      active?: boolean;
      name?: string;
      type?: string;
      licenseTypeId?: string;
      page?: number;
      size?: number;
    }) => {
      setState((prev) => ({ ...prev, loading: true }));

      try {
        const queryParams = new URLSearchParams();
        if (params?.active !== undefined) queryParams.set('active', String(params.active));
        if (params?.name) queryParams.set('name', params.name);
        if (params?.type) queryParams.set('type', params.type);
        if (params?.licenseTypeId) queryParams.set('licenseTypeId', params.licenseTypeId);
        if (params?.page) queryParams.set('page', String(params.page));
        if (params?.size) queryParams.set('size', String(params.size));

        const response = await fetch(`/api/license-parameters?${queryParams.toString()}`);
        if (!response.ok) throw new Error('Failed to fetch license parameters');

        const data = await response.json();
        setState((prev) => ({ ...prev, loading: false, licenseParameters: data.content || [] }));
      } catch (error) {
        console.error('Error loading license parameters:', error);
        igrpToast({
          title: 'Erro',
          description: 'Falha ao carregar parâmetros de licença',
          type: 'default',
        });
        setState((prev) => ({ ...prev, loading: false }));
      }
    },
    [igrpToast],
  );

  // Função para carregar parâmetro de licença por ID
  const loadLicenseParameterById = useCallback(
    async (id: string) => {
      setState((prev) => ({ ...prev, loading: true }));

      try {
        const response = await fetch(`/api/license-parameters/${id}`);
        if (!response.ok) throw new Error('Failed to fetch license parameter');

        const licenseParameter = await response.json();
        setState((prev) => ({
          ...prev,
          loading: false,
          selectedLicenseParameter: licenseParameter,
        }));
        return licenseParameter;
      } catch (error) {
        console.error('Error loading license parameter:', error);
        igrpToast({
          title: 'Erro',
          description: 'Falha ao carregar parâmetro de licença',
          type: 'default',
        });
        setState((prev) => ({ ...prev, loading: false }));
        throw error;
      }
    },
    [igrpToast],
  );

  // Função para criar parâmetro de licença
  const createLicenseParameter = useCallback(
    async (licenseParameterData: LicenseParameterRequestDTO) => {
      setState((prev) => ({ ...prev, submitting: true }));

      try {
        const response = await fetch('/api/license-parameters', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(licenseParameterData),
        });

        if (!response.ok) throw new Error('Failed to create license parameter');

        const newLicenseParameter = await response.json();
        setState((prev) => ({
          ...prev,
          submitting: false,
          licenseParameters: [...prev.licenseParameters, newLicenseParameter],
        }));

        igrpToast({
          title: 'Parâmetro de licença criado',
          description: 'O parâmetro de licença foi criado com sucesso.',
          type: 'success',
        });

        return newLicenseParameter;
      } catch (error) {
        console.error('Error creating license parameter:', error);
        igrpToast({
          title: 'Erro',
          description: 'Falha ao criar parâmetro de licença',
          type: 'default',
        });
        setState((prev) => ({ ...prev, submitting: false }));
        throw error;
      }
    },
    [igrpToast],
  );

  // Função para atualizar parâmetro de licença
  const updateLicenseParameter = useCallback(
    async (id: string, licenseParameterData: LicenseParameterRequestDTO) => {
      setState((prev) => ({ ...prev, submitting: true }));

      try {
        const response = await fetch(`/api/license-parameters/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(licenseParameterData),
        });

        if (!response.ok) throw new Error('Failed to update license parameter');

        const updatedLicenseParameter = await response.json();
        setState((prev) => ({
          ...prev,
          submitting: false,
          licenseParameters: prev.licenseParameters.map((param) =>
            param.id === id ? updatedLicenseParameter : param,
          ),
          selectedLicenseParameter:
            prev.selectedLicenseParameter?.id === id
              ? updatedLicenseParameter
              : prev.selectedLicenseParameter,
        }));

        igrpToast({
          title: 'Parâmetro de licença atualizado',
          description: 'O parâmetro de licença foi atualizado com sucesso.',
          type: 'success',
        });

        return updatedLicenseParameter;
      } catch (error) {
        console.error('Error updating license parameter:', error);
        igrpToast({
          title: 'Erro',
          description: 'Falha ao atualizar parâmetro de licença',
          type: 'default',
        });
        setState((prev) => ({ ...prev, submitting: false }));
        throw error;
      }
    },
    [igrpToast],
  );

  // Função para deletar parâmetro de licença
  const deleteLicenseParameter = useCallback(
    async (id: string) => {
      setState((prev) => ({ ...prev, submitting: true }));

      try {
        const response = await fetch(`/api/license-parameters/${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) throw new Error('Failed to delete license parameter');

        setState((prev) => ({
          ...prev,
          submitting: false,
          licenseParameters: prev.licenseParameters.filter((param) => param.id !== id),
          selectedLicenseParameter:
            prev.selectedLicenseParameter?.id === id ? null : prev.selectedLicenseParameter,
        }));

        igrpToast({
          title: 'Parâmetro de licença removido',
          description: 'O parâmetro de licença foi removido com sucesso.',
          type: 'success',
        });
      } catch (error) {
        console.error('Error deleting license parameter:', error);
        igrpToast({
          title: 'Erro',
          description: 'Falha ao remover parâmetro de licença',
          type: 'default',
        });
        setState((prev) => ({ ...prev, submitting: false }));
        throw error;
      }
    },
    [igrpToast],
  );

  // Função para validar dados do formulário
  const validateFormData = useCallback((data: Partial<LicenseParameterRequestDTO>) => {
    const errors: Record<string, string> = {};

    if (!data.name?.trim()) {
      errors.name = 'Nome é obrigatório';
    }

    if (!data.parameterType?.trim()) {
      errors.parameterType = 'Tipo é obrigatório';
    }

    if (!data.description?.trim()) {
      errors.description = 'Descrição é obrigatória';
    }

    if (
      data.minValue !== undefined &&
      data.maxValue !== undefined &&
      data.minValue > data.maxValue
    ) {
      errors.minValue = 'Valor mínimo deve ser menor que o valor máximo';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }, []);

  // Função para filtrar parâmetros por tipo de licença
  const filterParametersByLicenseType = useCallback(
    (licenseTypeId: string) => {
      return state.licenseParameters.filter(
        (param) => param.active && param.licenseTypeId === licenseTypeId,
      );
    },
    [state.licenseParameters],
  );

  // Função para validar valor do parâmetro
  const validateParameterValue = useCallback(
    (parameter: LicenseParameterResponseDTO, value: string | number | null | undefined) => {
      if (parameter.required && (value === null || value === undefined || value === '')) {
        return 'Este parâmetro é obrigatório';
      }

      if (parameter.type === 'NUMBER' && value !== null && value !== undefined) {
        const numValue = Number(value);
        if (isNaN(numValue)) {
          return 'Valor deve ser um número';
        }
        if (parameter.minValue !== null && parameter.minValue !== undefined && numValue < parameter.minValue) {
          return `Valor deve ser maior ou igual a ${parameter.minValue}`;
        }
        if (parameter.maxValue !== null && parameter.maxValue !== undefined && numValue > parameter.maxValue) {
          return `Valor deve ser menor ou igual a ${parameter.maxValue}`;
        }
      }

      return null;
    },
    [],
  );

  return {
    state,
    loadLicenseParameters,
    loadLicenseParameterById,
    createLicenseParameter,
    updateLicenseParameter,
    deleteLicenseParameter,
    validateFormData,
    filterParametersByLicenseType,
    validateParameterValue,
  };
};

export default useLicenseParametersActions;

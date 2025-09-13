'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useIGRPToast } from '@igrp/igrp-framework-react-design-system';
import { FeeCategoryResponseDTO, FeeCategoryRequestDTO } from '../types/fee-categories.types';

// Estado para gerenciamento de fee categories
export interface FeeCategoriesState {
  loading: boolean;
  submitting: boolean;
  feeCategories: FeeCategoryResponseDTO[];
  selectedFeeCategory: FeeCategoryResponseDTO | null;
}

// Hook personalizado para gerenciar fee categories
export const useFeeCategoriesActions = () => {
  const router = useRouter();
  const { igrpToast } = useIGRPToast();

  // Estado do componente
  const [state, setState] = useState<FeeCategoriesState>({
    loading: false,
    submitting: false,
    feeCategories: [],
    selectedFeeCategory: null,
  });

  // Função para carregar categorias de taxa
  const loadFeeCategories = useCallback(
    async (params?: { active?: boolean; name?: string; page?: number; size?: number }) => {
      setState((prev) => ({ ...prev, loading: true }));

      try {
        const queryParams = new URLSearchParams();
        if (params?.active !== undefined) queryParams.set('active', String(params.active));
        if (params?.name) queryParams.set('name', params.name);
        if (params?.page) queryParams.set('page', String(params.page));
        if (params?.size) queryParams.set('size', String(params.size));

        const response = await fetch(`/api/fee-categories?${queryParams.toString()}`);
        if (!response.ok) throw new Error('Failed to fetch fee categories');

        const data = await response.json();
        setState((prev) => ({ ...prev, loading: false, feeCategories: data.content || [] }));
      } catch (error) {
        console.error('Error loading fee categories:', error);
        igrpToast({
          title: 'Erro',
          description: 'Falha ao carregar categorias de taxa',
          type: 'default',
        });
        setState((prev) => ({ ...prev, loading: false }));
      }
    },
    [igrpToast],
  );

  // Função para carregar categoria de taxa por ID
  const loadFeeCategoryById = useCallback(
    async (id: string) => {
      setState((prev) => ({ ...prev, loading: true }));

      try {
        const response = await fetch(`/api/fee-categories/${id}`);
        if (!response.ok) throw new Error('Failed to fetch fee category');

        const feeCategory = await response.json();
        setState((prev) => ({ ...prev, loading: false, selectedFeeCategory: feeCategory }));
        return feeCategory;
      } catch (error) {
        console.error('Error loading fee category:', error);
        igrpToast({
          title: 'Erro',
          description: 'Falha ao carregar categoria de taxa',
          type: 'default',
        });
        setState((prev) => ({ ...prev, loading: false }));
        throw error;
      }
    },
    [igrpToast],
  );

  // Função para criar categoria de taxa
  const createFeeCategory = useCallback(
    async (feeCategoryData: FeeCategoryRequestDTO) => {
      setState((prev) => ({ ...prev, submitting: true }));

      try {
        const response = await fetch('/api/fee-categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(feeCategoryData),
        });

        if (!response.ok) throw new Error('Failed to create fee category');

        const newFeeCategory = await response.json();
        setState((prev) => ({
          ...prev,
          submitting: false,
          feeCategories: [...prev.feeCategories, newFeeCategory],
        }));

        igrpToast({
          title: 'Categoria de taxa criada',
          description: 'A categoria de taxa foi criada com sucesso.',
          type: 'success',
        });

        return newFeeCategory;
      } catch (error) {
        console.error('Error creating fee category:', error);
        igrpToast({
          title: 'Erro',
          description: 'Falha ao criar categoria de taxa',
          type: 'default',
        });
        setState((prev) => ({ ...prev, submitting: false }));
        throw error;
      }
    },
    [igrpToast],
  );

  // Função para atualizar categoria de taxa
  const updateFeeCategory = useCallback(
    async (id: string, feeCategoryData: FeeCategoryRequestDTO) => {
      setState((prev) => ({ ...prev, submitting: true }));

      try {
        const response = await fetch(`/api/fee-categories/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(feeCategoryData),
        });

        if (!response.ok) throw new Error('Failed to update fee category');

        const updatedFeeCategory = await response.json();
        setState((prev) => ({
          ...prev,
          submitting: false,
          feeCategories: prev.feeCategories.map((cat) =>
            cat.id === id ? updatedFeeCategory : cat,
          ),
          selectedFeeCategory:
            prev.selectedFeeCategory?.id === id ? updatedFeeCategory : prev.selectedFeeCategory,
        }));

        igrpToast({
          title: 'Categoria de taxa atualizada',
          description: 'A categoria de taxa foi atualizada com sucesso.',
          type: 'success',
        });

        return updatedFeeCategory;
      } catch (error) {
        console.error('Error updating fee category:', error);
        igrpToast({
          title: 'Erro',
          description: 'Falha ao atualizar categoria de taxa',
          type: 'default',
        });
        setState((prev) => ({ ...prev, submitting: false }));
        throw error;
      }
    },
    [igrpToast],
  );

  // Função para deletar categoria de taxa
  const deleteFeeCategory = useCallback(
    async (id: string) => {
      setState((prev) => ({ ...prev, submitting: true }));

      try {
        const response = await fetch(`/api/fee-categories/${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) throw new Error('Failed to delete fee category');

        setState((prev) => ({
          ...prev,
          submitting: false,
          feeCategories: prev.feeCategories.filter((cat) => cat.id !== id),
          selectedFeeCategory:
            prev.selectedFeeCategory?.id === id ? null : prev.selectedFeeCategory,
        }));

        igrpToast({
          title: 'Categoria de taxa removida',
          description: 'A categoria de taxa foi removida com sucesso.',
          type: 'success',
        });
      } catch (error) {
        console.error('Error deleting fee category:', error);
        igrpToast({
          title: 'Erro',
          description: 'Falha ao remover categoria de taxa',
          type: 'default',
        });
        setState((prev) => ({ ...prev, submitting: false }));
        throw error;
      }
    },
    [igrpToast],
  );

  // Função para validar dados do formulário
  const validateFormData = useCallback((data: Partial<FeeCategoryRequestDTO>) => {
    const errors: Record<string, string> = {};

    if (!data.name?.trim()) {
      errors.name = 'Nome é obrigatório';
    }

    if (!data.description?.trim()) {
      errors.description = 'Descrição é obrigatória';
    }

    if (data.baseAmount !== undefined && data.baseAmount < 0) {
      errors.baseAmount = 'Valor base deve ser maior ou igual a zero';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }, []);

  // Função para calcular valor total com taxas
  const calculateTotalWithFees = useCallback(
    (baseValue: number, feeCategories: FeeCategoryResponseDTO[]) => {
      return feeCategories.reduce((total, category) => {
        if (category.active && category.baseAmount) {
          return total + category.baseAmount;
        }
        return total;
      }, baseValue);
    },
    [],
  );

  return {
    state,
    loadFeeCategories,
    loadFeeCategoryById,
    createFeeCategory,
    updateFeeCategory,
    deleteFeeCategory,
    validateFormData,
    calculateTotalWithFees,
  };
};

export default useFeeCategoriesActions;

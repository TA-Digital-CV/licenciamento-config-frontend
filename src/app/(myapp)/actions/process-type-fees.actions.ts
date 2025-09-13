'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useIGRPToast } from '@igrp/igrp-framework-react-design-system';
import { ProcessTypeFeeResponseDTO, ProcessTypeFeeRequestDTO } from '../types/process-type-fees.types';

// Estado para gerenciamento de process type fees
export interface ProcessTypeFeesState {
  loading: boolean;
  submitting: boolean;
  processTypeFees: ProcessTypeFeeResponseDTO[];
  selectedProcessTypeFee: ProcessTypeFeeResponseDTO | null;
}

// Hook personalizado para gerenciar process type fees
export const useProcessTypeFeesActions = () => {
  const router = useRouter();
  const { igrpToast } = useIGRPToast();

  // Estado do componente
  const [state, setState] = useState<ProcessTypeFeesState>({
    loading: false,
    submitting: false,
    processTypeFees: [],
    selectedProcessTypeFee: null,
  });

  // Função para carregar taxas de tipo de processo
  const loadProcessTypeFees = useCallback(async (params?: {
    active?: boolean;
    processTypeId?: string;
    feeCategoryId?: string;
    page?: number;
    size?: number;
  }) => {
    setState((prev) => ({ ...prev, loading: true }));

    try {
      const queryParams = new URLSearchParams();
      if (params?.active !== undefined) queryParams.set('active', String(params.active));
      if (params?.processTypeId) queryParams.set('processTypeId', params.processTypeId);
      if (params?.feeCategoryId) queryParams.set('feeCategoryId', params.feeCategoryId);
      if (params?.page) queryParams.set('page', String(params.page));
      if (params?.size) queryParams.set('size', String(params.size));

      const response = await fetch(`/api/process-type-fees?${queryParams.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch process type fees');
      
      const data = await response.json();
      setState((prev) => ({ ...prev, loading: false, processTypeFees: data.content || [] }));
    } catch (error) {
      console.error('Error loading process type fees:', error);
      igrpToast({
        title: 'Erro',
        description: 'Falha ao carregar taxas de tipo de processo',
        type: 'default',
      });
      setState((prev) => ({ ...prev, loading: false }));
    }
  }, [igrpToast]);

  // Função para carregar taxa de tipo de processo por ID
  const loadProcessTypeFeeById = useCallback(async (id: string) => {
    setState((prev) => ({ ...prev, loading: true }));

    try {
      const response = await fetch(`/api/process-type-fees/${id}`);
      if (!response.ok) throw new Error('Failed to fetch process type fee');
      
      const processTypeFee = await response.json();
      setState((prev) => ({ ...prev, loading: false, selectedProcessTypeFee: processTypeFee }));
      return processTypeFee;
    } catch (error) {
      console.error('Error loading process type fee:', error);
      igrpToast({
        title: 'Erro',
        description: 'Falha ao carregar taxa de tipo de processo',
        type: 'default',
      });
      setState((prev) => ({ ...prev, loading: false }));
      throw error;
    }
  }, [igrpToast]);

  // Função para criar taxa de tipo de processo
  const createProcessTypeFee = useCallback(async (processTypeFeeData: ProcessTypeFeeRequestDTO) => {
    setState((prev) => ({ ...prev, submitting: true }));

    try {
      const response = await fetch('/api/process-type-fees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(processTypeFeeData),
      });

      if (!response.ok) throw new Error('Failed to create process type fee');
      
      const newProcessTypeFee = await response.json();
      setState((prev) => ({
        ...prev,
        submitting: false,
        processTypeFees: [...prev.processTypeFees, newProcessTypeFee],
      }));

      igrpToast({
        title: 'Taxa de tipo de processo criada',
        description: 'A taxa de tipo de processo foi criada com sucesso.',
        type: 'success',
      });

      return newProcessTypeFee;
    } catch (error) {
      console.error('Error creating process type fee:', error);
      igrpToast({
        title: 'Erro',
        description: 'Falha ao criar taxa de tipo de processo',
        type: 'default',
      });
      setState((prev) => ({ ...prev, submitting: false }));
      throw error;
    }
  }, [igrpToast]);

  // Função para atualizar taxa de tipo de processo
  const updateProcessTypeFee = useCallback(async (id: string, processTypeFeeData: ProcessTypeFeeRequestDTO) => {
    setState((prev) => ({ ...prev, submitting: true }));

    try {
      const response = await fetch(`/api/process-type-fees/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(processTypeFeeData),
      });

      if (!response.ok) throw new Error('Failed to update process type fee');
      
      const updatedProcessTypeFee = await response.json();
      setState((prev) => ({
        ...prev,
        submitting: false,
        processTypeFees: prev.processTypeFees.map(fee => fee.id === id ? updatedProcessTypeFee : fee),
        selectedProcessTypeFee: prev.selectedProcessTypeFee?.id === id ? updatedProcessTypeFee : prev.selectedProcessTypeFee,
      }));

      igrpToast({
        title: 'Taxa de tipo de processo atualizada',
        description: 'A taxa de tipo de processo foi atualizada com sucesso.',
        type: 'success',
      });

      return updatedProcessTypeFee;
    } catch (error) {
      console.error('Error updating process type fee:', error);
      igrpToast({
        title: 'Erro',
        description: 'Falha ao atualizar taxa de tipo de processo',
        type: 'default',
      });
      setState((prev) => ({ ...prev, submitting: false }));
      throw error;
    }
  }, [igrpToast]);

  // Função para deletar taxa de tipo de processo
  const deleteProcessTypeFee = useCallback(async (id: string) => {
    setState((prev) => ({ ...prev, submitting: true }));

    try {
      const response = await fetch(`/api/process-type-fees/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete process type fee');
      
      setState((prev) => ({
        ...prev,
        submitting: false,
        processTypeFees: prev.processTypeFees.filter(fee => fee.id !== id),
        selectedProcessTypeFee: prev.selectedProcessTypeFee?.id === id ? null : prev.selectedProcessTypeFee,
      }));

      igrpToast({
        title: 'Taxa de tipo de processo removida',
        description: 'A taxa de tipo de processo foi removida com sucesso.',
        type: 'success',
      });
    } catch (error) {
      console.error('Error deleting process type fee:', error);
      igrpToast({
        title: 'Erro',
        description: 'Falha ao remover taxa de tipo de processo',
        type: 'default',
      });
      setState((prev) => ({ ...prev, submitting: false }));
      throw error;
    }
  }, [igrpToast]);

  // Função para validar dados do formulário
  const validateFormData = useCallback((data: Partial<ProcessTypeFeeRequestDTO>) => {
    const errors: Record<string, string> = {};

    if (!data.processTypeId?.trim()) {
      errors.processTypeId = 'Tipo de processo é obrigatório';
    }

    if (!data.feeCategoryId?.trim()) {
      errors.feeCategoryId = 'Categoria de taxa é obrigatória';
    }

    if (data.amount !== undefined && data.amount < 0) {
      errors.amount = 'Valor deve ser maior ou igual a zero';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }, []);

  // Função para calcular total de taxas por tipo de processo
  const calculateTotalFeesByProcessType = useCallback((processTypeId: string) => {
    return state.processTypeFees
      .filter(fee => fee.active && fee.processTypeId === processTypeId)
      .reduce((total, fee) => total + (fee.amount || 0), 0);
  }, [state.processTypeFees]);

  // Função para obter taxas por categoria
  const getFeesByCategory = useCallback((feeCategoryId: string) => {
    return state.processTypeFees.filter(fee => 
      fee.active && fee.feeCategoryId === feeCategoryId
    );
  }, [state.processTypeFees]);

  // Função para verificar se existe taxa duplicada
  const checkDuplicateFee = useCallback((processTypeId: string, feeCategoryId: string, excludeId?: string) => {
    return state.processTypeFees.some(fee => 
      fee.processTypeId === processTypeId && 
      fee.feeCategoryId === feeCategoryId &&
      fee.id !== excludeId
    );
  }, [state.processTypeFees]);

  return {
    state,
    loadProcessTypeFees,
    loadProcessTypeFeeById,
    createProcessTypeFee,
    updateProcessTypeFee,
    deleteProcessTypeFee,
    validateFormData,
    calculateTotalFeesByProcessType,
    getFeesByCategory,
    checkDuplicateFee,
  };
};

export default useProcessTypeFeesActions;
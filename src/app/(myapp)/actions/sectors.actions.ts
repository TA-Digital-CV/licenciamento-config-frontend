'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useIGRPToast } from '@igrp/igrp-framework-react-design-system';
import { SectorResponseDTO, SectorRequestDTO } from '../types/sectors.types';

// Estado para gerenciamento de sectors
export interface SectorsState {
  loading: boolean;
  submitting: boolean;
  sectors: SectorResponseDTO[];
  selectedSector: SectorResponseDTO | null;
}

// Hook personalizado para gerenciar sectors
export const useSectorsActions = () => {
  const router = useRouter();
  const { igrpToast } = useIGRPToast();

  // Estado do componente
  const [state, setState] = useState<SectorsState>({
    loading: false,
    submitting: false,
    sectors: [],
    selectedSector: null,
  });

  // Função para carregar setores
  const loadSectors = useCallback(async (params?: {
    active?: boolean;
    name?: string;
    page?: number;
    size?: number;
  }) => {
    setState((prev) => ({ ...prev, loading: true }));

    try {
      const queryParams = new URLSearchParams();
      if (params?.active !== undefined) queryParams.set('active', String(params.active));
      if (params?.name) queryParams.set('name', params.name);
      if (params?.page) queryParams.set('page', String(params.page));
      if (params?.size) queryParams.set('size', String(params.size));

      const response = await fetch(`/api/sectors?${queryParams.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch sectors');
      
      const data = await response.json();
      setState((prev) => ({ ...prev, loading: false, sectors: data.content || [] }));
    } catch (error) {
      console.error('Error loading sectors:', error);
      igrpToast({
        title: 'Erro',
        description: 'Falha ao carregar setores',
        type: 'default',
      });
      setState((prev) => ({ ...prev, loading: false }));
    }
  }, [igrpToast]);

  // Função para carregar setor por ID
  const loadSectorById = useCallback(async (id: string) => {
    setState((prev) => ({ ...prev, loading: true }));

    try {
      const response = await fetch(`/api/sectors/${id}`);
      if (!response.ok) throw new Error('Failed to fetch sector');
      
      const sector = await response.json();
      setState((prev) => ({ ...prev, loading: false, selectedSector: sector }));
      return sector;
    } catch (error) {
      console.error('Error loading sector:', error);
      igrpToast({
        title: 'Erro',
        description: 'Falha ao carregar setor',
        type: 'default',
      });
      setState((prev) => ({ ...prev, loading: false }));
      throw error;
    }
  }, [igrpToast]);

  // Função para criar setor
  const createSector = useCallback(async (sectorData: SectorRequestDTO) => {
    setState((prev) => ({ ...prev, submitting: true }));

    try {
      const response = await fetch('/api/sectors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sectorData),
      });

      if (!response.ok) throw new Error('Failed to create sector');
      
      const newSector = await response.json();
      setState((prev) => ({
        ...prev,
        submitting: false,
        sectors: [...prev.sectors, newSector],
      }));

      igrpToast({
        title: 'Setor criado',
        description: 'O setor foi criado com sucesso.',
        type: 'success',
      });

      return newSector;
    } catch (error) {
      console.error('Error creating sector:', error);
      igrpToast({
        title: 'Erro',
        description: 'Falha ao criar setor',
        type: 'default',
      });
      setState((prev) => ({ ...prev, submitting: false }));
      throw error;
    }
  }, [igrpToast]);

  // Função para atualizar setor
  const updateSector = useCallback(async (id: string, sectorData: SectorRequestDTO) => {
    setState((prev) => ({ ...prev, submitting: true }));

    try {
      const response = await fetch(`/api/sectors/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sectorData),
      });

      if (!response.ok) throw new Error('Failed to update sector');
      
      const updatedSector = await response.json();
      setState((prev) => ({
        ...prev,
        submitting: false,
        sectors: prev.sectors.map(sector => sector.id === id ? updatedSector : sector),
        selectedSector: prev.selectedSector?.id === id ? updatedSector : prev.selectedSector,
      }));

      igrpToast({
        title: 'Setor atualizado',
        description: 'O setor foi atualizado com sucesso.',
        type: 'success',
      });

      return updatedSector;
    } catch (error) {
      console.error('Error updating sector:', error);
      igrpToast({
        title: 'Erro',
        description: 'Falha ao atualizar setor',
        type: 'default',
      });
      setState((prev) => ({ ...prev, submitting: false }));
      throw error;
    }
  }, [igrpToast]);

  // Função para deletar setor
  const deleteSector = useCallback(async (id: string) => {
    setState((prev) => ({ ...prev, submitting: true }));

    try {
      const response = await fetch(`/api/sectors/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete sector');
      
      setState((prev) => ({
        ...prev,
        submitting: false,
        sectors: prev.sectors.filter(sector => sector.id !== id),
        selectedSector: prev.selectedSector?.id === id ? null : prev.selectedSector,
      }));

      igrpToast({
        title: 'Setor removido',
        description: 'O setor foi removido com sucesso.',
        type: 'success',
      });
    } catch (error) {
      console.error('Error deleting sector:', error);
      igrpToast({
        title: 'Erro',
        description: 'Falha ao remover setor',
        type: 'default',
      });
      setState((prev) => ({ ...prev, submitting: false }));
      throw error;
    }
  }, [igrpToast]);

  // Função para validar dados do formulário
  const validateFormData = useCallback((data: Partial<SectorRequestDTO>) => {
    const errors: Record<string, string> = {};

    if (!data.name?.trim()) {
      errors.name = 'Nome é obrigatório';
    }

    if (!data.description?.trim()) {
      errors.description = 'Descrição é obrigatória';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }, []);

  return {
    state,
    loadSectors,
    loadSectorById,
    createSector,
    updateSector,
    deleteSector,
    validateFormData,
  };
};

export default useSectorsActions;
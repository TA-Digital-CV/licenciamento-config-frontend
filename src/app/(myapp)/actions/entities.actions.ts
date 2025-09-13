'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useIGRPToast } from '@igrp/igrp-framework-react-design-system';
import { EntityResponseDTO, EntityRequestDTO } from '../types/entities.types';

// Estado para gerenciamento de entities
export interface EntitiesState {
  loading: boolean;
  submitting: boolean;
  entities: EntityResponseDTO[];
  selectedEntity: EntityResponseDTO | null;
}

// Hook personalizado para gerenciar entities
export const useEntitiesActions = () => {
  const router = useRouter();
  const { igrpToast } = useIGRPToast();

  // Estado do componente
  const [state, setState] = useState<EntitiesState>({
    loading: false,
    submitting: false,
    entities: [],
    selectedEntity: null,
  });

  // Função para carregar entidades
  const loadEntities = useCallback(async (params?: {
    active?: boolean;
    name?: string;
    type?: string;
    page?: number;
    size?: number;
  }) => {
    setState((prev) => ({ ...prev, loading: true }));

    try {
      const queryParams = new URLSearchParams();
      if (params?.active !== undefined) queryParams.set('active', String(params.active));
      if (params?.name) queryParams.set('name', params.name);
      if (params?.type) queryParams.set('type', params.type);
      if (params?.page) queryParams.set('page', String(params.page));
      if (params?.size) queryParams.set('size', String(params.size));

      const response = await fetch(`/api/entities?${queryParams.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch entities');
      
      const data = await response.json();
      setState((prev) => ({ ...prev, loading: false, entities: data.content || [] }));
    } catch (error) {
      console.error('Error loading entities:', error);
      igrpToast({
        title: 'Erro',
        description: 'Falha ao carregar entidades',
        type: 'default',
      });
      setState((prev) => ({ ...prev, loading: false }));
    }
  }, [igrpToast]);

  // Função para carregar entidade por ID
  const loadEntityById = useCallback(async (id: string) => {
    setState((prev) => ({ ...prev, loading: true }));

    try {
      const response = await fetch(`/api/entities/${id}`);
      if (!response.ok) throw new Error('Failed to fetch entity');
      
      const entity = await response.json();
      setState((prev) => ({ ...prev, loading: false, selectedEntity: entity }));
      return entity;
    } catch (error) {
      console.error('Error loading entity:', error);
      igrpToast({
        title: 'Erro',
        description: 'Falha ao carregar entidade',
        type: 'default',
      });
      setState((prev) => ({ ...prev, loading: false }));
      throw error;
    }
  }, [igrpToast]);

  // Função para criar entidade
  const createEntity = useCallback(async (entityData: EntityRequestDTO) => {
    setState((prev) => ({ ...prev, submitting: true }));

    try {
      const response = await fetch('/api/entities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entityData),
      });

      if (!response.ok) throw new Error('Failed to create entity');
      
      const newEntity = await response.json();
      setState((prev) => ({
        ...prev,
        submitting: false,
        entities: [...prev.entities, newEntity],
      }));

      igrpToast({
        title: 'Entidade criada',
        description: 'A entidade foi criada com sucesso.',
        type: 'success',
      });

      return newEntity;
    } catch (error) {
      console.error('Error creating entity:', error);
      igrpToast({
        title: 'Erro',
        description: 'Falha ao criar entidade',
        type: 'default',
      });
      setState((prev) => ({ ...prev, submitting: false }));
      throw error;
    }
  }, [igrpToast]);

  // Função para atualizar entidade
  const updateEntity = useCallback(async (id: string, entityData: EntityRequestDTO) => {
    setState((prev) => ({ ...prev, submitting: true }));

    try {
      const response = await fetch(`/api/entities/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entityData),
      });

      if (!response.ok) throw new Error('Failed to update entity');
      
      const updatedEntity = await response.json();
      setState((prev) => ({
        ...prev,
        submitting: false,
        entities: prev.entities.map(entity => entity.id === id ? updatedEntity : entity),
        selectedEntity: prev.selectedEntity?.id === id ? updatedEntity : prev.selectedEntity,
      }));

      igrpToast({
        title: 'Entidade atualizada',
        description: 'A entidade foi atualizada com sucesso.',
        type: 'success',
      });

      return updatedEntity;
    } catch (error) {
      console.error('Error updating entity:', error);
      igrpToast({
        title: 'Erro',
        description: 'Falha ao atualizar entidade',
        type: 'default',
      });
      setState((prev) => ({ ...prev, submitting: false }));
      throw error;
    }
  }, [igrpToast]);

  // Função para deletar entidade
  const deleteEntity = useCallback(async (id: string) => {
    setState((prev) => ({ ...prev, submitting: true }));

    try {
      const response = await fetch(`/api/entities/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete entity');
      
      setState((prev) => ({
        ...prev,
        submitting: false,
        entities: prev.entities.filter(entity => entity.id !== id),
        selectedEntity: prev.selectedEntity?.id === id ? null : prev.selectedEntity,
      }));

      igrpToast({
        title: 'Entidade removida',
        description: 'A entidade foi removida com sucesso.',
        type: 'success',
      });
    } catch (error) {
      console.error('Error deleting entity:', error);
      igrpToast({
        title: 'Erro',
        description: 'Falha ao remover entidade',
        type: 'default',
      });
      setState((prev) => ({ ...prev, submitting: false }));
      throw error;
    }
  }, [igrpToast]);

  // Função para validar dados do formulário
  const validateFormData = useCallback((data: Partial<EntityRequestDTO>) => {
    const errors: Record<string, string> = {};

    if (!data.name?.trim()) {
      errors.name = 'Nome é obrigatório';
    }

    if (!data.type?.trim()) {
      errors.type = 'Tipo é obrigatório';
    }

    if (!data.description?.trim()) {
      errors.description = 'Descrição é obrigatória';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }, []);

  // Função para filtrar entidades válidas
  const filterValidEntities = useCallback((entities: EntityResponseDTO[]) => {
    return entities.filter(entity => 
      entity.active && 
      entity.name && 
      entity.type
    );
  }, []);

  return {
    state,
    loadEntities,
    loadEntityById,
    createEntity,
    updateEntity,
    deleteEntity,
    validateFormData,
    filterValidEntities,
  };
};

export default useEntitiesActions;
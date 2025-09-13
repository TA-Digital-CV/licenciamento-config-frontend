'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useIGRPToast } from '@igrp/igrp-framework-react-design-system';
import { CategoryResponseDTO, CategoryRequestDTO } from '../types/categories.types';

// Estado para gerenciamento de categories
export interface CategoriesState {
  loading: boolean;
  submitting: boolean;
  categories: CategoryResponseDTO[];
  selectedCategory: CategoryResponseDTO | null;
}

// Hook personalizado para gerenciar categories
export const useCategoriesActions = () => {
  const router = useRouter();
  const { igrpToast } = useIGRPToast();

  // Estado do componente
  const [state, setState] = useState<CategoriesState>({
    loading: false,
    submitting: false,
    categories: [],
    selectedCategory: null,
  });

  // Função para carregar categorias
  const loadCategories = useCallback(async (params?: {
    active?: boolean;
    parentId?: string;
    sectorId?: string;
    page?: number;
    size?: number;
  }) => {
    setState((prev) => ({ ...prev, loading: true }));

    try {
      const queryParams = new URLSearchParams();
      if (params?.active !== undefined) queryParams.set('active', String(params.active));
      if (params?.parentId) queryParams.set('parentId', params.parentId);
      if (params?.sectorId) queryParams.set('sectorId', params.sectorId);
      if (params?.page) queryParams.set('page', String(params.page));
      if (params?.size) queryParams.set('size', String(params.size));

      const response = await fetch(`/api/categories?${queryParams.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch categories');
      
      const data = await response.json();
      setState((prev) => ({ ...prev, loading: false, categories: data.content || [] }));
    } catch (error) {
      console.error('Error loading categories:', error);
      igrpToast({
        title: 'Erro',
        description: 'Falha ao carregar categorias',
        type: 'default',
      });
      setState((prev) => ({ ...prev, loading: false }));
    }
  }, [igrpToast]);

  // Função para carregar categoria por ID
  const loadCategoryById = useCallback(async (id: string) => {
    setState((prev) => ({ ...prev, loading: true }));

    try {
      const response = await fetch(`/api/categories/${id}`);
      if (!response.ok) throw new Error('Failed to fetch category');
      
      const category = await response.json();
      setState((prev) => ({ ...prev, loading: false, selectedCategory: category }));
      return category;
    } catch (error) {
      console.error('Error loading category:', error);
      igrpToast({
        title: 'Erro',
        description: 'Falha ao carregar categoria',
        type: 'default',
      });
      setState((prev) => ({ ...prev, loading: false }));
      throw error;
    }
  }, [igrpToast]);

  // Função para criar categoria
  const createCategory = useCallback(async (categoryData: CategoryRequestDTO) => {
    setState((prev) => ({ ...prev, submitting: true }));

    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(categoryData),
      });

      if (!response.ok) throw new Error('Failed to create category');
      
      const newCategory = await response.json();
      setState((prev) => ({
        ...prev,
        submitting: false,
        categories: [...prev.categories, newCategory],
      }));

      igrpToast({
        title: 'Categoria criada',
        description: 'A categoria foi criada com sucesso.',
        type: 'success',
      });

      return newCategory;
    } catch (error) {
      console.error('Error creating category:', error);
      igrpToast({
        title: 'Erro',
        description: 'Falha ao criar categoria',
        type: 'default',
      });
      setState((prev) => ({ ...prev, submitting: false }));
      throw error;
    }
  }, [igrpToast]);

  // Função para atualizar categoria
  const updateCategory = useCallback(async (id: string, categoryData: CategoryRequestDTO) => {
    setState((prev) => ({ ...prev, submitting: true }));

    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(categoryData),
      });

      if (!response.ok) throw new Error('Failed to update category');
      
      const updatedCategory = await response.json();
      setState((prev) => ({
        ...prev,
        submitting: false,
        categories: prev.categories.map(cat => cat.id === id ? updatedCategory : cat),
        selectedCategory: prev.selectedCategory?.id === id ? updatedCategory : prev.selectedCategory,
      }));

      igrpToast({
        title: 'Categoria atualizada',
        description: 'A categoria foi atualizada com sucesso.',
        type: 'success',
      });

      return updatedCategory;
    } catch (error) {
      console.error('Error updating category:', error);
      igrpToast({
        title: 'Erro',
        description: 'Falha ao atualizar categoria',
        type: 'default',
      });
      setState((prev) => ({ ...prev, submitting: false }));
      throw error;
    }
  }, [igrpToast]);

  // Função para mover categoria
  const moveCategory = useCallback(async (id: string, moveData: {
    newParentId?: string | null;
    newPosition?: number;
    targetSectorId?: string;
  }) => {
    setState((prev) => ({ ...prev, submitting: true }));

    try {
      const response = await fetch(`/api/categories/${id}/move`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(moveData),
      });

      if (!response.ok) throw new Error('Failed to move category');
      
      const movedCategory = await response.json();
      setState((prev) => ({
        ...prev,
        submitting: false,
        categories: prev.categories.map(cat => cat.id === id ? movedCategory : cat),
      }));

      igrpToast({
        title: 'Categoria movida',
        description: 'A categoria foi movida com sucesso.',
        type: 'success',
      });

      return movedCategory;
    } catch (error) {
      console.error('Error moving category:', error);
      igrpToast({
        title: 'Erro',
        description: 'Falha ao mover categoria',
        type: 'default',
      });
      setState((prev) => ({ ...prev, submitting: false }));
      throw error;
    }
  }, [igrpToast]);

  // Função para deletar categoria
  const deleteCategory = useCallback(async (id: string) => {
    setState((prev) => ({ ...prev, submitting: true }));

    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete category');
      
      setState((prev) => ({
        ...prev,
        submitting: false,
        categories: prev.categories.filter(cat => cat.id !== id),
        selectedCategory: prev.selectedCategory?.id === id ? null : prev.selectedCategory,
      }));

      igrpToast({
        title: 'Categoria removida',
        description: 'A categoria foi removida com sucesso.',
        type: 'success',
      });
    } catch (error) {
      console.error('Error deleting category:', error);
      igrpToast({
        title: 'Erro',
        description: 'Falha ao remover categoria',
        type: 'default',
      });
      setState((prev) => ({ ...prev, submitting: false }));
      throw error;
    }
  }, [igrpToast]);

  return {
    state,
    loadCategories,
    loadCategoryById,
    createCategory,
    updateCategory,
    moveCategory,
    deleteCategory,
  };
};

export default useCategoriesActions;
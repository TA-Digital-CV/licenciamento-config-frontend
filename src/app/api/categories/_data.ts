/* Shared in-memory mock data for Categories API */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

export type CategoryRecord = {
  id: string;
  name: string;
  description?: string;
  code: string;
  parentCategoryId?: string;
  parentCategoryName?: string;
  // Added optional sector relation to support filtering and display
  sectorId?: string;
  sectorName?: string;
  active: boolean;
  sortOrder?: number;
  metadata?: any;
  createdAt?: string;
  updatedAt?: string;
};

export const mockCategories: CategoryRecord[] = [
  { id: '10', name: 'Alimentos e Bebidas', description: 'Produtos alimentares', code: 'CAT_ALIM', active: true, sortOrder: 1, metadata: null, sectorId: '5', sectorName: 'Comércio e Serviços' },
  { id: '11', name: 'Hospedagem', description: 'Hotéis e similares', code: 'CAT_HOTEL', active: true, sortOrder: 2, metadata: null, sectorId: '4', sectorName: 'Turismo e Hotelaria' },
  { id: '12', name: 'Transporte', description: 'Transportes diversos', code: 'CAT_TRANS', active: true, sortOrder: 3, metadata: null, sectorId: '8', sectorName: 'Transportes e Logística' },
];
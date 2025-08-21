/* Shared in-memory mock data for Licence Types API */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

export type LicenceTypeRecord = {
  id: string;
  name: string;
  description?: string;
  code: string;
  categoryId?: string;
  categoryName?: string;
  active: boolean;
  sortOrder?: number;
  metadata?: any;
  createdAt?: string;
  updatedAt?: string;
};

export const mockLicenceTypes: LicenceTypeRecord[] = [
  { id: '100', name: 'Licença de Hotelaria', description: 'Operação de hotéis', code: 'LIC_HOTEL', categoryId: '11', categoryName: 'Hospedagem', active: true, sortOrder: 1, metadata: null },
  { id: '101', name: 'Licença de Restaurante', description: 'Serviço de restauração', code: 'LIC_REST', categoryId: '11', categoryName: 'Hospedagem', active: true, sortOrder: 2, metadata: null },
  { id: '102', name: 'Licença de Transporte Urbano', description: 'Transporte urbano de passageiros', code: 'LIC_URB', categoryId: '12', categoryName: 'Transporte', active: true, sortOrder: 3, metadata: null },
];
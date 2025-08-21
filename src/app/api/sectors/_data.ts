/* Shared in-memory mock data for Sectors API */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

export type SectorRecord = {
  id: string;
  name: string;
  description?: string;
  code: string;
  sectorTypeKey: string;
  sectorTypeValue?: string;
  active: boolean;
  sortOrder?: number;
  metadata?: any;
  createdAt?: string;
  updatedAt?: string;
};

// Mock data based on backend documentation
export const mockSectors: SectorRecord[] = [
  {
    id: '1',
    name: 'Agricultura e Pecuária',
    description: 'Sector primário dedicado à produção agrícola e pecuária',
    code: 'AGR',
    sectorTypeKey: 'PRIMARY',
    sectorTypeValue: 'Sector Primário',
    active: true,
    sortOrder: 1,
    metadata: { color: '#4ade80', icon: 'plant' },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    name: 'Pesca e Recursos Marinhos',
    description: 'Exploração sustentável dos recursos pesqueiros',
    code: 'PESC',
    sectorTypeKey: 'PRIMARY',
    sectorTypeValue: 'Sector Primário',
    active: true,
    sortOrder: 2,
    metadata: { color: '#3b82f6', icon: 'fish' },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '3',
    name: 'Indústria Alimentar',
    description: 'Transformação e processamento de alimentos',
    code: 'IND_ALIM',
    sectorTypeKey: 'SECONDARY',
    sectorTypeValue: 'Sector Secundário',
    active: true,
    sortOrder: 3,
    metadata: { color: '#f59e0b', icon: 'factory' },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '4',
    name: 'Turismo e Hotelaria',
    description: 'Serviços de turismo, hotelaria e restauração',
    code: 'TUR',
    sectorTypeKey: 'TERTIARY',
    sectorTypeValue: 'Sector Terciário',
    active: true,
    sortOrder: 4,
    metadata: { color: '#ec4899', icon: 'hotel' },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '5',
    name: 'Comércio e Serviços',
    description: 'Atividades comerciais e prestação de serviços',
    code: 'COM',
    sectorTypeKey: 'TERTIARY',
    sectorTypeValue: 'Sector Terciário',
    active: true,
    sortOrder: 5,
    metadata: { color: '#8b5cf6', icon: 'shop' },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '6',
    name: 'Energia e Recursos Naturais',
    description: 'Exploração de recursos energéticos e minerais',
    code: 'ENER',
    sectorTypeKey: 'PRIMARY',
    sectorTypeValue: 'Sector Primário',
    active: true,
    sortOrder: 6,
    metadata: { color: '#f97316', icon: 'energy' },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '7',
    name: 'Construção Civil',
    description: 'Sector da construção e obras públicas',
    code: 'CONST',
    sectorTypeKey: 'SECONDARY',
    sectorTypeValue: 'Sector Secundário',
    active: true,
    sortOrder: 7,
    metadata: { color: '#64748b', icon: 'building' },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '8',
    name: 'Transportes e Logística',
    description: 'Serviços de transporte e logística',
    code: 'TRANS',
    sectorTypeKey: 'TERTIARY',
    sectorTypeValue: 'Sector Terciário',
    active: true,
    sortOrder: 8,
    metadata: { color: '#06b6d4', icon: 'truck' },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
];
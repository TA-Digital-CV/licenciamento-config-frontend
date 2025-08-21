/* Shared in-memory mock data for Dossier General Data API */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

// Based on T_LICENSE_PARAMETER table from backend documentation
export type GeneralDataRecord = {
  id: string;
  licenseTypeId: string;
  licenseTypeName?: string;
  parameterName: string;
  parameterValue: string;
  parameterType: 'STRING' | 'NUMBER' | 'BOOLEAN' | 'DATE' | 'JSON';
  description?: string;
  isRequired: boolean;
  isEditable: boolean;
  displayOrder?: number;
  validationRules?: string; // JSON string with validation rules
  defaultValue?: string;
  category?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
};

export const mockGeneralData: GeneralDataRecord[] = [
  {
    id: '1',
    licenseTypeId: '100',
    licenseTypeName: 'Licença de Hotelaria',
    parameterName: 'capacidade_maxima',
    parameterValue: '200',
    parameterType: 'NUMBER',
    description: 'Capacidade máxima de hóspedes',
    isRequired: true,
    isEditable: true,
    displayOrder: 1,
    validationRules: '{"min": 1, "max": 1000}',
    defaultValue: '50',
    category: 'CAPACIDADE',
    active: true,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
    createdBy: 'admin',
    updatedBy: 'admin'
  },
  {
    id: '2',
    licenseTypeId: '100',
    licenseTypeName: 'Licença de Hotelaria',
    parameterName: 'area_construida',
    parameterValue: '1500.5',
    parameterType: 'NUMBER',
    description: 'Área construída em metros quadrados',
    isRequired: true,
    isEditable: true,
    displayOrder: 2,
    validationRules: '{"min": 100, "max": 10000}',
    defaultValue: '500',
    category: 'INFRAESTRUTURA',
    active: true,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
    createdBy: 'admin',
    updatedBy: 'admin'
  },
  {
    id: '3',
    licenseTypeId: '101',
    licenseTypeName: 'Licença de Restaurante',
    parameterName: 'numero_mesas',
    parameterValue: '25',
    parameterType: 'NUMBER',
    description: 'Número de mesas disponíveis',
    isRequired: true,
    isEditable: true,
    displayOrder: 1,
    validationRules: '{"min": 5, "max": 100}',
    defaultValue: '10',
    category: 'CAPACIDADE',
    active: true,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
    createdBy: 'admin',
    updatedBy: 'admin'
  },
  {
    id: '4',
    licenseTypeId: '101',
    licenseTypeName: 'Licença de Restaurante',
    parameterName: 'possui_terraco',
    parameterValue: 'true',
    parameterType: 'BOOLEAN',
    description: 'Indica se o restaurante possui terraço',
    isRequired: false,
    isEditable: true,
    displayOrder: 3,
    validationRules: '{}',
    defaultValue: 'false',
    category: 'INFRAESTRUTURA',
    active: true,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
    createdBy: 'admin',
    updatedBy: 'admin'
  },
  {
    id: '5',
    licenseTypeId: '102',
    licenseTypeName: 'Licença de Transporte Urbano',
    parameterName: 'data_inicio_operacao',
    parameterValue: '2024-03-01',
    parameterType: 'DATE',
    description: 'Data prevista para início das operações',
    isRequired: true,
    isEditable: true,
    displayOrder: 1,
    validationRules: '{"minDate": "2024-01-01"}',
    defaultValue: '',
    category: 'OPERACIONAL',
    active: true,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
    createdBy: 'admin',
    updatedBy: 'admin'
  }
];
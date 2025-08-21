/* Shared in-memory mock data for Options API */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

export type OptionRecord = {
  id: string;
  ccode: string;
  ckey: string;
  cvalue: string;
  locale: string;
  sort_order?: number;
  active?: boolean;
  description?: string;
  metadata?: any;
};

// Mock data based on PR00-BE-LIC-Parametrizacao-Base-Options.md
export const mockOptions: OptionRecord[] = [
  // Estados de Licenças
  { id: '1', ccode: 'LICENSE_STATUS', ckey: 'DRAFT', cvalue: 'Rascunho', locale: 'pt-CV', sort_order: 1, active: true, description: 'Licença em fase de preparação', metadata: null },
  { id: '2', ccode: 'LICENSE_STATUS', ckey: 'PENDING', cvalue: 'Pendente', locale: 'pt-CV', sort_order: 2, active: true, description: 'Licença submetida para análise', metadata: null },
  { id: '3', ccode: 'LICENSE_STATUS', ckey: 'UNDER_REVIEW', cvalue: 'Em Análise', locale: 'pt-CV', sort_order: 3, active: true, description: 'Licença em processo de avaliação', metadata: null },
  { id: '4', ccode: 'LICENSE_STATUS', ckey: 'APPROVED', cvalue: 'Aprovada', locale: 'pt-CV', sort_order: 4, active: true, description: 'Licença aprovada e ativa', metadata: null },
  { id: '5', ccode: 'LICENSE_STATUS', ckey: 'REJECTED', cvalue: 'Rejeitada', locale: 'pt-CV', sort_order: 5, active: true, description: 'Licença rejeitada', metadata: null },
  { id: '6', ccode: 'LICENSE_STATUS', ckey: 'SUSPENDED', cvalue: 'Suspensa', locale: 'pt-CV', sort_order: 6, active: true, description: 'Licença temporariamente suspensa', metadata: null },
  { id: '7', ccode: 'LICENSE_STATUS', ckey: 'EXPIRED', cvalue: 'Expirada', locale: 'pt-CV', sort_order: 7, active: true, description: 'Licença expirada', metadata: null },
  { id: '8', ccode: 'LICENSE_STATUS', ckey: 'CANCELLED', cvalue: 'Cancelada', locale: 'pt-CV', sort_order: 8, active: true, description: 'Licença cancelada pelo titular', metadata: null },

  // Tipos de Entidades Reguladoras
  { id: '9', ccode: 'ENTITY_TYPE', ckey: 'MINISTRY', cvalue: 'Ministério', locale: 'pt-CV', sort_order: 1, active: true, description: 'Ministério do governo', metadata: null },
  { id: '10', ccode: 'ENTITY_TYPE', ckey: 'AGENCY', cvalue: 'Agência', locale: 'pt-CV', sort_order: 2, active: true, description: 'Agência reguladora', metadata: null },
  { id: '11', ccode: 'ENTITY_TYPE', ckey: 'INSPECTION', cvalue: 'Inspeção', locale: 'pt-CV', sort_order: 3, active: true, description: 'Órgão de inspeção', metadata: null },
  { id: '12', ccode: 'ENTITY_TYPE', ckey: 'MUNICIPALITY', cvalue: 'Câmara Municipal', locale: 'pt-CV', sort_order: 4, active: true, description: 'Autoridade municipal', metadata: null },
  { id: '13', ccode: 'ENTITY_TYPE', ckey: 'INSTITUTE', cvalue: 'Instituto', locale: 'pt-CV', sort_order: 5, active: true, description: 'Instituto público', metadata: null },

  // Modelos de Licenciamento
  { id: '14', ccode: 'LICENSING_MODEL', ckey: 'SIMPLE', cvalue: 'Licenciamento Simples', locale: 'pt-CV', sort_order: 1, active: true, description: 'Processo simplificado', metadata: { duration_days: 30, complexity: 'low' } },
  { id: '15', ccode: 'LICENSING_MODEL', ckey: 'STANDARD', cvalue: 'Licenciamento Padrão', locale: 'pt-CV', sort_order: 2, active: true, description: 'Processo padrão', metadata: { duration_days: 60, complexity: 'medium' } },
  { id: '16', ccode: 'LICENSING_MODEL', ckey: 'COMPLEX', cvalue: 'Licenciamento Complexo', locale: 'pt-CV', sort_order: 3, active: true, description: 'Processo complexo', metadata: { duration_days: 90, complexity: 'high' } },
  { id: '17', ccode: 'LICENSING_MODEL', ckey: 'AUTOMATIC', cvalue: 'Licenciamento Automático', locale: 'pt-CV', sort_order: 4, active: true, description: 'Aprovação automática', metadata: { duration_days: 1, complexity: 'none' } },

  // Unidades de Validade
  { id: '18', ccode: 'VALIDITY_UNIT', ckey: 'DAYS', cvalue: 'Dias', locale: 'pt-CV', sort_order: 1, active: true, description: 'Validade em dias', metadata: null },
  { id: '19', ccode: 'VALIDITY_UNIT', ckey: 'MONTHS', cvalue: 'Meses', locale: 'pt-CV', sort_order: 2, active: true, description: 'Validade em meses', metadata: null },
  { id: '20', ccode: 'VALIDITY_UNIT', ckey: 'YEARS', cvalue: 'Anos', locale: 'pt-CV', sort_order: 3, active: true, description: 'Validade em anos', metadata: null },
  { id: '21', ccode: 'VALIDITY_UNIT', ckey: 'INDEFINITE', cvalue: 'Indefinida', locale: 'pt-CV', sort_order: 4, active: true, description: 'Sem prazo de validade', metadata: null },

  // Tipos de Infração
  { id: '22', ccode: 'INFRACTION_TYPE', ckey: 'MINOR', cvalue: 'Leve', locale: 'pt-CV', sort_order: 1, active: true, description: 'Infração de natureza leve', metadata: null },
  { id: '23', ccode: 'INFRACTION_TYPE', ckey: 'SERIOUS', cvalue: 'Grave', locale: 'pt-CV', sort_order: 2, active: true, description: 'Infração de natureza grave', metadata: null },
  { id: '24', ccode: 'INFRACTION_TYPE', ckey: 'VERY_SERIOUS', cvalue: 'Muito Grave', locale: 'pt-CV', sort_order: 3, active: true, description: 'Infração de natureza muito grave', metadata: null },

  // Tipos de Sector
  { id: '25', ccode: 'SECTOR_TYPE', ckey: 'PRIMARY', cvalue: 'Sector Primário', locale: 'pt-CV', sort_order: 1, active: true, description: 'Sector primário de atividades economicas', metadata: null },
  { id: '26', ccode: 'SECTOR_TYPE', ckey: 'SECONDARY', cvalue: 'Sector Secundário', locale: 'pt-CV', sort_order: 2, active: true, description: 'Sector secundário de atividades economicas', metadata: null },
  { id: '27', ccode: 'SECTOR_TYPE', ckey: 'TERTIARY', cvalue: 'Sector Terciário', locale: 'pt-CV', sort_order: 3, active: true, description: 'Sector terciário de atividades economicas', metadata: null },

  // Tipos de Legislação (TPLEG)
  { id: '28', ccode: 'TPLEG', ckey: 'LAW', cvalue: 'Lei', locale: 'pt-CV', sort_order: 1, active: true, description: 'Lei', metadata: null },
  { id: '29', ccode: 'TPLEG', ckey: 'DECREE', cvalue: 'Decreto', locale: 'pt-CV', sort_order: 2, active: true, description: 'Decreto', metadata: null },
  { id: '30', ccode: 'TPLEG', ckey: 'ORDINANCE', cvalue: 'Portaria', locale: 'pt-CV', sort_order: 3, active: true, description: 'Portaria', metadata: null },
  { id: '31', ccode: 'TPLEG', ckey: 'REGULATION', cvalue: 'Regulamento', locale: 'pt-CV', sort_order: 4, active: true, description: 'Regulamento', metadata: null },

  // Status de Legislação (LEGISLATION_STATUS)
  { id: '32', ccode: 'LEGISLATION_STATUS', ckey: 'ACTIVE', cvalue: 'Ativo', locale: 'pt-CV', sort_order: 1, active: true, description: 'Legislação ativa e em vigor', metadata: null },
  { id: '33', ccode: 'LEGISLATION_STATUS', ckey: 'INACTIVE', cvalue: 'Inativo', locale: 'pt-CV', sort_order: 2, active: true, description: 'Legislação inativa ou revogada', metadata: null },
  { id: '34', ccode: 'LEGISLATION_STATUS', ckey: 'DRAFT', cvalue: 'Rascunho', locale: 'pt-CV', sort_order: 3, active: true, description: 'Legislação em rascunho', metadata: null },

  // Tipos de Processo (PROCESS_TYPE)
  { id: '35', ccode: 'PROCESS_TYPE', ckey: 'NEW', cvalue: 'Novo Pedido', locale: 'pt-CV', sort_order: 1, active: true, description: 'Processo de novo pedido', metadata: null },
  { id: '36', ccode: 'PROCESS_TYPE', ckey: 'RENEWAL', cvalue: 'Renovação', locale: 'pt-CV', sort_order: 2, active: true, description: 'Processo de renovação', metadata: null },
  { id: '37', ccode: 'PROCESS_TYPE', ckey: 'AMENDMENT', cvalue: 'Alteração', locale: 'pt-CV', sort_order: 3, active: true, description: 'Processo de alteração', metadata: null },
  { id: '38', ccode: 'PROCESS_TYPE', ckey: 'TRANSFER', cvalue: 'Transferência', locale: 'pt-CV', sort_order: 4, active: true, description: 'Processo de transferência', metadata: null },

  // Tipos de Taxa (FEE_TYPE)
  { id: '39', ccode: 'FEE_TYPE', ckey: 'APPLICATION', cvalue: 'Taxa de Pedido', locale: 'pt-CV', sort_order: 1, active: true, description: 'Taxa na submissão do pedido', metadata: null },
  { id: '40', ccode: 'FEE_TYPE', ckey: 'ISSUANCE', cvalue: 'Taxa de Emissão', locale: 'pt-CV', sort_order: 2, active: true, description: 'Taxa na emissão da licença', metadata: null },
  { id: '41', ccode: 'FEE_TYPE', ckey: 'RENEWAL', cvalue: 'Taxa de Renovação', locale: 'pt-CV', sort_order: 3, active: true, description: 'Taxa para renovar a licença', metadata: null },
  { id: '42', ccode: 'FEE_TYPE', ckey: 'LATE', cvalue: 'Taxa de Mora', locale: 'pt-CV', sort_order: 4, active: true, description: 'Taxa por atraso', metadata: null },

];
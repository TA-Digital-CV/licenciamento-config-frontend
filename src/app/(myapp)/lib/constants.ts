/**
 * Constantes e enums do sistema de licenciamento
 */

// Status gerais
export enum Status {
  ACTIVE = 'true',
  INACTIVE = 'false',
}

// Status de processos
export enum ProcessStatus {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  IN_ANALYSIS = 'IN_ANALYSIS',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  EXPIRED = 'EXPIRED',
  RENEWED = 'RENEWED',
}

// Tipos de entidade
export enum EntityType {
  COMPANY = 'COMPANY',
  INDIVIDUAL = 'INDIVIDUAL',
  GOVERNMENT = 'GOVERNMENT',
  NGO = 'NGO',
  COOPERATIVE = 'COOPERATIVE',
  ASSOCIATION = 'ASSOCIATION',
}

// Tipos de categoria
export enum CategoryType {
  MAIN = 'MAIN',
  SUB = 'SUB',
  SPECIALTY = 'SPECIALTY',
}

// Tipos de setor
export enum SectorType {
  PRIMARY = 'PRIMARY',
  SECONDARY = 'SECONDARY',
  TERTIARY = 'TERTIARY',
}

// Tipos de taxa
export enum FeeType {
  FIXED = 'FIXED',
  PERCENTAGE = 'PERCENTAGE',
  VARIABLE = 'VARIABLE',
  CALCULATED = 'CALCULATED',
}

// Tipos de cálculo de taxa
export enum FeeCalculationType {
  SIMPLE = 'SIMPLE',
  COMPOUND = 'COMPOUND',
  PROGRESSIVE = 'PROGRESSIVE',
  REGRESSIVE = 'REGRESSIVE',
}

// Tipos de parâmetro de licença
export enum ParameterType {
  TEXT = 'TEXT',
  NUMBER = 'NUMBER',
  DATE = 'DATE',
  BOOLEAN = 'BOOLEAN',
  SELECT = 'SELECT',
  MULTI_SELECT = 'MULTI_SELECT',
  FILE = 'FILE',
}

// Tipos de validação
export enum ValidationType {
  REQUIRED = 'REQUIRED',
  MIN_LENGTH = 'MIN_LENGTH',
  MAX_LENGTH = 'MAX_LENGTH',
  MIN_VALUE = 'MIN_VALUE',
  MAX_VALUE = 'MAX_VALUE',
  PATTERN = 'PATTERN',
  EMAIL = 'EMAIL',
  URL = 'URL',
  DATE_RANGE = 'DATE_RANGE',
}

// Prioridades
export enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

// Níveis de acesso
export enum AccessLevel {
  PUBLIC = 'PUBLIC',
  RESTRICTED = 'RESTRICTED',
  CONFIDENTIAL = 'CONFIDENTIAL',
  SECRET = 'SECRET',
}

// Tipos de documento
export enum DocumentType {
  PDF = 'PDF',
  DOC = 'DOC',
  DOCX = 'DOCX',
  XLS = 'XLS',
  XLSX = 'XLSX',
  JPG = 'JPG',
  JPEG = 'JPEG',
  PNG = 'PNG',
  GIF = 'GIF',
  TXT = 'TXT',
  XML = 'XML',
  JSON = 'JSON',
}

// Constantes de API
export const API_CONSTANTS = {
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
} as const;

// Constantes de paginação
export const PAGINATION_CONSTANTS = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
} as const;

// Constantes de validação
export const VALIDATION_CONSTANTS = {
  MIN_PASSWORD_LENGTH: 8,
  MAX_PASSWORD_LENGTH: 128,
  MIN_USERNAME_LENGTH: 3,
  MAX_USERNAME_LENGTH: 50,
  MIN_NAME_LENGTH: 2,
  MAX_NAME_LENGTH: 100,
  MIN_DESCRIPTION_LENGTH: 10,
  MAX_DESCRIPTION_LENGTH: 1000,
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif'],
  ALLOWED_DOCUMENT_TYPES: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ],
} as const;

// Constantes de formatação
export const FORMAT_CONSTANTS = {
  DATE_FORMAT: 'dd/MM/yyyy',
  DATETIME_FORMAT: 'dd/MM/yyyy HH:mm',
  TIME_FORMAT: 'HH:mm',
  CURRENCY_FORMAT: 'pt-BR',
  CURRENCY_CODE: 'BRL',
  DECIMAL_PLACES: 2,
  PERCENTAGE_DECIMAL_PLACES: 2,
} as const;

// Constantes de cache
export const CACHE_CONSTANTS = {
  DEFAULT_TTL: 5 * 60 * 1000, // 5 minutos
  SHORT_TTL: 1 * 60 * 1000, // 1 minuto
  LONG_TTL: 30 * 60 * 1000, // 30 minutos
  VERY_LONG_TTL: 24 * 60 * 60 * 1000, // 24 horas
} as const;

// Constantes de UI
export const UI_CONSTANTS = {
  DEBOUNCE_DELAY: 300,
  THROTTLE_DELAY: 100,
  ANIMATION_DURATION: 200,
  TOAST_DURATION: 5000,
  MODAL_Z_INDEX: 1000,
  DROPDOWN_Z_INDEX: 999,
  TOOLTIP_Z_INDEX: 998,
} as const;

// Mensagens de erro padrão
export const ERROR_MESSAGES = {
  REQUIRED_FIELD: 'Este campo é obrigatório',
  INVALID_EMAIL: 'Email inválido',
  INVALID_URL: 'URL inválida',
  INVALID_DATE: 'Data inválida',
  INVALID_NUMBER: 'Número inválido',
  MIN_LENGTH: (min: number) => `Mínimo de ${min} caracteres`,
  MAX_LENGTH: (max: number) => `Máximo de ${max} caracteres`,
  MIN_VALUE: (min: number) => `Valor mínimo: ${min}`,
  MAX_VALUE: (max: number) => `Valor máximo: ${max}`,
  INVALID_PATTERN: 'Formato inválido',
  FILE_TOO_LARGE: 'Arquivo muito grande',
  INVALID_FILE_TYPE: 'Tipo de arquivo inválido',
  NETWORK_ERROR: 'Erro de conexão',
  SERVER_ERROR: 'Erro interno do servidor',
  UNAUTHORIZED: 'Não autorizado',
  FORBIDDEN: 'Acesso negado',
  NOT_FOUND: 'Não encontrado',
  CONFLICT: 'Conflito de dados',
  VALIDATION_ERROR: 'Erro de validação',
  UNKNOWN_ERROR: 'Erro desconhecido',
} as const;

// Mensagens de sucesso padrão
export const SUCCESS_MESSAGES = {
  CREATED: 'Criado com sucesso',
  UPDATED: 'Atualizado com sucesso',
  DELETED: 'Excluído com sucesso',
  SAVED: 'Salvo com sucesso',
  SENT: 'Enviado com sucesso',
  IMPORTED: 'Importado com sucesso',
  EXPORTED: 'Exportado com sucesso',
  COPIED: 'Copiado com sucesso',
  MOVED: 'Movido com sucesso',
  RESTORED: 'Restaurado com sucesso',
} as const;

// Labels padrão
export const LABELS = {
  // Ações
  CREATE: 'Criar',
  EDIT: 'Editar',
  DELETE: 'Excluir',
  SAVE: 'Salvar',
  CANCEL: 'Cancelar',
  CONFIRM: 'Confirmar',
  SUBMIT: 'Enviar',
  RESET: 'Limpar',
  SEARCH: 'Pesquisar',
  FILTER: 'Filtrar',
  EXPORT: 'Exportar',
  IMPORT: 'Importar',
  COPY: 'Copiar',
  MOVE: 'Mover',
  RESTORE: 'Restaurar',
  ACTIVATE: 'Ativar',
  DEACTIVATE: 'Desativar',
  APPROVE: 'Aprovar',
  REJECT: 'Rejeitar',

  // Navegação
  BACK: 'Voltar',
  NEXT: 'Próximo',
  PREVIOUS: 'Anterior',
  FIRST: 'Primeiro',
  LAST: 'Último',
  HOME: 'Início',

  // Status
  ACTIVE: 'Ativo',
  INACTIVE: 'Inativo',
  PENDING: 'Pendente',
  APPROVED: 'Aprovado',
  REJECTED: 'Rejeitado',
  CANCELLED: 'Cancelado',
  EXPIRED: 'Expirado',

  // Campos comuns
  NAME: 'Nome',
  DESCRIPTION: 'Descrição',
  CODE: 'Código',
  TYPE: 'Tipo',
  STATUS: 'Status',
  DATE: 'Data',
  TIME: 'Hora',
  VALUE: 'Valor',
  AMOUNT: 'Quantidade',
  PRICE: 'Preço',
  TOTAL: 'Total',
  NOTES: 'Observações',
  COMMENTS: 'Comentários',

  // Entidades
  CATEGORY: 'Categoria',
  CATEGORIES: 'Categorias',
  ENTITY: 'Entidade',
  ENTITIES: 'Entidades',
  SECTOR: 'Setor',
  SECTORS: 'Setores',
  FEE_CATEGORY: 'Categoria de Taxa',
  FEE_CATEGORIES: 'Categorias de Taxa',
  LICENSE_PARAMETER: 'Parâmetro de Licença',
  LICENSE_PARAMETERS: 'Parâmetros de Licença',
  PROCESS_TYPE_FEE: 'Taxa de Tipo de Processo',
  PROCESS_TYPE_FEES: 'Taxas de Tipo de Processo',

  // Mensagens
  NO_DATA: 'Nenhum dado encontrado',
  LOADING: 'Carregando...',
  PROCESSING: 'Processando...',
  PLEASE_WAIT: 'Aguarde...',
  SELECT_OPTION: 'Selecione uma opção',
  ALL: 'Todos',
  NONE: 'Nenhum',
} as const;

// Rotas da aplicação
export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',

  // Categorias
  CATEGORIES: '/categories',
  CATEGORIES_CREATE: '/categories/create',
  CATEGORIES_EDIT: (id: string) => `/categories/${id}/edit`,
  CATEGORIES_VIEW: (id: string) => `/categories/${id}`,

  // Entidades
  ENTITIES: '/entities',
  ENTITIES_CREATE: '/entities/create',
  ENTITIES_EDIT: (id: string) => `/entities/${id}/edit`,
  ENTITIES_VIEW: (id: string) => `/entities/${id}`,

  // Setores
  SECTORS: '/sectors',
  SECTORS_CREATE: '/sectors/create',
  SECTORS_EDIT: (id: string) => `/sectors/${id}/edit`,
  SECTORS_VIEW: (id: string) => `/sectors/${id}`,

  // Categorias de Taxa
  FEE_CATEGORIES: '/fee-categories',
  FEE_CATEGORIES_CREATE: '/fee-categories/create',
  FEE_CATEGORIES_EDIT: (id: string) => `/fee-categories/${id}/edit`,
  FEE_CATEGORIES_VIEW: (id: string) => `/fee-categories/${id}`,

  // Parâmetros de Licença
  LICENSE_PARAMETERS: '/license-parameters',
  LICENSE_PARAMETERS_CREATE: '/license-parameters/create',
  LICENSE_PARAMETERS_EDIT: (id: string) => `/license-parameters/${id}/edit`,
  LICENSE_PARAMETERS_VIEW: (id: string) => `/license-parameters/${id}`,

  // Taxas de Tipo de Processo
  PROCESS_TYPE_FEES: '/process-type-fees',
  PROCESS_TYPE_FEES_CREATE: '/process-type-fees/create',
  PROCESS_TYPE_FEES_EDIT: (id: string) => `/process-type-fees/${id}/edit`,
  PROCESS_TYPE_FEES_VIEW: (id: string) => `/process-type-fees/${id}`,

  // Configurações
  SETTINGS: '/settings',
  PROFILE: '/profile',

  // Autenticação
  LOGIN: '/login',
  LOGOUT: '/logout',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
} as const;

// Permissões
export const PERMISSIONS = {
  // Categorias
  CATEGORIES_VIEW: 'categories:view',
  CATEGORIES_CREATE: 'categories:create',
  CATEGORIES_EDIT: 'categories:edit',
  CATEGORIES_DELETE: 'categories:delete',
  CATEGORIES_MOVE: 'categories:move',

  // Entidades
  ENTITIES_VIEW: 'entities:view',
  ENTITIES_CREATE: 'entities:create',
  ENTITIES_EDIT: 'entities:edit',
  ENTITIES_DELETE: 'entities:delete',

  // Setores
  SECTORS_VIEW: 'sectors:view',
  SECTORS_CREATE: 'sectors:create',
  SECTORS_EDIT: 'sectors:edit',
  SECTORS_DELETE: 'sectors:delete',

  // Categorias de Taxa
  FEE_CATEGORIES_VIEW: 'fee-categories:view',
  FEE_CATEGORIES_CREATE: 'fee-categories:create',
  FEE_CATEGORIES_EDIT: 'fee-categories:edit',
  FEE_CATEGORIES_DELETE: 'fee-categories:delete',

  // Parâmetros de Licença
  LICENSE_PARAMETERS_VIEW: 'license-parameters:view',
  LICENSE_PARAMETERS_CREATE: 'license-parameters:create',
  LICENSE_PARAMETERS_EDIT: 'license-parameters:edit',
  LICENSE_PARAMETERS_DELETE: 'license-parameters:delete',

  // Taxas de Tipo de Processo
  PROCESS_TYPE_FEES_VIEW: 'process-type-fees:view',
  PROCESS_TYPE_FEES_CREATE: 'process-type-fees:create',
  PROCESS_TYPE_FEES_EDIT: 'process-type-fees:edit',
  PROCESS_TYPE_FEES_DELETE: 'process-type-fees:delete',

  // Administração
  ADMIN_VIEW: 'admin:view',
  ADMIN_MANAGE: 'admin:manage',

  // Sistema
  SYSTEM_CONFIG: 'system:config',
  SYSTEM_LOGS: 'system:logs',
  SYSTEM_BACKUP: 'system:backup',
} as const;

// Configurações de tema
export const THEME_CONSTANTS = {
  COLORS: {
    PRIMARY: '#0066cc',
    SECONDARY: '#6c757d',
    SUCCESS: '#28a745',
    WARNING: '#ffc107',
    DANGER: '#dc3545',
    INFO: '#17a2b8',
    LIGHT: '#f8f9fa',
    DARK: '#343a40',
  },
  BREAKPOINTS: {
    XS: '0px',
    SM: '576px',
    MD: '768px',
    LG: '992px',
    XL: '1200px',
    XXL: '1400px',
  },
  SPACING: {
    XS: '0.25rem',
    SM: '0.5rem',
    MD: '1rem',
    LG: '1.5rem',
    XL: '3rem',
  },
} as const;

// Configurações de localização
export const LOCALE_CONSTANTS = {
  DEFAULT_LOCALE: 'pt-BR',
  SUPPORTED_LOCALES: ['pt-BR', 'en-US'],
  DATE_LOCALES: {
    'pt-BR': 'pt-BR',
    'en-US': 'en-US',
  },
  CURRENCY_LOCALES: {
    'pt-BR': 'pt-BR',
    'en-US': 'en-US',
  },
} as const;

// Configurações de ambiente
export const ENV_CONSTANTS = {
  DEVELOPMENT: 'development',
  PRODUCTION: 'production',
  TEST: 'test',
  STAGING: 'staging',
} as const;

// Tipos de log
export enum LogLevel {
  ERROR = 'ERROR',
  WARN = 'WARN',
  INFO = 'INFO',
  DEBUG = 'DEBUG',
  TRACE = 'TRACE',
}

// Configurações de log
export const LOG_CONSTANTS = {
  MAX_LOG_SIZE: 1000,
  LOG_RETENTION_DAYS: 30,
  DEFAULT_LEVEL: LogLevel.INFO,
} as const;

export default {
  Status,
  ProcessStatus,
  EntityType,
  CategoryType,
  SectorType,
  FeeType,
  FeeCalculationType,
  ParameterType,
  ValidationType,
  Priority,
  AccessLevel,
  DocumentType,
  LogLevel,
  API_CONSTANTS,
  PAGINATION_CONSTANTS,
  VALIDATION_CONSTANTS,
  FORMAT_CONSTANTS,
  CACHE_CONSTANTS,
  UI_CONSTANTS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  LABELS,
  ROUTES,
  PERMISSIONS,
  THEME_CONSTANTS,
  LOCALE_CONSTANTS,
  ENV_CONSTANTS,
  LOG_CONSTANTS,
};

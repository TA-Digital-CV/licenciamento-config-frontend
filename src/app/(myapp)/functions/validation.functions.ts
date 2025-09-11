import { z } from 'zod';

// Schema para item de opção individual
export const optionItemSchema = z.object({
  ckey: z
    .string()
    .min(1, 'Chave é obrigatória')
    .transform((s) => s.trim()),
  cvalue: z
    .string()
    .min(1, 'Valor é obrigatório')
    .transform((s) => s.trim()),
  locale: z
    .string()
    .optional()
    .default('pt-CV')
    .transform((s) => s.trim()),
  sortOrder: z.coerce.number().int().min(0, 'Ordenação inválida').default(1),
  active: z.boolean().default(true),
  metadata: z.string().optional().default(''),
  description: z.string().optional().default(''),
});

// Schema para formulário de opções com validação de chaves únicas
export const optionFormSchema = z
  .object({
    ccode: z
      .string()
      .min(1, 'Código é obrigatório')
      .transform((s) => s.trim().toUpperCase()),
    options: z.array(optionItemSchema).min(1, 'Adicione pelo menos um valor'),
  })
  .superRefine((val, ctx) => {
    // Validar ckey único por locale dentro do mesmo code
    const seen = new Set<string>();
    val.options.forEach((item, index) => {
      const key = (item.ckey || '').trim();
      const loc = (item.locale || '').trim();
      if (!key) return; // handled by required rule
      const composite = `${key}::${loc}`; // locale em branco conta como um escopo próprio
      if (seen.has(composite)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Chave duplicada para o mesmo locale',
          path: ['options', index, 'ckey'],
        });
      } else {
        seen.add(composite);
      }
    });
  });

// Schema para formulário de tipos de licença com validações condicionais
export const licenceTypeFormSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  description: z.string().optional().default(''),
  code: z.string().min(1, 'Código é obrigatório'),
  categoryId: z.string().min(1, 'Categoria é obrigatória'),
  // Required by backend
  licensingModelKey: z.string().min(1, 'Modelo de licenciamento é obrigatório'),
  validityPeriod: z.coerce.number().int().min(1, 'Período de validade é obrigatório').optional(),
  validityUnitKey: z.string().optional(),
  // Optional configuration
  renewable: z.boolean().default(false),
  autoRenewal: z.boolean().default(false),
  requiresInspection: z.boolean().default(false),
  requiresPublicConsultation: z.boolean().default(false),
  maxProcessingDays: z.coerce.number().int().min(1, 'Prazo máximo deve ser maior que zero'),
  hasFees: z.boolean().default(false),
  baseFee: z.coerce.number().min(0, 'Valor inválido').optional(),
  currencyCode: z.string().optional().default('CVE'),
  sortOrder: z.coerce.number().int().optional(),
  active: z.boolean().default(true),
  metadata: z.string().optional().default(''),
}).superRefine((val, ctx) => {
  // Validações condicionais baseadas no modelo de licenciamento
  const licensingModel = val.licensingModelKey;
  const isTemporary = licensingModel === 'TEMPORARY';
  const isPermanent = licensingModel === 'PERMANENT';
  const isHybrid = licensingModel === 'HYBRID';
  
  // Validações para modelo TEMPORARY (Provisório)
  if (isTemporary) {
    if (!val.validityPeriod || val.validityPeriod <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Período de validade é obrigatório para modelo Provisório',
        path: ['validityPeriod'],
      });
    }
    if (!val.validityUnitKey || val.validityUnitKey.trim() === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Unidade de validade é obrigatória para modelo Provisório',
        path: ['validityUnitKey'],
      });
    }
  }
  
  // Validações para modelo HYBRID (Híbrido)
  if (isHybrid) {
    if (!val.validityPeriod || val.validityPeriod <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Período de validade é obrigatório para modelo Híbrido',
        path: ['validityPeriod'],
      });
    }
    if (!val.validityUnitKey || val.validityUnitKey.trim() === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Unidade de validade é obrigatória para modelo Híbrido',
        path: ['validityUnitKey'],
      });
    }
  }
  
  // Validações para modelo PERMANENT (Definitivo)
  if (isPermanent) {
    // Para modelo permanente, renovação automática deve estar desabilitada
    if (val.autoRenewal) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Renovação automática não é permitida para modelo Definitivo',
        path: ['autoRenewal'],
      });
    }
  }
  
  // Renovação automática só é permitida se renovável estiver ativado (exceto PERMANENT)
  if (!isPermanent && val.autoRenewal && !val.renewable) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Renovação automática só é permitida quando renovável estiver ativado',
      path: ['autoRenewal'],
    });
  }
  
  // O campo maxProcessingDays agora funciona de forma independente
  
  // Validações para taxas
  if (val.hasFees) {
    if (val.baseFee === undefined || val.baseFee === null || val.baseFee <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Valor base é obrigatório quando possui taxas',
        path: ['baseFee'],
      });
    }
    if (!val.currencyCode || val.currencyCode.trim() === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Moeda é obrigatória quando possui taxas',
        path: ['currencyCode'],
      });
    }
  }
  
  // Validar que prazos de processamento não excedem período de validade
  if (val.maxProcessingDays && val.validityPeriod && val.validityUnitKey) {
    // Converter período de validade para dias para comparação
    let validityInDays = val.validityPeriod;
    if (val.validityUnitKey === 'MONTHS') {
      validityInDays = val.validityPeriod * 30;
    } else if (val.validityUnitKey === 'YEARS') {
      validityInDays = val.validityPeriod * 365;
    } else if (val.validityUnitKey === 'WEEKS') {
      validityInDays = val.validityPeriod * 7;
    }
    
    if (val.maxProcessingDays > validityInDays) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Prazo de processamento não pode exceder o período de validade',
        path: ['maxProcessingDays'],
      });
    }
  }
  
  // Validar metadata JSON quando preenchida
  if (val.metadata && val.metadata.trim() !== '') {
    try {
      JSON.parse(val.metadata);
    } catch {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Metadata deve ser um JSON válido',
        path: ['metadata'],
      });
    }
  }
});

// Tipos TypeScript derivados dos schemas
export type OptionItem = z.infer<typeof optionItemSchema>;
export type OptionFormData = z.infer<typeof optionFormSchema>;
export type LicenceTypeFormData = z.infer<typeof licenceTypeFormSchema>;

// Funções utilitárias de validação
export const validateOptionItem = (data: unknown): OptionItem => {
  return optionItemSchema.parse(data);
};

export const validateOptionForm = (data: unknown): OptionFormData => {
  return optionFormSchema.parse(data);
};

export const validateLicenceTypeForm = (data: unknown): LicenceTypeFormData => {
  return licenceTypeFormSchema.parse(data);
};

// Função para validar metadata JSON
export const parseMetadata = (
  metadata: string | undefined,
): Record<string, unknown> | string | null => {
  if (!metadata || metadata.trim() === '') return null;
  try {
    return JSON.parse(metadata) as Record<string, unknown>;
  } catch {
    return metadata;
  }
};

// Função para serializar metadata
export const serializeMetadata = (
  metadata: Record<string, unknown> | string | null | undefined,
): string => {
  if (metadata === null || metadata === undefined) return '';
  if (typeof metadata === 'string') return metadata;
  try {
    return JSON.stringify(metadata);
  } catch {
    return String(metadata);
  }
};

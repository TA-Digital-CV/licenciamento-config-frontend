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

// Schema para formulário de tipos de licença
export const licenceTypeFormSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  description: z.string().optional().default(''),
  code: z.string().min(1, 'Código é obrigatório'),
  categoryId: z.string().min(1, 'Categoria é obrigatória'),
  // Required by backend
  licensingModelKey: z.string().min(1, 'Modelo de licenciamento é obrigatório'),
  validityPeriod: z.coerce.number().int().min(1, 'Período de validade é obrigatório'),
  validityUnitKey: z.string().min(1, 'Unidade de validade é obrigatória'),
  // Optional configuration
  renewable: z.boolean().default(true),
  autoRenewal: z.boolean().default(false),
  requiresInspection: z.boolean().default(false),
  requiresPublicConsultation: z.boolean().default(false),
  maxProcessingDays: z.coerce.number().int().min(0, 'Valor inválido').optional(),
  hasFees: z.boolean().default(false),
  baseFee: z.coerce.number().min(0, 'Valor inválido').optional(),
  currencyCode: z.string().optional().default('CVE'),
  sortOrder: z.coerce.number().int().optional(),
  active: z.boolean().default(true),
  metadata: z.string().optional().default(''),
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

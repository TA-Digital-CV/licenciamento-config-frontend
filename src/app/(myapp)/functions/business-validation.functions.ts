import { z } from 'zod';

// Schema para formulário de categorias
export const categoryFormSchema = z
  .object({
    name: z
      .string()
      .min(1, 'Nome é obrigatório')
      .transform((s) => s.trim()),
    description: z.string().optional().default(''),
    parentId: z.string().optional(),
    sectorId: z.string().min(1, 'Setor é obrigatório'),
    sortOrder: z.coerce.number().int().min(0, 'Ordenação inválida').default(1),
    active: z.boolean().default(true),
    metadata: z.string().optional().default(''),
  })
  .superRefine((val, ctx) => {
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

// Schema para formulário de entidades
export const entityFormSchema = z
  .object({
    name: z
      .string()
      .min(1, 'Nome é obrigatório')
      .transform((s) => s.trim()),
    description: z.string().optional().default(''),
    code: z
      .string()
      .min(1, 'Código é obrigatório')
      .transform((s) => s.trim().toUpperCase()),
    entityType: z.string().min(1, 'Tipo de entidade é obrigatório'),
    parentId: z.string().optional(),
    sectorId: z.string().min(1, 'Setor é obrigatório'),
    contactInfo: z.string().optional().default(''),
    address: z.string().optional().default(''),
    active: z.boolean().default(true),
    metadata: z.string().optional().default(''),
  })
  .superRefine((val, ctx) => {
    // Validar formato do código
    const codeRegex = /^[A-Z0-9_-]+$/;
    if (!codeRegex.test(val.code)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Código deve conter apenas letras maiúsculas, números, hífen e underscore',
        path: ['code'],
      });
    }

    // Validar email no contactInfo se fornecido
    if (val.contactInfo && val.contactInfo.includes('@')) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(val.contactInfo)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Formato de email inválido no campo de contato',
          path: ['contactInfo'],
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

// Schema para formulário de setores
export const sectorFormSchema = z
  .object({
    name: z
      .string()
      .min(1, 'Nome é obrigatório')
      .transform((s) => s.trim()),
    description: z.string().optional().default(''),
    code: z
      .string()
      .min(1, 'Código é obrigatório')
      .transform((s) => s.trim().toUpperCase()),
    parentId: z.string().optional(),
    sortOrder: z.coerce.number().int().min(0, 'Ordenação inválida').default(1),
    contactInfo: z.string().optional().default(''),
    address: z.string().optional().default(''),
    responsiblePersonId: z.string().optional(),
    active: z.boolean().default(true),
    metadata: z.string().optional().default(''),
  })
  .superRefine((val, ctx) => {
    // Validar formato do código
    const codeRegex = /^[A-Z0-9_-]+$/;
    if (!codeRegex.test(val.code)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Código deve conter apenas letras maiúsculas, números, hífen e underscore',
        path: ['code'],
      });
    }

    // Validar email no contactInfo se fornecido
    if (val.contactInfo && val.contactInfo.includes('@')) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(val.contactInfo)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Formato de email inválido no campo de contato',
          path: ['contactInfo'],
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

// Schema para formulário de categorias de taxas
export const feeCategoryFormSchema = z
  .object({
    name: z
      .string()
      .min(1, 'Nome é obrigatório')
      .transform((s) => s.trim()),
    description: z.string().optional().default(''),
    code: z
      .string()
      .min(1, 'Código é obrigatório')
      .transform((s) => s.trim().toUpperCase()),
    categoryType: z.string().min(1, 'Tipo de categoria é obrigatório'),
    baseAmount: z.coerce.number().min(0, 'Valor base deve ser maior ou igual a zero'),
    currency: z.string().optional().default('CVE'),
    calculationMethod: z.string().min(1, 'Método de cálculo é obrigatório'),
    isPercentage: z.boolean().default(false),
    minAmount: z.coerce.number().min(0, 'Valor mínimo inválido').optional(),
    maxAmount: z.coerce.number().min(0, 'Valor máximo inválido').optional(),
    applicableToTypes: z.array(z.string()).default([]),
    active: z.boolean().default(true),
    metadata: z.string().optional().default(''),
  })
  .superRefine((val, ctx) => {
    // Validar formato do código
    const codeRegex = /^[A-Z0-9_-]+$/;
    if (!codeRegex.test(val.code)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Código deve conter apenas letras maiúsculas, números, hífen e underscore',
        path: ['code'],
      });
    }

    // Validar que valor mínimo não seja maior que valor máximo
    if (
      val.minAmount !== undefined &&
      val.maxAmount !== undefined &&
      val.minAmount > val.maxAmount
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Valor mínimo não pode ser maior que o valor máximo',
        path: ['minAmount'],
      });
    }

    // Validar percentagem
    if (val.isPercentage && val.baseAmount > 100) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Percentagem não pode ser maior que 100%',
        path: ['baseAmount'],
      });
    }

    // Validar que pelo menos um tipo aplicável seja selecionado
    if (val.applicableToTypes.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Selecione pelo menos um tipo aplicável',
        path: ['applicableToTypes'],
      });
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

// Schema para movimentação de categorias
export const categoryMoveSchema = z
  .object({
    newParentId: z.string().optional(),
    newPosition: z.coerce.number().int().min(0, 'Posição deve ser maior ou igual a zero'),
    targetSectorId: z.string().optional(),
  })
  .superRefine((val, ctx) => {
    // Pelo menos um campo deve ser fornecido
    if (!val.newParentId && val.newPosition === undefined && !val.targetSectorId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Pelo menos um campo deve ser fornecido para movimentação',
        path: ['newPosition'],
      });
    }
  });

// Funções de validação de negócio

/**
 * Valida se um código é único dentro do contexto
 */
export const validateUniqueCode = async (
  code: string,
  checkFunction: (code: string, excludeId?: string) => Promise<{ exists: boolean }>,
  excludeId?: string,
): Promise<{ isValid: boolean; message?: string }> => {
  try {
    const result = await checkFunction(code, excludeId);
    if (result.exists) {
      return {
        isValid: false,
        message: 'Este código já está em uso',
      };
    }
    return { isValid: true };
  } catch (error) {
    return {
      isValid: false,
      message: 'Erro ao verificar código',
    };
  }
};

/**
 * Valida hierarquia para evitar referências circulares
 */
export const validateHierarchy = (
  itemId: string,
  parentId?: string,
  hierarchyPath: string[] = [],
): { isValid: boolean; message?: string } => {
  if (!parentId) {
    return { isValid: true };
  }

  if (itemId === parentId) {
    return {
      isValid: false,
      message: 'Um item não pode ser pai de si mesmo',
    };
  }

  if (hierarchyPath.includes(parentId)) {
    return {
      isValid: false,
      message: 'Referência circular detectada na hierarquia',
    };
  }

  return { isValid: true };
};

/**
 * Valida se um item pode ser deletado
 */
export const validateCanDelete = async (
  itemId: string,
  checkFunction: (id: string) => Promise<{ canDelete: boolean; reason?: string }>,
): Promise<{ canDelete: boolean; reason?: string }> => {
  try {
    return await checkFunction(itemId);
  } catch (error) {
    return {
      canDelete: false,
      reason: 'Erro ao verificar se o item pode ser deletado',
    };
  }
};

/**
 * Valida formato de email
 */
export const validateEmail = (email: string): { isValid: boolean; message?: string } => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return {
      isValid: false,
      message: 'Formato de email inválido',
    };
  }
  return { isValid: true };
};

/**
 * Valida formato de JSON
 */
export const validateJSON = (jsonString: string): { isValid: boolean; message?: string } => {
  if (!jsonString || jsonString.trim() === '') {
    return { isValid: true };
  }

  try {
    JSON.parse(jsonString);
    return { isValid: true };
  } catch (error) {
    return {
      isValid: false,
      message: 'JSON inválido',
    };
  }
};

/**
 * Valida se uma data é válida
 */
export const validateDate = (dateString: string): { isValid: boolean; message?: string } => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return {
      isValid: false,
      message: 'Data inválida',
    };
  }
  return { isValid: true };
};

/**
 * Valida se uma data é futura
 */
export const validateFutureDate = (dateString: string): { isValid: boolean; message?: string } => {
  const dateValidation = validateDate(dateString);
  if (!dateValidation.isValid) {
    return dateValidation;
  }

  const date = new Date(dateString);
  const now = new Date();

  if (date <= now) {
    return {
      isValid: false,
      message: 'A data deve ser futura',
    };
  }

  return { isValid: true };
};

/**
 * Valida range de valores numéricos
 */
export const validateNumberRange = (
  value: number,
  min?: number,
  max?: number,
): { isValid: boolean; message?: string } => {
  if (min !== undefined && value < min) {
    return {
      isValid: false,
      message: `Valor deve ser maior ou igual a ${min}`,
    };
  }

  if (max !== undefined && value > max) {
    return {
      isValid: false,
      message: `Valor deve ser menor ou igual a ${max}`,
    };
  }

  return { isValid: true };
};

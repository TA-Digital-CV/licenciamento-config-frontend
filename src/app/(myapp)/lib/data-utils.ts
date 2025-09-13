/**
 * Utilitários para manipulação de dados
 */

// Utilitários para arrays
export const arrayUtils = {
  /**
   * Remove duplicatas de um array
   */
  unique: <T>(array: T[]): T[] => {
    return Array.from(new Set(array));
  },

  /**
   * Remove duplicatas baseado em uma propriedade
   */
  uniqueBy: <T, K extends keyof T>(array: T[], key: K): T[] => {
    const seen = new Set();
    return array.filter((item) => {
      const value = item[key];
      if (seen.has(value)) {
        return false;
      }
      seen.add(value);
      return true;
    });
  },

  /**
   * Agrupa array por propriedade
   */
  groupBy: <T, K extends keyof T>(array: T[], key: K): Record<string, T[]> => {
    return array.reduce(
      (groups, item) => {
        const groupKey = String(item[key]);
        if (!groups[groupKey]) {
          groups[groupKey] = [];
        }
        groups[groupKey].push(item);
        return groups;
      },
      {} as Record<string, T[]>,
    );
  },

  /**
   * Ordena array por propriedade
   */
  sortBy: <T, K extends keyof T>(array: T[], key: K, direction: 'asc' | 'desc' = 'asc'): T[] => {
    return [...array].sort((a, b) => {
      const aVal = a[key];
      const bVal = b[key];

      if (aVal < bVal) return direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return direction === 'asc' ? 1 : -1;
      return 0;
    });
  },

  /**
   * Filtra array por múltiplos critérios
   */
  filterBy: <T>(array: T[], filters: Partial<Record<keyof T, any>>): T[] => {
    return array.filter((item) => {
      return Object.entries(filters).every(([key, value]) => {
        if (value === undefined || value === null || value === '') {
          return true;
        }
        const itemValue = item[key as keyof T];

        if (typeof value === 'string' && typeof itemValue === 'string') {
          return itemValue.toLowerCase().includes(value.toLowerCase());
        }

        return itemValue === value;
      });
    });
  },

  /**
   * Pagina array
   */
  paginate: <T>(
    array: T[],
    page: number,
    limit: number,
  ): {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  } => {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const data = array.slice(startIndex, endIndex);

    return {
      data,
      total: array.length,
      page,
      limit,
      totalPages: Math.ceil(array.length / limit),
    };
  },

  /**
   * Encontra item por propriedade
   */
  findBy: <T, K extends keyof T>(array: T[], key: K, value: T[K]): T | undefined => {
    return array.find((item) => item[key] === value);
  },

  /**
   * Converte array em mapa
   */
  toMap: <T, K extends keyof T>(array: T[], key: K): Map<T[K], T> => {
    return new Map(array.map((item) => [item[key], item]));
  },

  /**
   * Converte array em objeto
   */
  toObject: <T, K extends keyof T>(array: T[], key: K): Record<string, T> => {
    return array.reduce(
      (obj, item) => {
        obj[String(item[key])] = item;
        return obj;
      },
      {} as Record<string, T>,
    );
  },

  /**
   * Calcula diferença entre arrays
   */
  difference: <T>(array1: T[], array2: T[]): T[] => {
    return array1.filter((item) => !array2.includes(item));
  },

  /**
   * Calcula interseção entre arrays
   */
  intersection: <T>(array1: T[], array2: T[]): T[] => {
    return array1.filter((item) => array2.includes(item));
  },

  /**
   * Embaralha array
   */
  shuffle: <T>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  },

  /**
   * Divide array em chunks
   */
  chunk: <T>(array: T[], size: number): T[][] => {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  },
};

// Utilitários para objetos
export const objectUtils = {
  /**
   * Clona objeto profundamente
   */
  deepClone: <T>(obj: T): T => {
    if (obj === null || typeof obj !== 'object') {
      return obj;
    }

    if (obj instanceof Date) {
      return new Date(obj.getTime()) as unknown as T;
    }

    if (obj instanceof Array) {
      return obj.map((item) => objectUtils.deepClone(item)) as unknown as T;
    }

    if (typeof obj === 'object') {
      const cloned = {} as T;
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          cloned[key] = objectUtils.deepClone(obj[key]);
        }
      }
      return cloned;
    }

    return obj;
  },

  /**
   * Mescla objetos profundamente
   */
  deepMerge: <T extends Record<string, any>>(target: T, ...sources: Partial<T>[]): T => {
    if (!sources.length) return target;
    const source = sources.shift();

    if (objectUtils.isObject(target) && objectUtils.isObject(source)) {
      for (const key in source) {
        if (objectUtils.isObject(source[key])) {
          if (!target[key]) Object.assign(target, { [key]: {} });
          objectUtils.deepMerge(target[key] as any, source[key] as any);
        } else {
          Object.assign(target, { [key]: source[key] });
        }
      }
    }

    return objectUtils.deepMerge(target, ...sources);
  },

  /**
   * Verifica se é objeto
   */
  isObject: (item: any): item is Record<string, any> => {
    return item && typeof item === 'object' && !Array.isArray(item);
  },

  /**
   * Obtém valor aninhado por caminho
   */
  get: <T>(obj: any, path: string, defaultValue?: T): T => {
    const keys = path.split('.');
    let result = obj;

    for (const key of keys) {
      if (result === null || result === undefined) {
        return defaultValue as T;
      }
      result = result[key];
    }

    return result !== undefined ? result : (defaultValue as T);
  },

  /**
   * Define valor aninhado por caminho
   */
  set: (obj: any, path: string, value: any): void => {
    const keys = path.split('.');
    let current = obj;

    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      if (!(key in current) || !objectUtils.isObject(current[key])) {
        current[key] = {};
      }
      current = current[key];
    }

    current[keys[keys.length - 1]] = value;
  },

  /**
   * Remove propriedades com valores falsy
   */
  compact: <T extends Record<string, any>>(obj: T): Partial<T> => {
    const result: Partial<T> = {};

    for (const key in obj) {
      if (obj[key]) {
        result[key] = obj[key];
      }
    }

    return result;
  },

  /**
   * Seleciona apenas propriedades especificadas
   */
  pick: <T extends Record<string, any>, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> => {
    const result = {} as Pick<T, K>;

    for (const key of keys) {
      if (key in obj) {
        result[key] = obj[key];
      }
    }

    return result;
  },

  /**
   * Remove propriedades especificadas
   */
  omit: <T extends Record<string, any>, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> => {
    const result = { ...obj };

    for (const key of keys) {
      delete result[key];
    }

    return result;
  },

  /**
   * Transforma chaves do objeto
   */
  mapKeys: <T extends Record<string, any>>(
    obj: T,
    mapper: (key: string) => string,
  ): Record<string, T[keyof T]> => {
    const result: Record<string, T[keyof T]> = {};

    for (const key in obj) {
      result[mapper(key)] = obj[key];
    }

    return result;
  },

  /**
   * Transforma valores do objeto
   */
  mapValues: <T extends Record<string, any>, U>(
    obj: T,
    mapper: (value: T[keyof T], key: string) => U,
  ): Record<keyof T, U> => {
    const result = {} as Record<keyof T, U>;

    for (const key in obj) {
      result[key] = mapper(obj[key], key);
    }

    return result;
  },
};

// Utilitários para strings
export const stringUtils = {
  /**
   * Gera string aleatória
   */
  random: (
    length: number = 10,
    charset: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
  ): string => {
    let result = '';
    for (let i = 0; i < length; i++) {
      result += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return result;
  },

  /**
   * Gera UUID v4
   */
  uuid: (): string => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  },

  /**
   * Converte camelCase para snake_case
   */
  camelToSnake: (str: string): string => {
    return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
  },

  /**
   * Converte snake_case para camelCase
   */
  snakeToCamel: (str: string): string => {
    return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
  },

  /**
   * Converte kebab-case para camelCase
   */
  kebabToCamel: (str: string): string => {
    return str.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
  },

  /**
   * Converte camelCase para kebab-case
   */
  camelToKebab: (str: string): string => {
    return str.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
  },

  /**
   * Escapa caracteres especiais para regex
   */
  escapeRegex: (str: string): string => {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  },

  /**
   * Conta palavras em uma string
   */
  wordCount: (str: string): number => {
    return str
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0).length;
  },

  /**
   * Extrai iniciais de um nome
   */
  initials: (name: string, maxInitials: number = 2): string => {
    return name
      .split(' ')
      .filter((word) => word.length > 0)
      .slice(0, maxInitials)
      .map((word) => word.charAt(0).toUpperCase())
      .join('');
  },
};

// Utilitários para números
export const numberUtils = {
  /**
   * Gera número aleatório entre min e max
   */
  random: (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  /**
   * Limita número entre min e max
   */
  clamp: (value: number, min: number, max: number): number => {
    return Math.min(Math.max(value, min), max);
  },

  /**
   * Arredonda para número de casas decimais
   */
  round: (value: number, decimals: number = 2): number => {
    const factor = Math.pow(10, decimals);
    return Math.round(value * factor) / factor;
  },

  /**
   * Verifica se é número válido
   */
  isValid: (value: any): value is number => {
    return typeof value === 'number' && !isNaN(value) && isFinite(value);
  },

  /**
   * Converte para número ou retorna padrão
   */
  toNumber: (value: any, defaultValue: number = 0): number => {
    const num = Number(value);
    return numberUtils.isValid(num) ? num : defaultValue;
  },

  /**
   * Calcula percentagem
   */
  percentage: (value: number, total: number): number => {
    if (total === 0) return 0;
    return (value / total) * 100;
  },

  /**
   * Soma array de números
   */
  sum: (numbers: number[]): number => {
    return numbers.reduce((sum, num) => sum + num, 0);
  },

  /**
   * Calcula média
   */
  average: (numbers: number[]): number => {
    if (numbers.length === 0) return 0;
    return numberUtils.sum(numbers) / numbers.length;
  },

  /**
   * Encontra valor mínimo
   */
  min: (numbers: number[]): number => {
    return Math.min(...numbers);
  },

  /**
   * Encontra valor máximo
   */
  max: (numbers: number[]): number => {
    return Math.max(...numbers);
  },
};

// Utilitários para datas
export const dateUtils = {
  /**
   * Verifica se data é válida
   */
  isValid: (date: any): boolean => {
    const d = new Date(date);
    return d instanceof Date && !isNaN(d.getTime());
  },

  /**
   * Adiciona dias a uma data
   */
  addDays: (date: Date, days: number): Date => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  },

  /**
   * Adiciona meses a uma data
   */
  addMonths: (date: Date, months: number): Date => {
    const result = new Date(date);
    result.setMonth(result.getMonth() + months);
    return result;
  },

  /**
   * Adiciona anos a uma data
   */
  addYears: (date: Date, years: number): Date => {
    const result = new Date(date);
    result.setFullYear(result.getFullYear() + years);
    return result;
  },

  /**
   * Calcula diferença em dias
   */
  diffInDays: (date1: Date, date2: Date): number => {
    const diffTime = Math.abs(date2.getTime() - date1.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  },

  /**
   * Verifica se data é hoje
   */
  isToday: (date: Date): boolean => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  },

  /**
   * Verifica se data é no passado
   */
  isPast: (date: Date): boolean => {
    return date < new Date();
  },

  /**
   * Verifica se data é no futuro
   */
  isFuture: (date: Date): boolean => {
    return date > new Date();
  },

  /**
   * Obtém início do dia
   */
  startOfDay: (date: Date): Date => {
    const result = new Date(date);
    result.setHours(0, 0, 0, 0);
    return result;
  },

  /**
   * Obtém fim do dia
   */
  endOfDay: (date: Date): Date => {
    const result = new Date(date);
    result.setHours(23, 59, 59, 999);
    return result;
  },

  /**
   * Obtém início do mês
   */
  startOfMonth: (date: Date): Date => {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  },

  /**
   * Obtém fim do mês
   */
  endOfMonth: (date: Date): Date => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
  },
};

// Utilitários para validação
export const validationUtils = {
  /**
   * Verifica se valor está vazio
   */
  isEmpty: (value: any): boolean => {
    if (value === null || value === undefined) return true;
    if (typeof value === 'string') return value.trim().length === 0;
    if (Array.isArray(value)) return value.length === 0;
    if (typeof value === 'object') return Object.keys(value).length === 0;
    return false;
  },

  /**
   * Verifica se todos os valores são válidos
   */
  allValid: (values: any[]): boolean => {
    return values.every((value) => !validationUtils.isEmpty(value));
  },

  /**
   * Verifica se pelo menos um valor é válido
   */
  anyValid: (values: any[]): boolean => {
    return values.some((value) => !validationUtils.isEmpty(value));
  },

  /**
   * Valida range de valores
   */
  inRange: (value: number, min: number, max: number): boolean => {
    return value >= min && value <= max;
  },

  /**
   * Valida comprimento de string
   */
  lengthInRange: (str: string, min: number, max: number): boolean => {
    return str.length >= min && str.length <= max;
  },
};

// Utilitários para performance
export const performanceUtils = {
  /**
   * Debounce function
   */
  debounce: <T extends (...args: any[]) => any>(
    func: T,
    wait: number,
  ): ((...args: Parameters<T>) => void) => {
    let timeout: NodeJS.Timeout;

    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  },

  /**
   * Throttle function
   */
  throttle: <T extends (...args: any[]) => any>(
    func: T,
    limit: number,
  ): ((...args: Parameters<T>) => void) => {
    let inThrottle: boolean;

    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  },

  /**
   * Memoize function
   */
  memoize: <T extends (...args: any[]) => any>(func: T): T => {
    const cache = new Map();

    return ((...args: Parameters<T>) => {
      const key = JSON.stringify(args);

      if (cache.has(key)) {
        return cache.get(key);
      }

      const result = func(...args);
      cache.set(key, result);
      return result;
    }) as T;
  },
};

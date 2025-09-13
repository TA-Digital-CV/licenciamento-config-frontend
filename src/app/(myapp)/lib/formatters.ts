/**
 * Utilitários de formatação para a aplicação
 */

// Formatação de moeda
export const formatCurrency = (
  amount: number,
  currency: string = 'CVE',
  locale: string = 'pt-CV',
): string => {
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch (error) {
    // Fallback para formato simples
    return `${amount.toFixed(2)} ${currency}`;
  }
};

// Formatação de números
export const formatNumber = (
  value: number,
  decimals: number = 2,
  locale: string = 'pt-CV',
): string => {
  try {
    return new Intl.NumberFormat(locale, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(value);
  } catch (error) {
    return value.toFixed(decimals);
  }
};

// Formatação de percentagem
export const formatPercentage = (
  value: number,
  decimals: number = 1,
  locale: string = 'pt-CV',
): string => {
  try {
    return new Intl.NumberFormat(locale, {
      style: 'percent',
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(value / 100);
  } catch (error) {
    return `${value.toFixed(decimals)}%`;
  }
};

// Formatação de datas
export const formatDate = (
  date: string | Date,
  format: 'short' | 'medium' | 'long' | 'full' = 'medium',
  locale: string = 'pt-CV',
): string => {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;

    if (isNaN(dateObj.getTime())) {
      return 'Data inválida';
    }

    const optionsMap: Record<string, Intl.DateTimeFormatOptions> = {
      short: { day: '2-digit', month: '2-digit', year: 'numeric' },
      medium: { day: '2-digit', month: 'short', year: 'numeric' },
      long: { day: '2-digit', month: 'long', year: 'numeric' },
      full: { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' },
    };

    const options = optionsMap[format];

    return new Intl.DateTimeFormat(locale, options).format(dateObj);
  } catch (error) {
    return 'Data inválida';
  }
};

// Formatação de data e hora
export const formatDateTime = (date: string | Date, locale: string = 'pt-CV'): string => {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;

    if (isNaN(dateObj.getTime())) {
      return 'Data inválida';
    }

    return new Intl.DateTimeFormat(locale, {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(dateObj);
  } catch (error) {
    return 'Data inválida';
  }
};

// Formatação de tempo relativo
export const formatRelativeTime = (date: string | Date, locale: string = 'pt-CV'): string => {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return 'Agora mesmo';
    }

    const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

    if (diffInSeconds < 3600) {
      return rtf.format(-Math.floor(diffInSeconds / 60), 'minute');
    }

    if (diffInSeconds < 86400) {
      return rtf.format(-Math.floor(diffInSeconds / 3600), 'hour');
    }

    if (diffInSeconds < 2592000) {
      return rtf.format(-Math.floor(diffInSeconds / 86400), 'day');
    }

    if (diffInSeconds < 31536000) {
      return rtf.format(-Math.floor(diffInSeconds / 2592000), 'month');
    }

    return rtf.format(-Math.floor(diffInSeconds / 31536000), 'year');
  } catch (error) {
    return formatDate(date, 'short', locale);
  }
};

// Formatação de tamanho de arquivo
export const formatFileSize = (bytes: number, locale: string = 'pt-CV'): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  const value = parseFloat((bytes / Math.pow(k, i)).toFixed(2));

  try {
    const formattedValue = new Intl.NumberFormat(locale, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(value);

    return `${formattedValue} ${sizes[i]}`;
  } catch (error) {
    return `${value} ${sizes[i]}`;
  }
};

// Formatação de texto
export const formatText = {
  /**
   * Capitaliza a primeira letra de cada palavra
   */
  titleCase: (text: string): string => {
    return text
      .toLowerCase()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  },

  /**
   * Capitaliza apenas a primeira letra
   */
  capitalize: (text: string): string => {
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  },

  /**
   * Trunca texto com reticências
   */
  truncate: (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength - 3) + '...';
  },

  /**
   * Remove acentos e caracteres especiais
   */
  removeAccents: (text: string): string => {
    return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  },

  /**
   * Converte para slug (URL-friendly)
   */
  toSlug: (text: string): string => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
      .replace(/^-+|-+$/g, '');
  },

  /**
   * Mascara texto sensível
   */
  mask: (text: string, visibleChars: number = 4): string => {
    if (text.length <= visibleChars) {
      return '*'.repeat(text.length);
    }

    const visible = text.slice(-visibleChars);
    const masked = '*'.repeat(text.length - visibleChars);
    return masked + visible;
  },
};

// Formatação de códigos
export const formatCode = {
  /**
   * Formata código com separadores
   */
  withSeparators: (code: string, separator: string = '-', groupSize: number = 4): string => {
    return code
      .replace(new RegExp(`(.{${groupSize}})`, 'g'), `$1${separator}`)
      .replace(new RegExp(`${separator}$`), '');
  },

  /**
   * Formata código de entidade
   */
  entity: (code: string): string => {
    return code.toUpperCase().replace(/[^A-Z0-9]/g, '');
  },

  /**
   * Formata código de setor
   */
  sector: (code: string): string => {
    return code.toUpperCase().replace(/[^A-Z0-9_-]/g, '');
  },
};

// Formatação de status
export const formatStatus = {
  /**
   * Formata status booleano
   */
  boolean: (active: boolean): { label: string; color: string } => {
    return active ? { label: 'Ativo', color: 'success' } : { label: 'Inativo', color: 'error' };
  },

  /**
   * Formata status de processo
   */
  process: (status: string): { label: string; color: string } => {
    const statusMap: Record<string, { label: string; color: string }> = {
      pending: { label: 'Pendente', color: 'warning' },
      approved: { label: 'Aprovado', color: 'success' },
      rejected: { label: 'Rejeitado', color: 'error' },
      draft: { label: 'Rascunho', color: 'info' },
      submitted: { label: 'Submetido', color: 'primary' },
      under_review: { label: 'Em Análise', color: 'warning' },
      completed: { label: 'Concluído', color: 'success' },
      cancelled: { label: 'Cancelado', color: 'error' },
    };

    return statusMap[status] || { label: status, color: 'default' };
  },
};

// Formatação de listas
export const formatList = {
  /**
   * Junta lista com conectores
   */
  join: (items: string[], connector: string = 'e', locale: string = 'pt-CV'): string => {
    if (items.length === 0) return '';
    if (items.length === 1) return items[0];
    if (items.length === 2) return `${items[0]} ${connector} ${items[1]}`;

    const lastItem = items[items.length - 1];
    const otherItems = items.slice(0, -1);

    return `${otherItems.join(', ')} ${connector} ${lastItem}`;
  },

  /**
   * Formata lista numerada
   */
  numbered: (items: string[]): string[] => {
    return items.map((item, index) => `${index + 1}. ${item}`);
  },

  /**
   * Formata lista com bullets
   */
  bulleted: (items: string[], bullet: string = '•'): string[] => {
    return items.map((item) => `${bullet} ${item}`);
  },
};

// Validação de formatos
export const validateFormat = {
  /**
   * Valida formato de email
   */
  email: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  /**
   * Valida formato de telefone (Cabo Verde)
   */
  phone: (phone: string): boolean => {
    const phoneRegex = /^(\+238)?\s?[0-9]{7}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  },

  /**
   * Valida formato de código postal (Cabo Verde)
   */
  postalCode: (code: string): boolean => {
    const postalCodeRegex = /^[0-9]{4}$/;
    return postalCodeRegex.test(code);
  },

  /**
   * Valida formato de URL
   */
  url: (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },

  /**
   * Valida formato de JSON
   */
  json: (jsonString: string): boolean => {
    try {
      JSON.parse(jsonString);
      return true;
    } catch {
      return false;
    }
  },
};

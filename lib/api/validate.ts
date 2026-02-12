/**
 * API input validation utilities
 * Lightweight schema validation for API routes
 */

type ValidationRule = {
  required?: boolean;
  type?: 'string' | 'number' | 'boolean' | 'array' | 'object';
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  enum?: string[];
  message?: string;
};

type Schema = Record<string, ValidationRule>;

interface ValidationResult {
  valid: boolean;
  errors: { field: string; message: string }[];
}

export function validate(data: Record<string, unknown>, schema: Schema): ValidationResult {
  const errors: { field: string; message: string }[] = [];

  for (const [field, rules] of Object.entries(schema)) {
    const value = data[field];

    if (rules.required && (value === undefined || value === null || value === '')) {
      errors.push({ field, message: rules.message || `${field} is required` });
      continue;
    }

    if (value === undefined || value === null) continue;

    if (rules.type) {
      const actualType = Array.isArray(value) ? 'array' : typeof value;
      if (actualType !== rules.type) {
        errors.push({ field, message: `${field} must be a ${rules.type}` });
        continue;
      }
    }

    if (rules.type === 'string' || typeof value === 'string') {
      const str = value as string;
      if (rules.minLength && str.length < rules.minLength) {
        errors.push({ field, message: `${field} must be at least ${rules.minLength} characters` });
      }
      if (rules.maxLength && str.length > rules.maxLength) {
        errors.push({ field, message: `${field} must be at most ${rules.maxLength} characters` });
      }
      if (rules.pattern && !rules.pattern.test(str)) {
        errors.push({ field, message: rules.message || `${field} format is invalid` });
      }
      if (rules.enum && !rules.enum.includes(str)) {
        errors.push({ field, message: `${field} must be one of: ${rules.enum.join(', ')}` });
      }
    }

    if (rules.type === 'number' || typeof value === 'number') {
      const num = value as number;
      if (rules.min !== undefined && num < rules.min) {
        errors.push({ field, message: `${field} must be at least ${rules.min}` });
      }
      if (rules.max !== undefined && num > rules.max) {
        errors.push({ field, message: `${field} must be at most ${rules.max}` });
      }
    }
  }

  return { valid: errors.length === 0, errors };
}

// ─── Common Schemas ────────────────────────────────────────────────

export const SCHEMAS = {
  createTask: {
    title: { required: true, type: 'string' as const, minLength: 3, maxLength: 200 },
    description: { required: true, type: 'string' as const, minLength: 10, maxLength: 5000 },
    category: {
      required: true,
      type: 'string' as const,
      enum: ['pickups', 'meetings', 'document_signing', 'reconnaissance', 'verification', 'events', 'hardware_setup', 'real_estate', 'product_testing', 'errands', 'photography', 'purchases'],
    },
    location: { required: true, type: 'string' as const, minLength: 2 },
    pay_amount: { required: true, type: 'number' as const, min: 1, max: 50000 },
    pay_type: { type: 'string' as const, enum: ['fixed', 'hourly'] },
    priority: { type: 'string' as const, enum: ['low', 'medium', 'high', 'urgent'] },
  },

  createBooking: {
    task_id: { required: true, type: 'string' as const },
    human_id: { required: true, type: 'string' as const },
    payment_method: {
      required: true,
      type: 'string' as const,
      enum: ['usdc_ethereum', 'usdc_polygon', 'usdc_base', 'usdt_trc20', 'usdt_erc20', 'eth', 'btc', 'sol', 'wechat_pay', 'alipay'],
    },
  },

  login: {
    email: { required: true, type: 'string' as const, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Valid email is required' },
    password: { required: true, type: 'string' as const, minLength: 6 },
  },

  signup: {
    name: { required: true, type: 'string' as const, minLength: 2, maxLength: 100 },
    email: { required: true, type: 'string' as const, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Valid email is required' },
    password: { required: true, type: 'string' as const, minLength: 8, maxLength: 128 },
    location: { type: 'string' as const, maxLength: 200 },
  },

  review: {
    rating: { required: true, type: 'number' as const, min: 1, max: 5 },
    comment: { type: 'string' as const, maxLength: 2000 },
  },
} as const;

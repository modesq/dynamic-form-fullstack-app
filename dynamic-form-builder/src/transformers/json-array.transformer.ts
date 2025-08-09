import { ValueTransformer } from 'typeorm';

export class JsonArrayTransformer<T = string> implements ValueTransformer {
  constructor(private defaultValue: T[] = []) {}

  to(value: T[]): string {
    if (!value || !Array.isArray(value)) {
      return JSON.stringify(this.defaultValue);
    }
    return JSON.stringify(value);
  }

  from(value: string): T[] {
    if (!value) return this.defaultValue;
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : this.defaultValue;
    } catch (error) {
      console.error('JSON parsing error:', error);
      return this.defaultValue;
    }
  }
}
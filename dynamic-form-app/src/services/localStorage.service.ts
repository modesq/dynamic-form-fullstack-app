import { FormSubmission } from '../types/form.types';

export class LocalStorageService {
  private static isClient = typeof window !== 'undefined';

  static getFormData(key: string): FormSubmission | null {
    if (!this.isClient) return null;
    
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return null;
    }
  }

  static saveFormData(key: string, data: FormSubmission): void {
    if (!this.isClient) return;
    
    try {
      const filteredData: FormSubmission = {};
      Object.entries(data).forEach(([key, value]) => {
        if (value !== '' && value !== undefined && value !== null) {
          filteredData[key] = value;
        }
      });

      if (Object.keys(filteredData).length > 0) {
        localStorage.setItem(key, JSON.stringify(filteredData));
      } else {
        localStorage.removeItem(key);
      }
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }

  static clearFormData(key: string): void {
    if (!this.isClient) return;
    
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }
}
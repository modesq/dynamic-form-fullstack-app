import { FormFieldConfig } from '../types/form.types';

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isEmailField = (fieldName: string): boolean => {
  return fieldName.toLowerCase().includes('email');
};

export const validateField = (fieldName: string, value: string, field: FormFieldConfig): string => {
  // Check if field is required and empty
  if (field.required && (!value || value.trim() === '')) {
    return `${field.name} is required`;
  }

  // Validate email format
  if (value && isEmailField(fieldName) && !isValidEmail(value)) {
    return 'Please enter a valid email address';
  }

  // Validate min/max length for TEXT fields
  if (field.fieldType === 'TEXT' && value) {
    if (field.minLength && value.length < field.minLength) {
      return `${field.name} must be at least ${field.minLength} characters`;
    }
    if (field.maxLength && value.length > field.maxLength) {
      return `${field.name} must be no more than ${field.maxLength} characters`;
    }
  }

  return '';
};

export const validateAllFields = (
  formData: Record<string, string | boolean>, 
  fields: FormFieldConfig[]
): Record<string, string> => {
  const errors: Record<string, string> = {};
  
  fields.forEach(field => {
    const value = formData[field.name] || '';
    const error = validateField(field.name, value as string, field);
    if (error) {
      errors[field.name] = error;
    }
  });

  return errors;
};
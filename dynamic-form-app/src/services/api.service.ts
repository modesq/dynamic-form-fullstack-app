import { FormConfigResponse, FormSubmission } from '../types/form.types';

const API_BASE_URL = 'http://localhost:3000/api';

interface ApiErrorData {
  message?: string | string[];
  error?: string;
  detail?: string;
}

interface ApiError extends Error {
  response?: {
    data?: ApiErrorData;
    status?: number;
  };
}

interface ApiResponse<T = unknown> {
  data?: T;
  message?: string;
  status?: string;
}

interface TransformedFormData {
  fullName?: string;
  email?: string;
  gender?: string;
  loveReactFlag?: boolean;
  [key: string]: string | boolean | undefined;
}

export class ApiService {
  static async getFormConfig(): Promise<FormConfigResponse> {
    const response = await fetch(`${API_BASE_URL}/form-fields/config`);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const error = new Error(errorData.message || 'Failed to fetch form configuration') as ApiError;
      error.response = { data: errorData, status: response.status };
      throw error;
    }
    
    return response.json();
  }

  // Transform form data to match backend API format
  private static transformFormData(data: FormSubmission): TransformedFormData {
    const transformed: TransformedFormData = {};
    
    // Map frontend field names to backend field names
    Object.keys(data).forEach(key => {
      const value = data[key];
      
      switch (key.toLowerCase()) {
        case 'full name':
          transformed.fullName = value as string;
          break;
        case 'email':
          transformed.email = value as string;
          break;
        case 'gender':
          transformed.gender = value as string;
          break;
        case 'love react?':
          transformed.loveReactFlag = value === 'Yes' || value === true;
          break;
        default:
          // For any other fields, use camelCase conversion
          const camelKey = key.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
            return index === 0 ? word.toLowerCase() : word.toUpperCase();
          }).replace(/\s+/g, '');
          transformed[camelKey] = value as string;
      }
    });
    
    return transformed;
  }

  static async submitFormData(data: FormSubmission): Promise<ApiResponse> {
    const transformedData = this.transformFormData(data);
    console.log('Original form data:', data);
    console.log('Transformed data for API:', transformedData);
    
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(transformedData),
    });

    console.log('Response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.log('Error data from API:', errorData);
      
      const error = new Error(errorData.message || 'Failed to submit form data') as ApiError;
      error.response = { data: errorData, status: response.status };
      throw error;
    }

    return response.json();
  }
}
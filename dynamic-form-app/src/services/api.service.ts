import { FormConfigResponse, FormSubmission } from '../types/form.types';

const API_BASE_URL = 'http://localhost:3000/api';

export class ApiService {
  static async getFormConfig(): Promise<FormConfigResponse> {
    const response = await fetch(`${API_BASE_URL}/form-fields/config`);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const error: any = new Error(errorData.message || 'Failed to fetch form configuration');
      error.response = { data: errorData, status: response.status };
      throw error;
    }
    
    return response.json();
  }

  // Transform form data to match backend API format
  private static transformFormData(data: FormSubmission): any {
    const transformed: any = {};
    
    // Map frontend field names to backend field names
    Object.keys(data).forEach(key => {
      switch (key.toLowerCase()) {
        case 'full name':
          transformed.fullName = data[key];
          break;
        case 'email':
          transformed.email = data[key];
          break;
        case 'gender':
          transformed.gender = data[key];
          break;
        case 'love react?':
          transformed.loveReactFlag = data[key] === 'Yes' || data[key] === true;
          break;
        default:
          // For any other fields, use camelCase conversion
          const camelKey = key.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
            return index === 0 ? word.toLowerCase() : word.toUpperCase();
          }).replace(/\s+/g, '');
          transformed[camelKey] = data[key];
      }
    });
    
    return transformed;
  }

  static async submitFormData(data: FormSubmission) {
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
      
      const error: any = new Error(errorData.message || 'Failed to submit form data');
      error.response = { data: errorData, status: response.status };
      throw error;
    }

    return response.json();
  }
}
export interface FormFieldConfig {
  id: number;
  name: string;
  fieldType: 'TEXT' | 'LIST' | 'RADIO';
  minLength?: number;
  maxLength?: number;
  defaultValue?: string;
  required: boolean;
  listOfValues1?: string[];
}

export interface FormConfigResponse {
  data: FormFieldConfig[];
}

export interface FormSubmission {
  [key: string]: string | boolean;
}
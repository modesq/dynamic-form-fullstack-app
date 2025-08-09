import React from 'react';
import { TextField } from '@mui/material';
import { FormFieldConfig } from '../../../types/form.types';
import { isEmailField } from '../../../utils/formValidation';

interface TextFieldRendererProps {
  field: FormFieldConfig;
  value: string;
  error?: string;
  onChange: (value: string) => void;
}

export const TextFieldRenderer: React.FC<TextFieldRendererProps> = ({
  field,
  value,
  error,
  onChange
}) => {
  const inputType = isEmailField(field.name) ? 'email' : 'text';
  
  return (
    <TextField
      fullWidth
      type={inputType}
      label={field.name}
      required={field.required}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      variant="outlined"
      error={!!error}
      helperText={error || (
        field.minLength || field.maxLength
          ? `${field.minLength ? `Min: ${field.minLength}` : ''} ${
              field.maxLength ? `Max: ${field.maxLength}` : ''
            }`
          : undefined
      )}
      inputProps={{
        minLength: field.minLength,
        maxLength: field.maxLength,
      }}
    />
  );
};
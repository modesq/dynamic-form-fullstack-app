import React from 'react';
import { Box } from '@mui/material';
import { FormFieldConfig } from '../../types/form.types';
import { TextFieldRenderer } from './fields/TextFieldRenderer';
import { SelectFieldRenderer } from './fields/SelectFieldRenderer';
import { RadioFieldRenderer } from './fields/RadioFieldRenderer';
import { spacing } from '../../utils/spacing';

interface FieldRendererProps {
  field: FormFieldConfig;
  value: string;
  error?: string;
  onChange: (value: string) => void;
}

export const FieldRenderer: React.FC<FieldRendererProps> = ({
  field,
  value,
  error,
  onChange
}) => {
  const fieldProps = { field, value, error, onChange };

  const renderFieldComponent = () => {
    switch (field.fieldType) {
      case 'TEXT':
        return <TextFieldRenderer {...fieldProps} />;
      
      case 'LIST':
        return <SelectFieldRenderer {...fieldProps} />;
      
      case 'RADIO':
        return <RadioFieldRenderer {...fieldProps} />;
      
      default:
        console.warn(`Unsupported field type: ${field.fieldType}`);
        return null;
    }
  };

  return (
    <Box sx={{ mb: spacing.form.fieldGap }}>
      {renderFieldComponent()}
    </Box>
  );
};
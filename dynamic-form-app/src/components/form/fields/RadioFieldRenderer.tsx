import React from 'react';
import { Typography, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import { FormFieldConfig } from '../../../types/form.types';
import { spacing } from '../../../utils/spacing';

interface RadioFieldRendererProps {
  field: FormFieldConfig;
  value: string;
  error?: string;
  onChange: (value: string) => void;
}

export const RadioFieldRenderer: React.FC<RadioFieldRendererProps> = ({
  field,
  value,
  error,
  onChange
}) => {
  return (
    <>
      <Typography 
        variant="body1" 
        color={error ? 'error' : 'inherit'}
        sx={{ 
          mb: spacing.form.labelMarginBottom, 
          fontWeight: 500 
        }}
      >
        {field.name} {field.required && '*'}
      </Typography>
      
      <RadioGroup
        value={value}
        onChange={(e) => onChange(e.target.value)}
        sx={{ ml: spacing.components.radioGroup.indent }}
      >
        {field.listOfValues1?.map((option, index) => (
          <FormControlLabel
            key={index}
            value={option}
            control={<Radio />}
            label={option}
            sx={{ mb: spacing.components.radioGroup.optionGap }}
          />
        ))}
      </RadioGroup>
      
      {error && (
        <Typography 
          variant="caption" 
          color="error" 
          sx={{ 
            mt: spacing.form.errorMarginTop, 
            display: 'block' 
          }}
        >
          {error}
        </Typography>
      )}
    </>
  );
};
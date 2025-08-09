import React from 'react';
import { FormControl, InputLabel, Select, MenuItem, Typography } from '@mui/material';
import { FormFieldConfig } from '../../../types/form.types';
import { spacing } from '../../../utils/spacing';

interface SelectFieldRendererProps {
  field: FormFieldConfig;
  value: string;
  error?: string;
  onChange: (value: string) => void;
}

export const SelectFieldRenderer: React.FC<SelectFieldRendererProps> = ({
  field,
  value,
  error,
  onChange
}) => {
  return (
    <>
      <FormControl fullWidth required={field.required} error={!!error}>
        <InputLabel>{field.name}</InputLabel>
        <Select
          value={value}
          onChange={(e) => onChange(e.target.value as string)}
          label={field.name}
        >
          {field.listOfValues1?.map((option, index) => (
            <MenuItem key={index} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {error && (
        <Typography 
          variant="caption" 
          color="error" 
          sx={{ 
            ml: 2, 
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
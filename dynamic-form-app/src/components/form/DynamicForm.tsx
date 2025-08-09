'use client';

import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Button,
  Typography,
  Alert,
  CircularProgress
} from '@mui/material';
import { Send } from '@mui/icons-material';
import { FormConfigResponse, FormSubmission } from '../../types/form.types';
import { ApiService } from '../../services/api.service';
import { validateAllFields } from '../../utils/formValidation';
import { FieldRenderer } from './FieldRenderer';
import { spacing } from '../../utils/spacing';

interface DynamicFormProps {
  initialConfig: FormConfigResponse;
}

export default function DynamicForm({ initialConfig }: DynamicFormProps) {

  const initializeFormData = (): FormSubmission => {
    const initialData: FormSubmission = {};
    
    initialConfig.data.forEach(field => {
      if (field.defaultValue) {
        if (field.fieldType === 'TEXT') {
          initialData[field.name] = field.defaultValue;
        } else if ((field.fieldType === 'LIST' || field.fieldType === 'RADIO') && field.listOfValues1) {
          const index = parseInt(field.defaultValue);
          if (!isNaN(index) && index >= 0 && index < field.listOfValues1.length) {
            initialData[field.name] = field.listOfValues1[index];
          }
        }
      }
    });
    
    return initialData;
  };

  const [formData, setFormData] = useState<FormSubmission>(initializeFormData());
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleFieldChange = (fieldName: string, value: string) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));
    
    // Clear error for this field when user starts typing
    if (errors[fieldName]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);


    const validationErrors = validateAllFields(formData, initialConfig.data);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setLoading(false);
      setMessage({ type: 'error', text: 'Please fix the errors below' });
      return;
    }

    try {
      // Only send fields that have actual values (not empty strings)
      const filteredData: FormSubmission = {};
      Object.keys(formData).forEach(key => {
        const value = formData[key];
        if (value !== '' && value !== undefined && value !== null) {
          filteredData[key] = value;
        }
      });

      const result = await ApiService.submitFormData(filteredData);
      
      // Extract success message from API response or use default
      const successMessage = result?.message || 
                            result?.data?.message || 
                            'Form submitted successfully!';
                            
      setMessage({ type: 'success', text: successMessage });
      setFormData(initializeFormData());
      setErrors({});
    } catch (error: any) {
      console.error('Form submission error:', error);
      console.log('Error response:', error.response);
      
      // Extract specific error message from API response
      let errorMessage = 'Failed to submit form. Please try again.';
      
      if (error?.response?.data) {
        const apiError = error.response.data;
        console.log('API Error object:', apiError);
        
        errorMessage = apiError.message || 
                      apiError.error || 
                      apiError.detail ||
                      (Array.isArray(apiError.message) ? apiError.message[0] : null) ||
                      errorMessage;
      } else if (error?.message && error.message !== 'Failed to submit form data') {
        // Use the error message from our API service (which should contain the API's message)
        errorMessage = error.message;
      }
      
      console.log('Final error message:', errorMessage);
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card elevation={3} sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <CardContent sx={{ p: spacing.components.card.padding }}>
        <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ color: '#0369a1', fontWeight: 'bold' }}>
          Dynamic Form
        </Typography>
        
        <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: spacing.form.sectionGap }}>
          Please fill out all required fields
        </Typography>

        {message && (
          <Alert severity={message.type} sx={{ mb: spacing.form.sectionGap }}>
            {message.text}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          {initialConfig.data.map(field => (
            <FieldRenderer
              key={field.id}
              field={field}
              value={(formData[field.name] as string) || ''}
              error={errors[field.name]}
              onChange={(value) => handleFieldChange(field.name, value)}
            />
          ))}

          <Button
            type="submit"
            variant="contained"
            size="large"
            fullWidth
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <Send />}
            sx={{ 
              mt: spacing.form.buttonMarginTop,
              bgcolor: '#0369a1', 
              '&:hover': { bgcolor: '#0284c7' },
              py: 1.5
            }}
          >
            {loading ? 'Submitting...' : 'Submit Form'}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}
'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Button,
  Typography,
  Alert,
  CircularProgress,
  IconButton,
  Tooltip
} from '@mui/material';
import { Send, Save, Restore, Clear } from '@mui/icons-material';
import { FormConfigResponse, FormSubmission } from '../../types/form.types';
import { ApiService } from '../../services/api.service';
import { validateAllFields } from '../../utils/formValidation';
import { FieldRenderer } from './FieldRenderer';
import { spacing } from '../../utils/spacing';

interface DynamicFormProps {
  initialConfig: FormConfigResponse;
}

export default function DynamicForm({ initialConfig }: DynamicFormProps) {
  // Local storage key for this specific form
  const STORAGE_KEY = `dynamic_form_${initialConfig.data[0]?.id || 'default'}`;

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

  // Load form data from localStorage on component mount
  const loadFromStorage = (): FormSubmission => {
    if (typeof window === 'undefined') {
      return initializeFormData();
    }
    
    try {
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        // Validate that saved data matches current form structure
        const validData: FormSubmission = {};
        initialConfig.data.forEach(field => {
          if (parsedData[field.name] !== undefined) {
            validData[field.name] = parsedData[field.name];
          }
        });
        return { ...initializeFormData(), ...validData };
      }
    } catch (error) {
      console.error('Error loading form data from localStorage:', error);
    }
    return initializeFormData();
  };

  const [formData, setFormData] = useState<FormSubmission>(initializeFormData());
  const [isClient, setIsClient] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Load from localStorage after client-side hydration
  useEffect(() => {
    setIsClient(true);
    const savedData = loadFromStorage();
    if (Object.keys(savedData).length > 0) {
      setFormData(savedData);
    }
  }, []);

  // Save to localStorage whenever form data changes
  useEffect(() => {
    if (!isClient) return; // Only run on client side
    
    const timeoutId = setTimeout(() => {
      try {
        // Only save non-empty values
        const dataToSave: FormSubmission = {};
        Object.keys(formData).forEach(key => {
          const value = formData[key];
          if (value !== '' && value !== undefined && value !== null) {
            dataToSave[key] = value;
          }
        });

        if (Object.keys(dataToSave).length > 0) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
          setHasUnsavedChanges(true);
        } else {
          localStorage.removeItem(STORAGE_KEY);
          setHasUnsavedChanges(false);
        }
      } catch (error) {
        console.error('Error saving form data to localStorage:', error);
      }
    }, 500); // Debounce saving by 500ms

    return () => clearTimeout(timeoutId);
  }, [formData, STORAGE_KEY, isClient]);

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

  const handleSaveToStorage = () => {
    if (!isClient) return;
    
    try {
      const dataToSave: FormSubmission = {};
      Object.keys(formData).forEach(key => {
        const value = formData[key];
        if (value !== '' && value !== undefined && value !== null) {
          dataToSave[key] = value;
        }
      });

      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
      setMessage({ type: 'info', text: 'Form data saved locally!' });
      setHasUnsavedChanges(false);
      
      // Clear the message after 3 seconds
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      setMessage({ type: 'error', text: 'Failed to save form data locally' });
    }
  };

  const handleRestoreFromStorage = () => {
    if (!isClient) return;
    
    try {
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        const restoredData: FormSubmission = { ...initializeFormData() };
        
        // Only restore fields that exist in current form configuration
        initialConfig.data.forEach(field => {
          if (parsedData[field.name] !== undefined) {
            restoredData[field.name] = parsedData[field.name];
          }
        });
        
        setFormData(restoredData);
        setErrors({});
        setMessage({ type: 'info', text: 'Form data restored from local storage!' });
        
        // Clear the message after 3 seconds
        setTimeout(() => setMessage(null), 3000);
      } else {
        setMessage({ type: 'info', text: 'No saved data found in local storage' });
      }
    } catch (error) {
      console.error('Error restoring from localStorage:', error);
      setMessage({ type: 'error', text: 'Failed to restore form data' });
    }
  };

  const handleClearStorage = () => {
    if (!isClient) return;
    
    try {
      localStorage.removeItem(STORAGE_KEY);
      setFormData(initializeFormData());
      setErrors({});
      setHasUnsavedChanges(false);
      setMessage({ type: 'info', text: 'Form cleared and local storage removed!' });
      
      // Clear the message after 3 seconds
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      setMessage({ type: 'error', text: 'Failed to clear local storage' });
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
      
      // Clear form and localStorage after successful submission
      setFormData(initializeFormData());
      setErrors({});
      setHasUnsavedChanges(false);
      if (isClient) {
        localStorage.removeItem(STORAGE_KEY);
      }
      
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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" component="h1" sx={{ color: '#0369a1', fontWeight: 'bold' }}>
            Dynamic Form
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Save form data locally">
              <IconButton onClick={handleSaveToStorage} color="primary" size="small">
                <Save />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Restore from local storage">
              <IconButton onClick={handleRestoreFromStorage} color="primary" size="small">
                <Restore />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Clear form and local storage">
              <IconButton onClick={handleClearStorage} color="secondary" size="small">
                <Clear />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
        
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
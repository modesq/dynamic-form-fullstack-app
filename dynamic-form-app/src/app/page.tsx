'use client';

import React, { useState, useEffect } from 'react';
import { Container, Alert, CircularProgress, Box } from '@mui/material';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import DynamicForm from '@/components/form/DynamicForm';
import { ApiService } from '@/services/api.service';
import { FormConfigResponse } from '@/types/form.types';

export default function HomePage() {
  const [formConfig, setFormConfig] = useState<FormConfigResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFormConfig = async () => {
      try {
        const config = await ApiService.getFormConfig();
        setFormConfig(config);
      } catch (err) {
        console.error('Failed to fetch form config:', err);
        setError('Unable to load form configuration. Please ensure the backend server is running on localhost:3001.');
      } finally {
        setLoading(false);
      }
    };

    fetchFormConfig();
  }, []);

  return (
    <>
      <Header />
      <Container maxWidth="md" sx={{ py: 4, minHeight: 'calc(100vh - 200px)' }}>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
            <CircularProgress size={50} />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mt: 4 }}>
            {error}
          </Alert>
        ) : formConfig && formConfig.data.length > 0 ? (
          <DynamicForm initialConfig={formConfig} />
        ) : (
          <Alert severity="warning" sx={{ mt: 4 }}>
            No form fields found. Please configure form fields in your backend.
          </Alert>
        )}
      </Container>
      <Footer />
    </>
  );
}
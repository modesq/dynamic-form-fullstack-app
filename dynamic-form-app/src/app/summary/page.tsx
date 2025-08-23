'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Container, 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  Box,
  Alert,
  CircularProgress,
  Divider
} from '@mui/material';
import { ArrowBack, CheckCircle } from '@mui/icons-material';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

interface FormDataDisplay {
  [key: string]: string | boolean;
}

export default function SummaryPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormDataDisplay | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedData = localStorage.getItem('submittedFormData');
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        setFormData(parsedData);
      } catch (error) {
        console.error('Error parsing form data:', error);
      }
    }
    setLoading(false);
  }, []);

  const handleBackToForm = () => {
    localStorage.removeItem('submittedFormData');
    router.push('/');
  };

  const handleSubmitAnother = () => {
    localStorage.removeItem('submittedFormData');
    router.push('/');
  };

  const formatFieldName = (name: string): string => {
    return name
      .split(/(?=[A-Z])/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const formatFieldValue = (value: string | boolean): string => {
    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    }
    return String(value);
  };

  return (
    <>
      <Header />
      <Container maxWidth="md" sx={{ py: 4, minHeight: 'calc(100vh - 200px)' }}>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
            <CircularProgress size={50} />
          </Box>
        ) : !formData ? (
          <Alert severity="warning" sx={{ mt: 4 }}>
            No form submission found. Please fill out the form first.
            <Button 
              variant="text" 
              onClick={() => router.push('/')}
              sx={{ ml: 2 }}
            >
              Go to Form
            </Button>
          </Alert>
        ) : (
          <Card elevation={3} sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <CheckCircle sx={{ fontSize: 60, color: '#0ea5e9', mb: 2 }} />
                <Typography variant="h4" component="h1" sx={{ color: '#0369a1', fontWeight: 'bold' }}>
                  Form Submitted Successfully!
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                  Here's a summary of your submission:
                </Typography>
              </Box>

              <Divider sx={{ mb: 3 }} />

              <Box sx={{ mb: 4 }}>
                {Object.entries(formData).map(([key, value], index) => (
                  <Box 
                    key={key} 
                    sx={{ 
                      mb: 2,
                      p: 2,
                      bgcolor: index % 2 === 0 ? '#f8f9fa' : 'transparent',
                      borderRadius: 1
                    }}
                  >
                    <Typography 
                      variant="subtitle2" 
                      color="text.secondary"
                      sx={{ fontWeight: 600, mb: 0.5 }}
                    >
                      {formatFieldName(key)}
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {formatFieldValue(value)}
                    </Typography>
                  </Box>
                ))}
              </Box>

              <Divider sx={{ mb: 3 }} />

              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<ArrowBack />}
                  onClick={handleBackToForm}
                  sx={{ 
                    borderColor: '#0369a1',
                    color: '#0369a1',
                    '&:hover': {
                      borderColor: '#0284c7',
                      bgcolor: 'rgba(3, 105, 161, 0.04)'
                    }
                  }}
                >
                  Back to Form
                </Button>
                <Button
                  variant="contained"
                  size="large"
                  onClick={handleSubmitAnother}
                  sx={{ 
                    bgcolor: '#0369a1', 
                    '&:hover': { bgcolor: '#0284c7' }
                  }}
                >
                  Submit Another
                </Button>
              </Box>
            </CardContent>
          </Card>
        )}
      </Container>
      <Footer />
    </>
  );
}
import React from 'react';
import { Box, Container, Typography } from '@mui/material';

export default function Header() {
  return (
    <Box
      component="header"
      sx={{
        bgcolor: '#18181b',
        color: 'white',
        boxShadow: 3,
        py: 2
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <img src="/logo.svg" alt="Logo" style={{ height: '32px' }} />
          </Box>
          <Typography
            sx={{
              display: { xs: 'none', md: 'block' },
              color: '#71717a',
              fontSize: '0.875rem'
            }}
          >
            Dynamic Forms
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
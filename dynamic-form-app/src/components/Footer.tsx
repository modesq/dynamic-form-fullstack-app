import { Box, Container, Typography, Grid } from '@mui/material';
import { Email, Phone, LocationOn } from '@mui/icons-material';

export default function Footer() {
  return (
    <Box component="footer" sx={{ bgcolor: '#18181b', color: 'white', py: 6, mt: 8 }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom sx={{ color: '#0ea5e9' }}>
              Revest Solutions
            </Typography>
            <Typography variant="body2" sx={{ color: '#71717a' }}>
              Building the future of retail with innovative technology solutions.
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom sx={{ color: '#0ea5e9' }}>
              Contact
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Email sx={{ mr: 1, fontSize: 16, color: '#0ea5e9' }} />
              <Typography variant="body2">info@revest.sa</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Phone sx={{ mr: 1, fontSize: 16, color: '#0ea5e9' }} />
              <Typography variant="body2">+966 XX XXX XXXX</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <LocationOn sx={{ mr: 1, fontSize: 16, color: '#0ea5e9' }} />
              <Typography variant="body2">Riyadh, Saudi Arabia</Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom sx={{ color: '#0ea5e9' }}>
              Quick Links
            </Typography>
            <Typography variant="body2" sx={{ mb: 1, cursor: 'pointer', '&:hover': { color: '#0ea5e9' } }}>
              About Us
            </Typography>
            <Typography variant="body2" sx={{ mb: 1, cursor: 'pointer', '&:hover': { color: '#0ea5e9' } }}>
              Services
            </Typography>
            <Typography variant="body2" sx={{ cursor: 'pointer', '&:hover': { color: '#0ea5e9' } }}>
              Contact
            </Typography>
          </Grid>
        </Grid>
        
        <Box sx={{ borderTop: '1px solid #27272a', mt: 4, pt: 3, textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: '#71717a' }}>
            © 2024 Revest Solutions. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
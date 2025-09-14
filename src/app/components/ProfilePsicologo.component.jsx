import React from 'react';
import {
  Box,
  Avatar,
  Typography,
  Rating,
  Card,
  CardContent,
  Grid,
} from '@mui/material';

const perfil = {
  nombre: 'Dra. Carolina Ramírez',
  especialidad: 'Psicóloga Clínica',
  experiencia: 8,
  calificacion: 4.8,
  descripcion:
    'Especialista en ansiedad, terapia de pareja y crecimiento personal.',
  imagen: '/static/images/avatar/6.jpg', // puedes usar una URL real o base64
};

const PerfilPsicologo = () => {
  return (
    <Card
      sx={{
        maxWidth: 600,
        margin: 'auto',
        mt: 4,
        boxShadow: 4,
        borderRadius: 3,
        p: 2,
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        flexDirection: { xs: 'column', sm: 'row' },
      }}
    >
      <Avatar
        alt={perfil.nombre}
        src={perfil.imagen}
        sx={{ width: 100, height: 100 }}
      />

      <CardContent sx={{ flex: 1, padding: 0 }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          {perfil.nombre}
        </Typography>

        <Typography variant="subtitle1" color="text.secondary">
          {perfil.especialidad}
        </Typography>

        <Box display="flex" alignItems="center" gap={1} my={1}>
          <Rating value={perfil.calificacion} precision={0.1} readOnly size="small" />
          <Typography variant="body2" color="text.secondary">
            {perfil.calificacion} / 5.0
          </Typography>
        </Box>

        <Typography variant="body2" color="text.secondary">
          <strong>Experiencia:</strong> {perfil.experiencia} años
        </Typography>

        <Typography variant="body2" mt={1}>
          {perfil.descripcion}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default PerfilPsicologo;

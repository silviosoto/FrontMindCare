import { Card, CardContent, Typography, Divider, Box } from "@mui/material";

export default function DetallesCompra({
  referencia,
  producto,
  fecha,
  monto,
  metodoPago,
  estado,
}) {
  return (
    <Card sx={{ maxWidth: 500, borderRadius: 4, boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Detalles de la compra
        </Typography>

        <Divider sx={{ mb: 2 }} />

        <Box sx={{ mb: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Producto
          </Typography>
          <Typography variant="body1" fontWeight="medium">
            {producto}
          </Typography>
        </Box>

        <Box sx={{ mb: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Fecha de pago
          </Typography>
          <Typography variant="body1" fontWeight="medium">
            {fecha}
          </Typography>
        </Box>

        <Box sx={{ mb: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Monto (COP)
          </Typography>
          <Typography variant="body1" fontWeight="medium">
            ${monto.toLocaleString("es-CO")}
          </Typography>
        </Box>

        <Box sx={{ mb: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Método de pago
          </Typography>
          <Typography variant="body1" fontWeight="medium">
            {metodoPago}
          </Typography>
        </Box>

        <Box sx={{ mb: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Estado
          </Typography>
          <Typography variant="body1" fontWeight="medium">
            {estado}
          </Typography>
        </Box>

        <Box>
          <Typography variant="body2" color="text.secondary">
            Número de referencia
          </Typography>
          <Typography variant="body1" fontWeight="medium">
            {referencia}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}

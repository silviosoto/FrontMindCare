'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation'; 
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { Card, CardContent, Button, Typography, Box } from "@mui/material";
import { useRouter } from "next/navigation";

export default function PagoRespuesta() {
  const searchParams = useSearchParams();
  const [estado, setEstado] = useState("");
  const [icono, setIcono] = useState("");
  const [color, setColor] = useState("");
  const router = useRouter(); 

  useEffect(() => {
    const estadoTransaccion = searchParams.get('transactionState');

   switch (estadoTransaccion) {
    case '4':
      setEstado("¡Pago aprobado con éxito!");
      setIcono(<CheckCircleIcon color="success" sx={{ fontSize: 80 }} />)
      setColor("success");
      break;
    case '6':
      setEstado("El pago fue rechazado. Intenta nuevamente.");
      setIcono(<CancelIcon color="error" sx={{ fontSize: 80 }} />);
      setColor("error");
      break;
    case '7':
      setEstado("El pago está pendiente. Te notificaremos cuando se confirme.");
      setIcono(<HourglassBottomIcon color="warning" sx={{ fontSize: 80 }} />);
      setColor("warning");
      break;
    default:
      setEstado("Estado desconocido. Verifica con soporte.");
      setIcono(<HelpOutlineIcon color="info" sx={{ fontSize: 80 }} />);
      setColor("info");
      break;
   }
  }, [searchParams]);

  return (
   <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f5f5",
        p: 2,
      }}
    >
      <Card sx={{ maxWidth: 400, textAlign: "center", p: 3, borderRadius: 4 }}>
        <CardContent>
          {icono}

          <Typography variant="h5" fontWeight="bold" mt={2}>
            {estado}
          </Typography>

          <Button
            variant="contained"
            color={color}
            sx={{ mt: 4, borderRadius: 2 }}
            onClick={() => router.push("/cita")}
          >
            Volver a mis citas
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}

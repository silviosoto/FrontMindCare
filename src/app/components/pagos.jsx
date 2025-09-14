import { useState } from "react";
import CryptoJS from "crypto-js";
import { Button, Typography, Box } from "@mui/material";
import DetallesCompra from "./detallesCompra.componet";
export default function PayUForm({ amount, referenceCode }) {
  const [formData, setFormData] = useState({
    amount: amount,
    referenceCode: referenceCode,
  });

  const apiKey = "4Vj8eK4rloUd272L48hsrarnUA"; // Sandbox
  const merchantId = "508029";
  const accountId = "512321"; // Sandbox
  const currency = "COP";
  const responseUrl = "http://localhost:3000/pagorespuesta";
  const confirmationUrl =
    "https://2d1182939ba4.ngrok-free.app/api/payu/confirmation";

  const generateSignature = () => {
    const rawSignature = `${apiKey}~${merchantId}~${formData.referenceCode}~${formData.amount}~${currency}`;
    const signature = CryptoJS.MD5(rawSignature).toString();
    return signature;
  };

  const handleSubmit = () => {
    const signature = generateSignature();

    const form = document.createElement("form");
    form.method = "POST";
    form.action =
      "https://sandbox.checkout.payulatam.com/ppp-web-gateway-payu/";
    form.style.display = "none";

    const fields = {
      merchantId,
      accountId,
      description: "Sesión psicológica",
      referenceCode: formData.referenceCode,
      amount: formData.amount,
      tax: "0",
      taxReturnBase: "0",
      currency,
      signature,
      test: "1", // 0 es para producción, 1 para pruebas
      buyerEmail: "cliente@correo.com",
      responseUrl,
      confirmationUrl,
    };

    for (const key in fields) {
      const input = document.createElement("input");
      input.name = key;
      input.value = fields[key];
      form.appendChild(input);
    }

    document.body.appendChild(form);
    form.submit();
  };

  return (
    <div> 
      <Box
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
      >
        <Typography variant="h4" gutterBottom>
          Pago de sesión
        </Typography>
        <DetallesCompra
          referencia={formData.referenceCode}
          producto="Sesión psicológica"
          fecha={new Date().toLocaleDateString()}
          monto={formData.amount}
          metodoPago="PayU"
          estado="Pendiente"
        />
        <Box mt={2}>
          <Button onClick={handleSubmit} variant="contained" color="success">
            Pagar con PayU
          </Button>
        </Box>
      </Box>
    </div>
  );
}

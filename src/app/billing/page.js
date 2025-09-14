"use client";
import { Grid, Box, Typography, Divider } from "@mui/material";
import "dayjs/locale/es";

import Facturas from "../components/Facturas.component";

const Billing = () => {
  return (
    <Grid component="main">
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: "white",
          borderRadius: 3,
          boxShadow: 4,
          p: 3,
        }}
      >
        <Grid container spacing={2} sx={{ m: 1 }}>
          <Grid item xs={12}>
            <Typography
              variant="h5"
              sx={{
                textAlign: "center",
                mb: 1,
              }}
            >
             Facturación
            </Typography>
            <Divider sx={{ backgroundColor: "#ccc", mb: 4 }} />
            <Facturas></Facturas>
          </Grid>
        </Grid>
      </Box>
    </Grid>
  );
};

export default Billing;

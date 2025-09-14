"use client";
import { Grid, Box, Typography, Divider } from "@mui/material";
import "dayjs/locale/es";

import Pagos from "../components/Pagos.component";

const MisPagos = () => {
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
             Mis pagos
            </Typography>
            <Divider sx={{ backgroundColor: "#ccc", mb: 4 }} />
            <Pagos></Pagos>
          </Grid>
        </Grid>
      </Box>
    </Grid>
  );
};

export default MisPagos;
